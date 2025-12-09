<template>
  <div id="main" class="d-flex align-items-center flex-column RTL">
    <header class="div-top-arrow bg-color max_width d-flex justify-content-end rounded-bottom-5">
      <div class="d-flex justify-content-center">
        <h1 class="font-4 font-bold text-white mr-3">انتخاب نوع خدمت</h1>

        <router-link
          :to="{ name: 'HomePage'}">
          <img class="svg-back" src="../assets/img/arrow-right.svg" alt="back" />
        </router-link>

      </div>
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
          <h2 class="font-bold text-color-blue">{{ service.name }}</h2>
          <p class="font-4 text-end mt-3">
            {{
              stripHtml(service.description).length > 70
                ? stripHtml(service.description).slice(0, 70) + '...'
                : stripHtml(service.description)
            }}
          </p>
          <div class="d-flex justify-content-between mt-3">
            <div>
              <img src="../assets/img/Detials.svg" alt="details" class="icon-size-2 ml-1" />
              <a
                @click="ShowDescription(service.description)"
                class="text-color-blue font-5 font-bold text-decoration-none"
              >
                توضیحات بیشتر
              </a>
            </div>

            <div>
              <img src="../assets/img/Dollar.svg" alt="details" class="icon-size-2 ml-1" />
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
  </div>
</template>

<script setup>
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
