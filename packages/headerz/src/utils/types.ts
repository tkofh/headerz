export type Falsifiable<T> = {
  [K in keyof T]: T[K] | false
}

export type KeysOfType<T, U> = {
  [K in keyof T]: K extends string ? (T[K] extends U ? K : never) : never
}[keyof T]
