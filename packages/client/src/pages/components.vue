<script setup lang="ts">
import { Components as ComponentsPanel } from '@vue/devtools-applet'
import '@vue/devtools-applet/style.css'

import { openInEditor } from '../composables/open-in-editor'
</script>

<template>
  <ComponentsPanel @open-in-editor="openInEditor" />
</template>
