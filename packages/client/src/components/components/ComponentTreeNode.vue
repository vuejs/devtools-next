<script setup lang="ts">
withDefaults(defineProps<{
  data: {
    name: string
    children?: {
      name: string
    }[]
  }
  depth?: number
}>(), {
  depth: 0,
})
</script>

<template>
  <div
    class="selectable-item [&.active>span]:(text-white) group"
    :style="{ paddingLeft: `${depth * 15 + 4}px` }"
  >
    <!-- expand-icon -->
    <ExpandIcon v-if="data.children" :value="false" />
    <i v-else inline-block h-6 w-6 />
    <!-- component name -->
    <span text-primary-400 group-hover:text-white>
      {{ data.name }}
    </span>
  </div>
  <template v-if="data.children">
    <ComponentTreeNode v-for="(item, index) in data.children" :key="index" :data="item" :depth="depth + 1" />
  </template>
</template>
