<script setup lang="ts">
import { onDevToolsClientConnected, useDevToolsBridgeRpc } from '@vue-devtools-next/core'

const bridgeRpc = useDevToolsBridgeRpc()

onDevToolsClientConnected(() => {
  bridgeRpc.getGraph().then((res) => {
    console.log('res', res)
  })
})
</script>

<template>
  <div>
    Graph
  </div>
</template>
