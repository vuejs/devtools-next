import '@unocss/reset/tailwind.css'
import 'floating-vue/dist/style.css'

import { RPCFunctions, functions } from '@vue/devtools-core'
import { createMessageChannel, createRpc, setCurrentMessagingEnv } from '@vue/devtools-kit'
import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from './App.vue'
import Components from '~/pages/components.vue'
import Overview from '~/pages/overview.vue'
import PiniaPage from '~/pages/pinia.vue'
import VuexPage from '~/pages/vuex.vue'
import RouterPage from '~/pages/router.vue'
import I18nPage from '~/pages/i18n.vue'
import VueQueryPage from '~/pages/vue-query.vue'
import VeeValidatePage from '~/pages/vee-validate.vue'
import Pages from '~/pages/pages.vue'
import Assets from '~/pages/assets.vue'
import Graph from '~/pages/graph.vue'
import Index from '~/pages/index.vue'
import Settings from '~/pages/settings.vue'
import CustomTabView from '~/pages/custom-tab-view.vue'
import { createDevToolsPlugin } from '~/plugins'

import 'uno.css'
import '~/assets/styles/main.css'

const routes = [
  { path: '/', component: Index },
  { path: '/overview', component: Overview },
  { path: '/components', component: Components },
  { path: '/pinia', component: PiniaPage },
  { path: '/vuex', component: VuexPage },
  { path: '/router', component: RouterPage },
  { path: '/vue-query', component: VueQueryPage },
  { path: '/vee-validate', component: VeeValidatePage },
  { path: '/i18n', component: I18nPage },
  { path: '/pages', component: Pages },
  { path: '/assets', component: Assets },
  { path: '/graph', component: Graph },
  { path: '/settings', component: Settings },
  { path: `/${CUSTOM_TAB_VIEW}/:name`, component: CustomTabView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.use(createDevToolsPlugin())
app.mount('#app')

setCurrentMessagingEnv('client')
createMessageChannel({ preset: 'broadcast' })
createRpc<RPCFunctions>(functions)
heartbeat()

export function initDevTools() {}

export function createConnectionApp() {}
