<script setup lang="ts">
import Timeline from '~/components/timeline/index.vue'

const LAYER_IDS = ['pinia:mutations']
</script>

<template>
  <Timeline :layer-ids="LAYER_IDS" doc-link="https://pinia.vuejs.org/" github-repo-link="https://github.com/vuejs/pinia" />
</template>
