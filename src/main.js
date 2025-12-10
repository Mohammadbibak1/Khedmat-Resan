import 'sweetalert2'
import '@/assets/css/style.css'
import '@/assets/css/Bootstrap.css'
import '@/assets/js/MyJs.js'
import 'vue3-carousel/dist/carousel.css'
import 'leaflet/dist/leaflet.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/assets/css/style.css'
// app config
localStorage.setItem('ProjectUrl', 'https://back.khedmatrasan.ir/')
localStorage.setItem('ApiKey', 'khr-app-2024-08a9b7c6d5e4f3g2h1i0j-zkxynp')
export const appVersion = '1.0.0'

// app config

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
