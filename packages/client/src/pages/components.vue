<script setup lang="ts">
import { useDevToolsBridgeRpc } from '@vue-devtools-next/core'

// eslint-disable-next-line ts/consistent-type-imports
import type { ComponentBoundingRect, ComponentTreeNode, InspectorState } from 'vue-devtools-kit'
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
const { collapseMap: componentTreeCollapseMap, linkedList: componentTreeLinkedList } = createCollapseContext('component-tree')
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

// #region bounding react start
function getComponentBoundingRect(id: string) {
  return new Promise<ComponentBoundingRect>((resolve) => {
    bridgeRpc.getComponentBoundingRect<{ data: ComponentBoundingRect }>({ inspectorId: 'components', instanceId: id }).then(({ data }) => {
      resolve(data)
    })
  })
}
// #endregion

// #region tree start

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

// #region component inspector start
function toggleComponentInspector(id: string, visible: boolean) {
  getComponentBoundingRect(id).then((rect) => {
    bridgeRpc.toggleComponentInspector({
      id,
      visible,
      bounds: rect,
    })
  })
}

function inspectComponentInspector() {
  bridgeRpc.inspectComponentInspector().then(({ data }) => {
    selectedComponentTree.value = data.id
    selectComponentTree(data.id)
    const linkedList = componentTreeLinkedList.value[data.id]
    linkedList.forEach((id) => {
      componentTreeCollapseMap.value[id] = true
    })
  })
}

// #endregion

function selectComponentTree(id: string) {
  getComponentState(id)
  activeComponentId.value = id
}

watch(selectedComponentTree, (id) => {
  bridgeRpc.updateInspectorTreeId(id)
})

// #endregion

// #region state start

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

// #endregion

onDevToolsClientConnected(() => {
  // tree
  getComponentTree().then(() => {
    loaded.value = true
  })
  bridgeRpc.on.inspectorTreeUpdated<{ data: ComponentTreeNode[], inspectorId: string }>((data) => {
    if (!data?.data?.length)
      return

    treeNode.value = data.data
    componentTreeCollapseMap.value = normalizeComponentTreeCollapsed(data.data)
    initSelectedComponent(data.data)
  }, {
    inspectorId: 'components',
  })

  // state
  bridgeRpc.on.inspectorStateUpdated((data) => {
    activeComponentState.value = normalizeComponentState(data)
  }, {
    inspectorId: 'components',
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
        <div w-full px10px py12px flex gap2>
          <VueInput v-if="loaded" v-model="filterName" :loading-debounce-time="250" :loading="!filtered" placeholder="Find components..." flex-1 />
          <button px-1 @click="inspectComponentInspector">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style="height: 1.1em; width: 1.1em; opacity:0.5;"
              :style="true ? 'opacity:1;color:#00dc82' : ''"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r=".5" fill="currentColor" /><path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0-14 0m7-9v2m-9 7h2m7 7v2m7-9h2" /></g>
            </svg>
          </button>
        </div>
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <ComponentTreeNode v-for="item in treeNode" :key="item.id" :data="item" @select="selectComponentTree" @mouseover="toggleComponentInspector" @mouseleave="toggleComponentInspector" />
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
