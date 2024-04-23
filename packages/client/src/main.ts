import '@unocss/reset/tailwind.css'
import 'floating-vue/dist/style.css'

import type { BridgeInstanceType } from '@vue/devtools-core'
import { isInChromePanel, isInElectron, isInIframe } from '@vue/devtools-shared'
import { Bridge, HandShakeServer, createDevToolsVuePlugin, initDevToolsSeparateWindow, initDevToolsSeparateWindowBridge, initViteClientHotContext, setupDevToolsBridge } from '@vue/devtools-core'

import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from './App.vue'
import Components from '~/pages/components.vue'
import Overview from '~/pages/overview.vue'
import PiniaPage from '~/pages/pinia.vue'
import RouterPage from '~/pages/router.vue'
import I18nPage from '~/pages/i18n.vue'
import Pages from '~/pages/pages.vue'
import Assets from '~/pages/assets.vue'
import Graph from '~/pages/graph.vue'
import Index from '~/pages/index.vue'
import Settings from '~/pages/settings.vue'
import CustomTabView from '~/pages/custom-tab-view.vue'
import WaitForConnection from '~/components/WaitForConnection.vue'

import 'uno.css'
import '~/assets/styles/main.css'

const routes = [
  { path: '/', component: Index },
  { path: '/overview', component: Overview },
  { path: '/components', component: Components },
  { path: '/pinia', component: PiniaPage },
  { path: '/router', component: RouterPage },
  { path: '/i18n', component: I18nPage },
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
    setupDevToolsBridge(devtoolsBridge.value)
    new HandShakeServer(devtoolsBridge.value).onnConnect().then(() => {
      app.config.globalProperties.__VUE_DEVTOOLS_UPDATE__(devtoolsBridge.value)
      devtoolsBridge.value.emit('devtools:client-ready')
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
  await initViteClientHotContext()
  setupDevToolsBridge(devtoolsBridge.value)
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
    devtoolsBridge.value.emit('devtools:client-ready')
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

if (!isInIframe && !isInChromePanel && !isInElectron) {
  function initSeparateWindow() {
    const connectionApp = createConnectionApp()

    initDevToolsSeparateWindow({
      onConnected: (channel) => {
        connectionApp?.unmount()
        initDevTools({
          connect: (callback) => {
            const bridge = initDevToolsSeparateWindowBridge(channel)
            bridge.on('disconnect', () => {
              channel.close()
              initSeparateWindow()
            })
            callback(bridge)
          },
        })
      },
    })
  }

  initSeparateWindow()
}
