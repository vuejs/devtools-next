<script setup lang="ts">
import { VueInput } from '@vue-devtools-next/ui'

const routeInput = ref('')
const currentRoute = ref({})
const route = ref({
  matched: [],
})
const routeInputMatched = computed(() => [{
  path: '/',
  name: 'index',
}])
const routes = ref([
  {
    path: '/',
    name: 'index',
  },
  {
    path: '/home',
    name: 'home',
  },
  {
    path: '/hello',
    name: 'hello',
  },
  {
    path: '/detail/:id',
    name: 'detail',
  },
])
function navigate() {
  console.log('navigate')
}
function navigateToRoute() {}
</script>

<template>
  <div h-full of-auto>
    <div border="b base" flex="~ col gap1" px4 py3>
      <div>
        <template v-if="false">
          <span op50>Navigate from </span>
          <span font-mono>Hi</span>
          <span op50> to </span>
        </template>
        <template v-else>
          <span op50>Current route</span>
        </template>
      </div>
      <VueInput
        v-model="routeInput"
        left-icon="i-carbon-direction-right-01 scale-y--100"
        :class="currentRoute === routeInput ? '' : routeInputMatched.length ? 'text-green!' : 'text-orange!'"
        @keydown.enter="navigate"
      />
      <div>
        <template v-if="currentRoute !== routeInput">
          <span>Press <b font-bold>Enter</b> to navigate</span>
          <span v-if="!routeInputMatched.length" text-orange op75> (no match)</span>
        </template>
        <template v-else>
          <span op50>Edit path above to navigate</span>
        </template>
      </div>
    </div>
    <SectionBlock
      icon="i-carbon-tree-view"
      text="Matched Routes"
      :padding="false"
    >
      <RoutesTable
        v-if="routeInputMatched.length"
        :pages="routeInputMatched"
        :matched="route.matched"
        :matched-pending="routeInputMatched"
        @navigate="navigateToRoute"
      />
    </SectionBlock>
    <SectionBlock
      icon="i-carbon-tree-view-alt"
      text="All Routes"
      :description="`${routes.length} routes registered in your application`"
      :padding="false"
    >
      <RoutesTable
        :pages="routes"
        :matched="currentRoute?.matched ?? []"
        :matched-pending="routeInputMatched"
        @navigate="navigateToRoute"
      />
    </SectionBlock>
  </div>
</template>
