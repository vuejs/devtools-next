<script setup lang="ts">
import { onDevToolsClientConnected, useDevToolsBridgeApi } from '@vue-devtools-next/app-core'

// eslint-disable-next-line ts/consistent-type-imports
import type { ComponentTreeNode } from '@vue-devtools-next/schema'
import { Pane, Splitpanes } from 'splitpanes'

const bridgeApi = useDevToolsBridgeApi()
const treeNode = ref<ComponentTreeNode[]>([])
const { activeComponentState } = useComponentState()

onDevToolsClientConnected(() => {
  bridgeApi.getComponentTree({}, (data) => {
    initComponentTreeState(data)
    treeNode.value = data
  })
})
</script>

<template>
  <div h-screen>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <ComponentTreeNode v-for="(item, index) in treeNode" :key="index" :data="item" />
        </div>
      </Pane>
      <Pane flex flex-col overflow-y-scroll class="no-scrollbar">
        <div p-2>
          <ComponentState v-for="(state, key) in activeComponentState" :id="key" :key="key + Date.now()" :data="state" :name="`${key}`" />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
