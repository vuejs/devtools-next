<script setup lang="ts">
import type { ComponentState } from '@vue-devtools-next/schema'

defineProps<{
  data: ComponentState[]
  name: string
}>()
</script>

<template>
  <div class="selectable-item group w-full px-0">
    <ExpandIcon :value="true" group-hover:text-white />
    <span text-primary-400 group-hover:text-white class="text-[#486887] dark:(text-[#7595b5])">
      {{ name }}
    </span>
  </div>
  <ComponentStateType :data="data" />
</template>
