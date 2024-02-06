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
