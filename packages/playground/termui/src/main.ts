import { devtools } from '@vue/devtools'
import '@vue/devtools/hook'
import { createApp } from 'vue-termui'
import App from './App.vue'

globalThis.document = {
  createElement: () => {},
  getElementById: () => {},
} as any

devtools.connect()

const app = createApp(App)
app.mount()
