<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import STC from './components/ScrollToComponent.vue'
import { useAppStore } from './stores'

import { availableLocales, loadLanguageAsync } from './modules/i18n'

const age = ref(10)
const app = useAppStore()

const { t, locale } = useI18n()

async function toggleLocales() {
  // change to some real logic
  const locales = availableLocales
  const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
  await loadLanguageAsync(newLocale)
  locale.value = newLocale
}
</script>

<template>
  <div class="container">
    <RouterView />
    <p>
      <em text-sm opacity-75>{{ t('intro.desc') }}</em>
    </p>
    <p>
      <a icon-btn :title="t('button.toggle_langs')" @click="toggleLocales()">
        Toggle Langs
      </a>
    </p>
    <p>
      Age: {{ age }}
    </p>
    <p>
      Pinia State Count: {{ app.count }}
    </p>
    <p>
      Pinia Getter DoubledCount: {{ app.doubledCount }}
    </p>
    <button @click="app.increment">
      Increment Count (Pinia)
    </button>
    <p>
      <router-link to="/">
        Home
      </router-link> |
      <router-link to="/hello">
        Hello
      </router-link>
    </p>
    <STC />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
