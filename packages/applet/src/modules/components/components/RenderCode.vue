<script setup lang="ts">
import CodeBlock from '~/components/basic/CodeBlock.vue'

defineProps<{
  code: string
}>()

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<template>
  <div class="absolute left-0 top-0 h-full w-full flex flex-col bg-white p2 dark:bg-[#121212]">
    <div class="h-12 w-full flex items-center justify-between py-2">
      <span class="font-500">Render Code</span>
      <i class="i-carbon-close cursor-pointer hover:op80" @click="close" />
    </div>
    <div class="no-scrollbar flex-1 select-none overflow-scroll">
      <CodeBlock :code="code" lang="javascript" />
    </div>
  </div>
</template>
