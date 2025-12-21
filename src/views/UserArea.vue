<template>
  <div id="main" class="d-flex align-items-center flex-column RTl">
    <header class="div-top-arrow">
      <p class="font-3 font-bold text-white">کاربری</p>
    </header>

    <div
      class="w-100 d-flex flex-column align-items-center row-gap-4 pt-2"
      style="margin-top: 8rem"
    >
      <router-link
        to="/my_profile"
        class="w-90 bg-white p-4 d-flex justify-content-start align-items-center gap-3 rounded-4 shadow"
      >
        <img src="../assets/img/user (10).png" alt="user" class="icon-3" />
        <p class="font-3 font-bold text-black">پروفایل من</p>
      </router-link>


      <router-link
        to="/rules_page"
        class="w-90 bg-white p-4 d-flex justify-content-start align-items-center gap-3 rounded-4 shadow"
      >
        <img src="../assets/img/secure-shield%20(1).svg" alt="Privecy" class="icon-3" />
        <p class="font-3 font-bold text-black">قوانین و مقررات</p>
      </router-link>

      <router-link
        to="/about_us_page"
        class="w-90 bg-white p-4 d-flex justify-content-start align-items-center gap-3 rounded-4 shadow"
      >
        <img src="../assets/img/team%20(2).svg" alt="About-us" class="icon-3" />
        <p class="font-3 font-bold text-black">درباره ما</p>
      </router-link>

      <!-- خروج: اگر نیاز به لاگ‌اوت کدی داری -->
      <div
        @click="logout"
        class="w-90 bg-white p-4 d-flex justify-content-start align-items-center gap-3 rounded-4 shadow"
      >
        <img src="../assets/img/enter.svg" alt="Exit" class="icon-3" />
        <p class="font-3 font-bold text-black">خروج از اپلیکیشن</p>
      </div>
    </div>

    <div>
      <BottomNavigation v-model="activeIndex" :items="navItems" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useRouter } from 'vue-router'
import { SwalConfirm } from '@/assets/js/MyJs.js'
import BottomNavigation from '@/components/BottomNavigation.vue'

const router = useRouter()

const activeIndex = ref(3) // پشتیبانی باید به طور پیش‌فرض فعال باشد

import customerIcon from '@/assets/img/customer-service-_1_.svg'
import homeIcon from '@/assets/img/home-_4_.svg'
import profileIcon from '@/assets/img/user (2).svg'

const navItems = [
  { label: 'پشتیبانی', icon: customerIcon, route: '/support_page' },
  { label: 'خانه', icon: homeIcon, route: '/home_page' },
  { label: 'کاربری', icon: profileIcon, route: '/user_area' },
]

function logout() {
  SwalConfirm(
    'خروج از حساب کاربری',
    'آیا مطمئن هستید که می‌خواهید خارج شوید؟',
    'بله، خارج شو',
    'انصراف',
    () => {
      // حذف اطلاعات کاربر
      // localStorage.removeItem('ApiKey')
      // localStorage.removeItem('ProjectUrl')
      localStorage.removeItem('user_id')

      // هدایت به صفحه ورود یا خانه
      router.push({ name: 'SplashPage' })
    },
  )
}
</script>

<style scoped></style>
