export class StateEditor {
  static set(target: Record<string, unknown>, property: string | string[], value) {
    const sections = Array.isArray(property) ? property : property.split('.')
    while (sections.length > 1) {
      target = target[sections.shift()!] as Record<string, unknown>
      if (this.isRef(target))
        target = this.getRefValue(target)
    }
    const field = sections[0]

    if (this.isRef(target[field]))
      this.setRefValue(target[field], value)

    else
      target[field] = value
  }

  static get(target: Record<string, unknown>, property: string | string[]) {
    const sections = Array.isArray(property) ? property : property.split('.')
    for (let i = 0; i < sections.length; i++) {
      target = target[sections[i]] as Record<string, unknown>
      if (this.isRef(target))
        target = this.getRefValue(target)

      if (!target)
        return undefined
    }
    return target
  }

  static has(target: Record<string, unknown>, property: string | string[], parent = false) {
    if (typeof target === 'undefined')
      return false

    const sections = Array.isArray(property) ? property.slice() : property.split('.')
    const size = !parent ? 1 : 2
    while (target && sections.length > size) {
      target = target[sections.shift()!] as Record<string, unknown>
      if (this.isRef(target))
        target = this.getRefValue(target)
    }
    return target != null && Object.prototype.hasOwnProperty.call(target, sections[0])
  }

  static isRef(ref): boolean {
    return !!ref?.__v_isRef
  }

  static setRefValue(ref, value): void {
    ref.value = value
  }

  static getRefValue(ref) {
    return ref.value
  }
}
