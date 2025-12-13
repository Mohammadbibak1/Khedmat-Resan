<template>
  <LoadingJson :show="loading" />

  <div id="main" class="RTL">
    <header class="div-top-arrow">
      <router-link
        :to="{ name: 'UserArea' }"
        class="d-flex align-items-center text-decoration-none"
      >
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
        <p class="font-3 font-bold text-white mr-3">درباره ما</p>
      </router-link>
    </header>

    <div class="w-100 h-100 d-flex flex-column align-items-center p-3" style="margin-top: 7rem">
      <div class="w-100 h-100 bg-white border-2 rounded-4 p-4 font-4 shadow clean-content" v-html="cleanedData"></div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { SwalError } from '@/assets/js/MyJs.js'
import { onMounted, ref, computed } from 'vue'
import LoadingJson from '@/components/LoadingJson.vue'

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')
const loading = ref(false)

const data = ref('')

// تابع برای حذف استایل‌ها از HTML
const cleanedData = computed(() => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(data.value, 'text/html')
  doc.body.querySelectorAll('*').forEach(el => {
    el.removeAttribute('style')
  })
  return doc.body.innerHTML
})

async function SendFirstRequest() {
  loading.value = true
  try {
    const response = await axios.post(url + 'public_info', {
      user_id,
      apikey,
      action: 'about_us',
    })
    console.log(response)
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

.clean-content {
  font-family: 'IRANSans', sans-serif;
  font-size: 14px;
  color: #333;
  line-height: 2;
  text-align: justify;
}
</style>
