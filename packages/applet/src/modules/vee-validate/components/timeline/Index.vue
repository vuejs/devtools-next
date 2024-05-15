<script setup lang="ts">
import Timeline from '~/components/timeline/index.vue'

const LAYER_IDS = ['vee-validate-inspector']
</script>

<template>
  <Timeline :layer-ids="LAYER_IDS" doc-link="https://vee-validate.logaretm.com/v4/" github-repo-link="https://github.com/logaretm/vee-validate/" />
</template>
