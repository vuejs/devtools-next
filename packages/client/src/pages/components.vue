<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { onDevToolsClientConnected, useDevToolsBridgeApi } from '@vue-devtools-next/app-core'

const bridgeApi = useDevToolsBridgeApi()
onDevToolsClientConnected(() => {
  bridgeApi.getComponentTree().then((tree) => {
    console.log(tree)
  })
})
console.log(bridgeApi)
const tree = [
  {
    name: 'App',
    id: 'root',
    children: [
      {
        name: 'Home',
        id: 'home',
      },
      {
        name: 'About',
        id: 'about',
        children: [
          {
            name: 'Header',
            id: 'header',
          },
          {
            name: 'Footer',
            id: 'footer',
          },
        ],
      },
    ],
  },
]
</script>

<template>
  <div h-screen>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div h-screen select-none overflow-scroll p-2>
          <ComponentTreeNode v-for="(item, index) in tree" :key="index" :data="item" />
        </div>
      </Pane>
      <Pane flex flex-col>
        Component Details
      </Pane>
    </Splitpanes>
  </div>
</template>
