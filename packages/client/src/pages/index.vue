<script setup lang="ts">
import { VueButton } from '@vue-devtools-next/ui'

const router = useRouter()
function visit() {
  router.replace('/overview')
}
</script>

<template>
  <PanelGrids flex="~ col gap3" relative h-screen w-full items-center justify-center text-center>
    <p my2 text-3em font-bold font-stylish text-primary-600>
      👋 Hi there, welcome to Vue DevTools!
    </p>
    <p max-w-190 text-lg>
      <DevToolsLogo mr-0.5 inline-block h-8 translate-y--1.1 align-mid /> is a set of visual tools that help you to know your Vue app better, and enhance your
      development experience with Vue. Enjoy!<br>
    </p>
    <!-- <p mb6 op50>
      Learn more at
      <a href="https://devtools.vuejs.org/" target="_blank" rel="noopener noreferrer" n="primary">
        devtools.vuejs.org
      </a>
    </p> -->

    <VueButton type="primary" @click="visit">
      <span>Get Started</span>
    </VueButton>
  </PanelGrids>
</template>
