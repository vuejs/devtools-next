import { createApp, h } from 'vue'
import { createDevToolsVuePlugin } from '@vue-devtools-next/core'
import App from './App.vue'

const app = createApp({
  render: () => h(App),
})

app.use(createDevToolsVuePlugin())
app.mount('#app')
