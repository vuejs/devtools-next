export interface EditStatePayload<T = unknown> {
  value: T
  newKey: string | null
  remove?: false
}

export interface EditStateEventPayload<T = unknown> {
  instanceId: string
  dotPath: string
  payload: EditStatePayload<T>
  type?: string
}
