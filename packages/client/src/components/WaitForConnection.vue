<script setup lang="ts">
import { VueInput } from '@vue/devtools-ui'
import AppConnecting from '~/components/AppConnecting.vue'

const props = defineProps<{
  local?: string
  network?: string
}>()

function scriptWrapper(str: string) {
  return `\<script src="${str}"\>\</script\>`
}

const _local = scriptWrapper(props.local!)
const _network = scriptWrapper(props.network!)

const local = ref(_local)
const network = ref(_network)
</script>

<template>
  <div class="h-screen w-screen $ui-fcc">
    <AppConnecting>
      <p class="pt-5 font-bold text-base">
        Waiting for connection...
      </p>
      <div v-if="props.local && props.network" class="mt-5">
        <p class="text-center text-sm op80 text-base">
          Add one of the following to the top of your page 👇:
        </p>
        <div class="mt-3 $ui-fcc flex-row">
          <VueInput v-model="local" left-icon="i-carbon-copy" class="w-400px!" />
        </div>
        <div class="mt-3 $ui-fcc flex-row">
          <VueInput v-model="network" left-icon="i-carbon-copy" class="w-400px!" />
        </div>
      </div>
    </AppConnecting>
  </div>
</template>

<style scoped>

</style>
