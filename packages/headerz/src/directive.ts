import type { Header } from './header'
import { dual } from './utils/function'
import { isBoolean } from './utils/predicates'
import type { Identity, IntersectionOf } from './utils/types'

export type DirectiveOperations<N extends string, _K extends string, V> = {
  [K in string]:
    | (<H extends Header<{ [K in N]: V }>>(
        // biome-ignore lint/suspicious/noExplicitAny: needed for generics
        ...args: Array<any>
      ) => (header: H) => H)
    | (<H extends Header<{ [K in N]: V }>>(
        // biome-ignore lint/suspicious/noExplicitAny: needed for generics
        ...args: Array<any>
      ) => H)
}

export interface Directive<
  N extends string,
  K extends string,
  V,
  // biome-ignore lint/suspicious/noExplicitAny: needed for generics
  O extends DirectiveOperations<N, K, V> = any,
> {
  // name of the directive
  readonly name: N
  // key on the input object
  readonly key: K
  readonly operations: O
  stringify(value: V, self: this): string | null
  validate(value: unknown, self: this): value is V
}

type _DirectivesFrom<T> = T extends Directive<string, infer K, infer V>
  ? { [P in K]: V }
  : never
export type DirectivesFrom<
  T extends ReadonlyArray<Directive<string, string, unknown>>,
> = Partial<Identity<IntersectionOf<_DirectivesFrom<T[number]>>>>

type _OperationsFrom<T> = T extends Directive<string, infer K, unknown, infer O>
  ? { [P in K]: O }
  : never
export type OperationsFrom<
  T extends ReadonlyArray<Directive<string, string, unknown>>,
> = Identity<IntersectionOf<_OperationsFrom<T[number]>>>
export function createDirective<
  N extends string,
  K extends string,
  V,
  O extends DirectiveOperations<N, K, V>,
>(
  name: N,
  key: K,
  validate: (value: unknown, self: Directive<N, K, V, O>) => value is V,
  stringify: (value: V, self: Directive<N, K, V, O>) => string | null,
  operations?: O,
): Directive<N, K, V, O> {
  return {
    operations: operations ?? ({} as O),

    name,
    key,

    stringify(value: V): string | null {
      return stringify(value, this as unknown as Directive<N, K, V, O>)
    },

    validate(value: unknown, self: Directive<N, K, V, O>): value is V {
      return validate(value, self)
    },
  }
}

function stringifyBoolean(
  value: boolean,
  self: Directive<string, string, boolean>,
): string | null {
  if (value) {
    return self.key
  }
  return null
}

function setBoolean<const K extends string>(
  key: K,
): {
  <H extends Header<{ [P in K]: boolean }>>(header: H, value: boolean): H
  <H extends Header<{ [P in K]: boolean }>>(value: boolean): (header: H) => H
} {
  return dual(2, (header: Header<{ [P in K]: boolean }>, value: boolean) => {
    return header.with(key, value)
  })
}

export const publicDirective = createDirective(
  'public',
  'public',
  isBoolean,
  stringifyBoolean,
  {
    set: setBoolean('public'),
  },
)
