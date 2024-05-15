<script setup lang="ts">
import Timeline from '~/components/timeline/index.vue'

const LAYER_IDS = ['vuex:mutations', 'vuex:actions']
</script>

<template>
  <Timeline :layer-ids="LAYER_IDS" doc-link="https://vuex.vuejs.org/" github-repo-link="https://github.com/vuejs/vuex" />
</template>
