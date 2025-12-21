<template>
  <LoadingJson :show="loading" />

  <div id="main" class="RTL">

    <header class="div-top-arrow">
      <router-link
        :to="{ name: 'UserArea'}"
        class="d-flex align-items-center text-decoration-none"
      >
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
        <p class="font-3 font-bold text-white" style="margin: 0 15px 0 0">کاربری</p>
      </router-link>
    </header>


    <div class="w-100 d-flex flex-column align-items-center row-gap-4 p-3" style="margin-top: 6.5rem">

      <div class="w-100 d-flex flex-column align-items-start mt-3">
        <label for="name" class="font-3 text-black font-bold">نام و نام خانوادگی</label>
        <input v-model="name" type="text" class="w-100 border-0 p-4 shadow-lite rounded-4 font-5 font-bold mt-3" id="name">
      </div>

      <div class="w-100 d-flex flex-column align-items-start mt-3">
        <label for="tell" class="font-3 text-black font-bold">شماره همراه</label>
        <input v-model="phone"  class="w-100 border-0 p-4 shadow-lite rounded-4 font-5 font-bold mt-3" disabled>
      </div>

      <div class="w-100 d-flex justify-content-between align-items-center mt-3">

        <select v-model="state_id" @change="getCities(state_id)" class="w-48 border-0 p-4 shadow-lite rounded-4 font-5 font-bold" id="state">
          <option value="" disabled>انتخاب استان</option>
          <option v-for="state in states" :key="state.id" :value="state.id">{{ state.name }}</option>
        </select>

        <select v-model="city_id" class="w-48 border-0 p-4 shadow-lite rounded-4 font-5 font-bold" id="city">
          <option value="" disabled>انتخاب شهر</option>
          <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
        </select>

      </div>

      <div class="w-100 d-flex flex-column align-items-start mt-3">
        <label for="tell" class="font-3 text-black font-bold">آدرس محل سکونت</label>
        <textarea class="w-100 rounded-3 shadow-lite p-3" rows="10"></textarea>
      </div>


      <button @click="updateProfile" class="w-50 button-Default shadow-lite mt-6"> ثبت ویرایش</button>

    </div>


  </div>

</template>

<script setup>


import axios from 'axios'
import { SwalError, SwalSuccess } from '@/assets/js/MyJs.js'
import { onMounted, ref } from 'vue'
import LoadingJson from '@/components/LoadingJson.vue'
import { useLocationStore } from '@/stores/location'

const location = useLocationStore()
const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')
const loading = ref(false)

const name =ref('')
const phone = ref('')
const state_id =ref('')
const city_id =ref('')

const states = ref([])
const cities = ref([])

function loadCities() {
  cities.value = []
  city_id.value = ''

  const selected = states.value.find((state) => state.id == state_id.value)
  if (selected) {
    cities.value = selected.city
    city_id.value = selected.city[0]?.id || ''
  }
}
async function SendFirstRequest() {
  const send_date = {
    user_id: user_id,
    apikey: apikey,
    action: 'user_info',
  }

  loading.value = true

  try {
    const response = await axios.post(url + 'public_info', send_date)
    const res = response.data
    console.log(res)

    name.value = res.name
    phone.value = res.phone
    state_id.value = res.state_id

    // مهم: اول استان رو ست کن، بعد cities رو لود کن
    await loadCities()

    // حالا که cities پر شدن، city_id رو مقدار بده
    city_id.value = res.city_id

  } catch (error) {
    console.error('خطا در دریافت اطلاعات:', error)
    SwalError('خطا!', 'خطای ارتباط با سرور', 'error', true, SendFirstRequest)
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  SendFirstRequest()
  location.loadFromStorage()
  states.value = location.states
})

async function updateProfile() {
  var send_data = {
    apikey: apikey,
    url: url,
    user_id: user_id,
    name: name.value,
    state_id: state_id.value,
    city_id: city_id.value,
  }
  console.log(send_data)

  try {
    loading.value = true

    const response = await axios.post(url + 'edit_profile', send_data)

    if (response.data.status === 'ok') {
      loading.value = false

      await SwalSuccess('تبریک', `ویرایش پروفایل با موفقیت انجام شد`);
     SendFirstRequest()

    } else {
      SwalError('خطا!', response.data.message || 'مشکلی پیش آمد مجدد امنحان کنید')
    }
  } catch (error) {
    console.error('خطا:', error)
    SwalError('خطا!', 'خطای ارتباط با سرور')
  } finally {
    loading.value = false
  }
}

</script>


<style scoped>

</style>
