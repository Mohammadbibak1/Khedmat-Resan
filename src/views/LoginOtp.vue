<template>
  <LoadingJson :show="loading" />

  <div
    id="main"
    class="w-100 bg-color d-flex flex-column align-items-center justify-content-between p-0"
    style="height: 100svh"
  >
    <section
      class="w-100 h-50 bg-lite-color d-flex justify-content-center align-items-center"
      style="background-color: #5263c5"
    >
      <img
        src="../../public/Logo-app.svg"
        alt="logo"
        class="img-login w-40 rounded-pill"
        style="background-color: #cbd3ff4a"
      />
    </section>

    <div
      class="w-100 h-50 d-flex flex-column justify-content-center align-items-center position-relative bg-circle"
    >
      <section
        class="w-80 p-5 bg-color rounded-5 shadow-custom d-flex flex-column align-items-center row-gap-5 position-absolute"
        style="top: -3rem"
      >
        <label class="text-white font-3 font-bold text-center"
          >کد ارسال شده به شماره همراه را وارد کنید</label
        >
        <div class="otp-ltr" dir="ltr">
          <v-otp-input
            ref="otpInput"
            input-classes="otp-input"
            :conditionalClass="['one', 'two', 'three', 'four']"
            separator=" "
            inputType="tel"
            :num-inputs="4"
            v-model:value="bindValue"
            :should-auto-focus="true"
            :should-focus-order="true"
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
            :placeholder="[' ', ' ', ' ', ' ']"
          />
        </div>

        <div class="d-flex align-items-center gap-3 my-3 font-bold font-normal">
          <a href="#" @click.prevent="resendOtp" :class="{ 'disabled-link': resendDisabled }">
            {{ resendDisabled ? `ارسال مجدد (${countdown})` : 'ارسال مجدد' }}
          </a>
          <hr class="hr-vertical" />
          <router-link :to="{ name: 'LoginPhone' }" class="otp_link">ویرایش شماره</router-link>
        </div>

        <button @click="SendOtp" class="w-65 button-Default shadow mt-3" :disabled="otpExpired">
          ارسال کد فعال سازی
        </button>
      </section>
    </div>

    <!-- دکمه پشتیبانی -->
    <div class="support-fixed">
      <a :href="`tel:${support}`" class="w-65 button-Support text-center">پشتیبانی</a>
      <button class="button-Support shadow pulse-circle icon-size-2">
        <img src="../../src/assets/img/phone.svg" alt="" class="icon-2" />
      </button>
    </div>
  </div>
</template>

<script setup>
import VOtpInput from 'vue3-otp-input'
import { ref, onMounted } from 'vue'
import LoadingJson from '@/components/LoadingJson.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import router from '@/router/index.js'
import { SwalError, SwalSuccess } from '@/assets/js/MyJs.js'

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')

const loading = ref(false)
var phone = useRoute().params.phone
const bindValue = ref('')

const resendDisabled = ref(true)
const countdown = ref(60)
var support = localStorage.getItem('support_phone')
const otpExpired = ref(false) // برای انقضای کد
let interval = null

function startTimer() {
  resendDisabled.value = true
  countdown.value = 60
  otpExpired.value = false // ریست وضعیت انقضا

  interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
      resendDisabled.value = false
      otpExpired.value = true // کد منقضی شد
    }
  }, 1000)
}

function resendOtp() {
  if (resendDisabled.value) return
  bindValue.value = ''

  //برای اسال مجدد
  const data = {
    apikey: apikey,
    phone: phone,
  }

  loading.value = true
  axios
    .post(`${url}login_phone`, data)
    .then((response) => {
      loading.value = false
      const res = response.data
      if (res.status === 'ok') {
        SwalSuccess('', 'کد جدید ارسال شد')
      }
    })
    .catch((err) => {
      loading.value = false
      console.log(err)
    })

  // شروع تایمر
  startTimer()
}

function SendOtp() {
  if (otpExpired.value) {
    SwalError('خطا!', 'کد منقضی شده است. لطفاً مجدداً دریافت کنید.', 'error', false)
    return
  }
  console.log(phone)
  console.log(bindValue.value)

  var mydata = {
    apikey: apikey,
    phone: phone,
    otp: bindValue.value,
  }

  loading.value = true
  axios
    .post(url + 'login_otp', mydata)
    .then((response) => {
      loading.value = false
      var res = response.data
      console.log(res)

      if (res.status == 'ok') {
        if (res.event === 'user exist') {
          localStorage.setItem('user_id', res.user_id)
          router.push({ name: 'HomePage' })
        } else {
          router.push({ name: 'SignupPage', params: { phone: phone } })
        }
      } else {
        SwalError('خطا!', 'کد یک بار مصرف صحیح نمی باشد', 'error', false)
      }
    })
    .catch(() => {
      loading.value = false
      console.log('error')
    })
}

onMounted(() => {
  startTimer()
})

function handleOnComplete() {
  SendOtp()
}

const handleOnChange = (value) => {
  console.log('Value changed:', value)
}
</script>

<style scoped>
.RTL {
  direction: rtl;
}

.pulse-circle {
  position: relative;
  z-index: 1;
  overflow: visible;
}

.pulse-circle::after {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  border-radius: 50%;
  background: rgba(87, 148, 248, 0.5);
  animation: pulse 1.5s infinite;
  z-index: -1;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  70% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-1px);
  }
  50% {
    transform: translateY(1px);
  }
  75% {
    transform: translateY(-1px);
  }
}

.img-login {
  width: 20rem;
}

/* استایل کلی همه inputها */
::v-deep(.otp-input) {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin: 10px 10px;
  padding: 5px;
  font-size: 17px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  background-color: white;
}

/* وقتی کد کامل وارد شد */
::v-deep(.otp-input.is-complete) {
  background-color: #e4e4e4;
}

/* مخفی کردن فلش‌های عدد */
::v-deep(.otp-input::-webkit-inner-spin-button),
::v-deep(.otp-input::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* placeholder ها */
::v-deep(input::placeholder) {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}

.otp_link {
  color: white;
}

.disabled-link {
  color: #aaa;
  pointer-events: none;
  cursor: default;
}
.otp-ltr {
  direction: ltr;
  unicode-bidi: bidi-override;
}


</style>

<script setup lang="ts"></script>
