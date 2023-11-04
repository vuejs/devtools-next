// @TODO: pinia edit, route edit

export enum EditStateType {
  Component,
  Pinia,
  Route,
}

export interface EditStateEventPayload<T extends EditStateType, D = unknown> {
  payload: EditStatePayloads<D>[T]
  type: T
}

export interface EditStatePayloads<D = unknown> {
  [EditStateType.Component]: EditStateComponentPayload<D>
  [EditStateType.Pinia]: Record<string, null>
  [EditStateType.Route]: Record<string, null>
}

export interface EditStatePayloadData<T = unknown> {
  value: T
  newKey: string | null
  remove?: false
}

// component edit
export interface EditStateComponentPayload<T = unknown> {
  instanceId: string
  dotPath: string
  dataType?: string
  data: EditStatePayloadData<T>
}
