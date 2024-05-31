import { stringifyReplacer } from '../core/component/state/replacer'
import { reviver } from '../core/component/state/reviver'
import { parseCircularAutoChunks, stringifyCircularAutoChunks } from './transfer'

export function stringify<T extends object = Record<string, unknown>>(data: T) {
  return stringifyCircularAutoChunks(data as Record<string, unknown>, stringifyReplacer)
}

export function parse(data: string, revive = false) {
  // eslint-disable-next-line eqeqeq
  if (data == undefined)
    return {}

  return revive
    ? parseCircularAutoChunks(data, reviver)
    : parseCircularAutoChunks(data)
}

export * from '../core/component/state/format'
