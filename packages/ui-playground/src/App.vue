<script setup lang="ts">
import { VueButton, VueDarkToggle, VueDialog } from '@vue-devtools-next/ui'
import { useDark } from '@vueuse/core'
import { ref } from 'vue'

const dark = useDark()

const show = ref(false)
</script>

<template>
  {{ dark }}
  <div class="$ui-vtr">
    <a href="">1111</a>
  </div>
  <VueButton @click="show = true">
    Show dialog
  </VueButton>
  <br>
  <VueDialog v-model="show">
    Dialog!!!
  </VueDialog>
  <VueDarkToggle>
    <template #default="{ isDark, toggle }">
      <VueButton @click="toggle">
        {{ isDark }}
      </VueButton>
    </template>
  </VueDarkToggle>
</template>
