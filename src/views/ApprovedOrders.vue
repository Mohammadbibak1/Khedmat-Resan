<template>
  <LoadingJson :show="loading" />
  <div v-if="details_dialog" class="bg_dialog"></div>
  <div v-if="cancle_dialog" class="bg_dialog"></div>

  <div id="main" class="d-flex align-items-center flex-column RTL">
    <header class="div-top-arrow">
      <div @click.prevent="goBack" class="d-flex align-items-center text-decoration-none">
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
        <p class="font-4 font-bold text-white" style="margin: 0 15px 0 0">سفارشات تایید شده</p>
      </div>
    </header>

    <div v-if="!loading && orders.length > 0"  class="w-100 d-flex flex-column align-items-center row-gap-4 p-4" style="margin-top: 8rem">
      <div v-for="item in orders" :key="item.id" class="w-100 bg-white rounded-5 shadow-lite p-3">
        <div class="d-flex justify-content-between align-items-center pb-3">
          <div class="d-flex">
            <p class="font-3 font-bold">{{ item.service }}</p>
            <p class="font-3 font-bold mr-2 text-color-primary">{{ item.order_number }}</p>
          </div>

          <button
            class="w-40 button-status rounded-3 p-2 bg-success rounded-3 border-0 font-5"
          >
            پذیرفته شده
          </button>
        </div>

        <div
          class="d-flex flex-column row-gap-3 py-4"
          style="border-top: var(--primary-color) solid 3px; border-bottom: var(--primary-color) solid 3px"
        >
          <div class="d-flex justify-content-start align-items-center column-gap-3">
            <img src="../assets/img/calendar%20(5).svg" alt="calender" class="icon-3" />
            <p class="font-4 font-bold">روز و ساعت :</p>
            <p class="font-5 font-bold text-color-gray">{{ item.weekday }}</p>
            <p class="font-5 font-bold text-color-gray">{{ item.date }}</p>
            <p class="font-5 font-bold text-color-gray">{{ item.time }}</p>
          </div>
          <div class="d-flex justify-content-between align-items-start column-gap-3">
            <div class="d-flex column-gap-3">
              <img src="../assets/img/user%20(5).svg" alt="calender" class="icon-3" />
              <p class="font-4 font-bold">سفارش دهنده :</p>
              <p class="font-5 font-bold text-color-gray">
                {{ item.address }}
              </p>
            </div>
            <img src="../assets/img/call.svg" class="icon-3 ">
          </div>


          <div class="d-flex justify-content-between align-items-start column-gap-3">
            <div class="d-flex column-gap-3">
              <img src="../assets/img/user%20(5).svg" alt="calender" class="icon-3" />
              <p class="font-4 font-bold">ادرس سفارش :</p>
              <p class="font-5 font-bold text-color-gray">
                {{ item.address }}
              </p>
            </div>
            <img src="../assets/img/loc.svg" class="icon-3 ">
          </div>

          <div class="d-flex justify-content-start align-items-center column-gap-3">
            <img src="../assets/img/card.svg" alt="calender" class="icon-3" />
            <p class="font-4 font-bold">هزینه سفارش :</p>
            <p class="font-5 font-bold text-color-gray">
              <span v-if="item.price != null">
                {{ item.price }}
              </span>
              <span v-else> تعیین نشده </span>
              -
              <span v-if="item.is_pay == 0"> پرداخت نشده </span>
              <span v-else> پرداخت شده </span>
            </p>
          </div>

          <div class="w-85 bg-gray rounded-3 d-flex justify-content-between">

          </div>

          <div class="d-flex justify-content-start align-items-center column-gap-3">
            <img src="../assets/img/wallet%20(2).svg" alt="calender" class="icon-3" />
            <p class="font-4 font-bold">طریقه پرداخت :</p>
            <p class="font-5 font-bold text-color-gray" v-if="item.pay_type == null">نا مشخص</p>
            <p class="font-5 font-bold text-color-gray" v-else-if="item.pay_type == 'cash'">
              پرداخت نقدی
            </p>
            <p class="font-5 font-bold text-color-gray" v-else-if="item.pay_type == 'wallet'">
              پرداخت از کیف پول
            </p>
          </div>

        </div>

        <div
          class="w-100 d-flex justify-content-start align-items-center mt-3"
          v-if="item.worker == null"
        >
          <img
            src="../assets/img/Profile_avatar.svg"
            alt="Profile"
            class="rounded-circle object-fit-cover"
            style="width: 4rem; height: 4rem"
          />
          <p class="font-4 font-bold mr-3">سرویس کار :</p>

          <p class="font-5 mr-2">نامشخص</p>
        </div>

        <div class="w-100 d-flex justify-content-start align-items-center mt-3" v-else>
          <img
            :src="item.worker.face_pic"
            alt="Profile"
            class="rounded-circle object-fit-cover"
            style="width: 4rem; height: 4rem"
          />
          <p class="font-4 font-bold mr-3">سرویس کار :</p>

          <p class="font-5 mr-2">{{ item.worker.name }}</p>


          <a v-if="item.status == 1" :href="`tel:${item.worker.phone}`" >
            <img src="../assets/img/Call-service.svg" alt="" class="icon-size-5 mr-3" />
          </a>

        </div>

        <div class="w-100 d-flex justify-content-between align-items-center mt-3">
          <div
            class="d-flex align-items-center justify-content-start"
            @click="showDetails(item.id)"
          >
            <p class="font-4 text-color-blue font-bold">مشاهده جزئیات</p>
            <img
              src="../assets/img/Left-arrow.svg"
              alt="Detials"
              style="width: 1.1rem; height: 1.1rem"
              class="mr-2"
            />
          </div>

          <button
            @click="showCancleDialog(item.id)"
            class="w-35 bg-danger p-3 text-white shadow-lite bg-success"
            v-if="item.cancle_btn == 1"
          >
            لغو سفارش
          </button>

          <button
            class="w-35 p-3 text-white border-0 rounded-pill shadow-lite"
            style="background-color: deepskyblue"
            v-if="item.is_pay_btn == 1"
            @click="goToShowFactor(item.id)"
          >
            تکمیل سفارش و ثبت فاکتور
          </button>

          <a
            :href="item.factor_link"
            target="_blank"
            class="w-35 p-3 text-white border-0 rounded-pill shadow-lite d-inline-block text-center"
            style="background-color: #13e661"
            v-if="item.download_factor_btn == 1"
          >
            دانلود فاکتور
          </a>
        </div>
      </div>
    </div>


    <div
      v-else-if="!loading && orders.length === 0"
      class="w-100 d-flex flex-column align-items-center justify-content-center"
      style="min-height: 90vh"
    >
      <img src="../assets/img/empty-folder (1).png" style="opacity: 50%" />
      <p class="font-bold text-color-gray mt-3">سفارشی وجود ندارد</p>
    </div>


    <br />
    <br />
    <br />
    <br />
    <br />

    <div>
      <BottomNavigation v-model="activeIndex" :items="navItems" />
    </div>
  </div>

  <div v-if="details_dialog">
    <div class="dialog RTL">
      <button
        @click="details_dialog = false"
        class="position-absolute text-white d-flex justify-content-center align-items-center bg-white"
        style="
          width: 2.5rem;
          height: 2.5rem;
          top: 1.3rem;
          left: 1.5rem;
          border: none;
          border-radius: 50%;
        "
      >
        <span style="color: #0ba6ab; font-size: 20px">&times;</span>
      </button>
      <div
        class="w-100 bg-white bg-gradient d-flex flex-column justify-content-center align-items-center shadow-lite rounded-5 row-gap-4"
      >
        <div
          class="w-100 bg-gradient d-flex flex-column justify-content-start align-items-center shadow-lite rounded-5 row-gap-4 pb-3"
        >
          <p
            class="w-100 bg-color p-4 font-4 font-bold text-white rounded-top-5 text-center shadow"
          >
            جزئیات سفارش
          </p>

          <div
            v-for="items in details"
            :key="items.id"
            class="w-90 d-flex justify-content-between align-items-center"
          >
            <p class="font-4 font-bold">{{ items.question }}</p>
            <p class="font-5">{{ items.answer_text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="cancle_dialog">
    <div class="dialog RTL">
      <button
        @click="cancle_dialog = false"
        class="position-absolute text-white d-flex justify-content-center align-items-center bg-white"
        style="
          width: 2.5rem;
          height: 2.5rem;
          top: 1.3rem;
          left: 1.5rem;
          border: none;
          border-radius: 50%;
        "
      >
        <span style="color: #0ba6ab; font-size: 20px">&times;</span>
      </button>

      <div
        class="w-100 bg-white bg-gradient d-flex flex-column justify-content-center align-items-center shadow-lite rounded-5 row-gap-4"
      >
        <div
          class="w-100 bg-gradient d-flex flex-column justify-content-start align-items-center shadow-lite rounded-5"
        >
          <p
            class="w-100 bg-color p-4 font-4 font-bold text-white rounded-top-5 text-center shadow"
          >
            علت لغو سفارش
          </p>

          <div class="w-100 mt-3 p-3">
            <div class="w-100 d-flex">
              <input type="radio" id="A" value="سرویس کار به موقع نیامد" v-model="cancelReason" />
              <label for="A" class="font-4 text-black mr-2">سرویس کار به موقع نیامد</label>
            </div>
            <div class="w-100 mt-3 d-flex">
              <input
                type="radio"
                id="B"
                value="در زمان قرار برایم مشکلی پیش آمد"
                v-model="cancelReason"
              />
              <label for="B" class="font-4 text-black mr-2">در زمان قرار برایم مشکلی پیش آمد</label>
            </div>
            <div class="w-100 mt-3 d-flex">
              <input
                type="radio"
                id="C"
                value="مشکلی در انجام سفارش رخ داد"
                v-model="cancelReason"
              />
              <label for="C" class="font-4 text-black mr-2">مشکلی در انجام سفارش رخ داد</label>
            </div>
            <div class="w-100 mt-3 d-flex">
              <input type="radio" id="D" value="سایر" v-model="cancelReason" />
              <label for="D" class="font-4 text-black mr-2">سایر</label>
            </div>
          </div>

          <hr class="w-90 hr-custom mt-3" />
          <label for="de" class="w-100 text-center font-4 font-bold mt-3">
            لطفا علت لغو سفارش را بیان کنید
          </label>
          <textarea
            id="de"
            v-model="cancelDescription"
            class="w-90 p-3 bg-lite-blue rounded-4 my-3"
            rows="5"
            cols="5"
            placeholder="توضیحات"
          ></textarea>

          <button @click="cancleOrder" class="button-Default w-45 font-3 my-3 shadow">ثبت</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { SwalError, SwalSuccess } from '@/assets/js/MyJs.js'
import { onMounted, ref, watch } from 'vue'
import LoadingJson from '@/components/LoadingJson.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

// buttom navigation
const activeIndex = ref(2) // پشتیبانی باید به طور پیش‌فرض فعال باشد

import homeIcon from '@/assets/img/home.svg'
import customerIcon from '@/assets/img/customer.svg'
import orderIcon from '@/assets/img/order.svg'
import profileIcon from '@/assets/img/profile.svg'
import router from '@/router/index.js'

const navItems = [
  { label: 'خانه', icon: homeIcon, route: '/home_page' },
  { label: 'پشتیبانی', icon: customerIcon, route: '/support_page' },
  { label: 'سفارشات', icon: orderIcon, route: '/orders_page' },
  { label: 'کاربری', icon: profileIcon, route: '/user_area' }
]
// buttom navigation

const loading = ref(false)
const details_dialog = ref(false)
const cancle_dialog = ref(false)

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')

const orders = ref([])
const details = ref([])
const cancelReason = ref('')
const cancelDescription = ref('')
const selectedOrderId = ref(null)

async function SendFirstRequest() {
  const sendData = {
    user_id: user_id,
    apikey: apikey
  }

  loading.value = true

  try {
    const res = await axios.post(url + 'show_orders', sendData)
    orders.value = res.data // این خط اضافه شده است

    console.log(JSON.stringify(orders.value, null, 2))
    console.log(orders.value)
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

async function showDetails(itemId) {
  details.value = {} // اطلاعات قبلی پاک میشه
  details_dialog.value = true
  loading.value = true

  var send_data = {
    apikey: apikey,
    user_id: user_id,
    order_id: itemId
  }
  console.log(send_data)
  try {
    const res = await axios.post(url + 'show_details_orders', send_data)
    details.value = res.data

    console.log(JSON.stringify(details.value, null, 2))
    console.log(details.value)
  } catch (error) {
    console.error('خطا در دریافت اطلاعات:', error)
    SwalError('خطا!', 'خطای ارتباط با سرور', 'error', true, showDetails)
  } finally {
    loading.value = false
  }
}

const showCancleDialog = async (itemId) => {
  selectedOrderId.value = itemId
  cancle_dialog.value = true
}

const cancleOrder = async () => {

  if (!cancelReason.value) {
    SwalError('علت لغو', 'لطفا علت لغو سفارش را مشخص کنید')
    return
  }

  var send_data = {
    user_id: user_id,
    apikey: apikey,
    order_id: selectedOrderId.value,
    user_type: 'user',
    title: cancelReason.value,
    description: cancelDescription.value
  }

  console.log(send_data)
  try {
    const response = await axios.post(url + 'cancel_order', send_data)

    if (response.data.status === 'ok') {
      SwalSuccess('سفارش با موفقیت لغو شد')
      cancle_dialog.value = false
      SendFirstRequest()
      cancelReason.value = ''
      cancelDescription.value = ''
    } else {
      SwalError('خطا!', response.data.message || 'لغو سفارش انجام نشد. مجدد تلاش کنید')
    }
  } catch (error) {
    console.error('خطا :', error)
    SwalError('خطا!', 'خطای ارتباط با سرور')
  } finally {
    loading.value = false
  }
}

const goToShowFactor = (itemId) => {
  router.push({ name: 'ShowFactor', params: { order_id: itemId } })
}

//غیر فعال شدن اسکرول هنگام باز بودن دیالوگ
watch(details_dialog, (val) => {
  document.body.style.overflow = val ? 'hidden' : 'auto'
  if (!val) {
    details.value = {} // وقتی دیالوگ بسته میشه، اطلاعات پاک شه
  }
})

watch(cancle_dialog, (val) => {
  document.body.style.overflow = val ? 'hidden' : 'auto'
  // if (!val) {
  //   details.value = {} // وقتی دیالوگ بسته میشه، اطلاعات پاک شه
  // }
})
</script>

<style scoped>
.RTL {
  direction: rtl;
}
</style>
