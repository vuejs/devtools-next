<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from './stores'

const app = useAppStore()
const isDark = useDark()
const doubleCount = computed(() => {
  return app.count * 2
})
const p = reactive({
  age: 18,
})

const router = useRouter()
</script>

<template>
  <div>
    <button @click="isDark = !isDark">
      toggle dark mode
    </button>
    <RouterView />
    {{ doubleCount }}
    {{ isDark }}
    <button @click="app.increment">
      Increment
    </button>
  </div>
</template>
