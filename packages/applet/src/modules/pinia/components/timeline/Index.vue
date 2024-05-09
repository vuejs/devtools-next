<script setup lang="ts">
import Timeline from '~/components/timeline/index.vue'

const LAYER_ID = 'pinia:mutations'
const DOC_LINK = 'https://pinia.vuejs.org/'
const REPO_LINK = 'https://github.com/vuejs/pinia'
</script>

<template>
  <Timeline :layer-id="LAYER_ID" :doc-link="DOC_LINK" :repo-link="REPO_LINK" />
</template>
