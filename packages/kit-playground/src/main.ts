import { createPinia } from 'pinia'
import { createApp } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { devtools } from '@vue/devtools-kit-next'
import App from './App.vue'
import Home from './pages/Home.vue'

import './style.css'

devtools.init()

const pinia = createPinia()

const app = createApp(App)

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
    name: 'home',
    alias: '/index',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(router)
app.use(pinia)

// setTimeout(() => {
// }, 2000)

app.mount('#app')
