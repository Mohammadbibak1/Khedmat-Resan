<template>
  <LoadingJson :show="loading" />

  <div id="main" class="RTL">
    <div class="div-top-arrow bg-color max_width d-flex justify-content-end w-100 rounded-bottom-5">
      <p class="font-4 font-bold text-white mr-3">پشتیبانی</p>
    </div>

    <div class="w-100 d-flex flex-column justify-content-center align-items-center" style="margin-top: 10rem">
      <div class="w-85 d-flex justify-content-start">
        <p class="font-3 font-bold text-color-blue">انتخاب موضوع تیکت</p>
      </div>

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
        <p class="font-3 font-bold text-color-blue">مشکل خود را شرح دهید</p>
        <textarea
          v-model="details"
          cols="5"
          rows="5"
          class="rounded-4 text-center w-100 font-4 font-bold mt-3 shadow-lite p-3"
          placeholder="توضیحات مورد نظر خود را وارد نمایید"
        ></textarea>
      </div>

      <button class="w-50 button-Default shadow my-5 a-blue" @click="submitTicket">
        ارسال تیکت
      </button>

      <router-link to="/my_ticket" class="font-4 mb-4 text-decoration-none" style="color: #0F8096; text-decoration: underline">تیکت های من</router-link>

      <!-- دکمه پشتیبانی -->
      <div class="w-48 d-flex justify-content-end gap-1 support-fixed RTL">
        <a :href="`tel:${support}`" class="w-65 button-Support shadow text-center"
        >پشتیبانی</a
        >
        <button class="button-Support shadow pulse-circle">
          <img src="../../src/assets/img/phone.svg" alt="" class="icon-size-3" />
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

import homeIcon from '@/assets/img/home.svg'
import customerIcon from '@/assets/img/customer.svg'
import orderIcon from '@/assets/img/order.svg'
import profileIcon from '@/assets/img/profile.svg'

const navItems = [
  { label: 'خانه', icon: homeIcon , route: '/home_page' },
  { label: 'پشتیبانی', icon: customerIcon , route: '/support_page'},
  { label: 'سفارشات', icon: orderIcon , route: '/orders_page'},
  { label: 'کاربری', icon: profileIcon , route: '/user_area'},
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
.RTL{
  direction: rtl;
}
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
  background-color: white;
  box-shadow: 0px 5px 8px 0 rgba(189,227,228,37);
  text-align: center;
  //font-size: 1rem;
  font-weight: bold;
  width: 48%;
  transition: all 0.3s ease;
}

.custom-radio.selected {
  background-color: #BDE3E4;
  color: #0F8096;
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

.active {
  background-color: #007BFF;  /* رنگ دکمه وقتی فعال است */
  color: white;
}
</style>
