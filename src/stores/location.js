// stores/location.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useLocationStore = defineStore('location', {
  state: () => ({
    states: [],
    state_id: null,
    cities: [],
    city_id: null,
  }),

  actions: {
    async fetchLocations(apikey, url) {
      const sendData = {
        action: 'city',
        apikey: apikey,
      };

      const response = await axios.post(url + 'public_info', sendData);
      this.states = response.data;

      this.state_id = this.states[0].id;
      this.cities = this.states[0].city;
      this.city_id = this.cities[0].id;

      // ذخیره در localStorage برای دفعات بعد
      localStorage.setItem('location_data', JSON.stringify(this.states));
    },

    loadFromStorage() {
      const data = localStorage.getItem('location_data');
      if (data) {
        this.states = JSON.parse(data);
        this.state_id = this.states[0].id;
        this.cities = this.states[0].city;
        this.city_id = this.cities[0].id;
      }
    },

    loadCitiesByState() {
      this.cities = [];
      this.city_id = null;

      this.states.forEach((item) => {
        if (item.id === this.state_id) {
          this.cities = item.city;
          if (item.city.length > 0) {
            this.city_id = item.city[0].id;
          }
        }
      });
    }
  }
});
