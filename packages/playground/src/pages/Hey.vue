<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div>
    Hey: {{ route.params.id }}
  </div>
</template>
