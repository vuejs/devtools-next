<script setup lang="ts">
import { Components as ComponentsPanel } from '@vue/devtools-applet'
import '@vue/devtools-applet/style.css'
import { rpc } from '@vue/devtools-core'
import { openInEditor } from '../composables/open-in-editor'
import { useDefaultSelect } from '../composables/select'

function onInspectComponentStart() {
  rpc.value.emit('toggle-panel', false)
}

function onInspectComponentEnd() {
  rpc.value.emit('toggle-panel', true)
}

const { saveSelectedId, savedSelectedId } = useDefaultSelect()
</script>

<template>
  <ComponentsPanel
    :saved-selected-id="savedSelectedId"
    @open-in-editor="openInEditor"
    @on-inspect-component-start="onInspectComponentStart"
    @on-inspect-component-end="onInspectComponentEnd"
    @on-select-id="saveSelectedId"
  />
</template>
