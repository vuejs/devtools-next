<script setup lang="ts">
import {
  getInspectorState,
  getInspectorTree,
  onInspectorStateUpdated,
  onInspectorTreeUpdated,
  unhighlightElement,
} from '@vue/devtools-core'

// eslint-disable-next-line ts/no-import-type-side-effects
import { type InspectorNodeTag, type InspectorState } from '@vue/devtools-kit'
import { parse } from '@vue/devtools-kit'
import { Pane, Splitpanes } from 'splitpanes'

const INSPECTOR_ID = 'vue-i18n-resource-inspector'

const selected = ref('')
const tree = ref<{ id: string, label: string, tags: InspectorNodeTag[] }[]>([])
const state = ref<{
  inspectorId?: string
  state?: InspectorState[]
  getters?: InspectorState[]
}>({})

function getI18nState(nodeId: string) {
  getInspectorState({ inspectorId: INSPECTOR_ID, nodeId }).then((data) => {
    state.value = parse(data!)
  })
}

function clearI18nState() {
  state.value = {}
}

watch(selected, () => {
  clearI18nState()
  getI18nState(selected.value)
})

createCollapseContext('inspector-state')

onDevToolsClientConnected(() => {
  getInspectorTree({ inspectorId: INSPECTOR_ID, filter: '' }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    if (!selected.value && data.length) {
      selected.value = data[0].id
      getI18nState(data[0].id)
    }
  })

  onInspectorTreeUpdated((data) => {
    if (!data?.data.length)
      return
    tree.value = data.data as unknown as { id: string, label: string, tags: InspectorNodeTag[] }[]
    if (!selected.value && data.data.length) {
      selected.value = data.data[0].id
      getI18nState(data.data[0].id)
    }
  })

  onInspectorStateUpdated((data) => {
    if (!data || !data?.state?.length || data.inspectorId !== INSPECTOR_ID)
      return

    state.value = {
      state: data.state,
    }
  })
})

onUnmounted(() => {
  unhighlightElement()
})
</script>

<template>
  <div h-screen>
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
  </div>
</template>
