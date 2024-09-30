<script setup lang="ts">
import { SelectiveList } from '@vue/devtools-applet'
import {
  rpc,
  useDevToolsState,
} from '@vue/devtools-core'
import { Pane, Splitpanes } from 'splitpanes'

// responsive layout
const splitpanesRef = ref<HTMLDivElement>()
const splitpanesReady = ref(false)
const { width: splitpanesWidth } = useElementSize(splitpanesRef)
// prevent `Splitpanes` layout from being changed before it ready
const horizontal = computed(() => splitpanesReady.value ? splitpanesWidth.value < 700 : false)

// #region toggle app
const devtoolsState = useDevToolsState()
const appRecords = computed(() => devtoolsState.appRecords.value.map(app => ({
  label: app.name + (app.version ? ` (${app.version})` : ''),
  value: app.id,
})))

const normalizedAppRecords = computed(() => appRecords.value.map(app => ({
  label: app.label,
  id: app.value,
})))

const activeAppRecordId = ref(devtoolsState.activeAppRecordId.value)
watchEffect(() => {
  activeAppRecordId.value = devtoolsState.activeAppRecordId.value
})

function toggleApp(id: string) {
  rpc.value.toggleApp(id).then(() => {
  })
}

// #endregion
</script>

<template>
  <div class="h-full w-full">
    <Splitpanes ref="splitpanesRef" class="flex-1 overflow-auto" :horizontal="horizontal" @ready="splitpanesReady = true">
      <Pane v-if="appRecords.length > 1" border="base h-full" size="20">
        <div class="no-scrollbar h-full flex select-none gap-2 overflow-scroll">
          <SelectiveList v-model="activeAppRecordId" :data="normalizedAppRecords" class="w-full" @select="toggleApp" />
        </div>
      </Pane>
      <Pane border="base" h-full>
        <div class="h-full flex flex-col p2">
          <div class="flex py2">
            3
          </div>
          <div class="no-scrollbar flex-1 select-none overflow-scroll">
            2
          </div>
        </div>
      </Pane>
      <Pane relative h-full>
        <div class="h-full flex flex-col p2">
          <div class="flex py2">
            1
          </div>
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
