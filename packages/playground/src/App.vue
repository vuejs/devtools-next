<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const count = ref(0)
const isDark = useDark()
const doubleCount = computed(() => {
  return count.value * 2
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
    <button @click="count++">
      Increment
    </button>
  </div>
</template>
