export function useContext<T = unknown>(_key: string) {
  const key = Symbol(_key)
  return {
    set(value: T) {
      provide(key, value)
    },
    get() {
      return inject<T>(key)
    },
  }
}
