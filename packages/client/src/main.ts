import '@unocss/reset/tailwind.css'
import 'floating-vue/dist/style.css'
import { getViteClient } from 'vite-hot-client'

import { isInSeparateWindow } from '@vue/devtools-shared'
import { createViteClientRpc, functions } from '@vue/devtools-core'
import { createRpcClient, setViteClientContext } from '@vue/devtools-kit'
import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from './App.vue'
import Components from '~/pages/components.vue'
import Overview from '~/pages/overview.vue'
import PiniaPage from '~/pages/pinia.vue'
import RouterPage from '~/pages/router.vue'
import Pages from '~/pages/pages.vue'
import Assets from '~/pages/assets.vue'
import Graph from '~/pages/graph.vue'
import Index from '~/pages/index.vue'
import Settings from '~/pages/settings.vue'
import CustomTabView from '~/pages/custom-tab-view.vue'
import CustomInspectorTabView from '~/pages/custom-inspector-tab-view.vue'
import WaitForConnection from '~/components/WaitForConnection.vue'

import 'uno.css'
import '~/assets/styles/main.css'

const routes = [
  { path: '/', component: Index },
  { path: '/overview', component: Overview },
  { path: '/components', component: Components },
  { path: '/pinia', component: PiniaPage },
  { path: '/router', component: RouterPage },
  { path: '/pages', component: Pages },
  { path: '/assets', component: Assets },
  { path: '/graph', component: Graph },
  { path: '/settings', component: Settings },
  { path: `/${CUSTOM_TAB_VIEW}/:name`, component: CustomTabView },
  { path: `/${CUSTOM_INSPECTOR_TAB_VIEW}/:name`, component: CustomInspectorTabView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')

async function getViteHotContext() {
  if (import.meta.url?.includes('chrome-extension://'))
    return

  const viteClient = await getViteClient(`${location.pathname.split('/__devtools__')[0] || ''}/`.replace(/\/\//g, '/'), false)
  return viteClient?.createHotContext('/____')
}

export async function initViteClientHotContext() {
  const context = await getViteHotContext()
  context && setViteClientContext(context)
  return context
}

initViteClientHotContext().then((ctx) => {
  if (ctx) {
    createViteClientRpc()
  }
})

// heartbeat()

if (isInSeparateWindow) {
  createRpcClient(functions, {
    preset: 'broadcast',
  })
}
else {
  createRpcClient(functions, {
    preset: 'iframe',
  })
}

export function initDevTools() {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
}

export function createConnectionApp(container: string = '#app', props?: Record<string, string>) {
  const app = createApp(WaitForConnection, {
    ...props,
  })
  app.mount(container)
  return app
}
