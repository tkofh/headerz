export type Falsifiable<T> = {
  [K in keyof T]: T[K] | false
}

export type KeysOfType<T, U> = {
  [K in keyof T]: K extends string ? (T[K] extends U ? K : never) : never
}[keyof T]

export type Identity<T> = { [K in keyof T]: T[K] }

export type RequireKey<T, K> = K extends keyof T
  ? Identity<{ [P in K]: Exclude<T[P], undefined> } & T>
  : never

type StrictRequireKey<T extends object, K extends keyof T> = {
  [P in keyof T & K]-?: Exclude<T[P], undefined>
} & Omit<T, K>

type StrictPick<T extends object, K extends PropertyKey> = T extends unknown
  ? K extends keyof T
    ? keyof T extends never
      ? never
      : StrictRequireKey<T, K>
    : never
  : never

export type AssertProperty<T extends object, K extends PropertyKey> = Identity<
  [unknown] extends [T]
    ? T & Record<K, unknown>
    : [PropertyKey] extends [keyof T]
      ? T & Record<K, unknown>
      : PropertyKey extends keyof T
        ? never
        : StrictPick<T, K>
>
