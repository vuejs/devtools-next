<script setup lang="ts">
import { defineProps } from 'vue'
import { useVirtualRouter } from '~/composables/virtual-router'

defineProps<{
  githubRepoLink: string
  docLink: string
}>()
const router = useVirtualRouter()
</script>

<template>
  <div border="b base" class="h10 flex items-center justify-between px-2">
    <i class="i-ep:back cursor-pointer op70 text-base hover:op100" @click="router.push('/')" />
    <div>
      <a class="pr1" :href="docLink" target="_blank">
        <i class="i-clarity:document-line cursor-pointer op70 text-base hover:op100" />
      </a>
      <a :href="githubRepoLink" target="_blank">
        <i class="i-mdi:github cursor-pointer op70 text-base hover:op100" />
      </a>
    </div>
  </div>
</template>
