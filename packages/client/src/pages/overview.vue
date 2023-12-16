<script setup lang="ts">
import { isMacOS } from '@vue-devtools-next/shared'
import { useDevToolsBridgeRpc, useDevToolsState } from '@vue-devtools-next/core'
import type { ComponentTreeNode } from 'vue-devtools-kit'
import { VueButton } from '@vue-devtools-next/ui'

import { version } from '../../../core/package.json'

const bridgeRpc = useDevToolsBridgeRpc()

const { vueVersion } = useDevToolsState()
const pageCount = ref(1)
const componentCount = ref(0)

function normalizeComponentCount(data: ComponentTreeNode[]) {
  let count = 0
  for (const node of data) {
    count++
    if (node.children?.length)
      count += normalizeComponentCount(node.children)
  }
  return count
}

onDevToolsClientConnected(() => {
  // page count getter
  bridgeRpc.getRouterInfo().then(({ data }) => {
    pageCount.value = data?.routes?.length || 1
  })
  bridgeRpc.on.routerInfoUpdated((data) => {
    pageCount.value = data?.routes?.length || 1
  })

  // component count getter
  bridgeRpc.getInspectorTree<{ data: ComponentTreeNode[] }>({ inspectorId: 'components', filter: '' }).then(({ data }) => {
    componentCount.value = normalizeComponentCount(data)
  })
  bridgeRpc.on.inspectorTreeUpdated<{ data: ComponentTreeNode[], inspectorId: string }>((data) => {
    if (!data?.data?.length)
      return
    componentCount.value = normalizeComponentCount(data.data)
  }, {
    inspectorId: 'components',
  })
})
</script>

<template>
  <PanelGrids h-screen w-full flex of-auto>
    <div flex="~ col gap2" ma h-full max-w-300 w-full px20>
      <div flex-auto />

      <!-- Banner -->
      <div flex="~ col" mt-20 items-center>
        <div flex="~" mt--10 items-center justify-center>
          <DevToolsLogo h-18 />
        </div>
        <div mb6 mt--1 text-center text-sm flex="~ gap-1">
          <span op40>
            Vue DevTools
          </span>
          <code op40>v{{ version }}</code>
        </div>
      </div>

      <!-- Main Grid -->
      <div flex="~ gap2 wrap">
        <div p4 theme-card-green flex="~ col auto">
          <div i-logos-vue text-3xl />
          <code>v{{ vueVersion }}</code>
        </div>
        <RouterLink flex="~ col auto" to="/pages" replace min-w-40 p4 theme-card-lime>
          <div i-carbon-tree-view-alt text-3xl />
          <div>{{ pageCount }} pages</div>
        </RouterLink>
        <RouterLink v-if="componentCount" flex="~ col auto" to="/components" replace min-w-40 p4 theme-card-lime>
          <div i-carbon-assembly-cluster text-3xl />
          <div>{{ componentCount }} components</div>
        </RouterLink>
      </div>
      <div flex="~ gap-6 wrap" mt-5 items-center justify-center>
        <a href="https://github.com/vuejs/vue-devtools-next" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-blue" transition>
          <div i-carbon-star />
          Star on GitHub
        </a>
        <a href="https://github.com/vuejs/vue-devtools-next/discussions/1" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-yellow" transition>
          <div i-carbon-data-enrichment />
          Ideas & Suggestions
        </a>
        <a href="https://github.com/vuejs/vue-devtools-next/discussions/2" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-lime" transition>
          <div i-carbon-plan />
          Project Roadmap
        </a>
        <a href="https://github.com/vuejs/vue-devtools-next/issues" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-rose" transition>
          <div i-carbon-debug />
          Bug Reports
        </a>
        <RouterLink to="/settings" flex="~ gap1" replace inline-block items-center op50 hover:op80>
          <div i-carbon-settings />
          Settings
        </RouterLink>
      </div>
      <div flex-auto />
      <div flex="~ gap-1" cursor-default items-center justify-center pb-8 text-sm op40>
        Press
        <template v-if="isMacOS()">
          <VueButton>
            ⇧ Shift
          </VueButton>
          <span>+</span>
          <VueButton>
            ⌥ Option
          </VueButton>
          <span>+</span>
          <VueButton>
            D
          </VueButton>
        </template>
        <template v-else>
          <VueButton>
            Shift
          </VueButton>
          <span>+</span>
          <VueButton>
            Alt
          </VueButton>
          <span>+</span>
          <VueButton>
            D
          </VueButton>
        </template>
        to toggle DevTools
      </div>
    </div>
  </PanelGrids>
</template>
