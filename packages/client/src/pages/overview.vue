<script setup lang="ts">
import { isMacOS } from '@vue-devtools-next/shared'

// @TODO: chore ui style and import path
import { VueButton } from '../../../ui/src/index'
</script>

<template>
  <PanelGrids h-screen w-full flex of-auto>
    <div flex="~ col gap2" ma h-full max-w-300 w-full px20>
      <div flex-auto />

      <!-- Banner -->
      <div flex="~ col" mt-20 items-center>
        <div flex="~" mt--10 items-center justify-center>
          <DevToolsLogo h-18 />
          <button mr--16 mt--6>
            <Badge
              bg-green-400:10 text-green-400
              title="preview"
              v-text="'preview'"
            />
          </button>
        </div>
        <div mb6 mt--1 text-center text-sm flex="~ gap-1">
          <span op40>
            Vue DevTools
          </span>
          <code op40>v3.3.4</code>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div flex="~ gap2 wrap">
      <div p4 theme-card-green flex="~ col auto">
        <div i-logos-vue text-3xl />
        <code>v3.3.4</code>
      </div>
      <RouterLink flex="~ col auto" to="/pages" replace min-w-40 p4 theme-card-lime>
        <div i-carbon-tree-view-alt text-3xl />
        <div>100 pages</div>
      </RouterLink>
      <RouterLink flex="~ col auto" to="/components" replace min-w-40 p4 theme-card-lime>
        <div i-carbon-assembly-cluster text-3xl />
        <div>10 components</div>
      </RouterLink>
    </div>
    <div flex="~ gap-6 wrap" mt-5 items-center justify-center>
      <a href="https://github.com/webfansplz/vue-devtools-next" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-blue" transition>
        <div i-carbon-star />
        Star on GitHub
      </a>
      <a href="https://github.com/webfansplz/vue-devtools-next/discussions/1" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-yellow" transition>
        <div i-carbon-data-enrichment />
        Ideas & Suggestions
      </a>
      <a href="https://github.com/webfansplz/vue-devtools-next/discussions/2" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-lime" transition>
        <div i-carbon-plan />
        Project Roadmap
      </a>
      <a href="https://github.com/webfansplz/vue-devtools-next/issues" target="_blank" flex="~ gap1" items-center op50 hover="op100 text-rose" transition>
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
  </PanelGrids>
</template>
