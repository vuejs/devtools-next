import { createPinia } from 'pinia'
import { createApp } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './pages/Home.vue'
import Hello from './pages/Hello.vue'
import './style.css'

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
    component: Hello,
    name: 'hello',
  },
  {
    path: '/hey/:id',
    component: Hello,
    name: 'hello',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(router)
app.use(pinia)

// setTimeout(() => {
app.mount('#app')
// }, 2000)
