<script setup lang="ts">
import { VueDropdown } from '@vue-devtools-next/ui'

const showDocking = ref(false)
const showMoreTabs = ref(false)
const panel = ref()
const buttonDocking = ref<HTMLButtonElement>()
const buttonMoreTabs = ref<HTMLButtonElement>()
const sidebarExpanded = ref(false)
const sidebarScrollable = ref(false)

// @TODO: dynamic tabs
const displayedTabs = categorizedTabs
</script>

<template>
  <div
    border="r base" flex="~ col"
    z-100 h-full items-start of-hidden bg-base
  >
    <div
      sticky top-0 z-1 w-full p1 bg-base border="b base"
    >
      <VueDropdown placement="left-start" :distance="6" :skidding="5" trigger="click" :shown="showDocking">
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
      </VueDropdown>
    </div>

    <div
      flex="~ auto col gap-0.5 items-center" w-full p1 class="no-scrollbar"
      :class="sidebarExpanded ? '' : 'of-x-hidden of-y-auto'"
    >
      <template v-for="[name, tabs], idx of displayedTabs" :key="name">
        <template v-if="tabs.length">
          <!-- if is not the first nonempty list, render the top divider -->
          <div v-if="idx && displayedTabs[0][1].length" my1 h-1px w-full border="b base" />
          <SideNavItem
            v-for="tab of tabs.filter(item => !item.hidden)"
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
