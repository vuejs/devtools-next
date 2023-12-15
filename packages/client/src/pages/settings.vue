<script setup lang="ts">
import { VueButton, VueCard, VueCheckbox, VueConfirm, VueDarkToggle, VueSwitch } from '@vue-devtools-next/ui'
import { isInChromePanel } from '@vue-devtools-next/shared'

// #region view mode
const viewMode = inject<Ref<'overlay' | 'panel'>>('viewMode', ref('overlay'))
const viewModeSwitchVisible = computed(() => viewMode.value === 'panel' && isInChromePanel)
const { toggle: toggleViewMode } = useToggleViewMode()
// #endregion

const { categorizedTabs: categories } = useAllTabs()

const { hiddenTabCategories, hiddenTabs, pinnedTabs } = toRefs(devtoolsClientState.value.tabSettings)
const expandSidebar = computed({
  get: () => devtoolsClientState.value.expandSidebar,
  set: v => (devtoolsClientState.value.expandSidebar = v),
})

function toggleTab(name: string, v: boolean) {
  if (v)
    hiddenTabs.value = hiddenTabs.value.filter(i => i !== name)
  else
    hiddenTabs.value.push(name)
}

function toggleTabCategory(name: string, v: boolean) {
  if (v)
    hiddenTabCategories.value = hiddenTabCategories.value.filter(i => i !== name)
  else
    hiddenTabCategories.value.push(name)
}

function togglePinTab(name: string) {
  if (pinnedTabs.value.includes(name))
    pinnedTabs.value = pinnedTabs.value.filter(i => i !== name)
  else
    pinnedTabs.value.push(name)
}

function pinMove(name: string, delta: number) {
  const index = pinnedTabs.value.indexOf(name)
  if (index === -1)
    return

  const newIndex = index + delta
  if (newIndex < 0 || newIndex >= pinnedTabs.value.length)
    return

  const newPinnedTabs = [...pinnedTabs.value]
  newPinnedTabs.splice(index, 1)
  newPinnedTabs.splice(newIndex, 0, name)
  pinnedTabs.value = newPinnedTabs
}

const clearOptionsConfirmState = ref(false)
async function clearOptions() {
  resetDevtoolsClientState()
  window.location.reload()
}
</script>

<template>
  <div px8 py6 of-auto w-full h-full>
    <IconTitle
      class="mb-5 text-xl op75"
      icon="i-carbon-settings-adjust"
      text="DevTools Settings"
    />
    <div grid="~ md:cols-2 gap-x-10 gap-y-3" max-w-300>
      <div flex="~ col gap-2">
        <h3 text-lg>
          Tabs
        </h3>
        <template v-for="[{ name, hidden }, tabs] of categories" :key="name">
          <VueCard
            v-if="tabs.length" p3 flex="~ col gap-1"
            :class="hidden ? 'op50 grayscale' : ''"
          >
            <VueSwitch
              :model-value="!hiddenTabCategories.includes(name)"
              class="flex row-reverse py1 pl2 pr1 hover:bg-active"
              @update:model-value="(v: boolean) => toggleTabCategory(name, v)"
            >
              <div flex="~ gap-2" flex-auto items-center justify-start>
                <span capitalize op75>{{ name }}</span>
              </div>
            </VueSwitch>

            <div mx--1 my1 h-1px border="b base" op75 />

            <template v-for="tab of tabs" :key="tab.name">
              <VueSwitch
                class="flex row-reverse py1 pl2 pr1 n-primary hover:bg-active"
                :model-value="!hiddenTabs.includes(tab.name)"
                :class="tab.hidden ? 'op35' : ''"
                @update:model-value="(v: boolean) => toggleTab(tab.name, v)"
              >
                <div flex="~ gap-2" text-sm flex-auto items-center justify-start pr-4>
                  <TabIcon text-xl :icon="tab.icon" :title="tab.title" />
                  <span>{{ tab.title }}</span>
                  <div flex-auto />
                  <template v-if="pinnedTabs.includes(tab.name)">
                    <button
                      class="px1 py1 text-sm hover:(bg-active op100) flex items-center op65"
                      @click.stop="() => {
                        if (pinnedTabs.indexOf(tab.name) === 0) return
                        pinMove(tab.name, -1)
                      }"
                    >
                      <div class="i-carbon-caret-up" />
                    </button>
                    <button
                      class="px1 py1 text-sm hover:(bg-active op100) flex items-center op65"
                      @click.stop="() => {
                        if (pinnedTabs.indexOf(tab.name) === pinnedTabs.length - 1) return
                        pinMove(tab.name, 1)
                      }"
                    >
                      <div class="i-carbon-caret-down" />
                    </button>
                  </template>
                  <button class="px1 py1 text-sm hover:(bg-active op100) flex items-center op65" @click.stop="togglePinTab(tab.name)">
                    <div :class="pinnedTabs.includes(tab.name) ? ' i-carbon-pin-filled rotate--45' : ' i-carbon-pin op45'" />
                  </button>
                </div>
              </VueSwitch>
            </template>
          </VueCard>
        </template>
      </div>
      <div flex="~ col gap-2">
        <h3 text-lg>
          Appearance
        </h3>
        <VueCard p4 flex="~ col gap-2">
          <div flex="~ gap2">
            <VueDarkToggle v-slot="{ isDark, toggle }">
              <VueButton outlined type="primary" @click="toggle">
                <div i-carbon-sun dark:i-carbon-moon translate-y--1px /> {{ isDark ? 'Dark' : 'Light' }}
              </VueButton>
            </VueDarkToggle>
            <VueButton v-if="viewModeSwitchVisible" outlined type="primary" @click="toggleViewMode('overlay')">
              Switch to Overlay Mode
            </VueButton>
          </div>
          <div mx--2 my1 h-1px border="b base" op75 />
          <div class="flex items-center gap2 text-sm">
            <VueCheckbox v-model="expandSidebar" />
            <span op75>Expand Sidebar</span>
          </div>
        </VueCard>
        <h3 mt2 text-lg>
          Debug
        </h3>
        <div flex="~ gap-2">
          <VueButton outlined type="warning" @click="clearOptionsConfirmState = true">
            <div i-carbon-breaking-change />
            Reset Local Settings & State
          </VueButton>
          <VueConfirm
            v-model="clearOptionsConfirmState"
            title="Clear Local Settings & State"
            width="40%"
            height="200px"
            content="Are you sure you to reset all local settings & state? Devtools will reload."
            @confirm="clearOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>
