<template>
  <div class="bg-main d-flex flex-column align-items-center justify-content-center" id="main">
    <div class="w-100 d-flex flex-column justify-content-center align-items-center">

      <div class="w-80 bg-color p-4 rounded-5 shadow-custom d-flex flex-column align-items-center">
        <label class="text-white font-2 font-bold text-center">ثبت نام</label>

        <div class="w-100 d-flex flex-column mt-3">
          <label class="font-4 font-bold text-white" for="name">نام ونام خانوادگی</label>
          <input v-model="name" id="name" type="text" class="p-3 shadow mt-3" />
        </div>

        <div class="w-100 mt-3 d-flex justify-content-between">
          <div class="w-48 d-flex flex-column">
            <label class="font-4 font-bold text-white">شهر</label>
            <select v-model="city_id" name="city" id="city" class="p-3 shadow mt-3">
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.name }}
              </option>
            </select>
          </div>

          <div class="w-48 d-flex flex-column">
            <label class="font-4 font-bold text-white">استان</label>
            <select
              v-model="state_id"
              name="state"
              id="state"
              class="p-3 shadow mt-3"
              @change="loadCities"
            >
              <option v-for="state in states" :key="state.id" :value="state.id">
                {{ state.name }}
              </option>
            </select>
          </div>
        </div>

        <button class="button-Default w-50 shadow font-3 mt-6" @click="register">ثبت نام</button>
      </div>
    </div>

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
        }else{
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
