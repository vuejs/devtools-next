import { devtools } from '@vue/devtools-kit'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { devtoolsAppRecords, resetDevToolsContext, resetDevToolsState } from '../../src/state'
import App from '../fixtures/App.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: App,
    name: 'home',
    alias: '/index',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('vue plugin', () => {
  beforeAll(() => {
    devtools.init()
  })
  afterEach(() => {
    resetDevToolsState()
    resetDevToolsContext()
  })
  it('should work w/ register plugin', async () => {
    await new Promise<void>((resolve) => {
      devtools.hook.on.vueAppInit(() => {
        const [appRecord] = devtoolsAppRecords.value
        expect(devtools.state.pluginBuffer.findIndex(([descriptor]) => descriptor.packageName === 'vue-router')).toBeGreaterThanOrEqual(0)
        expect(appRecord.moduleDetectives?.vueRouter).toBe(true)
        resolve()
      })
      mount(App, {
        attachTo: document.body,
        global: {
          plugins: [router],
        },
      })
    })
  })
})
