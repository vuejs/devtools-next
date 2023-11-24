<script setup lang="ts">
import { VueButton, VueDrawer } from '@vue-devtools-next/ui'

defineProps<{
  top?: HTMLElement
}>()

const data = graphDrawerData
const show = graphDrawerShow
const filterId = graphFilterNodeId
const _openInEditor = openInEditor

const { copy, isSupported, copied } = useClipboard()

const keys = [
  ['refs', 'references'],
  ['deps', 'dependencies'],
] as const
</script>

<template>
  <VueDrawer v-model="show" :top="top" :close-outside="false" permanent content-blur>
    <div class="w-300px" h-full of-auto>
      <div border-b border-base h-80px text-md p3 flex="~ col gap1">
        <span text-lg flex="~ gap2 items-center">
          {{ data?.name }}
          <span v-if="copied" text-primary-500 i-material-symbols-check-small />
          <span
            v-else-if="data"
            i-carbon-copy text-sm op-50 hover="op-100" cursor-pointer :class="{
              'text-gray-200': !isSupported,
            }" @click="copy(data.name)"
          />
        </span>
        <button text-gray-500 truncate hover="underline" text-left @click="_openInEditor(data!.path)">
          {{ data?.path }}
        </button>
      </div>
      <div
        v-for="([key, keyDisplay]) in keys" :key="key"
        border-b max-h-60 of-auto border-base p3 text-sm
      >
        <div pb2 text-gray-500>
          <span text-primary-500>{{ data?.[key].length }}</span>
          {{ keyDisplay }}
        </div>
        <div flex="~ col gap2 items-start">
          <button
            v-for="item in data?.[key]" :key="item.path" text-gray-800 dark="text-gray-200"
            ws-nowrap of-hidden truncate pr-3 hover="underline" @click="_openInEditor(item.path)"
          >
            {{ item.displayPath }}
          </button>
        </div>
      </div>
      <div p3>
        <VueButton type="primary" @click="filterId = data!.fullPath">
          Filter to this module
        </VueButton>
      </div>
    </div>
  </VueDrawer>
</template>
