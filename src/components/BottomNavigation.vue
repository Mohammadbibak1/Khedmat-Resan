<template>
  <div class="bottom-navigation">
    <div class="bg-white d-flex justify-content-between align-items-end rounded-top-5 shadow-bottom-navigation px-5" style="height: 6rem;">
      <div
        class="nav-item"
        v-for="(item, index) in items"
        :key="index"
        :class="{ 'bottom-navigation-active': activeIndex === index }"
        @click="navigate(index, item.route)"
      >
        <div class="icon-wrapper">
          <img :src="item.icon" class="icon-size-3" />
        </div>
        <p v-if="activeIndex !== index" class="bottom-navigation-title">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  items: Array,
  modelValue: Number
})
const emit = defineEmits(['update:modelValue'])

const router = useRouter()

const activeIndex = ref(props.modelValue || 0)

function navigate(index, routeName) {
  activeIndex.value = index
  emit('update:modelValue', index)
  router.push(routeName) // رفتن به مسیر مربوطه
}

// اگر از بیرون مقدار تغییر کرد، هماهنگ کن
watch(() => props.modelValue, val => {
  activeIndex.value = val
})
</script>
