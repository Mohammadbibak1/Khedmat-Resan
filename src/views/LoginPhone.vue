<template>
  <LoadingJson :show="loading" />

  <div id="main" class="w-100 bg-color d-flex flex-column align-items-center justify-content-center p-0">

    <section class="w-100 bg-lite-color d-flex justify-content-center">
      <img src="../../public/Logo-app.svg" alt="logo" class="img-login w-40 bg-color rounded-pill" />
    </section>

    <div class="w-100 d-flex flex-column justify-content-center align-items-center">

      <div class="w-80 p-5 rounded-5 shadow-custom d-flex flex-column align-items-center">
        <label for="number" class="text-white font-4 font-bold text-center"
          >برای ورود شماره موبایل خود راوارد کنید
        </label>

        <input
          v-model="phone"
          type="tel"
          maxlength="11"
          id="number"
          class="w-100 rounded-pill p-3 shadow my-4"
          placeholder="0913......."
        />

        <div class="d-flex align-items-center gap-3 my-3">
          <label for="num" class="font-5 text-white font-bold text-end">
            تمام
            <RouterLink to="/rules_page">شرایط و قوانین</RouterLink>
            برنامه و
            <RouterLink :to="{ name: 'PrivacyPage' }">حریم خصوصی</RouterLink>

            را میپذیرم
          </label>
          <input v-model="check_rules" id="num" type="checkbox" />
        </div>

        <button @click="SendData" class="w-65 button-Default shadow mt-3">
          دریافت کد فعال سازی
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router'
import { SwalError } from '@/assets/js/MyJs'
import LoadingJson from '@/components/LoadingJson.vue'

// متغیرها
const phone = ref('')
const check_rules = ref(false)
const loading = ref(false)

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const support = localStorage.getItem('support_phone')

// ارسال اطلاعات
function SendData() {
  if (phone.value.length !== 11) {
    SwalError('خطا!', 'شماره همراه نا معتبر است', 'error')
    return
  }

  if (!check_rules.value) {
    SwalError('خطا!', 'شرایط و قوانین را بپذیرید', 'error', false)
    return
  }

  const data = {
    apikey: apikey,
    phone: phone.value,
  }

  loading.value = true
  axios
    .post(`${url}login_phone`, data)
    .then((response) => {
      loading.value = false
      const res = response.data
      if (res.status === 'ok') {
        router.push({ name: 'LoginOtp', params: { phone: phone.value, otp: res.otp } })
      }
    })
    .catch((err) => {
      loading.value = false
      console.log(err)
    })
}

// onMounted(() => {
//   const input = document.getElementById("number");
//   const supportElement = document.querySelector('.support-fixed');
//
//   // وقتی کاربر وارد فیلد شماره می‌شود صفحه‌کلید باز می‌شود
//   input.addEventListener("focus", () => {
//     supportElement.style.display = 'none';
//   });
//
//   // وقتی کاربر از فیلد خارج می‌شود صفحه‌کلید بسته می‌شود
//   input.addEventListener("blur", () => {
//     supportElement.style.display = 'flex';
//   });
//
//   // بررسی وضعیت صفحه‌کلید و تنظیم موقعیت دکمه پشتیبانی
//   window.addEventListener('resize', () => {
//     if (window.innerHeight < 600) { // زمانی که صفحه‌کلید باز است
//       supportElement.style.display = 'none'; // مخفی کردن دکمه پشتیبانی
//     } else {
//       supportElement.style.display = 'flex'; // نمایش دکمه پشتیبانی
//     }
//   });
// });
</script>

<style scoped>

</style>
