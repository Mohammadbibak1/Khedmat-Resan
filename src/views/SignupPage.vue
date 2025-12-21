<template>
  <div class="bg-main d-flex flex-column align-items-center justify-content-center" id="main">
    <header class="div-top-arrow">
      <p class="font-3 font-bold text-white" style="margin: 0 5px">ثبت نام</p>
    </header>

    <main class="w-100 d-flex flex-column row-gap-5 p-3" style="margin-top: 10rem">

      <div class="w-100">
        <label for="" class="w-100 font-4 font-bold mb-3"> نام و نام خانوادگی </label>
        <input type="text" name="" id="" class="w-100 shadow"/>
      </div>

      <div class="w-100">
        <label for="" class="w-100 font-4 font-bold mb-3"> شماره همراه </label>
        <input type="tel" name="" id="" class="w-100 shadow" placeholder="09130000000"/>
      </div>

      <div class="w-100">
        <label for="" class="w-100 font-4 font-bold mb-3"> کد ملی </label>
        <input type="number" name="" id="" class="w-100 shadow"/>
      </div>

      <div class="w-100 d-flex justify-content-between">

        <div class="w-48">
          <label for="" class="w-100 font-4 font-bold"> استان </label>
          <select class="w-100 shadow">
            <option selected disabled>انتخاب</option>
            <option>خوزستان</option>
            <option>اصفهان</option>
          </select>
        </div>
        <div class="w-48">
          <label for="" class="w-100 font-4 font-bold"> شهر </label>
          <select class="w-100 shadow">
            <option selected disabled>انتخاب</option>
            <option>اینجا</option>
            <option>اونجا</option>
          </select>
        </div>

      </div>

      <div class="w-100">
        <label for="" class="w-100 font-4 font-bold mb-3"> آدرس محل سکونت </label>
        <textarea class="w-100 shadow" rows="7"></textarea>
      </div>

      <div class="w-100">
          <label for="" class="w-100 font-4 font-bold"> دسته بندی خدمت </label>
          <select class="w-100 shadow">
            <option selected disabled>انتخاب</option>
            <option>این </option>
            <option>اون</option>
          </select>
      </div>

      <div class="w-100 d-flex flex-column row-gap-3">

        <div class="d-flex justify-content-between align-items-center">
          <label class="font-5 font-bold">عکس پروفایل</label>
          <input type="file" name="" id="">
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <label class="font-5 font-bold">گواهی عدم سو پیشینه</label>
          <input type="file" name="" id="">
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <label class="font-5 font-bold">گواهی فنی حرفه ای یا شغلی</label>
          <input type="file" name="" id="">
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <label class="font-5 font-bold">عکس روی کارت ملی</label>
          <input type="file" name="" id="">
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <label class="font-5 font-bold">عکس کارت ملی روبه روی صورت</label>
          <input type="file" name="" id="">
        </div>

      </div>


      <button class="">ثبت نام</button>
    </main>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLocationStore } from '@/stores/location'
import { useRoute } from 'vue-router'
import axios from 'axios'
import router from '@/router/index.js'
import { SwalError, SwalSuccess } from '@/assets/js/MyJs.js'

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const location = useLocationStore()
var phone = useRoute().params.phone

const name = ref('')
const state_id = ref('')
const city_id = ref('')

const states = ref([])
const cities = ref([])

onMounted(() => {
  // داده‌های ذخیره‌شده از localStorage (در اسپلش) رو می‌گیریم
  location.loadFromStorage()

  states.value = location.states

  state_id.value = states.value[0].id
  loadCities()
})

// وقتی کاربر استان رو تغییر داد
const loadCities = () => {
  cities.value = []
  city_id.value = ''

  const selected = states.value.find((state) => state.id == state_id.value)
  if (selected) {
    cities.value = selected.city
    city_id.value = selected.city[0]?.id || ''
  }
}

function register() {
  var signup_data = {
    apikey: apikey,
    url: url,
    name: name.value,
    phone: phone,
    state_id: state_id.value,
    city_id: city_id.value,
  }
  console.log(signup_data)

  axios
    .post(url + 'signup', signup_data)
    .then((response) => {
      var res = response.data
      console.log(res)

      if (res.status == 'ok') {
        SwalSuccess('تبریک', 'ثبت نام شما با موفقیت انجام شد')
        localStorage.setItem('user_id', res.user_id)
        router.push({ name: 'HomePage' })
      } else {
        if (res.event == 'user exist') {
          SwalError('خطا!', 'شما با این شماره قبلا ثبت نام کرده اید', 'error', false)
        } else {
          SwalError('خطا!', 'متاسفانه ثبت نام شما با مشکل مواجه شد', 'error', false)
        }
      }
    })
    .catch(() => {
      SwalError('خطا!', 'مشکلی پیش امد مجدد تلاش کنید', 'error', false)

      console.log('error')
    })
}
</script>

<style scoped>
.img-login {
  width: 20rem;
}

label {
  direction: rtl;
}
</style>
