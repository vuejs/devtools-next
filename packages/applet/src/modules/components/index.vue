<script setup lang="ts">
import { ref } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import type { ComponentTreeNode } from '@vue/devtools-kit'
import { getInspectorTree } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import ComponentTree from '~/components/tree/TreeViewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'
import { createSelectedContext } from '~/composables/select'

const inspectorId = 'components'
const tree = ref<ComponentTreeNode[]>([])

createExpandedContext()
createSelectedContext()

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
          <ComponentTree :data="tree" />
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
