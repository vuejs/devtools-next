<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from './stores'
import EditState from './components/EditState.vue'

const app = useAppStore()
const isDark = useDark()
const doubleCount = computed(() => {
  return app.count * 2
})
const p = reactive({
  age: 18,
})

const str = ref('111')

const router = useRouter()
const route = useRoute()
</script>

<template>
  <div>
    <button @click="isDark = !isDark">
      toggle dark mode
    </button>
    <EditState />
    <RouterView />
    {{ doubleCount }}
    {{ isDark }}
    <RouterLink to="/hello">
      <div>
        Go to hello!
      </div>
    </RouterLink>
    <button @click="app.increment">
      Increment
    </button>
  </div>
</template>
