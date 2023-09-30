<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'

const tree = [
  {
    name: 'App',
    children: [
      {
        name: 'Home',
      },
      {
        name: 'About',
        children: [
          {
            name: 'Header',
          },
          {
            name: 'Footer',
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
