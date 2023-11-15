<script setup lang="ts">
import type { ModuleBuiltinTab } from '~/types'

const showDocking = ref(false)
const showMoreTabs = ref(false)
const panel = ref()
const buttonDocking = ref<HTMLButtonElement>()
const buttonMoreTabs = ref<HTMLButtonElement>()
const sidebarExpanded = ref(false)
const sidebarScrollable = ref(false)

// @TODO: dynamic tabs
const displayedTabs: [string, ModuleBuiltinTab[]][] = [
  ['app', [
    {
      icon: 'i-carbon-information',
      name: 'overview',
      order: -100,
      path: 'overview',
      title: 'Overview',
    },
    {
      icon: 'i-carbon-tree-view-alt',
      name: 'pages',
      order: -100,
      path: 'pages',
      title: 'Pages',
    },
    {
      icon: 'i-carbon-assembly-cluster',
      name: 'components',
      order: -100,
      path: 'components',
      title: 'Components',
    },
    {
      icon: 'i-carbon-image-copy',
      name: 'assets',
      order: -100,
      path: 'assets',
      title: 'Assets',
    },
    {
      icon: 'i-icon-park-outline:vertical-timeline',
      name: 'timeline',
      order: -100,
      path: 'timeline',
      title: 'Timeline',
    },
  ]],
  ['modules', [
    {
      icon: 'i-ri-route-line',
      name: 'router',
      order: -100,
      path: 'router',
      title: 'Router',
    },
    {
      icon: 'i-icon-park-outline:pineapple',
      name: 'pinia',
      order: -100,
      path: 'pinia',
      title: 'Pinia',
    },
  ]],
  ['advanced', [
    {
      icon: 'i-carbon-network-4',
      name: 'graph',
      order: -100,
      path: 'graph',
      title: 'Graph',
    },
  ]],
]
</script>

<template>
  <div
    border="r base" flex="~ col"
    z-100 h-full items-start of-hidden bg-base
  >
    <div
      sticky top-0 z-1 w-full p1 bg-base border="b base"
    >
      <VDropdown
        placement="left-start"
        :distance="12"
        :skidding="5"
        :triggers="['click']"
        :shown="showDocking"
        :auto-hide="true"
      >
        <button
          ref="buttonDocking"
          flex="~ items-center justify-center gap-2"
          hover="bg-active"
          relative h-10 select-none p2 text-secondary
          exact-active-class="!text-primary bg-active"
          :class="[
            sidebarExpanded ? 'w-full rounded pl2.5' : 'w-10 rounded-xl',
          ]"
        >
          <div i-logos-vue h-6 w-6 />
          <template v-if="sidebarExpanded">
            <span text="lg white" font-600>
              DevTools
            </span>
            <div flex-auto />
            <div i-carbon-overflow-menu-vertical />
          </template>
        </button>
        <template #popper>
          DockingPanel
        </template>
      </VDropdown>
    </div>

    <div
      flex="~ auto col gap-0.5 items-center" w-full p1 class="no-scrollbar"
      :class="sidebarExpanded ? '' : 'of-x-hidden of-y-auto'"
    >
      <template v-for="[name, tabs], idx of displayedTabs" :key="name">
        <template v-if="tabs.length">
          <div v-if="idx" my1 h-1px w-full border="b base" />
          <SideNavItem
            v-for="tab of tabs"
            :key="tab.name"
            :tab="tab"
            :minimized="!sidebarExpanded"
          />
        </template>
      </template>
      <div flex-auto />
    </div>

    <div
      :flex="`~ items-center gap-1 ${sidebarExpanded ? '' : 'none col'}`"
      border="t base" sticky bottom-0 w-full p1 bg-base
    >
      <SideNavItem
        :minimized="!sidebarExpanded"
        :tab="{
          icon: 'i-carbon-settings-adjust',
          title: 'Settings',
          name: 'settings',
          path: '/settings',
        }"
      />
    </div>
  </div>
</template>
