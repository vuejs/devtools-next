<script setup lang="ts">
import { useDevToolsBridgeRpc } from '@vue-devtools-next/core'

// eslint-disable-next-line ts/consistent-type-imports
import type { InspectorState } from 'vue-devtools-kit'
import { Pane, Splitpanes } from 'splitpanes'

const bridgeRpc = useDevToolsBridgeRpc()

const selected = ref('')
const tree = ref<{ id: string, label: string }[]>([])
const state = ref<{
  inspectorId?: string
  state?: InspectorState[]
}>({})
createCollapseContext('inspector-state')

function getRouterState(nodeId: string) {
  // @TODO: should to support multiple router instances ?
  bridgeRpc.getInspectorState({ inspectorId: 'router-inspector:0', nodeId }).then(({ data }) => {
    state.value = data
  })
}

watch(selected, () => {
  getRouterState(selected.value)
})

onDevToolsClientConnected(() => {
  bridgeRpc.getInspectorTree({ inspectorId: 'router-inspector:0', filter: '' }).then(({ data }) => {
    tree.value = data
    if (!selected.value && data.length) {
      selected.value = data[0].id
      getRouterState(data[0].id)
    }
  })

  bridgeRpc.on.inspectorTreeUpdated((data) => {
    if (!data?.data?.length)
      return
    tree.value = data.data
    if (!selected.value && data.data.length) {
      selected.value = data.data[0].id
      getRouterState(data.data[0].id)
    }
  }, {
    inspectorId: 'router-inspector:0',
  })

  bridgeRpc.on.inspectorStateUpdated((data) => {
    if (!data || !data.state || data.inspectorId !== 'router-inspector:0')
      return

    state.value = data
  }, {
    inspectorId: 'router-inspector:0',
  })
})
</script>

<template>
  <div h-screen>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <InspectorTree v-for="(item) in tree" :key="item.id" v-model="selected" :data="item" />
        </div>
      </Pane>
      <Pane flex flex-col overflow-y-scroll class="no-scrollbar">
        <div p-2>
          <InspectorState
            v-for="(item, key) in state" :id="key"
            :key="key + Date.now()" :data="item" :name="`${key}`"
            inspector-id="router"
          />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
