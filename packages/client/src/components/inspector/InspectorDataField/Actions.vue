<script setup lang="ts">
import { VueButton, VueDropdown, VueDropdownButton, VueIcon } from '@vue-devtools-next/ui'
import type { InspectorState } from 'vue-devtools-kit'
import type { ButtonProps } from '@vue-devtools-next/ui/dist/types/src/components/Button'
import { getEditData, useEditState } from '../composable'

const props = defineProps<{
  data: InspectorState
  hovering: boolean
}>()

defineEmits<{
  'enableEditInput': []
}>()

const { type, nodeId } = getEditData()!

const { copy, isSupported } = useClipboard()

const popupVisible = ref(false)

const dataType = computed(() => {
  const v = props.data.value
  return typeof v
})

const { sendEdit } = useEditState(type)

const iconButtonProps = {
  flat: true,
  size: 'mini',
} satisfies ButtonProps

const buttonClass = computed(() => ({
  'opacity-0': !props.hovering,
}))

function quickEdit(v: unknown) {
  sendEdit({
    dotPath: props.data.key,
    dataType: props.data.stateType,
    data: {
      nodeId,
      newKey: null,
      value: v,
    },
  })
}
</script>

<template>
  <div class="inline pl5px">
    <!-- only editable will show operate actions -->
    <template v-if="data.editable">
      <!-- checkbox, button value only -->
      <VueButton
        v-if="dataType === 'boolean'" v-bind="iconButtonProps" :class="buttonClass"
        @click="quickEdit(!data.value)"
      >
        <template #icon>
          <VueIcon :icon="data.value ? 'i-material-symbols-check-box-sharp' : 'i-material-symbols-check-box-outline-blank-sharp'" />
        </template>
      </VueButton>
      <!-- increment/decrement button, numeric value only -->
      <template v-else-if="dataType === 'number'">
        <VueButton v-bind="iconButtonProps" :class="buttonClass" @click="quickEdit((data.value as number) + 1)">
          <template #icon>
            <VueIcon icon="i-carbon-add" />
          </template>
        </VueButton>
        <VueButton v-bind="iconButtonProps" :class="buttonClass" @click="quickEdit((data.value as number) - 1)">
          <template #icon>
            <VueIcon icon="i-carbon-subtract" />
          </template>
        </VueButton>
      </template>
      <template v-else-if="dataType === 'string'">
        <VueButton v-bind="iconButtonProps" :class="buttonClass" @click="$emit('enableEditInput')">
          <template #icon>
            <VueIcon icon="i-material-symbols-edit-rounded" />
          </template>
        </VueButton>
      </template>
    </template>
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
