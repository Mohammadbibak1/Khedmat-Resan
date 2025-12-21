<template>
  <LoadingJson :show="loading" />

  <div id="main" class="d-flex align-items-center flex-column RTL" style="height: 100dvh">
    <header class="div-top-arrow">
      <div @click.prevent="goBack" class="d-flex align-items-center text-decoration-none">
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
        <p class="font-3 font-bold text-white" style="margin: 0 5px">تکمیل سفارش وثبت فاکتور</p>
      </div>
    </header>

    <div class="w-100 d-flex flex-column align-items-start row-gap-3 p-3" style="margin-top: 8rem">
      <div class="w-100 d-flex justify-content-between align-items-center">
        <h2 class="font-4 font-bold">لطفا فاکتور سفارش را تکمیل کنید</h2>
        <button class="bg-success w-25">افزودن سطر</button>
      </div>
      <!-- *************************فاکتور خدمات*******************-->
      <div
        class="w-100 d-flex flex-column align-items-end p-3 rounded-5 shadow-lite"
        style="background-color: #dfdfdf"
      >
        <div class="w-100 d-flex bg-white rounded-4 p-3 mb-4">
          <p class="w-45 text-center font-4 font-bold">خدمات</p>
          <p
            class="w-25 text-center font-4 font-bold"
            style="border-right: var(--primary-color) 3px solid"
          >
            قیمت واحد<br />(تومان)
          </p>
          <p
            class="w-25 text-center font-4 font-bold"
            style="border-right: var(--primary-color) 3px solid"
          >
            تعداد/ساعت
          </p>
          <p
            class="w-25 text-center font-4 font-bold"
            style="border-right: var(--primary-color) 3px solid"
          >
            جمع کل<br />(تومان)
          </p>
        </div>

        <div
          v-for="(item, index) in factor"
          :key="index"
          class="w-100 d-flex align-items-center bg-white rounded-4 p-3 mt-2"
        >
          <p class="text-center font-4 font-bold text-color-blue">
            {{ index + 1 }}
          </p>
          <p class="w-45 text-center font-4 font-bold text-color-blue">{{ item.title }}</p>
          <p
            class="w-25 text-center font-4 font-bold text-color-blue"
            style="border-right: #0ba6ab 3px solid"
          >
            {{ item.price }}
          </p>
          <p
            class="w-25 text-center font-4 font-bold text-color-blue"
            style="border-right: #0ba6ab 3px solid"
          >
            {{ item.unit }}
          </p>
          <p
            class="w-25 text-center font-4 font-bold text-color-blue"
            style="border-right: #0ba6ab 3px solid"
          >
            {{ item.total_price }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <section
    class="w-100 bg-white d-flex flex-wrap justify-content-between align-items-center p-3"
    style="position: absolute; bottom: 0; height: 15rem"
  >
    <span class="font-3 font-bold"> جمع کل فاکتور </span>
    <span class="font-3 font-bold text-success"> 1.920.000 تومان </span>
    <button class="w-100 bg-success">ثبت فاکتور</button>
  </section>
</template>

<script setup>
import axios from 'axios'
import { SwalError, SwalSuccess } from '@/assets/js/MyJs.js'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import LoadingJson from '@/components/LoadingJson.vue'
import router from '@/router/index.js'

const loading = ref(false)

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')
const route = useRoute()

const order_id = route.params.order_id

const factor = ref([])
const factor_price = ref('')
const user_wallet = ref('')
const discount_code = ref('')
const info_factor = ref([])
const order_number = ref('')
const selectedPayment = ref('') // wallet یا cash

async function SendFirstRequest() {
  const sendData = {
    user_id: user_id,
    apikey: apikey,
    order_id: order_id,
    discount_code: discount_code.value,
  }

  loading.value = true

  try {
    const res = await axios.post(url + 'show_factor', sendData)
    if (res.data.status && res.data.status == 'error') {
      SwalError('خطا!', res.data.event, 'error')

      discount_code.value = ''
      return // از ادامه اجرای تابع جلوگیری کنید
    }

    factor.value = res.data.factor
    factor_price.value = res.data.factor_price
    user_wallet.value = res.data.user_wallet
    discount_code.value = res.data.discount_code
    info_factor.value = res.data.info_factor
    order_number.value = res.data.order_number
  } catch (error) {
    console.error('خطا در دریافت اطلاعات:', error)
    SwalError('خطا!', 'در دریافت اطلاعات مشکلی پیش آمده است', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  SendFirstRequest()
})

async function payOrder() {
  if (!selectedPayment.value) {
    SwalError('خطا!', 'لطفا طریقه پرداخت خود را مشخص کنید')
    return
  }

  const sendData = {
    user_id: user_id,
    apikey: apikey,
    order_id: order_id,
    discount_code: discount_code.value,
    pay_type: selectedPayment.value,
    factor_price: factor_price.value,
  }

  console.log(sendData)
  try {
    const response = await axios.post(url + 'pay_order', sendData)

    if (response.data.status === 'ok') {
      await SwalSuccess('پرداخت موفق', 'پرداخت سفارش با موفقیت انجام شد') // اینجا صبر می‌کنه تا تایمر تموم شه
      router.back()
    } else {
      SwalError('خطا!', response.data.event, 'error')
    }
  } catch (error) {
    console.error('خطا :', error)
    SwalError('خطا!', 'خطای ارتباط با سرور')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.RTL {
  direction: rtl;
}
</style>
