<template>

  <div v-if="props.show" class="loading-container">
    <Vue3Lottie
        :animationData="animationData"
        :height="300"
        :width="200"
        :loop="true"
        :autoplay="true"
    />
  </div>
</template>

<script setup>
import { Vue3Lottie } from 'vue3-lottie'
import animationData from '@/assets/animations/Animation - 1744198326694.json' // مسیر فایل JSON انیمیشن

// دریافت props با مقدار پیش‌فرض
// eslint-disable-next-line no-undef
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>


<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
