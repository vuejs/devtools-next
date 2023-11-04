<script setup lang="ts">
import { VueButton, VueDropdown, VueDropdownButton, VueIcon } from '@vue-devtools-next/ui'
import type { InspectorState } from 'vue-devtools-kit'
import { getEditType, useEditState } from '../composable'

const props = defineProps<{
  data: InspectorState
  hovering: boolean
}>()

const type = getEditType()!

const { copy, isSupported } = useClipboard()

const popupVisible = ref(false)

const isBoolean = computed(() => typeof props.data.value === 'boolean')

const { sendEdit } = useEditState(type)
</script>

<template>
  <div class="inline pl5px">
    <!-- Checkbox(Boolean value only) -->
    <VueButton
      v-if="isBoolean" :class="{
        'opacity-0!': !hovering,
      }" size="mini" flat
      @click="sendEdit({
        dotPath: data.key,
        instanceId: '',
        dataType: data.stateType,
        data: {
          newKey: null,
          value: !data.value,
        },
      })"
    >
      <template #icon>
        <VueIcon :icon="data.value ? 'i-material-symbols-check-box-sharp' : 'i-material-symbols-check-box-outline-blank-sharp'" />
      </template>
    </VueButton>
    <!-- Copy key/value -->
    <VueDropdown
      :class="{
        'opacity-0': !hovering && !popupVisible,
      }"
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
