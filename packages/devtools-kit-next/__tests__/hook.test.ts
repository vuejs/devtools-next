import { devtools } from '@vue/devtools-kit-next'
import { mount } from '@vue/test-utils'
import { describe, it } from 'vitest'
import App from './fixtures/App.vue'

describe('hook', () => {
  it('should work', async () => {
    devtools.init()
    /**
     * Work failed now, Wait for:
     * https://github.com/vuejs/test-utils/issues/2310
     */
    const app = mount(App, {
      attachTo: document.body,
    })
    await new Promise(() => {})
  })
})
