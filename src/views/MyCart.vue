<template>
  <LoadingJson :show="loading" />

  <div id="main" class="d-flex align-items-center flex-column RTL">
    <div class="div-top-arrow bg-color max_width justify-content-between rounded-bottom-5">
      <div class="d-flex">
        <div @click="addCart">
          <p
            class="bg-white font-5 font-bold rounded-pill shadow-lg"
            style="padding: 0.6rem 1.5rem"
          >
            افزودن کارت
            <img src="../assets/img/add.svg " alt="" class="icon-size-5" />
          </p>
        </div>
      </div>

      <router-link
        :to="{ name: 'MyWallet' }"
        class="d-flex align-items-center text-decoration-none"
      >
        <p class="font-4 font-bold text-white mr-3">کارت های من</p>
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
      </router-link>
    </div>

    <div
      v-if="cart.length > 0"
      class="w-100 d-flex flex-column align-items-center row-gap-4"
      style="margin-top: 8rem"
    >
      <div
        v-for="item in cart"
        :key="item.id"
        @click="selectedCardId = item.id"
        :class="[
          'w-90 p-4 d-flex justify-content-between align-items-center rounded-4 shadow-lite card-select',
          selectedCardId === item.id ? 'selected-card' : 'bg-white',
        ]"
      >
        <div>
          <p class="font-4 font-bold mr-3">{{ item.name }}</p>
          <p class="font-4 font-bold mr-3">{{ item.bank_name }}</p>
          <p class="font-4 font-bold mr-3">{{ item.kart_number }}</p>
          <p class="font-4 font-bold mr-3">{{ item.shaba_number }}</p>
        </div>

        <div @click.stop="deleteCart(item.id)" role="button" tabindex="0">
          <img
            src="../assets/img/Trashbin.svg"
            alt="حذف آدرس"
            class="icon-size-4 bg-white shadow p-2 rounded-pill cursor-pointer"
          />
        </div>
      </div>
      <button class="w-45 button-Default font-4 shadow my-5 a-blue" @click="submitTicket()">
        ثبت درخواست تسویه
      </button>
    </div>

    <div v-else class="position-absolute top-50 start-50 translate-middle text-center">
      <p class="font-5">کارتی ثبت نشده است</p>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { SwalConfirm, SwalError, SwalSuccess } from '@/assets/js/MyJs.js'
import { onMounted, ref } from 'vue'
import LoadingJson from '@/components/LoadingJson.vue'
import Swal from 'sweetalert2'
import router from '@/router/index.js'

const selectedCardId = ref(null)

const loading = ref(false)

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')

const cart = ref([])

async function SendFirstRequest() {
  const sendData = {
    user_id: user_id,
    apikey: apikey,
    action: 'show',
    user_type: 'user',
  }

  loading.value = true

  try {
    const res = await axios.post(url + 'pay_kart', sendData)
    cart.value = res.data // این خط اضافه شده است

    console.log(cart.value)
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

const deleteCart = async (cartId) => {
  SwalConfirm('آیا مطمئن هستید؟', 'این کارت حذف خواهد شد', 'بله، حذف کن', 'انصراف', async () => {
    try {
      const response = await axios.post(url + 'pay_kart', {
        user_id: user_id,
        apikey: apikey,
        kart_id: cartId,
        action: 'delete',
        user_type: 'user',
      })

      if (response.data.status === 'ok') {
        cart.value = cart.value.filter((item) => item.id !== cartId)
        SwalSuccess('کارت با موفقیت حذف شد')
        SendFirstRequest()
      } else {
        SwalError('خطا!', response.data.message || 'حذف کارت انجام نشد')
      }
    } catch (error) {
      console.error('خطا در حذف:', error)
      SwalError('خطا!', 'خطای ارتباط با سرور')
    } finally {
      loading.value = false
    }
  })
}

const addCart = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'افزودن کارت بانکی',
    html:
      `<input id="swal-name" class="swal2-input w-80 shadow-lite rounded-4 mt-2 p-3 no-border" placeholder="نام صاحب حساب">` +
      `<input id="swal-bank_name" class="swal2-input w-80 shadow-lite rounded-4 mt-2 p-3 no-border" placeholder="نام بانک">` +
      `<input id="swal-kart_number" class="swal2-input w-80 shadow-lite rounded-4 mt-2 p-3 no-border" placeholder="شماره کارت">` +
      `<input id="swal-shaba_number" class="swal2-input w-80 shadow-lite rounded-4 mt-2 p-3 no-border" placeholder="شماره شبا">`,
    focusConfirm: false,
    confirmButtonText: 'ثبت اطلاعات',
    cancelButtonText: 'لغو',
    showCancelButton: true,
    confirmButtonColor: '#2AE78B',
    cancelButtonColor: '#E93030',
    preConfirm: () => {
      const name = document.getElementById('swal-name').value
      const bank_name = document.getElementById('swal-bank_name').value
      const kart_number = document.getElementById('swal-kart_number').value
      const shaba_number = document.getElementById('swal-shaba_number').value

      if (!name || !bank_name || !kart_number || !shaba_number) {
        Swal.showValidationMessage('لطفاً همه فیلدها را پر کنید')
        return false
      }

      return { name, bank_name, kart_number, shaba_number }
    },
  })

  if (formValues) {
    console.log('اطلاعات وارد شده:', formValues)

    const sendData = {
      user_id: user_id,
      apikey: apikey,
      action: 'add',
      user_type: 'user',
      name: formValues.name,
      bank_name: formValues.bank_name,
      shaba_number: formValues.shaba_number,
      kart_number: formValues.kart_number,
    }

    loading.value = true

    try {
      const response = await axios.post(url + 'pay_kart', sendData)

      if (response.data.status === 'ok') {
        loading.value = false

        await SwalSuccess('افزودن کارت', 'کارت با موفقیت ثبت شد')
        SendFirstRequest()
      } else {
        SwalError('خطا!', 'مشکلی پیش آمد مجدد امنحان کنید')
      }
    } catch (error) {
      console.error('خطا در افزودن آدرس:', error)
      SwalError('خطا!', 'خطای ارتباط با سرور')
    }
  }
}

const submitTicket = async () => {
  if (!selectedCardId.value) {
    SwalError('خطا!', 'لطفاً یک کارت انتخاب کنید')
    return
  }
  console.log('کارت انتخاب شده:', selectedCardId.value)

  const sendData = {
    user_id: user_id,
    apikey: apikey,
    action: 'pay_request',
    user_type: 'user',
    pay_kart_id: selectedCardId.value,
  }

  loading.value = true

  try {
    const response = await axios.post(url + 'wallet', sendData)

    if (response.data.status === 'ok') {
      loading.value = false

      await SwalSuccess('درخواست موفق', 'درخواست تسویه شما با موفقیت ثبت شد')
      router.back()
    } else {
      SwalError('خطا!', 'مشکلی پیش آمد مجدد امنحان کنید')
    }
  } catch (error) {
    console.error('خطا:', error)
    SwalError('خطا!', 'خطای ارتباط با سرور')
  }
}
</script>

<style scoped>
.RTL {
  direction: rtl;
}

p {
  color: black;
}

#main {
  position: relative;
}

.card-select {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.selected-card {
  background-color: #d0f2f3; /* رنگ دلخواه برای انتخاب‌شده */
}
input{
  border: none!important;
}

</style>
