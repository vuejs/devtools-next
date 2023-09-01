import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const count = ref(120)
  function increment() {
    count.value++
  }

  return { count, increment }
})

export const useCounterStore = defineStore('counter', () => {
  const count = ref(10)
  const name = ref('webfansplz!!!')
  function increment() {
    count.value++
  }

  return { count, name, increment }
})
