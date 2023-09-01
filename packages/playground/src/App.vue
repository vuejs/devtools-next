<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const count = ref(0)
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
    <RouterView />
  </div>
</template>
