<script setup lang="ts">
import { onDevToolsClientConnected, useDevToolsBridgeRpc } from '@vue-devtools-next/core'

// eslint-disable-next-line ts/consistent-type-imports
import type { ComponentTreeNode, InspectorState } from 'vue-devtools-kit'
import { VueInput } from '@vue-devtools-next/ui'
import { Pane, Splitpanes } from 'splitpanes'

const bridgeRpc = useDevToolsBridgeRpc()
const treeNode = ref<ComponentTreeNode[]>([])
const activeComponentId = ref('')

// UX related state
const loaded = ref(false)
const [filtered, toggleFiltered] = useToggle(true)

// create component context
const { selected: selectedComponentTree } = createSelectContext('component-tree')

// create collapse context
const { collapseMap: componentTreeCollapseMap } = createCollapseContext('component-tree')
createCollapseContext('inspector-state')

function checkComponentInTree(treeNode: ComponentTreeNode[], id: string) {
  if (!treeNode.length)
    return false
  if (treeNode.find(item => item.id === id))
    return true
  return treeNode.some(item => checkComponentInTree(item.children || [], id))
}

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

/** ---------------- tree start ------------------- */

function normalizeComponentTreeCollapsed(treeNode: ComponentTreeNode[]) {
  return {
    [treeNode[0].id]: true,
    ...treeNode?.[0].children?.reduce((acc, cur) => {
      acc[cur.id] = true
      return acc
    }, {}),
  }
}

function getComponentTree(filterText?: string) {
  return new Promise<void>((resolve) => {
    bridgeRpc.getInspectorTree<{ data: ComponentTreeNode[] }>({ inspectorId: 'components', filter: filterText }).then(({ data }) => {
      const isNoComponentTreeCollapsed = !Object.keys(componentTreeCollapseMap.value).length
      treeNode.value = data
      isNoComponentTreeCollapsed && (componentTreeCollapseMap.value = normalizeComponentTreeCollapsed(data))
      initSelectedComponent(data)
      resolve()
    })
  })
}

function selectComponentTree(id: string) {
  getComponentState(id)
  activeComponentId.value = id
}

watch(selectedComponentTree, (id) => {
  bridgeRpc.updateInspectorTreeId(id)
})

/** ---------------- tree end ------------------- */

/** ---------------- state start ------------------- */

const activeComponentState = ref<Record<string, InspectorState[]>>({})

function normalizeComponentState(data: { state?: InspectorState[] }) {
  if (!data || !data?.state)
    return {}
  const res = {}
  data.state.forEach((item) => {
    if (!res[item.type])
      res[item.type] = []
    res[item.type].push(item)
  })
  return res
}

function getComponentState(id: string) {
  bridgeRpc.getInspectorState({ inspectorId: 'components', nodeId: id }).then(({ data }) => {
    activeComponentState.value = normalizeComponentState(data)
  })
}

/** ---------------- state end ------------------- */

onDevToolsClientConnected(() => {
  // tree
  getComponentTree().then(() => {
    loaded.value = true
  })
  bridgeRpc.on.inspectorTreeUpdated<{ data: ComponentTreeNode[]; inspectorId: string }>((data) => {
    if (data.inspectorId !== 'components' || !data?.data?.length)
      return

    const isNoComponentTreeCollapsed = !Object.keys(componentTreeCollapseMap.value).length
    treeNode.value = data.data
    isNoComponentTreeCollapsed && (componentTreeCollapseMap.value = normalizeComponentTreeCollapsed(data.data))
    initSelectedComponent(data.data)
  })

  // state
  bridgeRpc.on.inspectorStateUpdated((data) => {
    activeComponentState.value = normalizeComponentState(data)
  })
})

const filterName = ref('')

// @TODO: bugfix - the selected component highlighted working failed when the filter is applied
watchDebounced(filterName, (v) => {
  const value = v.trim().toLowerCase()
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
      <Pane flex flex-col>
        <div p-2 grow h-0 overflow-auto class="no-scrollbar">
          <InspectorState
            v-for="(state, key) in activeComponentState" :id="key" :key="key + Date.now()"
            :node-id="activeComponentId" :data="state" :name="`${key}`" inspector-id="components"
          />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
