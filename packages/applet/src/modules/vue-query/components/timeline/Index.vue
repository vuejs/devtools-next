<script setup lang="ts">
import Timeline from '~/components/timeline/index.vue'

const LAYER_IDS = ['vue-query']
</script>

<template>
  <Timeline :layer-ids="LAYER_IDS" doc-link="https://tanstack.com/query/latest/docs/framework/vue/overview/" github-repo-link="https://github.com/TanStack/query/tree/main/packages/vue-query/" />
</template>
