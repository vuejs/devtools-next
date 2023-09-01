import { createApp } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import Home from './pages/Home.vue'
import './style.css'
import App from './App.vue'

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
app.mount('#app')
