import { createApp } from 'vue'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import { createMemoryHistory, createRouter } from 'vue-router'
import routes from 'virtual:generated-pages'
import { Bridge } from '@vue-devtools-next/app-core'
import { BridgeEvents } from '@vue-devtools-next/schema'

import App from './App.vue'

import '@unocss/reset/tailwind.css'

// import './styles/main.css'

import 'uno.css'

async function connectApp(app, shell) {
  return new Promise<void>((resolve) => {
    shell.connect((bridge) => {
      // @TODO: find a better way to handle it
      Bridge.value = bridge
      resolve()
    })
  })
}

export async function initDevTools(shell) {
  const app = createApp(App)
  await connectApp(app, shell)
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  app.use(router)
  app.use(FloatingVue)
  app.mount('#app')
  Bridge.value.emit(BridgeEvents.CLIENT_READY)
}

window.addEventListener('message', (event) => {
  if (event.data === '__VUE_DEVTOOLS_CREATE_CLIENT__') {
    initDevTools({
      connect: (callback) => {
        const bridge = new Bridge({
          tracker(fn) {
            window.addEventListener('message', (e) => {
              if (e.data.source === '__VUE_DEVTOOLS_USER_APP__')
                fn(e.data.data)
            })
          },
          trigger(data) {
            event?.source?.postMessage({
              source: '__VUE_DEVTOOLS_CLIENT__',
              data,
            }, {
              targetOrigin: '*',
            })
          },
        })
        callback(bridge)
      },
    })
    event.source?.postMessage('__VUE_DEVTOOLS_CLIENT_READY__')
  }
})
