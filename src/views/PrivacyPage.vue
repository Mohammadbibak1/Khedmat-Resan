<template>
  <LoadingJson :show="loading" />

  <div id="main" class="RTL">
    <header class="div-top-arrow">
      <div @click.prevent="goBack" class="d-flex align-items-center text-decoration-none">
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
        <p class="font-3 font-bold text-white" style="margin: 0 5px">حریم خصوصی</p>
      </div>
    </header>

    <div class="w-100 h-100 d-flex flex-column align-items-center p-3" style="margin-top: 7rem">
      <div
        class="w-100 h-100 bg-white border-2 rounded-4 p-4 font-4 shadow-lite clean-content"
        v-html="cleanedData"
      ></div>
    </div>
  </div>
  <div>
    <BottomNavigation v-model="activeIndex" :items="navItems" />
  </div>
</template>

<script setup>
import BottomNavigation from '@/components/BottomNavigation.vue'
import categoryicon from '@/assets/img/category.svg'
import customerIcon from '@/assets/img/customer-service-_1_.svg'
import homeIcon from '@/assets/img/home-_4_.svg'
import orderIcon from '@/assets/img/list (1).svg'
import profileIcon from '@/assets/img/user (2).svg'

const navItems = [
  { label: 'دسته بندی', icon: categoryicon, route: '/home_page' },
  { label: 'پشتیبانی', icon: customerIcon, route: '/support_page' },
  { label: 'خانه', icon: homeIcon, route: '/home_page' },
  { label: 'سفارشات', icon: orderIcon, route: '/orders_page' },
  { label: 'کاربری', icon: profileIcon, route: '/user_area' },
]

import axios from 'axios'
import { SwalError } from '@/assets/js/MyJs.js'
import { onMounted, ref, computed } from 'vue'
import LoadingJson from '@/components/LoadingJson.vue'
import { useRouter } from 'vue-router'

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')

const loading = ref(false)
const data = ref('')
const router = useRouter()

// تابع برای حذف استایل‌ها از HTML
const cleanedData = computed(() => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(data.value, 'text/html')
  doc.body.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('style')
  })
  return doc.body.innerHTML
})

async function SendFirstRequest() {
  loading.value = true
  try {
    const response = await axios.post(url + 'public_info', {
      apikey,
      action: 'privacy',
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

function goBack() {
  // اگر تاریخچه مرورگر بیشتر از 1 است، به عقب برمی‌گردد.
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/') // در صورت نداشتن تاریخچه، به صفحه اصلی هدایت می‌شود
  }
}
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
