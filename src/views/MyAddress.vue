<template>
  <LoadingJson :show="loading" />

  <div id="main" class="d-flex align-items-center flex-column RTL">
    <div class="div-top-arrow justify-content-between">

      <router-link
        :to="{ name: 'UserArea' }"
        class="d-flex align-items-center text-decoration-none">
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
        <p class="font-4 font-bold text-white" style="margin: 0 15px 0 0">آدرس های من</p>
      </router-link>
      <div class="d-flex">
        <router-link to="/add_address" tabindex="0">
        <p class="bg-white font-5 font-bold rounded-pill shadow-lg " style="padding: 0.6rem 1.5rem">
          افزودن آدرس
          <img src="../assets/img/add.svg" alt="" class="icon-5" />
        </p>
        </router-link>
      </div>

    </div>

    <div
      v-if="!loading && address.length > 0"
      class="w-100 d-flex flex-column align-items-center row-gap-4"
      style="margin-top: 8rem"
    >
      <div
        v-for="item in address"
        :key="item.id"
        class="w-90 bg-white p-4 d-flex justify-content-between align-items-center rounded-4 shadow"
      >
        <div class="d-flex">
          <img src="../assets/img/address.svg" alt="" class="icon-5" />
          <p class="font-3 font-bold mr-3">{{ item.address }}</p>
        </div>

        <div @click.stop="deleteAddress(item.id)" role="button" tabindex="0">
          <img
            src="../assets/img/Trashbin.svg"
            alt="حذف آدرس"
            class="icon-2 bg-white shadow p-2 rounded-pill cursor-pointer"
          />
        </div>

      </div>
    </div>


    <div
      v-else-if="!loading && address.length === 0"
      class="w-100 d-flex flex-column align-items-center justify-content-center"
      style="min-height: 90vh"
    >
      <img src="../assets/img/empty-folder (1).png" style="opacity:50%;" />
      <p class="font-bold text-color-gray mt-3">آدرسی ثبت نشده است</p>
    </div>


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
import { SwalConfirm, SwalError, SwalSuccess } from '@/assets/js/MyJs.js'
import { onMounted, ref } from 'vue'
import LoadingJson from '@/components/LoadingJson.vue'

const loading = ref(false)

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')

const address = ref([])

async function SendFirstRequest() {
  const sendData = {
    user_id: user_id,
    apikey: apikey,
    action: 'show',
  }

  loading.value = true

  try {
    const res = await axios.post(url + 'user_address', sendData)
    address.value = res.data // این خط اضافه شده است

    console.log('res.data:', res.data)
    console.log('typeof res.data:', typeof res.data)
    console.log('Array.isArray(res.data):', Array.isArray(res.data))
    console.log('length:', res.data.length)
    console.log(address.value)
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


const deleteAddress = async (addressId) => {
  SwalConfirm('آیا مطمئن هستید؟', 'این آدرس حذف خواهد شد', 'بله، حذف کن', 'انصراف', async () => {
    try {
      const response = await axios.post(url + 'user_address', {
        user_id: user_id,
        apikey: apikey,
        address_id: addressId,
        action: 'delete'
      })

      if (response.data.status === 'ok') {
        address.value = address.value.filter((item) => item.id !== addressId)
        SwalSuccess('آدرس با موفقیت حذف شد')
        SendFirstRequest()
      } else {
        // اگر سرور status غیر از ok برگرداند
        SwalError('خطا!', response.data.message || 'حذف آدرس انجام نشد')
      }
    } catch (error) {
      console.error('خطا در حذف آدرس:', error)
      SwalError('خطا!', 'خطای ارتباط با سرور')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.RTL {
  direction: rtl;
}

p{
  color: black;
}
#main {
  position: relative;
}
</style>
