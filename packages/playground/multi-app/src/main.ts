import { createApp } from 'vue'

import App from './App.vue'
import App2 from './App2.vue'

import './style.css'
import 'uno.css'

const app = createApp(App)

app.mount('#app')

setTimeout(() => {
  app.unmount()
  app.mount('#app')
  createApp(App2).mount('#app2')
}, 500)
