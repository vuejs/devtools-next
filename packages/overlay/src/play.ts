import { createApp, h } from 'vue'

import App from './App.vue'

const app = createApp({
  render: () => h(App),
})

app.mount('#app')
