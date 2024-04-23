<script setup lang="ts">
import { Components as ComponentsPanel } from '@vue/devtools-applet'
import '@vue/devtools-applet/style.css'
import { useDevToolsBridge } from '@vue/devtools-core'
import { openInEditor } from '../composables/open-in-editor'

const bridge = useDevToolsBridge()
function onInspectComponentStart() {
  bridge.value.emit('toggle-panel', false)
}

function onInspectComponentEnd() {
  bridge.value.emit('toggle-panel', true)
}
</script>

<template>
  <ComponentsPanel
    @open-in-editor="openInEditor"
    @on-inspect-component-start="onInspectComponentStart"
    @on-inspect-component-end="onInspectComponentEnd"
  />
</template>
