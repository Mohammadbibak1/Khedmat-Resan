import { defineStore } from 'pinia'

export const useAnswerStore = defineStore('answer', {
  state: () => ({
    questions: [],
    service_id: null,
  }),
  actions: {
    setAnswers(data) {
      this.questions = data
    },
    addAnswers(data) {
      this.questions.push(...data)
    },
    clearAnswers() {
      this.questions = []
      this.service_id = null
    },
    setServiceId(id) {
      this.service_id = id
    },
  }
})
