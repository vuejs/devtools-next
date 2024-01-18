export function isObject<T extends object>(value: any): value is T {
  return typeof value === 'object' && !Array.isArray(value) && value !== null
}

export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value)
}

export function isSet<T>(value: any): value is Set<T> {
  return value instanceof Set
}

export function isMap<K, V>(value: any): value is Map<K, V> {
  return value instanceof Map
}
