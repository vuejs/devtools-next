export interface EditStatePayload<T = unknown> {
  value: T
  newKey: string | null
  remove?: false
}
