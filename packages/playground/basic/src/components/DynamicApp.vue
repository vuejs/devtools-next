<script setup lang="ts">
import { App, createApp, shallowRef, triggerRef } from 'vue'
import Foo from './Foo.vue'

const dynamicInstance = shallowRef<App | null>(null)

function registerApp() {
  const app = createApp(Foo)

  app.mount('#dynamic-app')
  dynamicInstance.value = app
  triggerRef(dynamicInstance)
}

function removeApp() {
  if (!dynamicInstance.value)
    return
  dynamicInstance.value.unmount()
  document.querySelector('#dynamic-app')!.innerHTML = ''
  dynamicInstance.value = null
  triggerRef(dynamicInstance)
}
</script>

<template>
  <div>
    <button v-if="!dynamicInstance" @click="registerApp">
      Register App
    </button>
    <button v-if="dynamicInstance" @click="removeApp">
      Remove App
    </button>
    <div id="dynamic-app" />
  </div>
</template>
