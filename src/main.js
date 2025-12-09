import "sweetalert2"
import '@/assets/css/style.css'
import '@/assets/css/Bootstrap.css'
import '@/assets/js/MyJs.js'
import 'vue3-carousel/dist/carousel.css'
import 'leaflet/dist/leaflet.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import "@/assets/css/style.css"
// app config
localStorage.setItem('ProjectUrl', 'https://back.samankhedmat.ir/')
localStorage.setItem('ApiKey', 'MY_api_key_is:HELLO_saman_Khedmat_Shahreza')
export const appVersion = '1.0.5';

// app config

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
