import { createPinia } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { addCustomCommand } from '@vue/devtools-api'

import ElementPlus from 'element-plus'
import store from './stores/vuexStore'

import App from './App.vue'
import 'element-plus/dist/index.css'
import Home from './pages/Home.vue'
import Hey from './pages/Hey.vue'
import VueQuery from './pages/VueQuery.vue'
import VeeValidate from './pages/VeeValidate.vue'
import './style.css'
import 'uno.css'

const pinia = createPinia()
const app = createApp(App)
app.use(ElementPlus)

// devtools.connect()

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
    name: 'home',
    alias: '/index',
  },
  {
    path: '/hello',
    component: () => import('./pages/Hello.vue'),
    name: 'hello',
  },
  {
    path: '/hey/:id',
    component: Hey,
    name: 'hey',
  },
  {
    path: '/vue-query',
    component: VueQuery,
    name: 'vue-query',
  },
  {
    path: '/vee-validate',
    component: VeeValidate,
    name: 'vee-validate',
  },
  {
    path: '/circular-state',
    component: () => import('./pages/CircularState.vue'),
    name: 'circular-state',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(VueQueryPlugin, {
  enableDevtoolsV6Plugin: true,
})
app.use(router)
app.use(pinia)
app.use(store)

app.mount('#app')

setTimeout(() => {
  addCustomCommand({
    id: 'vueuse',
    title: 'VueUse',
    icon: 'auto-awesome',
    action: {
      type: 'url',
      src: 'https://vueuse.org/',
    },
  })
}, 2000)
