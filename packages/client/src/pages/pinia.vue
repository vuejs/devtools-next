<script setup lang="ts">
import { useDevToolsBridgeRpc } from '@vue/devtools-next-core'

// eslint-disable-next-line ts/no-import-type-side-effects
import { type InspectorNodeTag, type InspectorState } from '@vue/devtools-next-kit'
import { Pane, Splitpanes } from 'splitpanes'

const bridgeRpc = useDevToolsBridgeRpc()

const selected = ref('')
const tree = ref<{ id: string, label: string, tags: InspectorNodeTag[] }[]>([])
const state = ref<{
  inspectorId?: string
  state?: InspectorState[]
}>({})

function getPiniaState(nodeId: string) {
  bridgeRpc.getInspectorState({ inspectorId: 'pinia', nodeId }).then(({ data }) => {
    state.value = data
  })
}

watch(selected, () => {
  getPiniaState(selected.value)
})

createCollapseContext('inspector-state')

onDevToolsClientConnected(() => {
  bridgeRpc.getInspectorTree({ inspectorId: 'pinia', filter: '' }).then(({ data }) => {
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
    inspectorId: 'pinia',
  })

  bridgeRpc.on.inspectorStateUpdated((data) => {
    if (!data || !data.state.length)
      return

    state.value = data
  }, {
    inspectorId: 'pinia',
  })
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
        <div h-0 grow overflow-auto p-2 class="no-scrollbar">
          <InspectorState
            v-for="(item, key) in state" :id="key"
            :key="key + Date.now()"
            inspector-id="pinia"
            :node-id="selected" :data="item" :name="`${key}`"
          />
        </div>
      </Pane>
    </Splitpanes>
  </PanelGrids>
</template>
