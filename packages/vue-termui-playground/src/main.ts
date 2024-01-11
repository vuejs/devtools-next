import { devtools } from '@vue/devtools'
import '@vue/devtools/hook'
import { createApp } from 'vue-termui'
import App from './App.vue'

globalThis.document = {
  createElement: () => {},
  getElementById: () => {},
} as any

devtools.connect('http://localhost', 8098)

const app = createApp(App)
app.mount()
