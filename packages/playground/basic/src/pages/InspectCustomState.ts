import { defineComponent, h, reactive, ref } from 'vue'
import { inspectSetupState } from '@vue/devtools-api'

export default defineComponent({
  name: 'InspectCustomState',
  setup() {
    const count = ref(1)
    const state = reactive({
      name: 'foo',
      age: 10,
    })

    inspectSetupState({
      count,
      state,
    })

    return () => h('div', [
      h('button', {
        onClick() {
          count.value++
        },
      }, `count: ${count.value}`),
      h('div', `name: ${state.name}`),
      h('div', `age: ${state.age}`),
    ])
  },
})
