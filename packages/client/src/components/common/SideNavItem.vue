<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { toValue } from '@vueuse/core'
import { VueTooltip } from '@vue/devtools-next-ui'
import type { ModuleBuiltinTab } from '~/types'

const props = withDefaults(
  defineProps<{
    tab: ModuleBuiltinTab
    minimized?: boolean
    target?: 'main' | 'side'
  }>(),
  {
    minimized: true,
    target: 'main',
  },
)
const route = useRoute()

const tabPath = computed(() => 'path' in props.tab ? (`${props.tab.path.startsWith('/') ? `` : `/`}${props.tab.path!}`) : `/custom-tab-view/${(props.tab as ModuleBuiltinTab).name}`)
const badge = computed(() => 'badge' in props.tab && props.tab.badge?.())
const isActive = computed(() => route.path.startsWith(tabPath.value))

function onClick() {
  if ('onClick' in props.tab && props.tab.onClick)
    props.tab.onClick()
  else if (props.target === 'side')
    devtoolsClientState.value.splitScreen.view = props.tab.name
}
</script>

<template>
  <VueTooltip :disabled="!minimized" placement="right" :class="{ 'w-full': !minimized }">
    <component
      :is="target === 'main' ? RouterLink : 'button'"
      :to="tabPath"
      :flex="`~ items-center ${minimized ? 'justify-center' : 'justify-between'}`"
      hover="bg-active op-100"

      :w="minimized ? '10' : 'full'"
      :rounded="minimized ? 'xl' : ''"
      :p="minimized ? '1' : 'x3'" text-secondary relative block h-10 select-none op65
      exact-active-class="!text-primary-600 bg-active op-100!"
      @click="onClick"
    >
      <div flex="~ items-center gap-3">
        <TabIcon
          text-xl
          :icon="tab.icon"
          title="Settings"
          :show-title="false"
        />
        <span v-if="!minimized" text-md overflow-hidden text-ellipsis ws-nowrap>
          {{ tab.title }}
        </span>
      </div>
      <div
        v-if="badge"
        h-4 w-4 rounded-full text-9px text-white flex="~ items-center justify-center"
        :class="[isActive ? 'bg-primary-600' : 'bg-gray', { 'absolute bottom-0 right-0': minimized }]"
      >
        <span translate-y-0.5px>{{ toValue(badge) }}</span>
      </div>
    </component>
    <template #popper>
      <div>
        {{ tab.title }}
      </div>
      <div v-if="'extraTabVNode' in tab && tab.extraTabVNode" hidden lg:block>
        <Component :is="tab.extraTabVNode" />
      </div>
    </template>
  </VueTooltip>
</template>
