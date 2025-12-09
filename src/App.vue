<script setup>

import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { StatusBar } from '@capacitor/status-bar'
import { ScreenOrientation } from '@capacitor/screen-orientation'
import router from './router'
import { useRoute } from 'vue-router'
import { SwalConfirm } from '@/assets/js/MyJs.js'
const route = useRoute()

if (Capacitor.getPlatform() !== 'web') {
  StatusBar.setBackgroundColor({ color: '#0BA6AB' })
  ScreenOrientation.lock({ orientation: 'portrait' })
}

App.addListener('backButton', async () => {

  const currentComponent = route.name
  if (
    currentComponent === 'LoginPhone' ||
    currentComponent === 'LoginOtp' ||
    currentComponent === 'SighupPage' ||
    currentComponent === 'HomePage'
  ) {
    SwalConfirm(
      "آیا میخواهید از برنامه خارج شوید؟",
      "",
      "بله",
      "انصراف",
      () => {
        App.exitApp()  // خروج از اپلیکیشن
      }
    )

  }else if (
    currentComponent === 'SupportPage' ||
    currentComponent === 'OrdersPage' ||
    currentComponent === 'UserArea' ||
    currentComponent === 'SubcategoryPage'
  ){
    await router.push({ name: 'HomePage' })

    } else if (currentComponent === 'requestNew') {
    // نادیده بگیر (کار خاصی نمی‌کنی)
    return
  } else {
    router.back()  // برگشت به صفحه قبلی
  }
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
