<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDark } from '@vueuse/core'

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
  </div>
</template>
