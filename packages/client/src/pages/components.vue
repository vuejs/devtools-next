<script setup lang="ts">
import {
  getComponentBoundingRect as getComponentBoundingRectAction,
  getInspectorState,
  getInspectorTree,
  inspectComponentInspector as inspectComponentInspectorAction,
  onInspectorStateUpdated,
  onInspectorTreeUpdated,
  openInEditor,
  scrollToComponent as scrollToComponentAction,
  toggleComponentInspector as toggleComponentInspectorAction,
  updateInspectorTreeId,
  useDevToolsBridge,
  useDevToolsState,
} from '@vue/devtools-core'

import type { ComponentBoundingRect, ComponentTreeNode, InspectorState } from '@vue/devtools-kit'
import { parse } from '@vue/devtools-kit'

import { VueIcon, VueInput, VTooltip as vTooltip } from '@vue/devtools-ui'
import { Pane, Splitpanes } from 'splitpanes'

const inspectorId = 'components'
const bridge = useDevToolsBridge()
const treeNode = ref<ComponentTreeNode[]>([])
const activeComponentId = ref('')

const _vueInspectorDetected = computed(() => vueInspectorDetected.value)

// UX related state
const loaded = ref(false)
const [filtered, toggleFiltered] = useToggle(true)

// create component context
const { selected: selectedComponentTree } = createSelectContext('component-tree')

// create collapse context
const { collapseMap: componentTreeCollapseMap, linkedList: componentTreeLinkedList } = createCollapseContext('component-tree')
createCollapseContext('inspector-state')

// selected component tree node
const selectedComponentTreeNode = computed<ComponentTreeNode>(() => {
  const res: ComponentTreeNode[] = []
  const find = (treeNode: ComponentTreeNode[]) => {
    treeNode.forEach((item) => {
      if (item.id === selectedComponentTree.value)
        res.push(item)
      if (item.children?.length)
        find(item.children)
    })
  }
  find(treeNode.value)
  return res[0]
})

const treeNodeIdLinkedList = computed<string[][]>(() => {
  const res: string[][] = []
  const find = (treeNode: ComponentTreeNode[], linkedList: string[] = []) => {
    treeNode.forEach((item) => {
      res.push([...linkedList, item.id])
      if (item.children?.length)
        find(item.children, [...linkedList, item.id])
    })
  }
  find(treeNode.value)
  return res
})

// selected component file path
const selectedComponentFilePath = computed(() => selectedComponentTreeNode.value?.file ?? '')

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
    getComponentBoundingRectAction({ inspectorId: 'components', instanceId: id }).then((data) => {
      resolve(parse(data!))
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
    getInspectorTree({ inspectorId: 'components', filter: filterText }).then((_data) => {
      const isNoComponentTreeCollapsed = !Object.keys(componentTreeCollapseMap.value).length
      const data = parse(_data!)
      treeNode.value = data
      isNoComponentTreeCollapsed && (componentTreeCollapseMap.value = normalizeComponentTreeCollapsed(data))
      initSelectedComponent(data)
      resolve()
    })
  })
}

// #region component inspector start
const isPending = ref(false)
async function toggleComponentInspector(id: string, visible: boolean) {
  if (isPending.value)
    await until(isPending).toBe(false)
  isPending.value = true

  getComponentBoundingRect(id).then((rect) => {
    toggleComponentInspectorAction({
      id,
      visible,
      bounds: rect,
    })
    isPending.value = false
  })
}

function scrollToComponent(id: string) {
  scrollToComponentAction({
    id,
  })
}

function inspectComponentInspector() {
  bridge.value.emit('toggle-panel', false)
  inspectComponentInspectorAction().then((_data) => {
    const data = JSON.parse(_data!)
    selectedComponentTree.value = data.id
    selectComponentTree(data.id)
    const linkedList = componentTreeLinkedList.value[data.id]
    if (linkedList) {
      linkedList.forEach((id) => {
        componentTreeCollapseMap.value[id] = true
      })
    }
    else {
      treeNodeIdLinkedList.value.forEach((item) => {
        let index = item.indexOf(data.id)
        if (index > -1) {
          while (index >= 0) {
            componentTreeCollapseMap.value[item[index]] = true
            index--
          }
        }
      })
    }
  }).finally(() => {
    bridge.value.emit('toggle-panel', true)
  })
}

// #endregion

function selectComponentTree(id: string) {
  clearComponentState()
  getComponentState(id)
  activeComponentId.value = id
}

watch(selectedComponentTree, (id) => {
  updateInspectorTreeId(id)
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
  getInspectorState({ inspectorId: 'components', nodeId: id }).then((data) => {
    activeComponentState.value = normalizeComponentState(parse(data))
  })
}

function clearComponentState() {
  activeComponentState.value = {}
}

// #endregion

onDevToolsClientConnected(() => {
  // tree
  getComponentTree().then(() => {
    loaded.value = true
  })
  onInspectorTreeUpdated((_data) => {
    const data = parse(_data)
    if (!data?.data.length || data.inspectorId !== inspectorId)
      return

    treeNode.value = data.data
    componentTreeCollapseMap.value = {
      ...normalizeComponentTreeCollapsed(data.data),
      ...componentTreeCollapseMap.value,
    }
    initSelectedComponent(data.data)
  })

  // state
  onInspectorStateUpdated((_data) => {
    const data = parse(_data)
    if (data.inspectorId !== inspectorId)
      return

    activeComponentState.value = normalizeComponentState({ state: data.state })
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

const devtoolsState = useDevToolsState()
</script>

<template>
  <PanelGrids h-screen>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div w-full flex gap2 px2 py2>
          <VueInput v-if="loaded" v-model="filterName" :loading-debounce-time="250" :loading="!filtered" placeholder="Find components..." flex-1 />
          <button v-if="devtoolsState.vitePluginDetected.value" px-1 @click="inspectComponentInspector">
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
          <ComponentTreeNode v-for="item in treeNode" :key="item.id" :data="item" @select="selectComponentTree" @mouseenter="toggleComponentInspector" @mouseleave="toggleComponentInspector" />
        </div>
      </Pane>
      <Pane flex flex-col>
        <div flex justify-between overflow-auto px2 py3 class="no-scrollbar">
          <span v-if="selectedComponentTreeNode?.name">{{ selectedComponentTreeNode.name }}</span>
          <div flex="~ gap2">
            <VueIcon
              v-tooltip="'Scroll to Component'"

              title="Scroll to Component"
              icon="i-iconoir:mouse-scroll-wheel"
              action flex-none
              :border="false"
              @click="scrollToComponent(selectedComponentTree)"
            />

            <VueIcon
              v-if="selectedComponentFilePath && devtoolsState.vitePluginDetected.value && _vueInspectorDetected"
              v-tooltip="'Open in Editor'"
              title="Open in Editor"
              icon="i-carbon-launch"
              action flex-none
              :border="false"
              @click="openInEditor(selectedComponentFilePath)"
            />
          </div>
        </div>
        <p class="x-divider" />
        <div :key="selectedComponentTree" h-0 grow overflow-auto p-2 class="no-scrollbar">
          <InspectorState
            v-for="(state, key) in activeComponentState" :id="key" :key="key"
            :node-id="activeComponentId" :data="state" :name="`${key}`" inspector-id="components"
          />
        </div>
      </Pane>
    </Splitpanes>
  </PanelGrids>
</template>
