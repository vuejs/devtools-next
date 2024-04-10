<script setup lang="ts">
import { ref } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import type { InspectorNodeTag } from '@vue/devtools-kit'
import { getInspectorTree } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import ComponentTree from '~/components/tree/TreeViewer.vue'

const inspectorId = 'components'
const tree = ref<{ id: string, label: string, tags: InspectorNodeTag[] }[]>([])

const getPiniaInspectorTree = () => {
  getInspectorTree({ inspectorId, filter: '' }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    console.log('x', tree.value)
  })
}
getPiniaInspectorTree()
</script>

<template>
  <div class="h-full w-full">
    <Splitpanes class="flex-1 overflow-auto">
      <Pane border="r base" h-full>
        <div h-full select-none overflow-scroll p2 class="no-scrollbar">
          <ComponentTree />
        </div>
      </Pane>
      <Pane>
        <div h-full select-none overflow-scroll p2 class="no-scrollbar">
          state
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
