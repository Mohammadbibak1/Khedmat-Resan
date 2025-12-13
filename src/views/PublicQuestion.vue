<template>
  <LoadingJson :show="loading" />

  <div id="main" class="d-flex align-items-center flex-column RTL">
    <div
      class="div-top-arrow justify-content-between"
    >
      <div class="d-flex align-items-center">

        <p class="font-4 font-bold text-white">تعیین زمان و قیمت</p>

        <div
          @click="cancelAndGoBack"
          class="d-flex align-items-center text-decoration-none"
          style="cursor: pointer"
        >
          <p class="text-white font-4 font-bold rounded-pill mr-2">انصراف</p>
          <img src="../assets/img/Close.svg" alt="" class="icon-4" />
        </div>

      </div>
    </div>

    <div class="w-100 d-flex flex-column align-items-center p-3 row-gap-4" style="margin-top: 8rem">
      <div class="w-100 text-end mt-3">
        <h2 class="font-3 font-bold">تاریخ حضور نیرو</h2>

        <date-picker
          v-model="date"
          format="YYYY/MM/DD"
          display-format="jYYYY/jMM/jDD"
          :editable="false"
          placeholder="انتخاب تاریخ"
          class="w-100 "
          :disabled-date="disabledDates"
        />

      </div>

      <h2 class="w-100 text-end font-3 font-bold mt-3">زمان حضور نیرو</h2>
      <div
        class="w-100 bg-white p-3 d-flex flex-wrap align-items-start row-gap-4 rounded-4 shadow-lite"
      >
        <div
          class="w-48 column-gap-3 d-flex align-items-center"
          v-for="timeSlot in timeSlots"
          :key="timeSlot.id"
        >
          <input
            type="radio"
            :id="'time-' + timeSlot.id"
            :value="timeSlot.label"
            v-model="selectedTimeSlot"
            :disabled="isTimeSlotDisabled(timeSlot)"
            class="form-radio"
          />
          <label
            :for="'time-' + timeSlot.id"
            class="font-4 font-bold"
            :class="{ 'text-color-gray': isTimeSlotDisabled(timeSlot) }"
          >
            {{ timeSlot.label }}
          </label>
        </div>
      </div>

      <h2 class="w-100 text-end font-3 font-bold mt-3">محل انجام سفارش</h2>

      <div
        class="w-100 bg-white p-4 d-flex flex-wrap align-items-center row-gap-4 rounded-4 shadow-lite"
      >
        <div class="w-100 d-flex justify-content-between">
          <h4 class="font-bold">آدرس های من</h4>

          <router-link to="/add_address" tabindex="0">
            <img src="../assets/img/add-blue-button.svg" alt="add" class="icon-3" />
            <span class="text-color-blue font-5 font-bold mr-3">افزودن آدرس</span>
          </router-link>
        </div>

        <!--        bg-lite-blue-->

        <div class="d-flex flex-column row-gap-3 w-100">
          <div v-if="address && address.length > 0">
            <div
              v-for="item in address"
              :key="item.id"
              class="w-100 p-4 d-flex justify-content-between align-items-center rounded-4 shadow-lite mt-3"
              :class="{ 'border border-primary': selectedAddressId === item.id }"
              @click="selectAddress(item.id)"
              style="cursor: pointer"
            >
              <div class="d-flex align-items-center">
                <input
                  type="radio"
                  :value="item.id"
                  v-model="selectedAddressId"
                  class="form-check-input me-2"
                />
                <!--                <img src="../assets/img/Location-address.svg" alt="" class="icon-size-3" />-->
                <p class="font-5 font-bold mr-3 mb-0">
                  {{ item.address }}
                </p>
              </div>

              <div @click.stop="deleteAddress(item.id)" role="button" tabindex="0">
                <img
                  src="../assets/img/Trashbin.svg"
                  alt="حذف آدرس"
                  class="icon-1 bg-white shadow p-2 rounded-pill cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div v-else class="w-100 text-center py-4">
            <p class="font-5 text-muted">آدرسی ثبت نشده است</p>
          </div>
        </div>
      </div>
      <h2 class="w-100 text-end font-3 font-bold mt-3">توضیحات تکمیلی برای سرویس مورد نظر شما</h2>
      <textarea
        v-model="caption"
        name="توضیحات"
        rows="6"
        cols="10"
        placeholder="اختیاری"
        class="w-100 shadow-lite rounded-5 p-4"
      ></textarea>
      <div class="w-90 d-flex justify-content-between mt-3">
