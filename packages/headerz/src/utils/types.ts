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

export type IntersectionOf<T> = (
  T extends unknown
    ? (k: T) => void
    : never
) extends (k: infer I) => void
  ? I extends Record<PropertyKey, unknown>
    ? I
    : never
  : never

export type KeysOf<T> = T extends unknown ? keyof T : never

type DefineKey<O extends object, K extends keyof O> = Identity<
  Required<Pick<O, K>> & Omit<O, K>
>

type ExtractAndDefine<O extends object, K extends keyof O> = DefineKey<
  Extract<O, { [P in K]: unknown }>,
  K
>
type HandlePropertyAssertion<
  O extends object,
  K extends PropertyKey,
> = PropertyKey extends keyof O
  ? Record<K, unknown>
  : K extends keyof O
    ? ExtractAndDefine<O, keyof O & K>
    : never

export type AssertProperty<
  O extends object,
  K extends PropertyKey,
> = O extends unknown ? HandlePropertyAssertion<O, K> : never
