import { getCurrentInstance } from 'vue'
import { DEVTOOLS_API_INSPECT_STATE_KEY } from '@vue/devtools-shared'
import { __DEV__ } from '../constants'

/**
 * Register a setup state on an instance, which will be displayed in the "Component" tab.
 * This is very useful when using `defineComponent` with setup returning the render function.
 *
 * @param state any states you want to see in the vue devtool
 *
 * @example
 * const Component = defineComponent({
 *   setup() {
 *     const name = ref('foo')
 *     inspectSetupState({
 *       name,
 *     })
 *     return h('div', name.value)
 *   },
 * })
 *
 */
export const inspectSetupState = __DEV__
  ? function inspectSetupState(state: Record<string, any>) {
    const currentInstance = getCurrentInstance()
    if (!currentInstance) {
      throw new Error('[Vue Devtools API]: Please using `inspectSetupState()` inside `setup()`.')
    }
    // @ts-expect-error internal api
    currentInstance.devtoolsRawSetupState ??= {}
    // @ts-expect-error internal api
    const devtoolsRawSetupState = currentInstance.devtoolsRawSetupState
    Object.assign(devtoolsRawSetupState, state)
    devtoolsRawSetupState[DEVTOOLS_API_INSPECT_STATE_KEY] ??= []
    devtoolsRawSetupState[DEVTOOLS_API_INSPECT_STATE_KEY].push(...Object.keys(state))
  }
  : (state: Record<string, any>) => {
    // do nothing
    }
