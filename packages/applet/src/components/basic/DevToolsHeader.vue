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
  <div border="b base" class="h10 h40px flex items-center justify-between px3">
    <div>
      <slot>
        <i class="i-ep:back cursor-pointer op70 text-base hover:op100" @click="router.push('/')" />
      </slot>
    </div>
    <div>
      <div class="flex gap2">
        <a class="pr2" :href="docLink" target="_blank">
          <i class="i-clarity:document-line cursor-pointer op70 text-base hover:op100" />
        </a>
        <a :href="githubRepoLink" target="_blank">
          <i class="i-mdi:github cursor-pointer op70 text-base hover:op100" />
        </a>
      </div>
    </div>
  </div>
</template>
