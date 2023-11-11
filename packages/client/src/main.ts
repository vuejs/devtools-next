import '@unocss/reset/tailwind.css'
import { Bridge, BridgeEvents, HandShakeServer, createDevToolsVuePlugin, registerBridgeRpc } from '@vue-devtools-next/core'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { getViteClient } from 'vite-hot-client'
import App from './App.vue'
import ViewModeSwitch from '~/components/chrome/ViewModeSwitch.vue'
import Components from '~/pages/components.vue'
import Overview from '~/pages/overview.vue'
import PiniaPage from '~/pages/pinia.vue'
import RouterPage from '~/pages/router.vue'
import Timeline from '~/pages/timeline.vue'
import Pages from '~/pages/pages.vue'
import Assets from '~/pages/assets.vue'
import Graph from '~/pages/graph.vue'
import 'uno.css'
import '~/assets/styles/main.css'

async function getViteHotContext() {
  if (import.meta.url?.includes('chrome-extension://'))
    return

  const viteCLient = await getViteClient(`${location.pathname.split('/__devtools__')[0] || ''}/`.replace(/\/\//g, '/'), false)
  return viteCLient?.createHotContext('/____')
}

const routes = [
  { path: '/overview', component: Overview },
  { path: '/components', component: Components },
  { path: '/pinia', component: PiniaPage },
  { path: '/router', component: RouterPage },
  { path: '/router', component: RouterPage },
  { path: '/timeline', component: Timeline },
  { path: '/pages', component: Pages },
  { path: '/assets', component: Assets },
  { path: '/graph', component: Graph },
]

async function reload(app, shell) {
  Bridge.value.removeAllListeners()
  shell.connect(async (bridge) => {
    Bridge.value = bridge
    registerBridgeRpc('devtools', {
      viteRPCContext: await getViteHotContext(),
    })
    new HandShakeServer(Bridge.value).onnConnect().then(() => {
      app.config.globalProperties.__VUE_DEVTOOLS_UPDATE__(Bridge.value)
      Bridge.value.emit(BridgeEvents.CLIENT_READY)
    })
  })
}

async function connectApp(app, shell) {
  return new Promise<void>((resolve) => {
    shell.connect((bridge) => {
      // @TODO: find a better way to handle it
      Bridge.value = bridge
      resolve()
    })
    shell.reload(() => {
      reload(app, shell)
    })
  })
}

export async function initDevTools(shell) {
  const app = createApp(App)
  await connectApp(app, shell)
  registerBridgeRpc('devtools', {
    viteRPCContext: await getViteHotContext(),
  })
  new HandShakeServer(Bridge.value).onnConnect().then(() => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    app.use(router)
    app.use(FloatingVue)
    app.use(createDevToolsVuePlugin({
      bridge: Bridge.value,
    }))
    app.mount('#app')
    Bridge.value.emit(BridgeEvents.CLIENT_READY)
    Bridge.value.on('toggle-view-mode', (data) => {
      if (data === 'overlay') {
        Bridge.value.removeAllListeners()
        app.unmount()
        showViewModeInfo(shell)
      }
    })
  })
}

export async function showViewModeInfo(shell) {
  const app = createApp(ViewModeSwitch)
  shell.connectViewModeBridge(async (bridge) => {
    Bridge.value = bridge
    Bridge.value.on('toggle-view-mode', (data) => {
      if (data === 'panel') {
        Bridge.value.removeAllListeners()
        app.unmount()
        initDevTools(shell)
      }
    })
  })
  app.mount('#app')
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
