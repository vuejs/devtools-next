import { VueAppInstance } from '@vue-devtools-next/schema'

function mergeOptions(
  to: any,
  from: any,
  instance: VueAppInstance,
) {
  if (typeof from === 'function')
    from = from.options

  if (!from)
    return to

  const { mixins, extends: extendsOptions } = from

  extendsOptions && mergeOptions(to, extendsOptions, instance)
  mixins
    && mixins.forEach(m =>
      mergeOptions(to, m, instance),
    )

  for (const key of ['computed', 'inject']) {
    if (Object.prototype.hasOwnProperty.call(from, key)) {
      if (!to[key])
        to[key] = from[key]

      else
        Object.assign(to[key], from[key])
    }
  }
  return to
}

// @TODO: maybe should be exported from vue core?
function resolveMergedOptions(
  instance: VueAppInstance,
) {
  const raw = instance.type
  const { mixins, extends: extendsOptions } = raw
  const globalMixins = instance.appContext.mixins
  if (!globalMixins.length && !mixins && !extendsOptions)
    return raw
  const options = {}
  globalMixins.forEach(m => mergeOptions(options, m, instance))
  mergeOptions(options, raw, instance)
  return options
}

export function processInstanceState(instance: VueAppInstance) {
  const mergedType = resolveMergedOptions(instance)
}
