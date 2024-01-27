import { devtools } from '@vue/devtools-kit-next'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from './fixtures/App.vue'

describe('hook', () => {
  it('should work w/ app init hook', async () => {
    await new Promise<void>((resolve) => {
      devtools.init()

      devtools.hook.on.vueAppInit((app, version) => {
        expect(app).toBeTypeOf('object')
        expect(version).toBeTypeOf('string')
        resolve()
      })
      mount(App, {
        attachTo: document.body,
      })
    })
  })
})
