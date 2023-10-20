<script setup lang="ts">
import { onDevToolsClientConnected, useDevToolsBridgeApi } from '@vue-devtools-next/app-core'

// eslint-disable-next-line ts/consistent-type-imports
import type { ComponentTreeNode } from '@vue-devtools-next/schema'
import { Pane, Splitpanes } from 'splitpanes'
import { VueInput } from '@vue-devtools-next/ui'

const bridgeApi = useDevToolsBridgeApi()
const treeNode = ref<ComponentTreeNode[]>([])
const { activeComponentState } = useComponentState()

// UX related state
const loaded = ref(false)
const [filtered, toggleFiltered] = useToggle(true)

// create component context
const { selected: selectedComponentTree } = createSelectContext('component-tree')

// create collapse context
const { collapseMap: componentTreeCollapseMap } = createCollapseContext('component-tree')
createCollapseContext('component-state')

function initSelectedComponent(treeNode: ComponentTreeNode[]) {
  if (!treeNode.length)
    return
  if (!selectedComponentTree.value) {
    selectedComponentTree.value = treeNode?.[0].id
    getComponentState(treeNode?.[0].id)
  }
  else {
    // fallback to root if selected component is not in the tree
    if (!checkComponentInTree(treeNode, selectedComponentTree.value)) {
      selectedComponentTree.value = treeNode?.[0].id
      getComponentState(treeNode?.[0].id)
    }
  }
}

function getComponentTree(filterText?: string) {
  return new Promise<void>((resolve) => {
    bridgeApi.getComponentTree({ filterText }, (data) => {
      const isNoComponentTreeCollapsed = !Object.keys(componentTreeCollapseMap.value).length
      treeNode.value = data
      isNoComponentTreeCollapsed && (componentTreeCollapseMap.value = normalizeComponentTreeCollapsed(data))
      initSelectedComponent(data)
      resolve()
    })
  })
}

onDevToolsClientConnected(() => {
  getComponentTree().then(() => {
    loaded.value = true
  })
})

function selectComponentTree(id: string) {
  getComponentState(id)
}

const filterName = ref('')

watchDebounced(filterName, (value) => {
  value = value.trim().toLowerCase()
  toggleFiltered()
  getComponentTree(value).then(() => {
    toggleFiltered()
  })
}, { debounce: 300 })
</script>

<template>
  <div h-screen>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div w-full px10px py12px>
          <VueInput v-if="loaded" v-model="filterName" :loading-debounce-time="250" :loading="!filtered" placeholder="Find components..." />
        </div>
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <ComponentTreeNode v-for="(item, index) in treeNode" :key="index" :data="item" @select="selectComponentTree" />
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
