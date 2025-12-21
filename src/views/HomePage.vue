<template>
  <LoadingJson :show="loading" />
  <div v-if="dialog" class="bg_dialog"></div>

  <div
    class="d-flex flex-column justify-content-start p-3 row-gap-3"
    id="main"
    style="margin-top: 18rem; height: 100dvh"
  >
    <header class="d-flex flex-column align-items-center justify-content-center">

      <div class="w-100 d-flex justify-content-between align-items-center ">

        <div class="">
          <img src="../assets/img/yaro.svg" alt="" class="profile-avatar">
          <span class="font-3 text-white font-bold">محمد بی باک</span>
        </div>

        <span class="text-white font-3 font-bold">
          <span class="text-color-green">1.000.000</span>
          تومان
        </span>

      </div>

      <div class="w-100 bg-white d-flex justify-content-between align-items-center p-3 rounded-3 shadow" style="margin-bottom: -1.5rem">
        <span class="font-4 font-bold">گزارش این ماه</span>
        <span class="font-4 font-bold text-center border-dotted-custom w-50">
          تعداد سفارش
          <br>
          <span class="text-color-green">10</span>
        </span>
        <span class="font-4 font-bold text-center">
          مبلغ
          <br>
          <span class="text-color-green">10.000.000</span>
        </span>
      </div>

    </header>

    <section class="w-100 slider-row">
      <Carousel v-bind="carouselConfig" class="carousel w-100 h-100">
        <Slide v-for="(slide, index) in slider" :key="index" class="w-100">
          <img class="slider-img" :src="slide" />
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </section>

    <!--    /********************** service boxes ***********************/-->

    <div class="w-100 d-flex flex-column align-items-center row-gap-3 ">

      <div class="w-100 bg-white rounded-2 shadow d-flex justify-content-between align-items-center p-3">
        <div>
          <img src="../assets/img/clipboard%20(5).svg" alt="" class="icon-1">
          <span class="font-bold font-4 mr-3">سفارشات جدید</span>
        </div>
        <img src="../assets/img/back.svg" alt="" class="icon-5">
      </div>
      <div class="w-100 bg-white rounded-2 shadow d-flex justify-content-between align-items-center p-3">
        <div>
          <img src="../assets/img/project-management%20(1)%20(1).svg" alt="" class="icon-1 ">
          <span class="font-bold font-4 mr-3">سفارشات تایید شده (توسط شما)</span>
        </div>
        <img src="../assets/img/back.svg" alt="" class="icon-5">
      </div>
      <div class="w-100 bg-white rounded-2 shadow d-flex justify-content-between align-items-center p-3">
        <div>
          <img src="../assets/img/Group%202761.svg" alt="" class="icon-1">
          <span class="font-bold font-4 mr-3">سفارشات پایان یافته</span>
        </div>
        <img src="../assets/img/back.svg" alt="" class="icon-5">
      </div>
      <div class="w-100 bg-white rounded-2 shadow d-flex justify-content-between align-items-center p-3">
        <div>
          <img src="../assets/img/transaction.svg" alt="" class="icon-1">
          <span class="font-bold font-4 mr-3">تراکنش ها</span>
        </div>
        <img src="../assets/img/back.svg" alt="" class="icon-5">
      </div>

    </div>

    <!-- دکمه پشتیبانی -->
    <div class="support-fixed">
      <a :href="`tel:${support}`" class="w-65 button-Support text-center">پشتیبانی</a>
      <button class="button-Support shadow pulse-circle icon-size-2">
        <img src="../../src/assets/img/phone.svg" alt="" class="icon-2" />
      </button>
    </div>

    <!--    /********************** service boxes ***********************/-->

    <div>
      <BottomNavigation v-model="activeIndex" :items="navItems" />
    </div>
  </div>

  <div v-if="dialog" class="dialog">
    <div
      class="w-100 bg-white bg-gradient d-flex flex-column justify-content-center align-items-center shadow-lite rounded-5 row-gap-4"
    >
      <p class="w-100 bg-color p-4 font-4 font-bold text-white rounded-top-5 text-center shadow">
        نظر سنجی
      </p>
      <img
        src="../assets/img/Rate-Star.svg"
        class="mt-4"
        alt="rate"
        style="width: 9rem; height: 9rem"
      />
      <h3 class="font-3 font-bold">مشتری عزیز</h3>
      <p class="font-4 font-bold text-center mt-4 RTL">
        لطفا نظر خود را در ارتباط با کیفیت خدمات
        <span>{{ worker_name }}</span>
        با ما در میان بگذارید
      </p>

      <div class="star-rating-container">
        <div class="stars-wrapper">
          <span
            v-for="star in 5"
            :key="star"
            @click="setRating(star)"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
            :class="{
              active: star <= (hoverRating || rating),
              animated: star === hoverRating,
            }"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" class="star-icon">
              <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                :fill="star <= (hoverRating || rating) ? '#FFD700' : '#e0e0e0'"
              />
            </svg>
          </span>
        </div>
        <div class="rating-text" v-if="rating > 0">امتیاز شما: {{ rating }} از 5</div>
      </div>

      <textarea
        class="w-90 p-3 rounded-4 my-3 shadow-lite"
        name="rate"
        rows="5"
        cols="5"
        placeholder="توضیحات"
        v-model="description"
      ></textarea>

      <button @click="addRate" class="button-Default w-45 font-3 my-3 shadow">ثبت</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'

