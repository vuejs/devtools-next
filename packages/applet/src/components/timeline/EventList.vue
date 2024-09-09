<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import type { TimelineEventOptions } from '@vue/devtools-kit'
import { formatTime } from '~/utils'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const props = defineProps<{
  data: Array<TimelineEventOptions['event'] & { color?: string, id?: number }>
}>()

const selected = defineModel()
const colors = ['#3e5770', '#42b983', '#0098c4']
const scrollerRef = ref<InstanceType<typeof RecycleScroller> | null>(null)

const normalizedData = computed(() => {
  let currentColorIndex = -1
  let currentGroupId = 0
  props.data.forEach((item, index) => {
    if (item.groupId !== currentGroupId || currentColorIndex === -1)
      currentColorIndex = (currentColorIndex + 1) % colors.length

    currentGroupId = item.groupId as number ?? currentGroupId

    item.id = index
    item.color = colors[currentColorIndex]
  })
  return props.data
})

watch(() => normalizedData.value.length, (length) => {
  scrollerRef.value?.scrollToItem(length - 1)
}, { flush: 'post' })
</script>

<template>
  <div class="p3">
    <RecycleScroller
      ref="scrollerRef"
      v-slot="{ item }"
      :items="normalizedData"
      :min-item-size="52"
      key-field="id"
      page-mode
      item-tag="li"
      list-tag="ul"
      :buffer="20"
    >
      <div class="relative mb7 h6 cursor-pointer" :style="{ color: selected === item.id ? item.color : '' }" @click="selected = item.id">
        <!-- head -->
        <span class="absolute top-1.5 inline-block h3 w3 b rounded-50%" :style="{ border: `3px solid ${item.color}` }" />
        <!-- line -->
        <span v-if="item.id < data.length - 1" class="absolute left-5px top-4.5 h10 w0 border-l-2" border="solid gray2" />
        <!-- content -->
        <p class="h-full flex items-center truncate pl5">
          <span absolute top-5 pr2 text-3 op40>[{{ formatTime(item.time) }}]</span>
          {{ item.title }}
          <span pl2 op30>{{ item.subtitle }}</span>
        </p>
      </div>
    </RecycleScroller>
  </div>
</template>
