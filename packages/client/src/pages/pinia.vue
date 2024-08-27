<script setup lang="ts">
import { Pinia as PiniaPanel } from '@vue/devtools-applet'
import { useDefaultSelect } from '../composables/select'
import '@vue/devtools-applet/style.css'

const { saveSelectedId, savedSelectedId } = useDefaultSelect()
</script>

<template>
  <PiniaPanel
    :saved-selected-id="savedSelectedId"
    @on-select-id="saveSelectedId"
  />
</template>
