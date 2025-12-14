<template>
  <LoadingJson :show="loading" />

  <div id="main" class="RTL">

    <div class="div-top-arrow">
      <router-link
        :to="{ name: 'UserArea' }"
        class="d-flex align-items-center text-decoration-none">
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
        <p class="font-4 font-bold text-white " style="margin: 0 15px 0 0">کیف پول</p>
      </router-link>
    </div>

    <div class="w-100 d-flex flex-column align-items-center row-gap-4" style="margin-top: 6.5rem">

      <div class="w-100 mt-3 p-3">

        <p class="text-end font-4 font-bold">موجودی کیف پول</p>

        <div class="w-100 bg-white d-flex justify-content-between p-3 rounded-5 shadow mt-3">
          <div class="w-50 d-flex justify-content-end align-items-center">
            <p v-if="user_wallet>0" class="text-blue-lite font-bold wallet-amount">  {{ Number(user_wallet).toLocaleString('fa-IR') }}</p>
            <p v-else class="text-color-red font-bold wallet-amount">   {{ Number(user_wallet).toLocaleString('fa-IR') }}</p>

            <span class="mr-2 text-color-gray">تومان</span>
          </div>

          <router-link  :to="{ name: 'MyCart' }">
            <img src="../assets/img/money.svg" alt="money" class="bg-color p-3 rounded-4" width="40px">
          </router-link>


        </div>

      </div>

    </div>

    <div class="w-100 d-flex flex-column align-items-center">

      <div class="w-95 d-flex flex-column align-items-start mt-3">
        <p class="font-4 font-bold">شارژ کیف پول</p>

        <div class="w-100 bg-white rounded-5 p-3 d-flex flex-column justify-content-center align-items-center my-4 shadow row-gap-4">

          <input
            v-model="amount"
            type="number"
            placeholder="مبلغ مد نظر (تومان)"
            class="w-50 p-3 rounded-4 text-center bg-gray font-4 border-0 bg-gray"
          />

          <button @click="addWallet" class="w-50 button-Default shadow font-4">
            افزایش موجودی
          </button>
        </div>
      </div>

      <hr class="w-85 br-lite-blue mt-3">

      <div
        v-for="item in show_history_wallet"
        :key="item.id"
        class="w-95 bg-white d-flex flex-column justify-content-center align-items-center mt-3 rounded-5 shadow wallet-padding"
      >

        <div class="w-100 d-flex">
          <div class="w-50 d-flex align-items-center">

            <img
              :src="getImage(item.type)"
              alt=""
              class="icon-2 ml-3"
            />
            <p
              :class="[
          'font-bold font-3',
          item.type === 'increase' ? 'text-color-green' : 'text-color-red'
        ]"
            >
              {{ item.price}} تومان
            </p>
          </div>
          <div class="w-50 d-flex justify-content-end align-items-center">
            <p class="font-3 font-bold">{{ item.date }}</p>
          </div>
        </div>

        <hr class="w-95 border-2 text-color_blue">

        <div class="w-85 d-flex justify-content-between">
          <p class="font-bold font-3"> {{ item.reason }}</p>
        </div>
      </div>



    </div>

    <br>
    <br>
    <br>
    <br>
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
import { SwalError} from '@/assets/js/MyJs.js'
import { onMounted, ref } from 'vue'
import LoadingJson from '@/components/LoadingJson.vue'
import { Capacitor } from '@capacitor/core'


const loading = ref(false)

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')

const user_wallet = ref('')
const show_history_wallet = ref([])
const amount = ref('')
let device = null;

if (Capacitor.getPlatform() === 'web') {
  device = 'web';
} else {
  device = 'android';
}

async function SendFirstRequest() {
  const sendData = {
    user_id: user_id,
    apikey: apikey,
    action: 'show_history',
    user_type: 'user',
  }

  loading.value = true

  try {
    const res = await axios.post(url + 'wallet', sendData)
    user_wallet.value = res.data.user_wallet
    show_history_wallet.value = res.data.show_history_wallet

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
function getImage(type) {
  if (type === 'increase') {
    return new URL('@/assets/img/plus-button.svg', import.meta.url).href
  } else {
    return new URL('@/assets/img/minus-button.svg', import.meta.url).href
  }
}

function addWallet() {
  if (!amount.value || amount.value <= 0) {
    SwalError('خطا!', 'لطفاً مبلغ معتبری وارد کنید', 'warning')
    return
  }

  // مثلاً ارسال به بک‌اند یا رفتن به درگاه پرداخت
  const sendData = {
    user_id: user_id,
    apikey: apikey,
    price: amount.value,
    action: 'add_wallet',
    user_type: 'user',
    device: device,
  }

  axios.post(url + 'wallet', sendData)
    .then(res => {
      if (res.data.status === 'ok') {
        window.location.href = res.data.event
      } else {
        SwalError('خطا!', res.data.message || 'مشکلی پیش آمده', 'error')
      }
    })
    .catch(err => {
      console.error(err)
      SwalError('خطا!', 'مشکل در برقراری ارتباط با سرور', 'error')
    })
}
</script>


<style scoped>
.RTL{
  direction: rtl;
}
.wallet-padding{
  padding: 1rem 2rem;
}
.wallet-amount {
  direction: rtl;
  unicode-bidi: plaintext;
  text-align: right;
  display: inline-block;
  font-size: 2rem;
}
</style>
