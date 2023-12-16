<script setup lang="ts">
import { VueButton, VueDrawer, showVueNotification } from '@vue-devtools-next/ui'

defineProps<{
  top?: HTMLElement
}>()

const data = graphDrawerData
const show = graphDrawerShow
const filterId = graphFilterNodeId
const _openInEditor = openInEditor

const copiedDuring = 1500
const { copy: copyApi, isSupported, copied } = useClipboard({
  copiedDuring,
})

function copy(data: string) {
  copyApi(data)
  showVueNotification({
    message: 'Copied to clipboard',
    type: 'success',
    duration: copiedDuring,
  })
}

const keys = [
  ['refs', 'references'],
  ['deps', 'dependencies'],
] as const
</script>

<template>
  <VueDrawer
    v-model="show"
    :top="top"
    :close-outside="false"

    content-blur permanent
    mount-to=".graph-body"
  >
    <div class="w-300px" h-full of-auto>
      <div text-md h-80px border-b border-base p3 flex="~ col gap1">
        <span text-lg flex="~ gap2 items-center">
          {{ data?.name }}
          <span v-if="copied" i-material-symbols-check-small text-primary-500 />
          <span
            v-else-if="data"
            hover="op-100" i-carbon-copy cursor-pointer text-sm op-50 :class="{
              'text-gray-200': !isSupported,
            }" @click="copy(data.name)"
          />
        </span>
        <button hover="underline" truncate text-left text-gray-500 @click="_openInEditor(data!.path)">
          {{ data?.displayPath }}
        </button>
      </div>
      <div
        v-for="([key, keyDisplay]) in keys" :key="key"
        max-h-60 of-auto border-b border-base p3 text-sm
      >
        <div pb2 text-gray-500>
          <span text-primary-500>{{ data?.[key].length }}</span>
          {{ keyDisplay }}
        </div>
        <div flex="~ col gap2 items-start">
          <button
            v-for="item in data?.[key]" :key="item.path" dark="text-gray-200"
            of-hidden truncate ws-nowrap pr-3 text-gray-800 hover="underline" @click="_openInEditor(item.path)"
          >
            {{ item.displayPath }}
          </button>
        </div>
      </div>
      <div p3>
        <VueButton type="primary" @click="filterId = data!.path">
          Filter to this module
        </VueButton>
      </div>
    </div>
  </VueDrawer>
</template>
