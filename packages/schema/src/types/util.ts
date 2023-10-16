export type NonNullableValues<T> = {
  [K in keyof T]: NonNullable<T[K]>;
}
