<script setup lang="ts">
import Timeline from '~/components/timeline/index.vue'

const LAYER_IDS = ['router:navigations:0']
</script>

<template>
  <Timeline :layer-ids="LAYER_IDS" doc-link="https://router.vuejs.org/" github-repo-link="https://github.com/vuejs/router" />
</template>
