<script setup lang="ts">
import Settings from '~/components/settings/Settings.vue'
import Navbar from '~/components/basic/Navbar.vue'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'

const settings = inject('pluginSettings')
const options = computed(() => settings.value.options)
const values = computed(() => settings.value.values)
const inspectorId = 'pinia'

function update(_settings) {
  settings.value = _settings
}
</script>

<template>
  <div class="h-full flex flex-col">
    <DevToolsHeader doc-link="https://pinia.vuejs.org/" github-repo-link="https://github.com/vuejs/pinia">
      <Navbar />
    </DevToolsHeader>
    <Settings :plugin-id="inspectorId" :options="options" :values="values" @update="update" />
  </div>
</template>
