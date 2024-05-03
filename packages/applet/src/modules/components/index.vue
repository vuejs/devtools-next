<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import type { ComponentTreeNode, InspectorState } from '@vue/devtools-kit'
import {
  cancelInspectComponentInspector as cancelInspectComponentInspectorAction,
  getComponentRenderCode as getComponentRenderCodeAction,
  getInspectorState,
  getInspectorTree,
  inspectComponentInspector as inspectComponentInspectorAction,
  onInspectorStateUpdated,
  onInspectorTreeUpdated,
  scrollToComponent as scrollToComponentAction,
} from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import { useElementSize, useToggle, watchDebounced } from '@vueuse/core'
import { VueInput, vTooltip } from '@vue/devtools-ui'
import { sortByKey } from '@vue/devtools-shared'
import { flatten, groupBy } from 'lodash-es'
import ComponentRenderCode from './components/RenderCode.vue'
import ComponentTree from '~/components/tree/TreeViewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'
import { createSelectedContext } from '~/composables/select'
import RootStateViewer from '~/components/state/RootStateViewer.vue'
import { searchDeepInObject } from '~/utils'

const emit = defineEmits(['openInEditor', 'onInspectComponentStart', 'onInspectComponentEnd'])
// responsive layout
const splitpanesRef = ref<HTMLDivElement>()
const splitpanesReady = ref(false)
const { width: splitpanesWidth } = useElementSize(splitpanesRef)
// prevent `Splitpanes` layout from being changed before it ready
const horizontal = computed(() => splitpanesReady.value ? splitpanesWidth.value < 700 : false)
const filterComponentName = ref('')
const filterStateName = ref('')
const [filtered, toggleFiltered] = useToggle(true)
const componentTreeLoaded = ref(false)
const inspectComponentTipVisible = ref(false)
const componentRenderCode = ref('')

// tree
function dfs(node: { id: string, children?: { id: string }[] }, path: string[] = [], linkedList: string[][] = []) {
  path.push(node.id)
  if (node.children?.length === 0)
    linkedList.push([...path])

  node.children?.forEach((child) => {
    dfs(child, path, linkedList)
  })
  path.pop()
  return linkedList
}

function getNodesByDepth(list: string[][], depth: number) {
  const nodes: string[] = []
  list.forEach((item) => {
    nodes.push(...item.slice(0, depth + 1))
  })
  return [...new Set(nodes)]
}

function getTargetLinkedNodes(list: string[][], target: string) {
  const nodes: string[] = []
  list.forEach((item) => {
    const index = item.indexOf(target)
    if (index !== -1)
      nodes.push(...item.slice(0, index + 1))
  })
  return [...new Set(nodes)]
}

const inspectorId = 'components'
const tree = ref<ComponentTreeNode[]>([])
const treeNodeLinkedList = computed(() => tree.value?.length ? dfs(tree.value?.[0]) : [])
const activeComponentState = ref<Record<string, InspectorState[]>>({})
const activeComponentId = ref('')
const activeTreeNode = computed(() => {
  const res: ComponentTreeNode[] = []
  const find = (treeNode: ComponentTreeNode[]) => {
    treeNode.forEach((item) => {
      if (item.id === activeComponentId.value)
        res.push(item)
      if (item.children?.length)
        find(item.children)
    })
  }
  find(tree.value)
  return res[0]
})
const activeTreeNodeFilePath = computed(() => activeTreeNode.value?.file ?? '')

const filteredState = computed(() => {
  const result = {}
  for (const groupKey in activeComponentState.value) {
    const group = activeComponentState.value[groupKey]
    const groupFields = group.filter((el) => {
      try {
        return searchDeepInObject({
          [el.key]: el.value,
        }, filterStateName.value)
      }
      catch (e) {
        return {
          [el.key]: e,
        }
      }
    })
    const normalized = flatten(Object.values(groupBy(sortByKey(groupFields), 'stateType')))
    if (groupFields.length)
      result[groupKey] = normalized
  }
  return result
})

const { expanded: expandedTreeNodes } = createExpandedContext()
const { expanded: expandedStateNodes } = createExpandedContext('component-state')
createSelectedContext()

function getComponentsInspectorTree(filter = '') {
  return getInspectorTree({ inspectorId, filter }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    activeComponentId.value = tree.value?.[0]?.id
    expandedTreeNodes.value = getNodesByDepth(treeNodeLinkedList.value, 1)
    componentTreeLoaded.value = true
  })
}

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
  getInspectorState({ inspectorId, nodeId: id }).then((data) => {
    activeComponentState.value = normalizeComponentState(parse(data!))
    expandedStateNodes.value = Array.from({ length: Object.keys(activeComponentState.value).length }, (_, i) => `${i}`)
  })
}

watch(activeComponentId, (id) => {
  getComponentState(id)
})

onInspectorStateUpdated((data) => {
  if (data.inspectorId !== inspectorId)
    return

  activeComponentState.value = normalizeComponentState({ state: data.state })
})

getComponentsInspectorTree()

onInspectorTreeUpdated((data) => {
  if (!data?.data.length || data.inspectorId !== inspectorId)
    return

  tree.value = data.data

  // expandedTreeNodes.value = getNodesByDepth(treeNodeLinkedList.value, 1)
})

