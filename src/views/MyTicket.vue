<template>
  <LoadingJson :show="loading" />

  <div id="main" class="d-flex align-items-center flex-column RTL">

    <div class="div-top-arrow bg-color max_width d-flex justify-content-end rounded-bottom-5">
      <router-link
        :to="{ name: 'SupportPage'}"
        class="d-flex align-items-center text-decoration-none"
      >
        <p class="font-4 font-bold text-white mr-3">تیکت های من</p>
        <img class="svg-back" src="../assets/img/arrow-right.svg" alt="" />
      </router-link>
    </div>

    <div style="margin-top: 7rem"></div>

    <div v-if="!loading && show_ticket.length > 0"  class="w-100">
      <div
        v-for="item in show_ticket"
        :key="item.id"
        class="w-100 d-flex flex-column align-items-center row-gap-4 mt-4"
      >
        <div
          class="w-95 bg-white rounded-5 p-3 shadow d-flex flex-column justify-content-center align-items-center"
        >
          <div class="w-100 d-flex justify-content-between align-items-center border-bottom p-3">
            <div>
              <p class="font-bold font-4">{{ item.title }}</p>
            </div>

            <div class="d-flex column-gap-2">
              <p class="font-4">{{ item.date }}</p>
            </div>
          </div>

          <p class="w-100 font-4 my-4 mr-5 text-color-gray">{{ item.caption }}</p>

          <div
            class="w-100 bg-lite-blue rounded-5 p-4 d-flex flex-column align-items-start row-gap-4"
          >
            <p class="font-bold text-end font-5">پاسخ پشتیبانی</p>
            <hr class="hr-white" />

            <p
              v-if="item.answer && item.answer.length > 0 && item.answer[0].caption"
              class="font-bold text-end font-5"
            >
              {{ item.answer[0].caption }}
            </p>
            <p v-else class="text-end font-5">پاسخی درج نشده</p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="!loading && show_ticket.length === 0"
      class="w-100 d-flex flex-column align-items-center justify-content-center"
      style="min-height: 70vh"
    >
      <img src="../assets/img/empty-folder (1).png" style="opacity: 50%" />
      <p class="font-bold text-color-gray mt-3">تیکتی وجود ندارد</p>
    </div>

    <br>
    <br>
    <br>
  </div>
</template>

<script setup>
import axios from 'axios'
import { SwalError } from '@/assets/js/MyJs.js'
import { onMounted, ref } from 'vue'
import LoadingJson from '@/components/LoadingJson.vue'

const url = localStorage.getItem('ProjectUrl')
const apikey = localStorage.getItem('ApiKey')
const user_id = localStorage.getItem('user_id')
const loading = ref(false)
const show_ticket=ref([])
async function SendFirstRequest() {
  const send_date = {
    user_id: user_id,
    apikey: apikey,
    action: 'show',
    user_type: 'user',
  }

  loading.value = true

  try {
    const response = await axios.post(url + 'ticket', send_date)
    const res = response.data

    show_ticket.value = res.show_ticket

    console.log(show_ticket.value)
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
</script>

<style scoped>
.RTL {
  direction: rtl;
}
</style>
