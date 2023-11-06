import type { MaybeRef, Ref } from 'vue'
import { isRef } from 'vue'
import { getComponentInstance, nodeIdToInstanceId } from '../general'
import { devtoolsContext } from '../../general'

import type { InspectorStateEditorPayload } from '../types'

type Recordable = Record<PropertyKey, any>

type PropPath = string | string[]

export class StateEditor {
  refEditor = new RefStateEditor()

  set(
    object: Recordable,
    path: PropPath,
    value: unknown,
    cb?: (object: Recordable, field: string, value: unknown) => void,
  ) {
    const sections = Array.isArray(path) ? path : path.split('.')
    while (sections.length > 1) {
      const section = sections.shift()!
      object = object[section] as Recordable
      if (this.refEditor.isRef(object))
        object = this.refEditor.get(object)
    }
    const field = sections[0]
    const item = object[field]
    if (cb)
      cb(object, field, value)
    else if (this.refEditor.isRef(item))
      this.refEditor.set(item, value)
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

  createDefaultSetCallback(state: InspectorStateEditorPayload['state']) {
    return (object: Recordable, field: string | number, value: unknown) => {
      if (state.remove || state.newKey) {
        if (Array.isArray(object))
          object.splice(field as number, 1)
        else
          Reflect.deleteProperty(object, field)
      }
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

class RefStateEditor {
  set(ref: Ref<any>, value: any): void {
    ref.value = value
  }

  get(ref: any): any {
    return ref
  }

  isRef(ref: MaybeRef<any>): ref is Ref<any> {
    return isRef(ref)
  }
}

export async function editComponentState(payload: InspectorStateEditorPayload, stateEditor: StateEditor) {
  const { path, nodeId, state } = payload
  const instanceId = nodeIdToInstanceId(devtoolsContext.appRecord.id, nodeId)
  // assert data types, currently no...
  // if (!['data', 'props', 'computed', 'setup'].includes(dataType))
  const instance = getComponentInstance(devtoolsContext.appRecord, instanceId)
  if (!instance)
    return

  const paths = path.split('.')
  const targetPath = paths.slice()

  let target: Record<string, unknown> | undefined

  // TODO: props
  if (instance.devtoolsRawSetupState && Object.keys(instance.devtoolsRawSetupState).includes(paths[0])) {
    // Setup
    target = instance.devtoolsRawSetupState
  }

  if (target && targetPath)
    stateEditor.set(target, targetPath, state.value, stateEditor.createDefaultSetCallback(state))
}

export const stateEditor = new StateEditor()

// TODO: currently (w/ Vue official devtools), we send all state to frontend after changes,
//       we can optimize this by only sending the changed state, to make a better UX.
// PRIORITY: LOW
export async function editState(payload: InspectorStateEditorPayload) {
  editComponentState(payload, stateEditor)
}