<!--        <button-->
<!--          @click="addOrder"-->
<!--          class="w-48 bg-color border-3 border-color-White rounded-pill text-white font-4 font-bold shadow p-3"-->
<!--        >-->
<!--          ثبت نهایی-->
<!--        </button>-->
        <button
          @click="addOrder"
          :disabled="loading"
          class="w-48 bg-color border-3 border-color-White rounded-pill text-white font-4 font-bold shadow p-3"
        >
          <span v-if="loading">در حال ثبت...</span>
          <span v-else>ثبت نهایی</span>
        </button>
        <button @click="goBack" class="w-48 font-4 font-bold shadow bg-gradient-gray p-3 rounded-pill">قبلی</button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useOrderFormStore } from '@/stores/useOrderFormStore'

import { useRoute } from 'vue-router'
import DatePicker from 'vue3-persian-datetime-picker'
import { computed, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { SwalClose, SwalConfirm, SwalError, SwalSuccess } from '@/assets/js/MyJs.js'
import LoadingJson from '@/components/LoadingJson.vue'
import moment from 'moment-jalaali'

const route = useRoute()
const id = route.params.id
const parentId = route.params.parentId
const loading = ref(false)
const address = ref([])


const orderFormStore = useOrderFormStore()
const date = ref(orderFormStore.date)
const selectedTimeSlot = ref(orderFormStore.selectedTimeSlot)
const selectedAddressId = ref(orderFormStore.selectedAddressId)
const caption =  ref(orderFormStore.caption)

// Watch to update the store
watch(date, val => orderFormStore.date = val)
watch(selectedTimeSlot, val => orderFormStore.selectedTimeSlot = val)
watch(selectedAddressId, val => orderFormStore.selectedAddressId = val)
watch(caption, val => orderFormStore.caption = val)


// فراخوانی اطلاعات صفحه قبلی از پانیا
import { useAnswerStore } from '@/stores/answerStore'
import router from '@/router/index.js'

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')
const answerStore = useAnswerStore()

async function SendFirstRequest() {
  const sendData = {
    user_id: user_id,
    apikey: apikey,
    action: 'show'
  }

  loading.value = true

  try {
    const res = await axios.post(url + 'user_address', sendData)

    address.value = res.data
    console.log(address.value)
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


watch(date, (newVal) => {
  if (newVal) {
    const iranTime = getIranTime()
    console.log(
      'زمان دقیق ایران:',
      iranTime.getHours() + ':' + String(iranTime.getMinutes()).padStart(2, '0')
    )

    timeSlots.value.forEach((slot) => {
      console.log(slot.label, 'disabled:', isTimeSlotDisabled(slot))
    })
  }
})

// توابع کنترل زمان
const timeSlots = ref([
  { id: 1, label: '08-12', startHour: 8 },
  { id: 2, label: '12-16', startHour: 12 },
  { id: 3, label: '16-20', startHour: 16 },
  { id: 4, label: '20-24', startHour: 20 }
])
const isToday = computed(() => {
  if (!date.value) return false

  const selectedDate = new Date(date.value)
  const today = getIranTime()

  // مقایسه فقط بر اساس تاریخ (بدون در نظر گرفتن ساعت)
  return (
    selectedDate.getDate() === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear()
  )
})

// بررسی آیا بازه زمانی گذشته است
const isTimeSlotDisabled = (timeSlot) => {
  if (!date.value) return false

  const selectedDate = new Date(date.value)
  const today = getIranTime()

  // تنظیم ساعت به 00:00:00 برای مقایسه تاریخ
  const todayStart = new Date(today)
  todayStart.setHours(0, 0, 0, 0)

  // اگر تاریخ انتخاب شده قبل از امروز باشد
  if (selectedDate < todayStart) return true

  // اگر تاریخ امروز است و ساعت شروع گذشته است
  if (isToday.value) {
    const currentHour = today.getHours()
    return timeSlot.startHour <= currentHour
  }

  return false
}

// غیرفعال کردن تاریخ‌های گذشته در date-picker
const disabledDates = (date) => {
  const today = getIranTime()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const getIranTime = () => {
  const now = new Date()
  // زمان UTC فعلی
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const iranOffset = 3.5 * 60 * 60 * 1000 // 3.5 ساعت به میلی‌ثانیه
  return new Date(utc + iranOffset)
}

const deleteAddress = async (addressId) => {
  // ابتدا از کاربر تایید بگیریم
  SwalConfirm('آیا مطمئن هستید؟', 'این آدرس حذف خواهد شد', 'بله، حذف کن', 'انصراف', async () => {
    try {
      const response = await axios.post(url + 'user_address', {
        user_id: user_id,
        apikey: apikey,
        address_id: addressId,
        action: 'delete'
      })

      if (response.data.status === 'ok') {
        // حذف آدرس از لیست محلی
        address.value = address.value.filter((item) => item.id !== addressId)
        SwalSuccess('آدرس با موفقیت حذف شد') // نمایش پیغام موفقیت
      } else {
        // اگر سرور status غیر از ok برگرداند
        SwalError('خطا!', response.data.message || 'حذف آدرس انجام نشد')
      }
    } catch (error) {
      console.error('خطا در حذف آدرس:', error)
      SwalError('خطا!', 'خطای ارتباط با سرور')
    } finally {
      SwalClose() // بستن پیغام لودینگ
      loading.value = false
    }
  })
}

const selectAddress = (id) => {
  selectedAddressId.value = id
}

function cancelAndGoBack() {
  answerStore.clearAnswers()
  orderFormStore.clear();

  router.push({ name: 'SubcategoryPage', params: { id: parentId } })
}

function goBack() {
  router.back()
}

async function addOrder() {
  // بررسی پر بودن فیلدهای ضروری
  if (!selectedTimeSlot.value || !selectedAddressId.value || !date.value) {
    SwalError('خطا!', 'لطفاً تمام فیلدها را پر کنید');
    return;
  }

  const questions = answerStore.questions;
  const service_id = answerStore.service_id;
  const shamsiDate = moment(date.value).format('jYYYY/jMM/jDD');


  const send_data = {
    apikey: apikey,
    user_id: parseInt(user_id),
    service_id: parseInt(service_id),
    questions: JSON.parse(JSON.stringify(questions)),
    date: shamsiDate,
    time: selectedTimeSlot.value,
    address_id: parseInt(selectedAddressId.value),
    caption: caption.value,
  };

  console.log('در حال ارسال سفارش:', send_data);

  loading.value = true;

  try {
    const response = await axios.post(url + 'add_order', send_data);

    if (response.data.status === 'ok') {
      loading.value = false;
      orderFormStore.clear();

      const order_number = response.data.order_number;

      await SwalSuccess('ثبت موفق سفارش', `سفارش شماره ${order_number} با موفقیت ایجاد شد`, 5000);

      router.push({ name: 'HomePage' });
    } else {
      SwalError('خطا!', response.data.message || 'مشکلی پیش آمد، مجدداً امتحان کنید');
    }
  } catch (error) {
    console.error('خطا در ارسال سفارش:', error);
    SwalError('خطا!', 'خطای ارتباط با سرور');
  } finally {
    loading.value = false;
  }

}
</script>

<style scoped>
.RTL {
  direction: rtl;
}

::v-deep(.vpd-header){
  background-color: var(--primary-color) !important;
  color: white !important;
}

::v-deep(.vpd-icon-btn) {
  background-color: var(--primary-color) !important;
  color: white !important;
}
::v-deep(.vpd-day-effect) {
  background-color: var(--primary-color) !important;
  color: white !important;
}
::v-deep(.vpd-input-group) {
height: 4rem!important;
}
::v-deep(.form-control) {
  box-shadow: 0px 5px 8px 0 rgba(189,227,228,37);
  border-radius: 9px;
}

form-radio {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  outline: none;
  cursor: pointer;
}

.form-radio:checked {
  background-color: var(--primary-color);
}

.form-radio:disabled {
  border-color: #ccc;
  cursor: not-allowed;
}

.form-radio:disabled:checked {
  background-color: #ccc;
}

.text-color-gray {
  color: #999;
}
</style>
