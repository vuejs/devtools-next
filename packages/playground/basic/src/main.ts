import { createPinia } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { addCustomCommand } from '@vue/devtools-api'
import store from './stores/vuexStore'

import App from './App.vue'

import Home from './pages/Home.vue'
import Hey from './pages/Hey.vue'
import VueQuery from './pages/VueQuery.vue'
import VeeValidate from './pages/VeeValidate.vue'
import './style.css'
import 'uno.css'

const pinia = createPinia()

const app = createApp(App)

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
    // component: Hello,
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// setTimeout(() => {
app.use(VueQueryPlugin, {
  enableDevtoolsV6Plugin: true,
})
app.use(router)
app.use(pinia)
app.use(store)

app.mount('#app')
// }, 2000)

setTimeout(() => {
  addCustomCommand({
    id: 'vueuse',
    title: 'VueUse',
    action: {
      type: 'url',
      src: 'https://vueuse.org/',
    },
  })
}, 2000)

// setTimeout(() => {
//   addCustomTab({
//   // unique identifier
//     name: 'vue-use',
//     // title to display in the tab
//     title: 'VueUse',
//     // any icon from Iconify, or a URL to an image
//     icon: 'i-logos-vueuse',
//     // iframe view
//     view: {
//       type: 'iframe',
//       src: 'https://vueuse.org/',
//     },
//     category: 'advanced',
//   })
//   setTimeout(() => {
//     addCustomTab({
//     // unique identifier
//       name: 'vue-use1',
//       // title to display in the tab
//       title: 'VueUse1',
//       // any icon from Iconify, or a URL to an image
//       icon: 'i-logos-vueuse',
//       // iframe view
//       view: {
//         type: 'iframe',
//         src: 'https://vueuse.org/',
//       },
//       category: 'advanced',
//     })
//   }, 2000)
// }, 2000)
