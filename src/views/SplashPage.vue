<template>
  <LoadingJson :show="loading" />

  <div id="main" class="bg-color w-100 d-flex flex-column" style="min-height: 100vh">
    <div
      class="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-center"
      style="gap: 1rem"
    >
      <img src="../../public/Logo-app.svg" class="logo_splash" />
      <span class="font-bold font-2 text-white">خدمت رسان</span>
    </div>

    <div class="w-100 d-flex flex-column align-items-center mb-3">
      <span class="font-4 font-bold text-white">نسخه استاد کار</span>
      <span class="font-4 font-bold text-white">{{ appVersion }}</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocationStore } from '@/stores/location'
import axios from 'axios'
import { SwalError, SwalErrorSplash, SwalUpdateSplash } from '@/assets/js/MyJs.js'
import LoadingJson from '@/components/LoadingJson.vue'
import { appVersion } from '@/main.js'

const router = useRouter()
const location = useLocationStore()

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')
const loading = ref(false)
const app_version = ref('')
const updating_version = ref(false)
let tell = null

async function SendFirstRequest() {
  const version_data = {
    apikey: apikey,
    action: 'version_user',
  }
  const version_updating_data = {
    apikey: apikey,
    action: 'updating_user',
  }
  const support_phone = {
    apikey: apikey,
    action: 'tell',
  }
  loading.value = true

  try {
    const [versionRes, updatingRes, tellRes] = await Promise.all([
      axios.post(url + 'public_info', version_data),
      axios.post(url + 'public_info', version_updating_data),
      axios.post(url + 'public_info', support_phone),
    ])

    app_version.value = versionRes.data.version
    updating_version.value = updatingRes.data.version
    tell = tellRes.data
    localStorage.setItem('support_phone', tell)

    // if (appVersion !== app_version.value) {
    //   await SwalUpdateSplash(
    //     'بروزرسانی جدید',
    //     'یک نسخه جدید برای اپلیکیشن موجود است. لطفاً آپدیت کنید.',
    //     'error',
    //     false,
    //     null,
    //     'https://samankhedmat.ir/',
    //   )
    //   return false
    // } else if (updating_version.value == 1) {
    //   await SwalErrorSplash(
    //     'خطا!',
    //     'اپلیکیشن در دسترس نیست لطفا در مدتی نزدیک منتظر دیدار شما هستیم.',
    //     'error',
    //     false,
    //   )
    //   return false
    // }

    return true
  } catch (error) {
    console.error('خطا در دریافت اطلاعات:', error)
    await SwalError('خطا!', 'خطای ارتباط با سرور', 'error', true, SendFirstRequest)
    return false
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const canProceed = await SendFirstRequest()
  if (!canProceed) {
    return
  }

  const hasStorage = localStorage.getItem('location_data')
  console.log(hasStorage)
  await location.fetchLocations(apikey, url)

  // if (!hasStorage) {
  //   await location.fetchLocations(apikey, url);
  // } else {
  //   await location.fetchLocations(apikey, url);
  //   location.loadFromStorage();
  // }

  // بعد از یک ثانیه برو به صفحه لاگین

  setTimeout(() => {
    if (user_id) {
      router.push('/home_page')
    } else {
      router.push('/login_phone')
    }
  }, 1000)
})
</script>

<style scoped></style>
