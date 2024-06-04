<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import { callInspectorAction, callInspectorNodeAction, getInspectorActions, getInspectorNodeActions, getInspectorState, getInspectorTree, onInspectorStateUpdated, onInspectorTreeUpdated } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import type { InspectorNodeTag, InspectorState } from '@vue/devtools-kit'
import { vTooltip } from '@vue/devtools-ui'
import Navbar from '~/components/basic/Navbar.vue'
import SelectiveList from '~/components/basic/SelectiveList.vue'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'
import Empty from '~/components/basic/Empty.vue'
import RootStateViewer from '~/components/state/RootStateViewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'

const { expanded: expandedStateNodes } = createExpandedContext('vee-validate-state')

interface NodeAction {
  icon: string
  tooltip: string
  actions?: (payload: unknown) => void
}
const inspectorId = 'vee-validate-inspector'
const nodeActions = ref<NodeAction[]>([])
const actions = ref<NodeAction[]>([])

const selected = ref('')
const tree = ref<{ id: string, label: string, tags: InspectorNodeTag[] }[]>([])
const state = ref<Record<string, InspectorState[]>>({})
const emptyState = computed(() => !Object.keys(state.value).length)

function getNodeActions() {
  getInspectorNodeActions(inspectorId).then((actions) => {
    nodeActions.value = actions as NodeAction[]
  })
}

function getActions() {
  getInspectorActions(inspectorId).then((_actions) => {
    actions.value = _actions as NodeAction[]
  })
}

getNodeActions()

getActions()

function callNodeAction(index: number) {
  callInspectorNodeAction(inspectorId, index, selected.value)
}

function callAction(index: number) {
  callInspectorAction(inspectorId, index, selected.value)
}

function filterEmptyState(data: Record<string, InspectorState[]>) {
  for (const key in data) {
    if (!data[key]?.length)
      delete data[key]
  }
  return data
}

function getVeeValidateState(nodeId: string) {
  getInspectorState({ inspectorId, nodeId }).then((data) => {
    state.value = filterEmptyState(parse(data!))
    expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
  })
}

function clearVeeValidateState() {
  state.value = {}
}

watch(selected, () => {
  clearVeeValidateState()
  getVeeValidateState(selected.value)
})

const getVeeValidateInspectorTree = () => {
  getInspectorTree({ inspectorId, filter: '' }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    if (!selected.value && data.length) {
      selected.value = data[0].id
      getVeeValidateState(data[0].id)
    }
  })
}
getVeeValidateInspectorTree()

onInspectorTreeUpdated((data) => {
  if (!data?.data.length || data.inspectorId !== inspectorId)
    return
  tree.value = data.data as unknown as { id: string, label: string, tags: InspectorNodeTag[] }[]
  if ((!selected.value && data.data.length) || (selected.value && !data.data.find(node => node.id === selected.value))) {
    selected.value = data.data[0].id
    getVeeValidateState(data.data[0].id)
  }
})

onInspectorStateUpdated((data) => {
  if (!data || data.inspectorId !== inspectorId)
    return

  const { inspectorId: _inspectorId, ...filtered } = data

  state.value = filterEmptyState(filtered)
  expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <DevToolsHeader doc-link="https://vee-validate.logaretm.com/v4/" github-repo-link="https://github.com/logaretm/vee-validate/">
      <Navbar />
    </DevToolsHeader>
    <template v-if="tree.length">
      <Splitpanes class="flex-1 overflow-auto">
        <Pane border="r base" size="40" h-full>
          <div h-full select-none overflow-scroll class="no-scrollbar">
            <div v-if="actions.length" class="w-full px2 pt2">
              <div class="w-full flex justify-end pb1" border="b dashed base">
                <div class="flex items-center gap-2 px-1">
                  <div v-for="(action, index) in actions" :key="index" v-tooltip.bottom-end="{ content: action.tooltip }" class="flex items-center gap1" @click="callAction(index)">
                    <i :class="`i-ic-baseline-${action.icon.replace(/\_/g, '-')}`" cursor-pointer op70 text-base hover:op100 />
                  </div>
                </div>
              </div>
            </div>
            <SelectiveList v-model="selected" :data="tree" />
          </div>
        </Pane>
        <Pane size="60">
          <div class="h-full flex flex-col p2">
            <div v-if="nodeActions.length" class="flex justify-end pb-1" border="b dashed base">
              <div class="flex items-center gap-2 px-1">
                <div v-for="(action, index) in nodeActions" :key="index" v-tooltip.bottom-end="{ content: action.tooltip }" class="flex items-center gap1" @click="callNodeAction(index)">
                  <i :class="`i-ic-baseline-${action.icon.replace(/\_/g, '-')}`" cursor-pointer op70 text-base hover:op100 />
                </div>
              </div>
            </div>
            <RootStateViewer v-if="selected && !emptyState" :data="state" :node-id="selected" :inspector-id="inspectorId" expanded-state-id="vee-validate-state" class="no-scrollbar flex-1 select-none overflow-scroll" />
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
