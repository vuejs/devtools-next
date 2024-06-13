import { stringifyReplacer } from '../../core/component/state/replacer'
import { stringifyStrictCircularAutoChunks } from '../transfer'

it('encode', () => {
  const vueInstanceLike = {
    _: {
      ctx: {
        props: {},
      },
      vnode: [],
      type: {
        props: [],
      },
      appContext: {
        mixins: [],
      },
      setupState: {},
      attrs: {},
      provides: {},
      injects: {},
      refs: {},
    },
    __isVue: true,
    a: 1,
    b: {
      state: [] as any[],
    },
  }

  vueInstanceLike.b.state.push({
    type: 'provided',
    key: '$currentInstance',
    value: vueInstanceLike,
  })

  vueInstanceLike.b.state.push({
    type: 'provided',
    key: '$currentInstance2',
    value: vueInstanceLike,
  })

  expect(stringifyStrictCircularAutoChunks(vueInstanceLike, stringifyReplacer)).toMatchSnapshot()
})
