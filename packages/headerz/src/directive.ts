import type { Header } from './header'
import type { Identity } from './utils/types'

export type DirectiveOperations<K extends string, V> = {
  [P in string]:
    | (<H extends Header<{ [P in K]: V }>>(
        // biome-ignore lint/suspicious/noExplicitAny: needed for generics
        ...args: Array<any>
      ) => (header: H) => H)
    | (<H extends Header<{ [P in K]: V }>>(
        // biome-ignore lint/suspicious/noExplicitAny: needed for generics
        ...args: Array<any>
      ) => H)
}

export interface Directive<
  N extends string,
  K extends string,
  V,
  // biome-ignore lint/suspicious/noExplicitAny: needed for generics
  O extends DirectiveOperations<K, V> = any,
  I = V,
> {
  // name of the directive
  readonly name: N
  // key on the input object
  readonly key: K
  readonly operations: O
  translate(input: I): V
  stringify(value: V, self: this): string | null
  validate(value: unknown): value is V
  parse(value: string): V
}

export type AnyDirective = Directive<string, string, unknown>

export type DirectivesList = ReadonlyArray<Directive<string, string, unknown>>

export type ValuesOf<T extends AnyDirective> = Identity<{
  [K in T['key']]: Extract<T, { key: K }> extends Directive<
    string,
    string,
    infer V
  >
    ? V
    : never
}>

export type OperationsOf<T extends AnyDirective> = Identity<{
  [K in T['key']]: Extract<T, { key: K }> extends Directive<
    string,
    string,
    unknown,
    infer O
  >
    ? O
    : never
}>

export type InputsOf<T extends AnyDirective> = Identity<{
  [K in T['key']]: Extract<T, { key: K }> extends Directive<
    string,
    string,
    unknown,
    // biome-ignore lint/suspicious/noExplicitAny: generic
    any,
    infer I
  >
    ? I
    : never
}>

interface DirectiveOptions<
  N extends string,
  K extends string,
  V,
  O extends DirectiveOperations<K, V>,
  I = V,
> {
  name: N
  key: K
  validate: (value: unknown, self: Directive<N, K, V, O, I>) => value is V
  parse: (value: string, self: Directive<N, K, V, O, I>) => V
  stringify: (value: V, self: Directive<N, K, V, O, I>) => string | null
  operations: O
  translate?: (input: I) => V
}

export function createDirective<
  N extends string,
  K extends string,
  V,
  O extends DirectiveOperations<K, V>,
  I = V,
>(options: DirectiveOptions<N, K, V, O, I>): Directive<N, K, V, O, I> {
  const { name, key, validate, parse, stringify, operations, translate } =
    options

  return {
    operations,
    name,
    key,

    translate(input: I): V {
      return translate ? translate(input) : (input as unknown as V)
    },
    stringify(value: V): string | null {
      return stringify(value, this)
    },
    validate(value: unknown): value is V {
      return validate(value, this)
    },
    parse(value: string): V {
      return parse(value, this)
    },
  }
}
