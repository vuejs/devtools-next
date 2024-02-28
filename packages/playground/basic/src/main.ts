import { createPinia } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

import Home from './pages/Home.vue'
import Hey from './pages/Hey.vue'
import './style.css'
import 'uno.css'

const pinia = createPinia()

const app = createApp(App)

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(router)
app.use(pinia)

app.mount('#app')

// setTimeout(() => {
//   addCustomCommand({
//     id: 'vueuse',
//     title: 'VueUse',
//     action: {
//       type: 'url',
//       src: 'https://vueuse.org/',
//     },
//   })
// }, 2000)

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
// }, 2000)
