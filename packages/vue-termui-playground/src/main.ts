import { devtools } from '@vue/devtools'

globalThis.document = {
  createElement: () => {},
  getElementById: () => {},
} as any

devtools.connect('http://localhost', 8098)

// eslint-disable-next-line import/first
import { createApp } from 'vue-termui'

// eslint-disable-next-line import/first
import App from './App.vue'

const app = createApp(App)
app.mount()
