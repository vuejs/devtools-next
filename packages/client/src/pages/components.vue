<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { onDevToolsClientConnected, useDevToolsBridgeApi } from '@vue-devtools-next/app-core'
import type { ComponentTreeNode } from '@vue-devtools-next/schema'

const bridgeApi = useDevToolsBridgeApi()
const treeNode = ref<ComponentTreeNode[]>([])
onDevToolsClientConnected(() => {
  bridgeApi.getComponentTree({}, (tree) => {
    treeNode.value = tree
  })
})
</script>

<template>
  <div h-screen>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div h-screen select-none overflow-scroll p-2>
          <ComponentTreeNode v-for="(item, index) in treeNode" :key="index" :data="item" />
        </div>
      </Pane>
      <Pane flex flex-col>
        Component Details
      </Pane>
    </Splitpanes>
  </div>
</template>
