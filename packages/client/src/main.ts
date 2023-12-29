import '@unocss/reset/tailwind.css'
import 'floating-vue/dist/style.css'

import type { BridgeInstanceType } from '@vue/devtools-core'
import { BROADCAST_CHANNEL_NAME, isInChromePanel, isInElectron, isInIframe } from '@vue/devtools-shared'
import { Bridge, BridgeEvents, HandShakeServer, createDevToolsVuePlugin, registerBridgeRpc } from '@vue/devtools-core'

import type { App as AppType } from 'vue'
import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { getViteClient } from 'vite-hot-client'
import App from './App.vue'
import Components from '~/pages/components.vue'
import Overview from '~/pages/overview.vue'
import PiniaPage from '~/pages/pinia.vue'
import RouterPage from '~/pages/router.vue'
import Timeline from '~/pages/timeline.vue'
import Pages from '~/pages/pages.vue'
import Assets from '~/pages/assets.vue'
import Graph from '~/pages/graph.vue'
import Index from '~/pages/index.vue'
import Settings from '~/pages/settings.vue'
import CustomTabView from '~/pages/custom-tab-view.vue'
import WaitForConnection from '~/components/WaitForConnection.vue'

import 'uno.css'
import '~/assets/styles/main.css'

async function getViteHotContext() {
  if (import.meta.url?.includes('chrome-extension://'))
    return

  const viteCLient = await getViteClient(`${location.pathname.split('/__devtools__')[0] || ''}/`.replace(/\/\//g, '/'), false)
  return viteCLient?.createHotContext('/____')
}

const routes = [
  { path: '/', component: Index },
  { path: '/overview', component: Overview },
  { path: '/components', component: Components },
  { path: '/pinia', component: PiniaPage },
  { path: '/router', component: RouterPage },
  { path: '/timeline', component: Timeline },
  { path: '/pages', component: Pages },
  { path: '/assets', component: Assets },
  { path: '/graph', component: Graph },
  { path: '/settings', component: Settings },
  { path: '/custom-tab-view/:name', component: CustomTabView },
]

// @TODO: find a better way to handle it
const devtoolsBridge: {
  value: BridgeInstanceType
} = {
  value: null!,
}

async function reload(app, shell) {
  devtoolsBridge.value.removeAllListeners()
  shell.connect(async (bridge) => {
    devtoolsBridge.value = bridge
    registerBridgeRpc('devtools', {
      viteRPCContext: await getViteHotContext(),
      bridge: devtoolsBridge.value,
    })
    new HandShakeServer(devtoolsBridge.value).onnConnect().then(() => {
      app.config.globalProperties.__VUE_DEVTOOLS_UPDATE__(devtoolsBridge.value)
      devtoolsBridge.value.emit(BridgeEvents.CLIENT_READY)
    })
  })
}

async function connectApp(app, shell) {
  return new Promise<void>((resolve) => {
    shell.connect((bridge) => {
      devtoolsBridge.value = bridge
      resolve()
    })
    shell.reload(() => {
      reload(app, shell)
    })
  })
}

export async function initDevTools(shell, options: { viewMode?: 'overlay' | 'panel' } = { viewMode: 'overlay' }) {
  const app = createApp(App)
  await connectApp(app, shell)
  registerBridgeRpc('devtools', {
    viteRPCContext: await getViteHotContext(),
    bridge: devtoolsBridge.value,
  })
  new HandShakeServer(devtoolsBridge.value).onnConnect().then(() => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    app.use(router)
    app.use(createDevToolsVuePlugin({
      bridge: devtoolsBridge.value,
      viewMode: options.viewMode!,
    }))
    app.mount('#app')
    devtoolsBridge.value.emit(BridgeEvents.CLIENT_READY)
  })
}

export function createConnectionApp(container: string = '#app', props?: Record<string, string>) {
  const app = createApp(WaitForConnection, {
    ...props,
  })
  app.mount(container)
  return app
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

// @TODO: refactor separate window channel
if (!isInIframe && !isInChromePanel && !isInElectron) {
  function initSeparateWindowChannel() {
    const connectionInfo: {
      connected: boolean
      timer: NodeJS.Timeout | null
      app: AppType<Element> | null
    } = {
      connected: false,
      timer: null,
      app: null,
    }

    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)

    function connect() {
      connectionInfo.timer = setInterval(() => {
        channel.postMessage({
          source: '__VUE_DEVTOOLS_CLIENT__',
          data: {
            event: 'ready',
          },
        })
      }, 2000)
    }

    connectionInfo.app = createConnectionApp()

    channel.onmessage = (event) => {
      if (event.data?.data?.event === '__VUE_DEVTOOLS_CREATE_CLIENT__') {
        connectionInfo.app?.unmount()
        connectionInfo.connected = true
        clearInterval(connectionInfo.timer!)

        initDevTools({
          connect: (callback) => {
            const bridge = new Bridge({
              tracker(fn) {
                channel.onmessage = (event) => {
                  if (event.data.source === '__VUE_DEVTOOLS_USER_APP__')
                    fn(event.data.data)
                }
              },
              trigger(data) {
                channel.postMessage({
                  source: '__VUE_DEVTOOLS_CLIENT__',
                  data,
                })
              },
            })
            bridge.on('disconnect', () => {
              channel.close()
              initSeparateWindowChannel()
            })
            callback(bridge)
          },
        })
      }
    }
    connect()
  }
  initSeparateWindowChannel()
}
