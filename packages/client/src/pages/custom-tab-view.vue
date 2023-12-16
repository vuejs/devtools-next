<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { CustomTab } from '@vue-devtools-next/kit'

const route = useRoute()
const router = useRouter()
const { flattenedTabs } = useAllTabs()
const tabName = computed(() => route.query.name as string | undefined)
const tab = computed(() => flattenedTabs.value.find(tab => tabName.value === tab.name) || null!) as ComputedRef<CustomTab>

onMounted(() => {
  if (!tab.value) {
    setTimeout(() => {
      router.replace('/overview')
    }, 2000)
  }
})
</script>

<template>
  <template v-if="!tab">
    <PanelGrids flex="~ col" h-full items-center justify-center>
      <div flex="~ col gap2" mxa items-center>
        <div i-carbon-queued mb2 text-5xl op50 />
        <p text-xl>
          Tab <code text-rose>{{ tabName }}</code> not found
        </p>
        <p mt8 animate-pulse>
          Redirecting to overview page...
        </p>
      </div>
    </PanelGrids>
  </template>
  <template v-else-if="tab.view.type === 'iframe'">
    <IframeView :src="tab.view.src" />
  </template>
  <template v-else>
    <PanelGrids>
      <NCard flex="~ col" h-full items-center justify-center>
        Unknown tab type {{ tab.view }}
      </NCard>
    </PanelGrids>
  </template>
</template>
