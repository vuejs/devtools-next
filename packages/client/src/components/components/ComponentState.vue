<script setup lang="ts">
import type { ComponentState } from '@vue-devtools-next/schema'

const props = defineProps<{
  data: ComponentState[]
  name: string
  id: string
}>()

const { isExpanded, toggleCollapse } = useCollapse('component-state', props.id)
// expand the root node by default
!isExpanded.value && toggleCollapse()
</script>

<template>
  <div class="selectable-item group w-full px-0" @click="toggleCollapse">
    <ExpandIcon :value="isExpanded" group-hover:text-white />
    <span text-primary-400 group-hover:text-white class="text-[#486887] dark:(text-[#7595b5])">
      {{ name }}
    </span>
  </div>
  <ComponentStateType v-if="isExpanded" :data="data" />
</template>
