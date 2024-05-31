<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import { DevToolsMessagingEvents, rpc } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import type { CustomInspectorNode, CustomInspectorState } from '@vue/devtools-kit'
import Navbar from '~/components/basic/Navbar.vue'
import SelectiveList from '~/components/basic/SelectiveList.vue'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'
import Empty from '~/components/basic/Empty.vue'
import RootStateViewer from '~/components/state/RootStateViewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'
import { useDevToolsState } from '~/composables/devtools-state'

const { expanded: expandedStateNodes } = createExpandedContext('routes-state')

const devtoolsState = useDevToolsState()

const inspectorId = computed(() => {
  const item = devtoolsState.appRecords.value.find(app => app.id === devtoolsState.activeAppRecordId.value)
  return `router-inspector:${item?.routerId ?? 0}`
})

const selected = ref('')
const tree = ref<CustomInspectorNode[]>([])
const state = ref<CustomInspectorState>({})

function filterEmptyState(data: Record<string, unknown[] | string | undefined>) {
  for (const key in data) {
    if (!data[key]?.length)
      delete data[key]
  }
  return data
}

function getRoutesState(nodeId: string) {
  rpc.value.getInspectorState({ inspectorId: inspectorId.value, nodeId }).then(([data]) => {
    // @ts-expect-error skip type check
    state.value = filterEmptyState(parse(data!))
    expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
  })
}

function clearRoutesState() {
  state.value = {}
}

watch(selected, () => {
  clearRoutesState()
  getRoutesState(selected.value)
})

const getRoutesInspectorTree = () => {
  rpc.value.getInspectorTree({ inspectorId: inspectorId.value, filter: '' }).then(([_data]) => {
    const data = parse(_data!)
    tree.value = data
    if (!selected.value && data.length)
      selected.value = data[0].id
    getRoutesState(data[0].id)
  })
}
getRoutesInspectorTree()

rpc.functions.on(DevToolsMessagingEvents.INSPECTOR_TREE_UPDATED, (_data: string) => {
  const data = parse(_data) as {
    inspectorId: string
    rootNodes: CustomInspectorNode[]
  }
  if (data.inspectorId !== inspectorId.value || !data.rootNodes.length)
    return
  tree.value = data.rootNodes as unknown as CustomInspectorNode[]
  if (!selected.value && data.rootNodes.length) {
    selected.value = data.rootNodes[0].id
    getRoutesState(data.rootNodes[0].id)
  }
})

rpc.functions.on(DevToolsMessagingEvents.INSPECTOR_STATE_UPDATED, (_data: string) => {
  const data = parse(_data) as {
    inspectorId: string
    state: CustomInspectorState
    nodeId: string
  }

  if (data.inspectorId !== inspectorId.value)
    return

  const _state = data.state

  // @ts-expect-error skip type check
  state.value = filterEmptyState({
    state: _state.state,
    getters: _state.getters,
  })
  expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
})

rpc.functions.on(DevToolsMessagingEvents.INSPECTOR_STATE_UPDATED, (_data: string) => {
  const data = parse(_data) as {
    inspectorId: string
    state: CustomInspectorState
    nodeId: string
  }

  if (data.inspectorId !== inspectorId.value)
    return

  const _state = data.state

  // @ts-expect-error skip type check
  state.value = filterEmptyState(_state!)
  expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <DevToolsHeader doc-link="https://router.vuejs.org/" github-repo-link="https://github.com/vuejs/router">
      <Navbar />
    </DevToolsHeader>
    <Splitpanes class="flex-1 overflow-auto">
      <Pane border="r base" size="40" h-full>
        <div h-full select-none overflow-scroll class="no-scrollbar">
          <SelectiveList v-model="selected" :data="tree" />
        </div>
      </Pane>
      <Pane size="60">
        <div h-full select-none overflow-scroll class="no-scrollbar">
          <!-- @vue-expect-error -->
          <RootStateViewer v-if="selected" class="p3" :data="state" node-id="" inspector-id="router" expanded-state-id="routes-state" />
          <Empty v-else>
            No Data
          </Empty>
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
