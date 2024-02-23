<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import EventList from './EventList.vue'
import EventInfo from './EventInfo.vue'
</script>

<template>
  <div class="h-full">
    <Splitpanes class="h-full">
      <Pane border="r base" size="40" h-full>
        <div h-full select-none overflow-scroll class="no-scrollbar">
          <EventList />
        </div>
      </Pane>
      <Pane size="60">
        <div h-full select-none overflow-scroll class="no-scrollbar">
          <EventInfo />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
