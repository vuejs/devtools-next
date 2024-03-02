<script setup lang="ts">
import { defineDevToolsAction, defineDevToolsListener } from '@vue/devtools-core'
import { Pinia } from '@vue/devtools-applet'
import '@vue/devtools-applet/style.css'

import type { InspectorNodeTag, InspectorState } from '@vue/devtools-kit'
import { parse } from '@vue/devtools-kit'

const inspectorId = 'pinia'

const selected = ref('')
const tree = ref<{ id: string, label: string, tags: InspectorNodeTag[] }[]>([])
const state = ref<{
  inspectorId?: string
  state?: InspectorState[]
  getters?: InspectorState[]
}>({})

const getInspectorTree = defineDevToolsAction('devtools:inspector-tree', (devtools, payload) => {
  return devtools.api.getInspectorTree(payload)
})

const getInspectorState = defineDevToolsAction('devtools:inspector-state', (devtools, payload) => {
  return devtools.api.getInspectorState(payload)
})

const onComponentUpdated = defineDevToolsListener((devtools, callback) => {
  devtools.api.on.componentUpdated(() => {
    callback()
  })
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

createCollapseContext('inspector-state')

onDevToolsClientConnected(() => {
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

  onComponentUpdated(() => {
    getPiniaInspectorTree()
  })

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
})
</script>

<template>
  <!-- <PanelGrids h-screen> -->
  <Pinia />
  <!-- </PanelGrids> -->
</template>
