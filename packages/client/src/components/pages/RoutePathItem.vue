<script setup lang="ts">
import { VueButton, VueDropdown, VueInput } from '@vue/devtools-ui'
import type { RouteRecordNormalized } from 'vue-router'

const props = defineProps<{
  route: RouteRecordNormalized
}>()

const emit = defineEmits<{
  (e: 'navigate', path: string): void
}>()

function parseExpressRoute(route: string) {
  return route.split(/(:\w+[?*+]?(?:\([^)]*\))?[?*+]?)/).filter(Boolean)
}

const partsInput = ref<string[]>([])
const parts = computed(() => {
  const _ = parseExpressRoute(props.route.path)
  return _
})

watchEffect(() => {
  partsInput.value = Array.from({ length: parts.value.length }, () => '')
})

const path = computed(() => parts.value.map((i, idx) => i[0] === ':' ? partsInput.value[idx] : i).join('').replace(/\/+/g, '/'))
const hasWildcard = computed(() => props.route.path.includes(':'))

function navigate() {
  emit('navigate', path.value)
}
</script>

<template>
  <button v-if="!hasWildcard" @click="navigate">
    <code>{{ route.path }}</code>
  </button>
  <VueDropdown v-else>
    <code block cursor-pointer>
      <span
        v-for="part, idx of parts" :key="idx"
        :class="part[0] === ':' ? 'text-gray border border-dashed rounded border-gray:50 px1' : ''"
      >
        {{ part[0] === ':' ? part.slice(1) : part }}
      </span>
    </code>
    <template #popper="{ hide }">
      <div p2>
        <form flex="~ col" @submit.prevent="() => { navigate(); hide() }">
          <template v-if="hasWildcard">
            <div px2 text-sm op50>
              Fill params and navigate:
            </div>
            <div flex="~" items-center p2 text-sm font-mono>
              <template v-for="part, idx of parts" :key="idx">
                <VueInput
                  v-if="part[0] === ':'"
                  v-model="partsInput[idx]"
                  n-sm w-20
                  :placeholder="part.slice(1)"
                />
                <span v-else>{{ part }}</span>
              </template>
            </div>
          </template>
          <VueButton block type="primary">
            Navigate
          </VueButton>
        </form>
      </div>
    </template>
  </VueDropdown>
</template>
