import { createApp } from 'vue'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import { createMemoryHistory, createRouter } from 'vue-router'
import routes from 'virtual:generated-pages'

import App from './App.vue'

import '@unocss/reset/tailwind.css'

// import './styles/main.css'

import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

app.use(router)
app.use(FloatingVue)
app.mount('#app')
