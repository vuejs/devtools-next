import { NOOP } from '@vue-devtools-next/shared'
import type { EditStatePayloadData } from '../core/component/types'

type Recordable = Record<PropertyKey, unknown>

type PropPath = string | string[]

export class StateEditor {
  refEditor = new RefStateEditor()

  set(
    object: Recordable,
    path: PropPath,
    value: unknown,
    cb: (object: Recordable, field: string, value: unknown) => void = NOOP,
  ) {
    const sections = Array.isArray(path) ? path : path.split('.')
    while (sections.length > 1) {
      const section = sections.shift()!
      object = object[section] as Recordable
      if (this.refEditor.isRef(object))
        object = this.refEditor.get(object)
    }
    const field = sections[0]
    if (cb)
      cb(object, field, value)
    else if (this.refEditor.isRef(object[field]))
      this.refEditor.set(object[field], value)
    else
      object[field] = value
  }

  get(object: Recordable, path: PropPath) {
    const sections = Array.isArray(path) ? path : path.split('.')
    for (let i = 0; i < sections.length; i++) {
      object = object[sections[i]] as Recordable
      if (this.refEditor.isRef(object))
        object = this.refEditor.get(object)
      if (!object)
        return undefined
    }
    return object
  }

  has(object: Recordable, path: PropPath, parent = false) {
    if (typeof object === 'undefined')
      return false
    const sections = Array.isArray(path) ? path.slice() : path.split('.')
    const size = !parent ? 1 : 2
    while (object && sections.length > size) {
      const section = sections.shift()!
      object = object[section] as Recordable
      if (this.refEditor.isRef(object))
        object = this.refEditor.get(object)
    }
    return object != null && Object.prototype.hasOwnProperty.call(object, sections[0])
  }

  createDefaultSetCallback(state: EditStatePayloadData) {
    return (object: Recordable, field: string | number, value: unknown) => {
      if (state.remove || state.newKey) {
        if (Array.isArray(object))
          object.splice(field as number, 1)
        else
          Reflect.deleteProperty(object, field)
        if (!state.remove) {
          const target = object[state.newKey || field]
          if (this.refEditor.isRef(target))
            this.refEditor.set(target, value)
          else
            object[state.newKey || field] = value
        }
      }
    }
  }
}

// @TODO: To be implemented, the upstream `vuejs/devtools` mark this as un implemented, so the priority is low.
class RefStateEditor {
  set(_ref: any, _value: any): void {
  }

  get(ref: any): any {
    return ref
  }

  isRef(_ref: any): boolean {
    return false
  }
}
