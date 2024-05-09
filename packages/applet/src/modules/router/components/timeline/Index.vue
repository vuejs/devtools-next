<script setup lang="ts">
import Timeline from '~/components/timeline/index.vue'

const LAYER_ID = `router:navigations:0`
const DOC_LINK = 'https://router.vuejs.org/'
const REPO_LINK = 'https://github.com/vuejs/router'
</script>

<template>
  <Timeline :layer-id="LAYER_ID" :doc-link="DOC_LINK" :repo-link="REPO_LINK" />
</template>
