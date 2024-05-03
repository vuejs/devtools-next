import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const count = ref(120)
  const map = ref(new Map([['a', 1], ['b', 2], ['c.test', 3]]))
  const set = ref(new Set([1, 2, 3]))
  const obj = ref({ 'foo.test': 1 })
  function increment() {
    count.value++
  }
  const doubledCount = computed(() => count.value * 2)

  return { count, doubledCount, increment, map, set, obj }
})

export const useCounterStore = defineStore('counter', () => {
  const count = ref(10)
  const name = ref('webfansplz!!!')
  function increment() {
    count.value++
  }

  return { count, name, increment }
})