watchDebounced(filterComponentName, (v) => {
  const value = v.trim().toLowerCase()
  toggleFiltered()
  getComponentsInspectorTree(value).then(() => {
    toggleFiltered()
  })
}, { debounce: 300 })

function inspectComponentInspector() {
  inspectComponentTipVisible.value = true
  emit('onInspectComponentStart')
  inspectComponentInspectorAction().then((_data) => {
    const data = JSON.parse(_data!)
    activeComponentId.value = data.id
    if (!expandedTreeNodes.value.includes(data.id))
      expandedTreeNodes.value.push(data.id)

    expandedTreeNodes.value = [...new Set([...expandedTreeNodes.value, ...getTargetLinkedNodes(treeNodeLinkedList.value, data.id)])]
    scrollToActiveTreeNode()
  }).finally(() => {
    inspectComponentTipVisible.value = false
    emit('onInspectComponentEnd')
  })
}

function cancelInspectComponentInspector() {
  inspectComponentTipVisible.value = false
  cancelInspectComponentInspectorAction()
}

function scrollToComponent() {
  scrollToComponentAction({
    id: activeComponentId.value,
  })
}

function getComponentRenderCode() {
  getComponentRenderCodeAction(activeComponentId.value).then((data) => {
    componentRenderCode.value = data!
  })
}

function openInEditor() {
  emit('openInEditor', activeTreeNodeFilePath.value)
}

const componentTreeContainer = ref<HTMLDivElement>()
function scrollToActiveTreeNode() {
  setTimeout(() => {
    const selected = componentTreeContainer.value?.querySelector('.active')
    selected?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 300)
}
</script>

<template>
  <div class="h-full w-full">
    <Splitpanes ref="splitpanesRef" class="flex-1 overflow-auto" :horizontal="horizontal" @ready="splitpanesReady = true">
      <Pane border="r base" h-full>
        <div v-if="componentTreeLoaded" class="h-full flex flex-col p2">
          <div class="flex py2">
            <VueInput v-model="filterComponentName" :loading-debounce-time="250" :loading="!filtered" placeholder="Find components..." flex-1 />
            <button px-1 @click="inspectComponentInspector">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style="height: 1.1em; width: 1.1em;color:#00dc82;"
                class="hover:(op-80)"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r=".5" fill="currentColor" /><path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0-14 0m7-9v2m-9 7h2m7 7v2m7-9h2" /></g>
              </svg>
            </button>
          </div>
          <div ref="componentTreeContainer" class="no-scrollbar flex-1 select-none overflow-scroll">
            <ComponentTree v-model="activeComponentId" :data="tree" />
          </div>
        </div>
      </Pane>
      <Pane relative h-full>
        <div class="h-full flex flex-col p2">
          <div class="flex py2">
            <!-- component name -->
            <span v-if="activeTreeNode?.name" class="font-state-field flex items-center px-1 text-4">
              <span class="text-gray-400 dark:text-gray-600">&lt;</span>
              <span group-hover:text-white class="max-w-40 of-hidden text-ellipsis ws-nowrap [.active_&]:(text-white)">{{ activeTreeNode.name }}</span>
              <span class="text-gray-400 dark:text-gray-600">&gt;</span>
            </span>

            <VueInput v-model="filterStateName" :loading-debounce-time="250" placeholder="Filter State..." flex-1 />

            <div class="flex items-center gap-2 px-1">
              <i v-tooltip.bottom="'Scroll to component'" class="i-material-symbols-light:eye-tracking-outline h-4 w-4 cursor-pointer hover:(op-70)" @click="scrollToComponent" />
              <i v-tooltip.bottom="'Show render code'" class="i-material-symbols-light:code h-5 w-5 cursor-pointer hover:(op-70)" @click="getComponentRenderCode" />
              <i v-if="activeTreeNodeFilePath" v-tooltip.bottom="'Open in Editor'" class="i-carbon-launch h-4 w-4 cursor-pointer hover:(op-70)" @click="openInEditor" />
            </div>
          </div>
          <RootStateViewer class="no-scrollbar flex-1 select-none overflow-scroll" :data="filteredState" :node-id="activeComponentId" :inspector-id="inspectorId" expanded-state-id="component-state" />
        </div>
        <ComponentRenderCode v-if="componentRenderCode" :code="componentRenderCode" @close="componentRenderCode = ''" />
      </Pane>
    </Splitpanes>

    <!-- inspect-component dialog -->
    <!-- <VueDialog v-model="inspectComponentTipVisible" title="" height="12rem" :closable="false">
      <div class="h-full flex flex-col items-center justify-center gap-2">
        <span class="block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="height: 2em; width: 2em; opacity:0.5;color:#00dc82;"
            class="animate-fade"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r=".5" fill="currentColor" /><path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0-14 0m7-9v2m-9 7h2m7 7v2m7-9h2" /></g>
          </svg>
        </span>
        <p>
          Click on a component on the page to select it
        </p>
      </div>
      <template #footer>
        <div class="flex items-center justify-center">
          <VueButton @click="cancelInspectComponentInspector">
            Cancel
          </VueButton>
        </div>
      </template>
    </VueDialog> -->
  </div>
</template>

<style scoped>
@keyframes fade {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.animate-fade {
  animation: fade 2s infinite alternate;
}
</style>
