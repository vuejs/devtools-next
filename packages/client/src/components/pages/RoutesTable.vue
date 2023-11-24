<script setup lang="ts">
import { VueBadge } from '@vue-devtools-next/ui'
import type { RouteRecordNormalized } from 'vue-router'

const props = defineProps<{
  pages: RouteRecordNormalized[]
  matched: RouteRecordNormalized[]
  matchedPending: RouteRecordNormalized[]
}>()

defineEmits<{
  (e: 'navigate', path: string): void
}>()

const sorted = computed(() => {
  return [...props.pages].sort((a, b) => a.path.localeCompare(b.path))
})

// @TODO: open in editor
function openInEditor(name: string) {
}
</script>

<template>
  <div>
    <table w-full>
      <thead border="b base" px-3>
        <tr>
          <th text-left />
          <th text-left>
            Route Path
          </th>
          <th text-left>
            Name
          </th>
          <th text-left />
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of sorted" :key="item.name" class="group" h-7 border="b dashed transparent hover:base">
          <td w-20 pr-1>
            <div flex items-center justify-end>
              <VueBadge
                v-if="matched.find(m => m.name === item.name)"
                bg-green-400:10 text-green-400
                title="active"
                v-text="'active'"
              />
              <VueBadge
                v-else-if="matchedPending.find(m => m.name === item.name)"
                bg-teal-400:10 text-teal-400
                title="next"
                v-text="'next'"
              />
            </div>
          </td>
          <td text-sm>
            <div flex="inline gap3" items-center>
              <RoutePathItem
                :route="item"
                :class="matched.find(m => m.name === item.name) ? 'text-primary-400' : matchedPending.find(m => m.name === item.name) ? 'text-teal' : ''"
                @navigate="path => $emit('navigate', path)"
              />
              <div op0 group-hover:op100 flex="~ gap1">
                <button
                  v-if="item.file || item.meta?.file"
                  text-sm op40 hover="op100 text-primary-400"
                  title="Open in editor"
                  @click="openInEditor((item.file || item.meta?.file) as string)"
                >
                  <div i-carbon-script-reference />
                </button>
              </div>
            </div>
          </td>
          <td w-0 ws-nowrap pr-1 text-left text-sm font-mono op50>
            {{ item.name }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
