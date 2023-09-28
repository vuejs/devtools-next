<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
</script>

<template>
  <div h-screen panel-grids>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div h-screen select-none overflow-scroll p-2>
          <ComponentTreeNode />
        </div>
      </Pane>
      <Pane flex flex-col>
        2
      </Pane>
    </Splitpanes>
  </div>
</template>
