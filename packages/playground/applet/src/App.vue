<script setup lang="ts">
import { Pinia } from '@vue/devtools-applet'
import '@vue/devtools-applet/style.css'
import { HandShakeServer, getDevToolsState, initDevToolsSeparateWindow, initDevToolsSeparateWindowBridge, onDevToolsStateUpdated, setupDevToolsBridge } from '@vue/devtools-core'
import { useDevToolsColorMode } from '@vue/devtools-shared'
import { useCounterStore } from './stores'

const { isDark } = useDevToolsColorMode()
// user app
const counterStore = useCounterStore()

// devtools
const appConnected = ref(false)
const clientConnected = ref(false)
const connected = computed(() => appConnected.value && clientConnected.value)

initDevToolsSeparateWindow({
  onConnected(channel) {
    const bridge = initDevToolsSeparateWindowBridge(channel)
    setupDevToolsBridge(bridge)
    new HandShakeServer(bridge).onnConnect().then(() => {
      bridge.emit('devtools:client-ready')
      initVueDevToolsState()
    })
    bridge.on('disconnect', () => {
      channel.close()
      initDevToolsSeparateWindow()
    })
  },
})

function initVueDevToolsState() {
  getDevToolsState().then((data) => {
    if (data)
      return
    appConnected.value = data!.connected
    clientConnected.value = data!.clientConnected
  })

  onDevToolsStateUpdated((data) => {
    if (!data)
      return
    appConnected.value = data!.connected
    clientConnected.value = data!.clientConnected
  })
}

useDevToolsColorMode()
</script>

<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <div i-carbon-sun dark:i-carbon-moon translate-y--1px @click="isDark = !isDark" />

    <div select-none>
      Count:{{ counterStore.count }}
      <span @click="counterStore.increment">➕</span>
      <span @click="counterStore.decrement">➖</span>
    </div>
    <div h-150 w-200 border="1 green solid">
      <Pinia v-if="connected" />
      <div v-else class="h-full flex items-center justify-center">
        Connecting...
      </div>
    </div>
  </div>
</template>
