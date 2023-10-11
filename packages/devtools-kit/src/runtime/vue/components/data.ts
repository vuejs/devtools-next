import { VueAppInstance } from '@vue-devtools-next/schema'
import { camelize } from '@vue-devtools-next/shared'
import { returnError } from './util'

const fnTypeRE = /^(?:function|class) (\w+)/
/**
 * Convert prop type constructor to string.
 */
function getPropType(type: Array<string | null | Function | number> | string | null | Function | number) {
  if (Array.isArray(type))
    return type.map(t => getPropType(t)).join(' or ')

  if (type == null)
    return 'null'

  const match = type.toString().match(fnTypeRE)
  return typeof type === 'function'
    ? (match && match[1]) || 'any'
    : 'any'
}

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

function processProps(instance: VueAppInstance) {
  const props: any[] = []
  const propDefinitions = instance.type.props

  for (const key in instance.props) {
    const propDefinition = propDefinitions ? propDefinitions[key] : null
    const camelizeKey = camelize(key)
    props.push({
      type: 'props',
      key: camelizeKey,
      value: returnError(() => instance.props[key]),
      meta: propDefinition
        ? {
            type: propDefinition.type ? getPropType(propDefinition.type) : 'any',
            required: !!propDefinition.required,
            ...propDefinition.default
              ? {
                  default: propDefinition.default.toString(),
                }
              : {},
          }
        : { type: 'invalid' },
    })
  }

  return instance.type.props
}

export function processInstanceState(instance: VueAppInstance) {
  const mergedType = resolveMergedOptions(instance)
  return processProps(instance)
}
