<template>
  <LoadingJson :show="loading" />

  <div id="main" class="RTL">
    <div class="div-top-arrow">
      <router-link
        :to="{ name: 'UserArea' }"
        class="d-flex align-items-center text-decoration-none"
      >
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
        <p class="font-3 font-bold text-white mr-3">سوالات متداول</p>
      </router-link>
    </div>

    <div class="d-flex justify-content-center margin">
      <ul id="accordion">
        <li v-for="(item, index) in data" :key="item.id">
          <label :for="'faq-' + item.id">
            {{ item.question }}
            <span style="color: var(--primary-color)">&#9662;</span>
          </label>
          <input type="radio" name="accordion" :id="'faq-' + item.id" :checked="index === 0" />
          <div class="content">
            {{ item.answer }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { SwalError } from '@/assets/js/MyJs.js'
import { onMounted, ref } from 'vue'
import LoadingJson from '@/components/LoadingJson.vue'

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')
const loading = ref(false)

const data = ref([])

async function SendFirstRequest() {
  loading.value = true
  try {
    const response = await axios.post(url + 'public_info', {
      user_id,
      apikey,
      action: 'FAQ_user',
    })
    data.value = response.data
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
.margin {
  margin-top: 10rem;
}
#accordion {
  width: 90%;
  padding-right: 0 !important;
}
#accordion li {
  list-style: none;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}
#accordion li label {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.3rem;
  font-weight: bold;
  font-family: "IRANSans", sans-serif;
  cursor: pointer;
  color: var(--primary-color);
}
#accordion label span {
  transform: rotate(90deg);
  font-size: 22px;
  color: #333;
}
#accordion label + input[type='radio'] {
  display: none;
}
#accordion .content {
  padding: 0 10px;
  line-height: 26px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s linear;
  font-family: "IRANSans", sans-serif;
  font-size: 1rem;
}
#accordion label + input[type='radio']:checked + .content {
  max-height: 400px;
}
ol,
ul {
  padding-left: 0 !important;
}


</style>
