import { createPinia } from 'pinia'
import { createApp } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

// import { devtools } from '@vue/devtools-next'
import { addCustomCommand, addCustomTab } from '@vue/devtools-next-api'
import App2 from './App.vue'
import App from './App.preview.vue'
import Home from './pages/Home.vue'
import Hello from './pages/Hello.vue'
import Hey from './pages/Hey.vue'
import './style.css'

// connect to remote devtools
// devtools.connect('http://localhost', 8080)

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

addCustomTab({
  name: 'vueuse',
  icon: 'i-logos-vueuse',
  title: 'VueUse',
  view: {
    type: 'iframe',
    src: 'https://vueuse.org/',
  },
  category: 'app',
})

addCustomCommand({
  id: 'vueuse',
  title: 'VueUse',
  icon: 'i-logos-vueuse',
  children: [
    {
      id: 'vueuse:github',
      title: 'Github',
      icon: 'i-logos-github',
      action: {
        type: 'url',
        src: 'https://github.com/vueuse/vueuse',
      },
    },
    {
      id: 'vueuse:website',
      title: 'Website',
      icon: 'i-logos-vueuse',
      action: {
        type: 'url',
        src: 'https://vueuse.org/',
      },
      order: 2,
    },
  ],
})

app.use(router)
app.use(pinia)

// setTimeout(() => {
// }, 2000)

app.mount('#app')

// onDevToolsClientConnected(() => {
//   console.log('devtools client connected')
// })

// app2.use(router2)
// app2.use(pinia2)
// app2.mount('#app2')
