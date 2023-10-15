<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { onDevToolsClientConnected, useDevToolsBridgeApi } from '@vue-devtools-next/app-core'
import { ComponentTreeNode } from '@vue-devtools-next/schema'

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
        <div h-screen select-none overflow-scroll p-2>
          <ComponentTreeNode v-for="(item, index) in treeNode" :key="index" :data="item" />
        </div>
      </Pane>
      <Pane flex flex-col>
        <div p-2>
          <ComponentState v-for="(state, key) in activeComponentState" :key="key" :data="state" :name="`${key}`" />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
