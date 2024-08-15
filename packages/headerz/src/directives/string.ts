import { type Directive, createDirective } from '../directive'
import type { Header } from '../header'
import { dual } from '../utils/function'
import { isString } from '../utils/predicates'

function createStringOperations<const K extends string>(key: K) {
  const set: {
    <H extends Header<{ [P in K]: string }>>(header: H, value: string): H
    <H extends Header<{ [P in K]: string }>>(value: string): (header: H) => H
  } = dual(2, (header: Header<{ [P in K]: string }>, value: string) => {
    if (!isString(value)) {
      throw new TypeError('Expected a string')
    }

    if (value === '') {
      return unset(header)
    }
    return header.with(key, value)
  })

  const unset = <H extends Header<{ [P in K]: string }>>(header: H): H => {
    return header.with(key, undefined)
  }

  return {
    set,
    unset,
  }
}

export type StringOperations<K extends string> = ReturnType<
  typeof createStringOperations<K>
>

// 24 blocks...
function stringifyString(
  value: string,
  self: Directive<string, string, string>,
  separator: string,
  stringify?: (value: string) => string,
  literal?: boolean,
): string | null {
  const argument = stringify ? stringify(value) : value

  if (argument === '') {
    return null
  }

  if (literal) {
    return argument
  }

  return `${self.name}${separator}${argument}`
}

function parseString(
  value: string,
  self: Directive<string, string, string>,
  separator: string,
  parse?: (value: string) => string,
): string {
  const argument = value.replace(`${self.name}${separator}`, '')

  if (parse) {
    return parse(argument)
  }

  return argument
}

interface StringOptions {
  separator?: string
  validate?: (value: string) => boolean
  parse?: (value: string) => string
  stringify?: (value: string) => string
  literal?: boolean
}

export type StringDirective<N extends string, K extends string> = Directive<
  N,
  K,
  string,
  StringOperations<K>
>

export function string<const N extends string, const K extends string>(
  name: N,
  key: K,
  options?: StringOptions,
): StringDirective<N, K> {
  const separator = options?.separator ?? ' '
  return createDirective({
    name,
    key,
    validate: (value): value is string =>
      isString(value) && (options?.validate?.(value) ?? true),
    parse: (value, self) => parseString(value, self, separator, options?.parse),
    stringify: (value, self) =>
      stringifyString(
        value,
        self,
        separator,
        options?.stringify,
        options?.literal,
      ),
    operations: createStringOperations(key),
  })
}
