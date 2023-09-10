import { createApp, h } from 'vue'
import { createDevToolsVuePlugin } from '@vue-devtools-plus/core'
import App from './App.vue'

const app = createApp({
  render: () => h(App),
})

app.use(createDevToolsVuePlugin())
app.mount('#app')
