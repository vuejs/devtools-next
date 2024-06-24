/**
 * Only import vue types
 */
import type { Ref, VNodeProps } from 'vue'

/**
 * To prevent include a **HUGE** vue package in the final bundle of chrome ext / electron
 * we stub the necessary vue module.
 * This implementation is based on the 1c3327a0fa5983aa9078e3f7bb2330f572435425 commit
 */

/**
 * @from [@vue/reactivity](https://github.com/vuejs/core/blob/1c3327a0fa5983aa9078e3f7bb2330f572435425/packages/reactivity/src/constants.ts#L17-L23)
 */
export enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw',
}

/**
 * @from [@vue/reactivity](https://github.com/vuejs/core/blob/1c3327a0fa5983aa9078e3f7bb2330f572435425/packages/reactivity/src/reactive.ts#L18-L24)
 */
export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.IS_SHALLOW]?: boolean
  [ReactiveFlags.RAW]?: any
}

/**
 * @from [@vue/reactivity](https://github.com/vuejs/core/blob/1c3327a0fa5983aa9078e3f7bb2330f572435425/packages/reactivity/src/reactive.ts#L330-L332)
 */
export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

/**
 * @from [@vue/reactivity](https://github.com/vuejs/core/blob/1c3327a0fa5983aa9078e3f7bb2330f572435425/packages/reactivity/src/reactive.ts#L312-L317)
 */
export function isReactive(value: unknown): boolean {
  if (isReadonly(value)) {
    return isReactive((value as Target)[ReactiveFlags.RAW])
  }
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

/**
 * @from [@vue/reactivity](https://github.com/vuejs/core/blob/1c3327a0fa5983aa9078e3f7bb2330f572435425/packages/reactivity/src/ref.ts#L99-L102)
 */
export function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
export function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true)
}

/**
 * @from [@vue/reactivity](https://github.com/vuejs/core/blob/1c3327a0fa5983aa9078e3f7bb2330f572435425/packages/reactivity/src/reactive.ts#L372-L375)
 */
export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}

/**
 * @from [@vue/runtime-core](https://github.com/vuejs/core/blob/1c3327a0fa5983aa9078e3f7bb2330f572435425/packages/runtime-core/src/vnode.ts#L63-L68)
 */
export const Fragment = Symbol.for('v-fgt') as any as {
  __isFragment: true
  new (): {
    $props: VNodeProps
  }
}
