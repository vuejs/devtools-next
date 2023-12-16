import { createPinia } from 'pinia'
import { createApp } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import App2 from './App.vue'
import App from './App.preview.vue'
import Home from './pages/Home.vue'
import Hello from './pages/Hello.vue'
import Hey from './pages/Hey.vue'
import './style.css'

// connect to remote devtools
// connect('http://localhost', 8098)

const pinia = createPinia()
const pinia2 = createPinia()

const app = createApp(App)

const app2 = createApp(App2)

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
    component: Hey,
    name: 'hey',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const router2 = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(router)
app.use(pinia)

// setTimeout(() => {
// }, 2000)

app.mount('#app')

// app2.use(router2)
// app2.use(pinia2)
// app2.mount('#app2')
