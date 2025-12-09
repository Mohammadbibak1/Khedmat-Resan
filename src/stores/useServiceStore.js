import { defineStore } from 'pinia';
import axios from 'axios';

export const useServiceStore = defineStore('service', {
  state: () => ({
    services: [],
  }),
  actions: {
    setServices(data) {
      this.services = data
    },
  },
})
