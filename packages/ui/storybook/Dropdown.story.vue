<script setup lang="ts">
import { ref } from 'vue'
import type { Placement } from 'floating-vue'
import { placements } from 'floating-vue'
import { VueIcon, VueInput } from '../src'
import Dropdown from '../src/components/Dropdown.vue'
import DropdownButton from '../src/components/DropdownButton.vue'

const input = ref('')
const placement = ref<Placement>('auto')
const disabled = ref(false)
</script>

<template>
  <Story>
    <template #controls>
      <HstSelect
        v-model="placement"
        title="Placement"
        :options="placements.reduce((acc, placement) => {
          // @ts-expect-error
          acc[placement] = placement
          return acc
        }, {})"
      />
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>
    <Variant title="Dropdown buttons">
      <Dropdown label="Dropdown" :disabled="disabled" :distance="5" :placement="placement">
        <div class="py5px w200px">
          <DropdownButton>
            Edit
          </DropdownButton>
        </div>
      </Dropdown>
    </Variant>
    <Variant title="Dropdown with input">
      <Dropdown label="Dropdown" :disabled="disabled" :distance="5" :placement="placement">
        <template #button-icon-right>
          <VueIcon icon="i-carbon-search" />
        </template>
        <div class="p10px">
          <VueInput v-model="input" left-icon="i-carbon-search" placeholder="Search things..." />
          <div class="mt5px">
            <DropdownButton v-for="content of 3" :key="content">
              Result {{ content }}
            </DropdownButton>
          </div>
        </div>
      </Dropdown>
    </Variant>
  </Story>
</template>