import LoadingJson from '@/components/LoadingJson.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

import axios from 'axios'
import { SwalError, SwalSuccess } from '@/assets/js/MyJs.js'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useRouter } from 'vue-router'
import { useServiceStore } from '@/stores/useServiceStore.js'

// متغیرهای موجود شما
const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')
const router = useRouter()
const loading = ref(false)
const slider = ref([])
const category = ref([])
const offers = ref([])
const delivery_order = ref([])
const support = ref([])
const dialog = ref(false)
const worker_name = ref('')
const searchQuery = ref('')

const rating = ref(0)
const hoverRating = ref(0)
const description = ref(null)

const activeIndex = ref(0)

import customerIcon from '@/assets/img/customer-service-_1_.svg'
import homeIcon from '@/assets/img/home-_4_.svg'
import profileIcon from '@/assets/img/user (2).svg'

const navItems = [
  { label: 'پشتیبانی', icon: customerIcon, route: '/support_page' },
  { label: 'خانه', icon: homeIcon, route: '/home_page' },
  { label: 'کاربری', icon: profileIcon, route: '/user_area' },
]

async function SendFirstRequest() {
  const sendData = {
    user_id: user_id,
    apikey: apikey,
    action: 'tell',
  }

  loading.value = true

  try {
    const [homeRes, publicRes] = await Promise.all([
      axios.post(url + 'home', sendData),
      axios.post(url + 'public_info', sendData),
    ])

    const res = homeRes.data
    slider.value = res.slider
    category.value = res.category
    offers.value = res.offers
    delivery_order.value = res.delivery_order

    support.value = publicRes.data

    const servicecategory = useServiceStore()
    servicecategory.setServices(category.value)

    if (delivery_order.value !== null) {
      dialog.value = true
      worker_name.value = delivery_order.value.worker_name
    }
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

// تابع جدید برای نمایش نتایج جستجو به صورت لیست قابل کلیک
const showSearchResults = async () => {
  if (!searchQuery.value.trim()) {
    await Swal.fire({
      title: 'لطفاً عبارت جستجو را وارد کنید',
      icon: 'warning',
      confirmButtonText: 'متوجه شدم',
    })
    return
  }

  const results = getSearchResults()

  if (results.length === 0) {
    await Swal.fire({
      title: 'نتیجه‌ای یافت نشد',
      text: `هیچ خدمتی با عبارت "${searchQuery.value}" یافت نشد`,
      icon: 'info',
      confirmButtonText: 'متوجه شدم',
    })
    return
  }

  // ساخت HTML لیست نتایج
  const resultsHtml = `
    <div class="text-right" style="max-height: 400px; overflow-y: auto;">
      <ul class="list-group" style="list-style-type: none; padding-right: 0;">
        ${results
          .map(
            (item, i) => `
          <li class="list-group-item mb-2 search-result-item" data-index="${i}" style="cursor: pointer; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
            ${item.name}
            ${item.parent ? `<small class="text-muted">(${item.parent})</small>` : ''}
          </li>
        `,
          )
          .join('')}
      </ul>
    </div>
  `

  await Swal.fire({
    title: `" نتایج جستجو برای" ${searchQuery.value}`,
    html: resultsHtml,
    width: 600,
    showConfirmButton: false,
    didOpen: () => {
      document.querySelectorAll('.search-result-item').forEach((el) => {
        el.addEventListener('click', () => {
          const index = el.getAttribute('data-index')
          handleResultSelect(results[index])
        })
      })
    },
  })
}

// تابع برای فیلتر کردن نتایج// کوئری های جستجو
const getSearchResults = () => {
  const query = searchQuery.value.toLowerCase()
  const results = []

  category.value.forEach((cat) => {
    // بررسی دسته‌بندی اصلی
    if (cat.name.toLowerCase().includes(query)) {
      results.push({
        id: cat.id,
        name: cat.name,
        type: 'category',
        data: cat,
      })
    }

    // بررسی زیردسته‌ها
    if (cat.child && cat.child.length > 0) {
      cat.child.forEach((child) => {
        if (child.name.toLowerCase().includes(query)) {
          results.push({
            id: child.id,
            parent_id: child.parent_id,
            name: child.name,
            parent: cat.name,
            type: 'child',
            data: child,
          })
        }
      })
    }
  })

  return results
}

// تابع برای مدیریت انتخاب نتیجه
const handleResultSelect = (item) => {
  Swal.close()
  searchQuery.value = ''

  if (item.type === 'child') {
    // رفتن به صفحه سوالات زیرسرویس
    router.push({
      name: 'PrivateQuestion',
      params: {
        id: item.id,
        parentId: item.parent_id,
      },
    })
  } else if (item.type === 'category') {
    // رفتن به صفحه زیرسرویس‌ها
    router.push({ name: 'SubcategoryPage', params: { id: item.id } })
  }
}

const carouselConfig = {
  itemsToShow: 1,
  wrapAround: true,
  autoplay: 3000, // تغییر به میلی‌ثانیه (3 ثانیه)
  pauseAutoplayOnHover: true,
  transition: 500, // زمان انتقال بین اسلایدها
  dir: 'rtl', // جهت اسلایدر برای راست‌چین
}

const setRating = (star) => {
  rating.value = star
  console.log('امتیاز انتخاب شده:', star)
}

function addRate() {
  if (rating.value === 0) {
    // استفاده از rating به جای star
    SwalError('خطا!', 'لطفا امتیاز استاد کار را مشخص کنید', 'error')
    return false
  }
  if (!description.value) {
    SwalError('خطا!', 'لطفا توضیحات را در ارتباط با سفارش وارد کنید', 'error')
    return false
  }

  var rate_data = {
    apikey: apikey,
    user_id: user_id,
    worker_id: delivery_order.value.worker_id,
    order_id: delivery_order.value.id,
    // worker_id: 1, // بعدا عوض شود
    // order_id:2,// بعدا عوض شود
    rate: rating.value,
    description: description.value,
  }
  console.log(rate_data)

  axios
    .post(url + 'add_rate', rate_data)
    .then((response) => {
      if (response.data.status === 'ok') {
        SwalSuccess('تبریک', 'نظر شما با موفقیت ثبت شد')
        dialog.value = false
        rating.value = 0
        description.value = ''
      } else {
        SwalError('متاسفانه', response.data.event)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

const goToSubService = (id) => {
  router.push({ name: 'SubcategoryPage', params: { id } })
}

const goToPrivatePage = (id, parentID) => {
  router.push({ name: 'PrivateQuestion', params: { id: id, parentId: parentID } })
}

//غیر فعال شدن اسکرول هنگام باز بودن دیالوگ
watch(dialog, (val) => {
  document.body.style.overflow = val ? 'hidden' : 'auto'
})

function truncateName(name) {
  return name.length > 14 ? name.slice(0, 14) + '...' : name
}
</script>

<style scoped>
.star-rating {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  direction: ltr;
  padding: 16px;
}

.star-icon {
  cursor: pointer;
  transition: all 0.2s ease;
}

.star-icon:hover {
  transform: scale(1.2);
}

.active .star-icon {
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.7));
}

.animated .star-icon {
  animation: bounce 0.5s;
}

.rating-text {
  margin-right: 12px;
  font-size: 14px;
  color: #555;
  font-weight: bold;
  text-align: center;
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

.RTL {
  direction: rtl;
}

.custom-card {
  width: 22%;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.custom-img-style {
  width: 100%;
  height: 10rem;
  object-fit: cover;
  border-radius: 15px;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.custom-img-style:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.slider-row {
  height: 20rem; /* یا هر ارتفاعی که مدنظرت هست */
  overflow: visible;
}

.slider-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px; /* اختیاری برای زیبایی */
}

.carousel {
  --vc-pgn-background-color: #12a0a5;
  --vc-pgn-active-color: #30f2f8;
  --vc-pgn-border-radius: 5px;
  --vc-pgn-height: 5px;
  --vc-pgn-width: 5px;
}

/* لرزش */
@keyframes shake {
  0%,
  100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-1px);
  }
  50% {
    transform: translateY(1px);
  }
  75% {
    transform: translateY(-1px);
  }
}

/* استایل های پرطرفدارترین خدمات */

.horizontal-scroll-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  padding: 1rem 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.horizontal-scroll-container::-webkit-scrollbar {
  display: none;
}

.horizontal-scroll-wrapper {
  display: flex;
  flex-wrap: nowrap;
  gap: 1.5rem;
  padding: 0 1rem; /* فاصله از دو طرف برای جلوگیری از نصفه دیده شدن */
}

.offers-card {
  flex: 0 0 calc(33.33% - 1rem); /* نمایش 3 کارت در هر اسکرول */
  min-width: calc(33.33% - 1rem); /* حفظ عرض */
  max-width: calc(33.33% - 1rem);
  border-radius: 1rem;
  text-align: center;
}

.offers-img-style {
  width: 100%;
  height: 14rem;
  object-fit: cover;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 20px;
  border-bottom-right-radius: 20px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.offers-card:hover {
  transform: scale(1.02);
}

/* استایل های پرطرفدارترین خدمات */

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
