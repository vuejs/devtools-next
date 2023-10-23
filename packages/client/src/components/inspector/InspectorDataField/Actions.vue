<script setup lang="ts">
import { VueDropdown, VueDropdownButton, VueIcon } from '@vue-devtools-next/ui'
import type { InspectorState } from '@vue-devtools-next/schema'

defineProps<{
  data: InspectorState
  hovering: boolean
}>()

const { copy, isSupported } = useClipboard()

const popupVisible = ref(false)
</script>

<template>
  <div v-if="hovering || popupVisible" class="inline">
    <VueDropdown
      :button-props="{
        flat: true,
        size: 'mini',
      }"
      :disabled="!isSupported"
      @update:visible="v => popupVisible = v"
    >
      <div class="py5px w160px">
        <VueDropdownButton
          @click="() => {
            copy(data.value.toString())
          }"
        >
          <template #icon>
            <VueIcon icon="i-material-symbols-copy-all-rounded" class="mt4px" />
            Copy Value
          </template>
        </VueDropdownButton>
        <VueDropdownButton
          @click="() => {
            copy(data.key)
          }"
        >
          <template #icon>
            <VueIcon icon="i-material-symbols-copy-all-rounded" class="mt4px" />
            Copy Path
          </template>
        </VueDropdownButton>
      </div>
      <template #button-icon>
        <VueIcon icon="i-material-symbols:more-vert" />
      </template>
    </VueDropdown>
  </div>
</template>
