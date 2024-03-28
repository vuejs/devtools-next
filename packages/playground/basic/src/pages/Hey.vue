<script setup lang="ts">
import { useStore } from 'vuex'
import { useCounterStore } from '../stores'

const route = useRoute()
const counterStore = useCounterStore()
const vuexStore = useStore()
</script>

<template>
  <div class="container">
    Hey: {{ route.params.id }}
    Counter: {{ counterStore.count }}
    <p>
      Vuex counter: {{ vuexStore.state.counter }} <button @click="vuexStore.commit('increment')">
        Increase
      </button>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 250px;
  height: 150px;
  background: #363636;
  border-radius: 4px;
}
</style>
