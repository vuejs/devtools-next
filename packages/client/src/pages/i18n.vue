<script setup lang="ts">
import { useDevToolsBridgeRpc } from '@vue/devtools-core'

// eslint-disable-next-line ts/no-import-type-side-effects
import { type InspectorNodeTag, type InspectorState } from '@vue/devtools-kit'
import { Pane, Splitpanes } from 'splitpanes'

const bridgeRpc = useDevToolsBridgeRpc()
const INSPECTOR_ID = 'vue-i18n-resource-inspector'

const selected = ref('')
const tree = ref<{ id: string, label: string, tags: InspectorNodeTag[] }[]>([])
const state = ref<{
  inspectorId?: string
  state?: InspectorState[]
  getters?: InspectorState[]
}>({})

function getPiniaState(nodeId: string) {
  bridgeRpc.getInspectorState({ inspectorId: INSPECTOR_ID, nodeId }).then(({ data }) => {
    state.value = data
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
  bridgeRpc.getInspectorTree({ inspectorId: INSPECTOR_ID, filter: '' }).then(({ data }) => {
    tree.value = data
    if (!selected.value && data.length) {
      selected.value = data[0].id
      getPiniaState(data[0].id)
    }
  })

  bridgeRpc.on.inspectorTreeUpdated((data) => {
    if (!data?.data.length)
      return
    tree.value = data.data
    if (!selected.value && data.data.length) {
      selected.value = data.data[0].id
      getPiniaState(data.data[0].id)
    }
  }, {
    inspectorId: INSPECTOR_ID,
  })

  bridgeRpc.on.inspectorStateUpdated((data) => {
    if (!data || !data.state.length)
      return

    state.value = data
  }, {
    inspectorId: INSPECTOR_ID,
  })
})

onUnmounted(() => {
  bridgeRpc.unhighlightElement()
})
</script>

<template>
  <PanelGrids h-screen>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <InspectorTree v-model="selected" :data="tree" />
        </div>
      </Pane>
      <Pane flex flex-col>
        <div :key="selected" h-0 grow overflow-auto p-2 class="no-scrollbar">
          <InspectorState
            v-for="(item, key) in state" :id="key"
            :key="key"
            :inspector-id="INSPECTOR_ID"
            :node-id="selected" :data="item" :name="`${key}`"
          />
        </div>
      </Pane>
    </Splitpanes>
  </PanelGrids>
</template>
