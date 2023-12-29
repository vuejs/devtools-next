<script setup lang="ts">
import { VueButton, VueCard, VueDropdown, VTooltip as vTooltip } from '@vue/devtools-next-ui'

function close() {
  devtoolsClientState.value.splitScreen.enabled = false
}
const splitScreenState = computed(() => devtoolsClientState.value.splitScreen)

const { enabledTabs, flattenedTabs } = useAllTabs()
const router = useRouter()
const route = useRoute()
const PageComponent = shallowRef()

function isMatchedWithRoute(tab?: typeof flattenedTabs['value'][number]) {
  const routePath = route.path.startsWith('/') ? route.path.slice(1) : route.path
  return tab && 'path' in tab && routePath === tab.path
}

const currentTab = computed(() => {
  const tab = flattenedTabs.value.find(tab => tab.name === splitScreenState.value.view)
  return isMatchedWithRoute(tab) ? undefined : tab
})

watch(
  () => currentTab.value,
  (tab) => {
    if (!tab)
      return
    const routes = router.getRoutes()
    const matched = tab && 'path' in tab
      ? routes.find(route => route.path === (tab.path.startsWith('/') ? tab.path : `/${tab.path}`))
      : routes.find(route => route.name === 'custom-tab') // TODO: custom tabs
    // if it's the same route as the main view, skip
    const path = route.path.startsWith('/') ? route.path.slice(1) : route.path
    if (matched?.path === path || route.params?.name === tab.name) {
      PageComponent.value = undefined
      return
    }
    const component = matched?.components?.default
    if (typeof component === 'function')
      PageComponent.value = defineAsyncComponent(component as any)
    else
      PageComponent.value = component
  },
  { immediate: true },
)

const showGridPanel = ref(false)
</script>

<template>
  <div h-full h-screen of-hidden>
    <div v-if="PageComponent && currentTab" border="b base" flex="~ gap1" z-99 px4 py3 navbar-glass>
      <VueDropdown placement="bottom-start" :distance="12" :skidding="5" :shown="showGridPanel" trigger="click">
        <div flex cursor-pointer items-center gap2>
          <div i-carbon-chevron-down text-sm op50 />
          <TabIcon
            text-xl
            :icon="currentTab?.icon"
            title="Settings"
            :show-title="false"
          />
          <span capitalize>

            {{ currentTab?.name }}
          </span>
        </div>
        <template #popper>
          <TabsGrid :categories="enabledTabs" target="side" />
        </template>
      </VueDropdown>
      <div flex-auto />
      <button
        v-tooltip="'Close split screen'"
        title="Close split screen" cursor-pointer hover:bg-active px1
        @click="close"
      >
        <div i-carbon:side-panel-open />
      </button>
    </div>
    <div v-if="PageComponent && currentTab" of-auto style="height: calc(100% - 50px)">
      <!-- TODO: custom tabs -->
      <!-- Tabs -->
      <component :is="PageComponent" :key="`tab-${currentTab.name}`" />
    </div>
    <PanelGrids v-else>
      <span text-lg op50>
        Select a tab to start
      </span>
      <VueCard px4 py2 bg-base>
        <TabsGrid :categories="enabledTabs" target="side" />
      </VueCard>
      <VueButton type="warning" outlined mt2 @click="close">
        Close Split Screen
      </VueButton>
    </PanelGrids>
  </div>
</template>
