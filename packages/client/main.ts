import { createApp } from 'vue'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import { createMemoryHistory, createRouter } from 'vue-router'
import routes from 'virtual:generated-pages'

import App from './App.vue'

import '@unocss/reset/tailwind.css'

// import './styles/main.css'

import 'uno.css'

function connectApp(app, shell) {
  shell.connect((bridge) => {
    bridge.on('boom', () => {
      console.log(
        '🚀 ~ boom',
      )
    })
    bridge.emit('client:ready')
  })
}

export function initDevTools(shell) {
  const app = createApp(App)
  connectApp(app, shell)
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  app.use(router)
  app.use(FloatingVue)
  app.mount('#app')
}

window.__INIT_DEVTOOLS__ = initDevTools
