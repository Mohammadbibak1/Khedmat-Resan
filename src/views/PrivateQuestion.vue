<template>
  <LoadingJson :show="loading" />

  <div id="main" class="d-flex align-items-center flex-column RTL">
    <div
      class="div-top-arrow bg-color max_width d-flex justify-content-between rounded-bottom-5 shadow">
      <router-link
        :to="{ name: 'SubcategoryPage', params: { id: parentId } }"
        class="d-flex align-items-center text-decoration-none"
      >
        <p class="text-white font-3 font-bold rounded-pill mr-2">انصراف</p>
        <img src="../assets/img/Close.svg" alt="" class="icon-size-1" />
      </router-link>

      <p class="font-3 font-bold text-white mr-3">سوالات</p>
    </div>

    <div class="w-100 d-flex flex-column align-items-center p-3 row-gap-4" style="margin-top: 8rem">

      <template v-for="(question, qIndex) in questions" :key="qIndex">
        <h2 class="w-100 text-end font-3 font-bold mt-3">{{ question.question }}
          <span class="req-field">*</span>
        </h2>

        <!-- Radio -->
        <div
          v-if="question.type === 'radio'"
          class="w-100 bg-white p-3 d-flex flex-column align-items-start row-gap-3 rounded-4 shadow-lite"
        >
          <div
            v-for="(ans, aIndex) in question.answer"
            :key="aIndex"
            class="d-flex align-items-center column-gap-3"
          >
            <input
              type="radio"
              :name="'question-' + qIndex"
              :value="ans.id"
              v-model="userAnswers[qIndex].value"
            />
            <span class="font-4 text-color-gray">{{ ans.answer }}</span>
          </div>
          <span v-if="showErrors && !userAnswers[qIndex].value" class="text-danger font-4">
            لطفا یک گزینه را انتخاب کنید
          </span>
        </div>


        <!-- Checkbox -->
        <div
          v-else-if="question.type === 'checkbox'"
          class="w-100 bg-white p-3 d-flex flex-column align-items-start row-gap-2 rounded-4 shadow-lite"
        >
          <div
            v-for="(ans, aIndex) in question.answer"
            :key="aIndex"
            class="w-100 d-flex justify-content-between align-items-center py-2"
          >
            <span class="font-4 text-color-gray">{{ ans.answer }}</span>
            <label class="switch">
              <input
                type="checkbox"
                :value="ans.id"
                v-model="userAnswers[qIndex].value"
              />
              <span class="slider round"></span>
            </label>
          </div>
          <span v-if="showErrors && !userAnswers[qIndex].value.length" class="text-danger font-4">
            لطفا حداقل یک گزینه را انتخاب کنید
          </span>
        </div>

        <!-- Textarea -->
        <div v-else-if="question.type === 'text'" class="w-100">
          <textarea
            class="w-100 rounded-4 p-3 shadow-lite"
            placeholder="توضیحات خود را بنویسید"
            style="min-height: 150px"
            v-model="userAnswers[qIndex].value"
          ></textarea>
          <span v-if="showErrors && !userAnswers[qIndex].value" class="text-danger font-4">
            لطفا توضیحات را وارد کنید
          </span>
        </div>
      </template>


      <button
        class="w-45 button-Default p-3 shadow font-4 mt-5"
        :class="{ 'disabled-btn': !allQuestionsAnswered }"
        @click="goToNext"
        :disabled="!allQuestionsAnswered"
      >
        بعدی
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import axios from 'axios'
import { SwalError } from '@/assets/js/MyJs.js'
import { onMounted, ref, computed} from 'vue'
import LoadingJson from '@/components/LoadingJson.vue'
import { useAnswerStore } from '@/stores/answerStore'
import router from '@/router/index.js'

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')

const route = useRoute()
const id = route.params.id
const parentId = route.params.parentId

const loading = ref(false)
const showErrors = ref(false)

const questions = ref([])
const userAnswers = ref([])
const answerStore = useAnswerStore()

