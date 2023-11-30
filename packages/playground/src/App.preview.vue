<script setup lang="ts">
import { ref } from 'vue'
import STC from './components/ScrollToComponent.vue'
import { useAppStore } from './stores'

const age = ref(10)
const app = useAppStore()
</script>

<template>
  <div class="container">
    <RouterView />
    <p>
      Age: {{ age }}
    </p>
    <p>
      Pinia State Count: {{ app.count }}
    </p>
    <button @click="app.increment">
      Increment Count (Pinia)
    </button>
    <p>
      <router-link to="/">
        Home
      </router-link> |
      <router-link to="/hello">
        Hello
      </router-link>
    </p>
    <STC />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
