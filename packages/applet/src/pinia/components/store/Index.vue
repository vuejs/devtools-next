<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import { defineDevToolsAction, defineDevToolsListener } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import type { InspectorNodeTag, InspectorState } from '@vue/devtools-kit'
import SelectiveList from '~/components/basic/SelectiveList.vue'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'
import Empty from '~/components/basic/Empty.vue'
import RootStateViewer from '~/components/state/RootStateViewer.vue'

const inspectorId = 'pinia'

const selected = ref('')
const tree = ref<{ id: string, label: string, tags: InspectorNodeTag[] }[]>([])
const state = ref<{
  state?: InspectorState[]
  getters?: InspectorState[]
}>({})

const emptyState = computed(() => !state.value.state?.length && !state.value.getters?.length)

const getInspectorTree = defineDevToolsAction('devtools:inspector-tree', (devtools, payload) => {
  return devtools.api.getInspectorTree(payload)
})

const getInspectorState = defineDevToolsAction('devtools:inspector-state', (devtools, payload) => {
  return devtools.api.getInspectorState(payload)
})

const onInspectorTreeUpdated = defineDevToolsListener<string>((devtools, callback) => {
  devtools.api.on.sendInspectorTree((payload) => {
    callback(payload)
  })
})

const onInspectorStateUpdated = defineDevToolsListener<string>((devtools, callback) => {
  devtools.api.on.sendInspectorState((payload) => {
    callback(payload)
  })
})

function getPiniaState(nodeId: string) {
  getInspectorState({ inspectorId, nodeId }).then((data) => {
    state.value = parse(data)
  })
}

function clearPiniaState() {
  state.value = {}
}

watch(selected, () => {
  clearPiniaState()
  getPiniaState(selected.value)
})

const getPiniaInspectorTree = () => {
  getInspectorTree({ inspectorId, filter: '' }).then((_data) => {
    const data = parse(_data)
    tree.value = data
    if (!selected.value && data.length)
      selected.value = data[0].id
    getPiniaState(data[0].id)
  })
}
getPiniaInspectorTree()

onInspectorTreeUpdated((_data) => {
  const data = parse(_data)
  if (!data?.data.length || data.inspectorId !== inspectorId)
    return
  tree.value = data.data
  if (!selected.value && data.data.length) {
    selected.value = data.data[0].id
    getPiniaState(data.data[0].id)
  }
})

onInspectorStateUpdated((_data) => {
  const data = parse(_data)
  if (!data || !data?.state?.length || data.inspectorId !== inspectorId)
    return

  state.value = {
    state: data.state,
    getters: data.getters,
  }
})
</script>

<template>
  <div class="h-full flex flex-col">
    <DevToolsHeader doc-link="https://pinia.vuejs.org/" github-repo-link="https://github.com/vuejs/pinia" />
    <Splitpanes class="flex-1">
      <Pane border="r base" size="40" h-full>
        <div h-full select-none overflow-scroll class="no-scrollbar">
          <SelectiveList v-model="selected" :data="tree" />
        </div>
      </Pane>
      <Pane size="60">
        <div h-full select-none overflow-scroll class="no-scrollbar">
          <RootStateViewer v-if="selected && !emptyState" class="p3" :data="state" :node-id="selected" :inspector-id="inspectorId" />
          <Empty v-else>
            No Data
          </Empty>
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
