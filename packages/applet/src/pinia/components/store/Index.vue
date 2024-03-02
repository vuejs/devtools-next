<script setup lang="ts">
import { ref } from 'vue'

import { Pane, Splitpanes } from 'splitpanes'
import StoreInfo from './StoreInfo.vue'
import SelectiveList from '~/components/basic/SelectiveList.vue'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'

const list = [
  {
    id: 'root',
    name: 'Root',
  },
  {
    id: 'user',
    name: 'User',
  },
  {
    id: 'role',
    name: 'Role',
  },
  {
    id: 'app',
    name: 'App',
  },
]

const selected = ref('root')
</script>

<template>
  <div class="h-full flex flex-col">
    <DevToolsHeader doc-link="https://pinia.vuejs.org/" github-repo-link="https://github.com/vuejs/pinia" />
    <Splitpanes class="flex-1">
      <Pane border="r base" size="40" h-full>
        <div h-full select-none overflow-scroll class="no-scrollbar">
          <SelectiveList v-model="selected" :data="list" />
        </div>
      </Pane>
      <Pane size="60">
        <div h-full select-none overflow-scroll class="no-scrollbar">
          <StoreInfo />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
