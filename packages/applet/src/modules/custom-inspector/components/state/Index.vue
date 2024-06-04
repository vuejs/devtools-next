<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import { DevToolsMessagingEvents, rpc } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import type { CustomInspectorNode, CustomInspectorOptions, CustomInspectorState } from '@vue/devtools-kit'
import { vTooltip } from '@vue/devtools-ui'
import Navbar from '~/components/basic/Navbar.vue'
import SelectiveList from '~/components/basic/SelectiveList.vue'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'
import Empty from '~/components/basic/Empty.vue'
import RootStateViewer from '~/components/state/RootStateViewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'
import { useCustomInspectorState } from '~/composables/custom-inspector-state'

const { expanded: expandedStateNodes } = createExpandedContext('vue-query-state')

const customInspectState = useCustomInspectorState()

const inspectorId = computed(() => customInspectState.value.id!)
const nodeActions = ref<CustomInspectorOptions['nodeActions']>([])
const actions = ref<CustomInspectorOptions['nodeActions']>([])

const selected = ref('')
const tree = ref<CustomInspectorNode[]>([])
const state = ref<Record<string, CustomInspectorState[]>>({})
const emptyState = computed(() => !Object.keys(state.value).length)

function getNodeActions() {
  rpc.value.getInspectorNodeActions(inspectorId.value).then((actions) => {
    nodeActions.value = actions
  })
}

function getActions() {
  rpc.value.getInspectorActions(inspectorId.value).then((_actions) => {
    actions.value = _actions
  })
}

getNodeActions()

getActions()

function callNodeAction(index: number) {
  rpc.value.callInspectorNodeAction(inspectorId.value, index, selected.value)
}

function callAction(index: number) {
  rpc.value.callInspectorAction(inspectorId.value, index)
}

function filterEmptyState(data: Record<string, CustomInspectorState[]>) {
  for (const key in data) {
    if (!data[key]?.length)
      delete data[key]
  }
  return data
}

function getInspectorState(nodeId: string) {
  rpc.value.getInspectorState({ inspectorId: inspectorId.value, nodeId }).then((data) => {
    state.value = filterEmptyState(parse(data!))
    expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
  })
}

function clearInspectorState() {
  state.value = {}
}

watch(selected, () => {
  clearInspectorState()
  getInspectorState(selected.value)
})

const getInspectorTree = () => {
  rpc.value.getInspectorTree({ inspectorId: inspectorId.value, filter: '' }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    if (!selected.value && data.length) {
      selected.value = data[0].id
      getInspectorState(data[0].id)
    }
  })
}
getInspectorTree()

function onInspectorTreeUpdated(_data: string) {
  const data = parse(_data) as {
    inspectorId: string
    rootNodes: CustomInspectorNode[]
  }
  if (!data.rootNodes.length || data.inspectorId !== inspectorId.value)
    return
  tree.value = data.rootNodes
  if ((!selected.value && data.rootNodes.length) || (selected.value && !data.rootNodes.find(node => node.id === selected.value))) {
    selected.value = data.rootNodes[0].id
    getInspectorState(data.rootNodes[0].id)
  }
}

function onInspectorStateUpdated(_data: string) {
  const data = parse(_data) as {
    inspectorId: string
    state: CustomInspectorState
    nodeId: string
  }
  if (data.inspectorId !== inspectorId.value)
    return

  const { inspectorId: _inspectorId, ...filtered } = data.state

  state.value = filterEmptyState(filtered as any)
  expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
}

rpc.functions.on(DevToolsMessagingEvents.INSPECTOR_TREE_UPDATED, onInspectorTreeUpdated)
rpc.functions.on(DevToolsMessagingEvents.INSPECTOR_STATE_UPDATED, onInspectorStateUpdated)

onUnmounted(() => {
  rpc.functions.off(DevToolsMessagingEvents.INSPECTOR_TREE_UPDATED, onInspectorTreeUpdated)
  rpc.functions.off(DevToolsMessagingEvents.INSPECTOR_STATE_UPDATED, onInspectorStateUpdated)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <DevToolsHeader :doc-link="customInspectState.homepage!">
      <Navbar />
    </DevToolsHeader>
    <template v-if="tree.length">
      <Splitpanes class="flex-1 overflow-auto">
        <Pane border="r base" size="40" h-full>
          <div h-full select-none overflow-scroll class="no-scrollbar">
            <div v-if="actions?.length" class="flex justify-end pb-1" border="b dashed base">
              <div class="flex items-center gap-2 px-1">
                <div v-for="(action, index) in actions" :key="index" v-tooltip.bottom-end="{ content: action.tooltip }" class="flex items-center gap1" @click="callAction(index)">
                  <i :class="`i-ic-baseline-${action.icon.replace(/\_/g, '-')}`" cursor-pointer op70 text-base hover:op100 />
                </div>
              </div>
            </div>
            <SelectiveList v-model="selected" :data="tree" />
          </div>
        </Pane>
        <Pane size="60">
          <div class="h-full flex flex-col p2">
            <div v-if="nodeActions?.length" class="flex justify-end pb-1" border="b dashed base">
              <div class="flex items-center gap-2 px-1">
                <div v-for="(action, index) in nodeActions" :key="index" v-tooltip.bottom-end="{ content: action.tooltip }" class="flex items-center gap1" @click="callNodeAction(index)">
                  <i :class="`i-ic-baseline-${action.icon.replace(/\_/g, '-')}`" cursor-pointer op70 text-base hover:op100 />
                </div>
              </div>
            </div>
            <RootStateViewer v-if="selected && !emptyState" :data="state" :node-id="selected" :inspector-id="inspectorId" expanded-state-id="vue-query-state" class="no-scrollbar flex-1 select-none overflow-scroll" />
            <Empty v-else>
              No Data
            </Empty>
          </div>
        </Pane>
      </Splitpanes>
    </template>
    <Empty v-else>
      No Data
    </Empty>
  </div>
</template>