// Initialize userAnswers based on question type
function initializeAnswers() {
  userAnswers.value = questions.value.map(question => {
    return {
      type: question.type,
      value: question.type === 'checkbox' ? [] : ''
    }
  })
}

// Check if all questions are answered
const allQuestionsAnswered = computed(() => {
  return userAnswers.value.every(answer => {
    if (answer.type === 'checkbox') {
      return answer.value.length > 0
    } else {
      return answer.value !== ''
    }
  })
})

function goToNext() {
  if (!allQuestionsAnswered.value) {
    showErrors.value = true;
    return;
  }

  // ساخت آرایه پاسخ‌ها به فرمت مورد نظر
  const formattedAnswers = [];

  questions.value.forEach((question, index) => {
    const answer = userAnswers.value[index];

    if (question.type === 'radio') {
      const formattedAnswer = {
        question_id: question.id || index + 1,
        answer_id: null,
        answer_text: ''
      };

      const selectedOption = question.answer.find(opt => opt.id === answer.value);
      formattedAnswer.answer_id = selectedOption?.id || null;
      formattedAnswer.answer_text = selectedOption?.answer || '';

      formattedAnswers.push(formattedAnswer);
    }
    else if (question.type === 'text') {
      formattedAnswers.push({
        question_id: question.id || index + 1,
        answer_id: question.answer[0]?.id || null, // ✅ آیدی جواب از دیتابیس
        answer_text: answer.value // ✅ مقدار تایپ‌شده توسط کاربر
      });
    }
    else if (question.type === 'checkbox') {
      // برای سوالات چک‌باکس، هر گزینه انتخاب شده را به صورت جداگانه اضافه می‌کنیم
      const selectedOptions = question.answer.filter(opt => answer.value.includes(opt.id));

      selectedOptions.forEach(option => {
        formattedAnswers.push({
          question_id: question.id || index + 1,
          answer_id: option.id,
          answer_text: option.answer
        });
      });
    }
  });



  // ذخیره در pania
  const result = {
    questions: formattedAnswers
  }
  answerStore.setAnswers(result.questions)
  answerStore.setServiceId(id)


  // نمایش پاسخ‌ها در فرمت مورد نظر
  console.log('User answers in requested format:', {
    questions: result.questions,
    service_id: id
  });


  // هدایت به صفحه بعدی
  router.push({ name: 'PublicQuestion' , params:{id , parentId} })

}


async function SendFirstRequest() {
  const sendData = {
    user_id: user_id,
    apikey: apikey,
    action: 'service_question',
    service_id: id,
  }

  loading.value = true

  try {
    const publicRes = await axios.post(url + 'public_info', sendData)
    questions.value = publicRes.data

    const storedAnswers = answerStore.questions
    if (storedAnswers.length > 0) {
      userAnswers.value = questions.value.map((question) => {
        const answersForQuestion = storedAnswers.filter(ans => ans.question_id === question.id)

        if (question.type === 'checkbox') {
          return {
            type: 'checkbox',
            value: answersForQuestion.map(ans => ans.answer_id)
          }
        } else if (question.type === 'radio') {
          return {
            type: 'radio',
            value: answersForQuestion[0]?.answer_id || ''
          }
        } else {
          return {
            type: 'text',
            value: answersForQuestion[0]?.answer_text || ''
          }
        }
      })
    } else {
      initializeAnswers()
    }

    console.log(questions.value)
  } catch (error) {
    console.error('خطا در دریافت اطلاعات:', error)
    SwalError('خطا!', 'خطای ارتباط با سرور', 'error', true, SendFirstRequest)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  SendFirstRequest()
})
</script>

<style scoped>
.RTL {
  direction: rtl;
}

.switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #0BA6AB;
}

input:checked + .slider:before {
  transform: translateX(21px);
}
.req-field{
  color: #0BA6AB;
}
.disabled-btn {
  opacity: 0.6;
  cursor: not-allowed;
}
.text-danger {
  color: #dc3545;
  font-size: 0.9rem;
}
</style>
