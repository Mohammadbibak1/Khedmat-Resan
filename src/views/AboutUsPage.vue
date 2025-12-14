<template>
  <LoadingJson :show="loading" />

  <div id="main" class="RTL">
    <header class="div-top-arrow">
      <router-link
        :to="{ name: 'UserArea' }"
        class="d-flex align-items-center text-decoration-none"
      >
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
        <p class="font-3 font-bold text-white " style="margin: 0 15px 0 0">درباره ما</p>
      </router-link>
    </header>

    <div class="w-100 h-100 d-flex flex-column align-items-center p-3" style="margin-top: 7rem">
      <div class="w-100 h-100 bg-white border-2 rounded-4 p-4 font-4 shadow clean-content" v-html="cleanedData"></div>
    </div>
  </div>

  <div>
    <BottomNavigation v-model="activeIndex" :items="navItems" />
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

const activeIndex = ref(0)

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
