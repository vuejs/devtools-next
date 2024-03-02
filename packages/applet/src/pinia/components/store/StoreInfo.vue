<script setup lang="ts">
import StateViewer from '~/components/state/Viewer.vue'

import { createExpandedContext } from '~/composables/toggle-expanded'

const state: any = [
  {
    key: 'name',
    editable: false,
    type: 'string',
    display: 'routes',
  },
  {
    key: 'visible',
    editable: false,
    type: 'boolean',
    display: 'true',
  },
  {
    key: 'count',
    editable: false,
    type: 'literal',
    display: '1',
  },
  {
    key: 'from',
    editable: false,
    type: 'string',
    display: '/hello',
    children: [{
      key: 'from',
      editable: false,
      type: 'string',
      display: '/hello',
      children: [],
    }],
  },
  {
    key: 'to',
    editable: false,
    type: 'string',
    display: '/index',
    children: [{
      key: 'to',
      editable: false,
      type: 'string',
      display: '/hello',
      children: [],
    }],
  },
]

createExpandedContext()
</script>

<template>
  <div p3>
    <StateViewer :data="state" />
  </div>
</template>
