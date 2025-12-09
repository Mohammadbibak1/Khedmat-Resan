<template>
  <LoadingJson :show="loading" />

  <div id="main" class="d-flex align-items-center flex-column RTL">
    <div
      class="div-top-arrow bg-color max_width d-flex justify-content-end rounded-bottom-5 shadow">
      <router-link
        :to="{ name: 'OrdersPage' }"
        class="d-flex align-items-center text-decoration-none"
      >
        <p class="font-4 font-bold text-white mr-3">پرداخت</p>
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
      </router-link>
    </div>

    <div class="w-100 d-flex flex-column align-items-start row-gap-3 p-3" style="margin-top: 8rem">
      <div class="d-flex">
        <h2 class="font-4 font-bold">فاکتور خدمات</h2>
        <span class="font-5 font-bold mr-3">{{ order_number }}</span>
      </div>
      <!-- *************************فاکتور خدمات*******************-->
      <div class="w-100 d-flex flex-column align-items-end bg-skyblue p-3 rounded-5 shadow-lite">
        <div class="w-100 d-flex bg-white rounded-4 p-3 mb-4">
          <p class="w-45 text-center font-4 font-bold">خدمات</p>
          <p class="w-25 text-center font-4 font-bold" style="border-right: #0ba6ab 3px solid">
            قیمت واحد<br />(تومان)
          </p>
          <p class="w-25 text-center font-4 font-bold" style="border-right: #0ba6ab 3px solid">
            تعداد/ساعت
          </p>
          <p class="w-25 text-center font-4 font-bold" style="border-right: #0ba6ab 3px solid">
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

        <div
          class="w-90 d-flex align-items-center justify-content-between bg-white rounded-4 p-3 mt-2"
        >
          <p class="font-4 font-bold text-color-blue">جمع فاکتور</p>
          <p class="font-4 font-bold text-color-green">{{ factor_price }} تومان</p>
        </div>
      </div>

      <h2 class="font-4 font-bold mt-3">کد تخفیف</h2>

      <div class="w-100 d-flex justify-content-between">
        <input
          v-model="discount_code"
          type="text"
          class="w-65 rounded-3 p-3 shadow-lite"
          placeholder="اختیاری"
        />
        <button
          @click="SendFirstRequest"
          class="w-30 border-0 rounded-3 p-3 shadow-lite font-4 font-bold text-white"
          style="background-color: #2ae78b"
        >
          اعمال
        </button>
      </div>

      <h2 class="font-4 font-bold mt-3">نحوه پرداخت</h2>

      <div class="w-100 p-3 bg-white rounded-5 shadow-lite d-flex flex-column">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <input
              type="radio"
              id="wallet"
              name="payment"
              value="wallet"
              v-model="selectedPayment"
            />            <label class="font-4 font-bold text-black mr-3" for="wallet"
              >پرداخت از طریق کیف پول</label
            >
          </div>
          <div class="d-flex align-items-center column-gap-2">
            <p class="font-5 font-bold">موجودی کیف پول</p>
            <p class="font-5 font-bold text-color-green">{{user_wallet}} تومان</p>
            <img src="../assets/img/plus-button.svg" alt="" class="icon-size-2" />
          </div>
        </div>
        <hr class="w-100 border-color-blue" />
        <div class="d-flex align-items-center">
          <input
            type="radio"
            id="cash"
            name="payment"
            value="cash"
            v-model="selectedPayment"
          />
          <label class="font-4 font-bold text-black mr-3" for="cash"> پرداخت نقدی</label>
        </div>
      </div>

      <div class="w-100 d-flex justify-content-center mt-4">
        <button @click="payOrder" class="button-Default w-40 font-3 shadow">پرداخت</button>
      </div>
    </div>
  </div>
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
    return;
  }

  const sendData = {
    user_id: user_id,
    apikey: apikey,
    order_id: order_id,
    discount_code: discount_code.value,
    pay_type: selectedPayment.value,
    factor_price:factor_price.value,
  }

  console.log(sendData)
  try {
    const response = await axios.post(url + 'pay_order',sendData )

    if (response.data.status === 'ok') {
      await SwalSuccess('پرداخت موفق', 'پرداخت سفارش با موفقیت انجام شد') // اینجا صبر می‌کنه تا تایمر تموم شه
      router.back()
    } else {
      SwalError('خطا!',response.data.event ,'error')
    }
  } catch (error) {
    console.
    error('خطا :', error)
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
