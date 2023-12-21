<script setup lang="ts">
import { ref } from 'vue'

const a = ref(1)
</script>

<template>
  <h1>a</h1>

  <div class="card">
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out Rspack which support Vue
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">
    Click on the Rspack and Vue logos to learn more
  </p>
  <p class="stc">
    Scroll to Component
  </p>
  <div>Scroll</div>
</template>

<style lang="scss" scoped>
.stc {
  text-align: center;
  margin: 0 auto;
  width: 800px;
  height: 150px;
  line-height: 150px;
  margin-top: 1000px;
}
</style>
