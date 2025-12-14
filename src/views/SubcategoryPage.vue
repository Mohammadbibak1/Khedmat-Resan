<template>


  <div id="main" class="d-flex align-items-center flex-column RTL">
    <header class="div-top-arrow">
        <router-link :to="{ name: 'HomePage' }">
          <img class="svg-back" src="../assets/img/arrow-right.svg" alt="back" />
        </router-link>
        <h1 class="font-4 font-bold text-white" style="margin: 0 15px 0 0">انتخاب نوع خدمت</h1>
    </header>

    <div style="margin-top: 8rem"></div>

    <div
      v-for="(service, index) in childServices"
      :key="index"
      class="w-100 d-flex flex-column align-items-center row-gap-4"
    >
      <div
        class="w-95 d-flex bg-white align-items-center justify-content-between p-3 shadow-lite rounded-4 mt-3"
      >
        <div>
          <img
            :src="service.pic"
            alt="category-pic"
            class="rounded-shaped img-subcat shadow-lite"
          />
        </div>
        <div class="w-65 p-1">
          <h2 class="font-bold font-3">{{ service.name }}</h2>
          <p class="font-4 text-end mt-3 font-normal">
            {{
              stripHtml(service.description).length > 70
                ? stripHtml(service.description).slice(0, 70) + '...'
                : stripHtml(service.description)
            }}
          </p>
          <div class="d-flex justify-content-between mt-3">
            <div>
              <img src="../assets/img/Detials.svg" alt="details" class="icon-3 ml-1" />
              <a
                @click="ShowDescription(service.description)"
                class="text-color-blue font-5 font-bold text-decoration-none"
              >
                توضیحات بیشتر
              </a>
            </div>

            <div>
              <img src="../assets/img/Dollar.svg" alt="details" class="icon-3 ml-1" />
              <a
                @click="ShowGuide(service.price_guide)"
                class="text-color-blue font-5 font-bold text-decoration-none"
                >راهنمای قیمت
              </a>
            </div>
          </div>
          <div class="w-100 d-flex justify-content-end mt-3">
            <button
              class="w-70 button-Default bg-color p-3 rounded-5"
              @click="goToPrivateQuestion(service.id)"
            >
              درخواست خدمات
              <img
                src="../assets/img/arrow-left.svg"
                alt="arrow-left"
                class="mr-3"
                style="width: 1.5rem; height: 1.5rem"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <BottomNavigation v-model="activeIndex" :items="navItems" />
    </div>
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
import { useServiceStore } from '@/stores/useServiceStore.js'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import router from '@/router/index.js'

const route = useRoute()
const parentId = Number(route.params.id)

const serviceStore = useServiceStore()

const childServices = computed(() => {
  const parent = serviceStore.services.find((item) => item.id === parentId)
  return parent?.child || []
})

function stripHtml(html) {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || tempDiv.innerText || ''
}

function ShowDescription(description) {
  Swal.fire({
    title: 'توضیحات خدمت',
    html: description,
    icon: 'info',
    confirmButtonText: 'بستن',
    confirmButtonColor: '#0BA6AB',
  })
}

function ShowGuide(price_guide) {
  Swal.fire({
    title: 'راهنمای قیمت',
    html: price_guide,
    icon: 'info',
    confirmButtonText: 'بستن',
    confirmButtonColor: '#0BA6AB',
  })
}

const goToPrivateQuestion = (id) => {
  router.push({ name: 'PrivateQuestion', params: { id, parentId } })
}
</script>

<style scoped>
.RTL {
  direction: rtl;
}

.img-subcat {
  width: 10rem;
  height: 14rem;
}
</style>
