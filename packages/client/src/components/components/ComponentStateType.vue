<script setup lang="ts">
withDefaults(defineProps<{
  data: {
    key: string
    value: string | number
    type: string
    children?: {
      key: string
      value: string | number
      type: string
    }[]
  }[]
  depth?: number
}>(), {
  depth: 0,
})

const isExpanded = ref<boolean>(false)

function toggleStateExpanded() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div v-for="(item, index) in data" :key="index" class="flex items-center" :style="{ paddingLeft: `${depth * 15 + 4}px` }">
    <template v-if="item.children">
      <div cursor-pointer>
        <div flex items-center @click="toggleStateExpanded">
          <ExpandIcon :value="isExpanded" group-hover:text-white />
          <span state-key>{{ item.key }}</span>
          <span mx-1>:</span>
          <span class="mt-[0.15rem] state-value">{{ item.value }}</span>
        </div>
        <div v-if="isExpanded">
          <ComponentStateType :data="item.children" :depth="depth + 1" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="pl-6">
        <span state-key>{{ item.key }}</span>
        <span mx-1>:</span>
        <span :class="`state-value-${item.type}`" class="mt-[0.15rem]">{{ item.value }}</span>
      </div>
    </template>
  </div>
</template>
