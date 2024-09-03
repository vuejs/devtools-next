<script setup lang="ts">
import { VueButton } from '@vue/devtools-ui'

const hostEnv = useHostEnv()
const router = useRouter()
const clientState = devtoolsClientState

function visit() {
  clientState.value.isFirstVisit = false
  router.replace('/overview')
}
</script>

<template>
  <div v-if="hostEnv === 'chrome'" flex="~ col gap3" relative h-screen w-full items-center justify-center text-center>
    <p my2 text-3em text-primary-600 font-bold font-stylish>
      👋 Welcome to the new Vue Devtools v7!
    </p>
    <p max-w-190 text-lg>
      This new version supports only Vue 3. <span op50>
        (Learn more at
        <a href="https://devtools.vuejs.org/" target="_blank" rel="noopener noreferrer" n="primary">
          devtools.vuejs.org
        </a>)
      </span>
      <br>
      The legacy version that supports both Vue 2 and Vue 3 has been moved to <a href="https://chromewebstore.google.com/detail/vuejs-devtools/iaajmlceplecbljialhhkmedjlpdblhp" target="_blank" class="op50">here</a>.
    </p>

    <VueButton type="primary" @click="visit">
      <span>Get Started</span>
    </VueButton>
  </div>
  <!--  -->
  <div v-else flex="~ col gap3" relative h-screen w-full items-center justify-center text-center>
    <p my2 text-3em text-primary-600 font-bold font-stylish>
      👋 Hi there, welcome to Vue DevTools!
    </p>
    <p max-w-190 text-lg>
      <DevToolsLogo mr-0.5 inline-block h-8 translate-y--1.1 align-mid /> is a set of visual tools that help you to know your Vue app better, and enhance your
      development experience with Vue. Enjoy!<br>
    </p>
    <p mb6 op50>
      Learn more at
      <a href="https://devtools.vuejs.org/" target="_blank" rel="noopener noreferrer" n="primary">
        devtools.vuejs.org
      </a>
    </p>

    <VueButton type="primary" @click="visit">
      <span>Get Started</span>
    </VueButton>
  </div>
</template>
