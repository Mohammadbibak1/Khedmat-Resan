<template>
  <LoadingJson :show="loading" />

  <div id="main" class="d-flex flex-column justify-content-start p-3">


    <header class="div-top-arrow bg-color">
      <span class="font-3 font-bold text-white">پشتیبانی</span>
    </header>

    <div class="w-100 d-flex flex-column justify-content-center align-items-center" style="margin-top: 10rem">

        <h2 class="w-100 text-end font-3 font-bold">انتخاب موضوع تیکت</h2>

      <div class="w-95 d-flex flex-wrap row-gap-4 justify-content-between mt-5">
        <div class="option-group">
          <div
            v-for="option in options"
            :key="option"
            :class="['custom-radio', selectedOption === option && 'selected']"
            @click="selectedOption = option"
          >
            {{ option }}
          </div>
        </div>
      </div>

      <div class="w-95 d-flex flex-column align-items-start mt-5">
        <h2 class="font-3 font-bold">مشکل خود را شرح دهید</h2>
        <textarea
          v-model="details"
          cols="5"
          rows="10"
          class="rounded-4 text-center w-100 font-4 font-bold mt-3 p-3 shadow"
          placeholder="توضیحات مورد نظر خود را وارد نمایید"
        ></textarea>
      </div>

      <button class="w-50 button-Default shadow my-5 a-blue" @click="submitTicket">
        ارسال تیکت
      </button>

      <router-link to="/my_ticket" class="font-3 font-normal text-color-primary text-decoration-none">تیکت های من</router-link>


      <!-- دکمه پشتیبانی -->
      <div class="support-fixed">
        <a :href="`tel:${support}`" class="w-65 button-Support text-center"
        >پشتیبانی</a
        >
        <button class="button-Support shadow pulse-circle icon-size-2">
          <img src="../../src/assets/img/phone.svg" alt="" class="icon-2" />
        </button>
      </div>



    </div>


    <div>
      <BottomNavigation v-model="activeIndex" :items="navItems" />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SwalError, SwalSuccess } from '@/assets/js/MyJs.js'
import LoadingJson from '@/components/LoadingJson.vue'
import axios from 'axios'
import BottomNavigation from '@/components/BottomNavigation.vue'

const options = [
  'گزارش مشکل خاص در اپلیکیشن',
  'لغو سفارش',
  'انتقاد و پیشنهاد',
  'سایر موارد',
]

const selectedOption = ref('')
const details = ref('')
const loading = ref(false)
const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')
var support = localStorage.getItem('support_phone')

const activeIndex = ref(1)  // پشتیبانی باید به طور پیش‌فرض فعال باشد

import customerIcon from '@/assets/img/customer-service-_1_.svg'
import homeIcon from '@/assets/img/home-_4_.svg'
import profileIcon from '@/assets/img/user (2).svg'

const navItems = [
  { label: 'پشتیبانی', icon: customerIcon, route: '/support_page' },
  { label: 'خانه', icon: homeIcon, route: '/home_page' },
  { label: 'کاربری', icon: profileIcon, route: '/user_area' },
]



const submitTicket = async () => {
  if (!selectedOption.value) {
    SwalError('خطا!', 'لطفا موضوع تیکت را مشخص کنید')
    return
  }

  if (!details.value.trim()) {
    SwalError('خطا!', 'لطفا مشکل خود را توضیح دهید')
    return
  }

  var send_date = {
    apikey: apikey,
    user_id: parseInt(user_id),
    action: "add",
    user_type: "user",
    title: selectedOption.value,
    caption: details.value,
  }
  console.log(send_date)

  try {
    loading.value = true

    const response = await axios.post(url + 'ticket', send_date)

    if (response.data.status === 'ok') {
      loading.value = false
      await SwalSuccess('ثبت موفق تیکت', `تیکت شما با موفقیت ارسال شد`);
      selectedOption.value = ''
      details.value = ''
    } else {
      SwalError('خطا!', response.data.message || 'مشکلی پیش آمد مجدد امنحان کنید')
    }
  } catch (error) {
    console.error('خطا در درج تیکت:', error)
    SwalError('خطا!', 'خطای ارتباط با سرور')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

.option-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  justify-content: space-between;
}

.custom-radio {
  cursor: pointer;
  padding: 2rem;
  border-radius: 1rem;
  background-color: var(--bg-white);
  box-shadow: var(--shadow-light);
  text-align: center;
  font-family: IRANSans;
    font-size: var(--font-size-md);
  font-weight: var(--fw-bold);
  width: 48%;
  transition: all 0.3s ease;
}

.custom-radio.selected {
  background-color: var(--secondary-color);
  color: black;
}

textarea {
  resize: none;
}

.pulse-circle {
  position: relative;
  z-index: 1;
  overflow: visible;
}

.pulse-circle::after {
  content: "";
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

.support-fixed {
  position: fixed;
  bottom: 8rem;
  left: 1.5rem;
  z-index: 5;
  display: flex;
  gap: 0.5rem;
  animation: shake 2.2s infinite ease-in-out;
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

</style>
