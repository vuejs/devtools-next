const MAX_SERIALIZED_SIZE = 512 * 1024 // 1MB

function encode(data: Record<string, unknown>, replacer: ((this: any, key: string, value: any) => any) | null, list: unknown[], seen: Map<unknown, number>) {
  let stored, key, value, i, l
  const seenIndex = seen.get(data)
  if (seenIndex != null)
    return seenIndex

  const index = list.length
  const proto = Object.prototype.toString.call(data)
  if (proto === '[object Object]') {
    stored = {}
    seen.set(data, index)
    list.push(stored)
    const keys = Object.keys(data)
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i]
      try {
        value = data[key]
        if (replacer)
          value = replacer.call(data, key, value)
      }
      catch (e) {
        value = e
      }
      stored[key] = encode(value, replacer, list, seen)
    }
  }
  else if (proto === '[object Array]') {
    stored = []
    seen.set(data, index)
    list.push(stored)
    for (i = 0, l = data.length; i < l; i++) {
      try {
        value = data[i]
        if (replacer)
          value = replacer.call(data, i, value)
      }
      catch (e) {
        value = e
      }
      stored[i] = encode(value, replacer, list, seen)
    }
  }
  else {
    list.push(data)
  }
  return index
}

export function stringifyCircularAutoChunks(data: Record<string, unknown>, replacer: ((this: any, key: string, value: any) => any) | null = null, space: number | null = null) {
  let result: string
  try {
    result = arguments.length === 1
      ? JSON.stringify(data)
      : JSON.stringify(data, replacer!, space!)
  }
  catch (e) {
    result = stringifyStrictCircularAutoChunks(data, replacer!, space!)
  }
  if (result.length > MAX_SERIALIZED_SIZE) {
    const chunkCount = Math.ceil(result.length / MAX_SERIALIZED_SIZE)
    const chunks: string[] = []
    for (let i = 0; i < chunkCount; i++)
      chunks.push(result.slice(i * MAX_SERIALIZED_SIZE, (i + 1) * MAX_SERIALIZED_SIZE))

    return chunks
  }
  return result
}

export function stringifyStrictCircularAutoChunks(data: Record<string, unknown>, replacer: ((this: any, key: string, value: any) => any) | null = null, space: number | null = null) {
  const list = []
  encode(data, replacer, list, new Map())
  return space
    ? ` ${JSON.stringify(list, null, space)}`
    : ` ${JSON.stringify(list)}`
}
