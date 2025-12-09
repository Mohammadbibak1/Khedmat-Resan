// stores/orderFormStore.js
import { defineStore } from 'pinia'

export const useOrderFormStore = defineStore('orderForm', {
  state: () => ({
    date: '',
    selectedTimeSlot: null,
    selectedAddressId: null,
    caption: ''
  }),
  actions: {
    clear() {
      this.date = ''
      this.selectedTimeSlot = null
      this.selectedAddressId = null
      this.caption = ''
    }
  }
})
