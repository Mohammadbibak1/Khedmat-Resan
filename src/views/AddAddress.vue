<template>
  <LoadingJson :show="loading" />

  <div id="main" class="d-flex align-items-center flex-column RTL">
    <header
      class="div-top-arrow"
      @click="goBack"
    >
      <img class="svg-back" src="../assets/img/arrow-right.svg" alt="افزودن آدرس" />
      <p class="font-3 font-bold text-white mr-3">افزودن آدرس</p>
    </header>

    <div class="w-100 d-flex flex-column align-items-center row-gap-4 p-4" style="margin-top: 8rem">
      <div class="w-100 d-flex justify-content-between align-items-center">
        <div class="w-48 d-flex flex-column">
          <label for="state" class="font-bold font-3 text-black"> استان</label>
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

        <div class="w-48 d-flex flex-column">
          <label for="state" class="font-bold font-3 text-black"> شهر</label>
          <select v-model="city_id" name="city" id="city" class="p-3 shadow mt-3">
            <option v-for="city in cities" :key="city.id" :value="city.id">
              {{ city.name }}
            </option>
          </select>
        </div>
      </div>

      <h2 class="w-100 text-end mt-1 font-3 font-bold">آدرس پستی</h2>
      <textarea
        v-model="address"
        name="توضیحات"
        rows="5"
        cols="10"
        placeholder="خیابان اصلی، خیابان فرعی شماره کوچه و پلاک قید شود"
        class="w-100 shadow-lite rounded-5 p-5"
      ></textarea>

      <h2 class="w-100 text-end mt-1 font-3 font-bold">نقشه</h2>

      <div class="map-holder shadow-lite">
        <l-map ref="map" v-model:zoom="zoom" :center="center" @click="onMapClick">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>

          <l-marker v-if="markerPosition" :lat-lng="markerPosition"></l-marker>

          <!-- دکمه رفتن به لوکیشن کاربر -->
          <button class="btn-gps" @click="getUserPosition">
            <span style="font-size: 2.5rem"> 🎯 </span>
          </button>
        </l-map>
      </div>

      <button
        @click="addAddress"
        :disabled="loading"
        class="button-Default w-45 font-4 shadow-lite mt-2"
      >
        <span v-if="!loading">ثبت آدرس</span>
        <span v-else>در حال ثبت...</span>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLocationStore } from '@/stores/location'

import axios from 'axios'
import router from '@/router/index.js'
import { SwalConfirm, SwalError, SwalSuccess } from '@/assets/js/MyJs.js'
import { Geolocation } from '@capacitor/geolocation'
import { NativeSettings, AndroidSettings } from 'capacitor-native-settings'
import { Capacitor } from '@capacitor/core'

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')

import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

const zoom = ref(16) // یا هر زومی که می‌خوای
const center = ref([32.009028, 51.859715])
import L from 'leaflet'
import LoadingJson from '@/components/LoadingJson.vue'

// تنظیم مسیر آیکون‌ها به صورت دستی
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

const markerPosition = ref([32.009028, 51.859715]) // مقدار پیش‌فرض معتبر

const onMapClick = (e) => {
  markerPosition.value = [e.latlng.lat, e.latlng.lng]
}

async function getUserPosition() {
  try {
    if (Capacitor.getPlatform() === 'android') {
      const permissions = await Geolocation.checkPermissions()
      if (permissions.location === 'granted') {
        await goToUserLocation()
      } else {
        await Geolocation.requestPermissions()
      }
    } else {
      await goToUserLocation()
    }
  } catch {
    SwalConfirm('', 'موقعیت یاب دستگاه روشن شود؟', 'بله', 'خیر', () => {
      NativeSettings.openAndroid({ option: AndroidSettings.Location })
    })
  }
}

const goToUserLocation = async () => {
  try {
    const position = await Geolocation.getCurrentPosition()
    const { latitude, longitude } = position.coords
    markerPosition.value = [latitude, longitude]
    center.value = [latitude, longitude]
  } catch (error) {
    console.error('خطا در گرفتن موقعیت مکانی:', error)
    SwalError('خطا!', 'دسترسی به موقعیت مکانی داده نشد یا با خطا مواجه شد')
  }
}
const location = useLocationStore()

const state_id = ref('')
const city_id = ref('')

const states = ref([])
const cities = ref([])
const address = ref('')
const loading = ref(false)
const [lat, lng] = markerPosition.value

onMounted(() => {
  // داده‌های ذخیره‌شده از localStorage (در اسپلش) رو می‌گیریم
  location.loadFromStorage()

  states.value = location.states

  state_id.value = states.value[0].id
  loadCities()
})

const loadCities = () => {
  cities.value = []
  city_id.value = ''

  const selected = states.value.find((state) => state.id == state_id.value)
  if (selected) {
    cities.value = selected.city
    city_id.value = selected.city[0]?.id || ''
  }
}

const addAddress = async () => {
  console.log(markerPosition.value)

  if (!state_id.value || !city_id.value || !address.value || !lat || !lng) {
    SwalError('خطا!', 'لطفاً تمام فیلدها را پر کنید')
    return
  }
  loading.value = true

  const data = {
    user_id: user_id,
    apikey: apikey,
    action: 'add',
    state_id: state_id.value,
    city_id: city_id.value,
    address: address.value,
    lat: markerPosition.value[0],
    lng: markerPosition.value[1],
  }

  console.log(data)
  try {
    const response = await axios.post(url + 'user_address', data)

    if (response.data.status === 'ok') {
      loading.value = false

      await SwalSuccess('افزودن آدرس', 'آدرس با موفقیت ایجاد شد') // اینجا صبر می‌کنه تا تایمر تموم شه
      router.back()
    } else {
      SwalError('خطا!', 'مشکلی پیش آمد مجدد امنحان کنید')
    }
  } catch (error) {
    console.error('خطا در افزودن آدرس:', error)
    SwalError('خطا!', 'خطای ارتباط با سرور')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  window.history.back()
}
</script>

<style scoped>
.RTL {
  direction: rtl;
}

.map-holder {
  width: 100%;
  height: 25rem;
  border-radius: 20px;
  overflow: hidden;
}

.btn-gps {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
  font-size: 1.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
