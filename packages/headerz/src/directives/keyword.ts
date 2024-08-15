import { type Directive, createDirective } from '../directive'
import type { Header } from '../header'
import { dual } from '../utils/function'
import { isString } from '../utils/predicates'

function createKeywordOperations<
  const K extends string,
  const V extends string,
>(key: K, isKeyword: (value: string) => value is V) {
  const set: {
    <H extends Header<{ [P in K]: V }>>(header: H, value: V): H
    <H extends Header<{ [P in K]: V }>>(value: V): (header: H) => H
  } = dual(2, (header: Header<{ [P in K]: V }>, value: V) => {
    if (!isString(value)) {
      throw new TypeError('Expected a string')
    }

    if (!isKeyword(value)) {
      throw new TypeError('Invalid keyword')
    }

    if (value === '') {
      return unset(header)
    }
    return header.with(key, value)
  })

  const unset = <H extends Header<{ [P in K]: V }>>(header: H): H => {
    return header.with(key, undefined)
  }

  return {
    set,
    unset,
  }
}

export type KeywordOperations<K extends string, V extends string> = ReturnType<
  typeof createKeywordOperations<K, V>
>

function stringifyKeyword<const V extends string>(
  value: V,
  self: Directive<string, string, V>,
  separator: string,
  literal?: boolean,
): string | null {
  if (literal) {
    return value
  }

  return `${self.name}${separator}${value}`
}

function parseKeyword<const V extends string>(
  value: string,
  self: Directive<string, string, V>,
  separator: string,
  isKeyword: (value: string) => value is V,
): V {
  const argument = value.replace(`${self.name}${separator}`, '')

  if (!isKeyword(argument)) {
    throw new TypeError('Invalid keyword')
  }

  return argument
}

interface KeywordOptions<V extends string> {
  separator?: string
  isKeyword: (value: string) => value is V
  literal?: boolean
}

export type KeywordDirective<
  N extends string,
  K extends string,
  V extends string,
> = Directive<N, K, V, KeywordOperations<K, V>>

export function keyword<
  const N extends string,
  const K extends string,
  const V extends string,
>(name: N, key: K, options: KeywordOptions<V>): KeywordDirective<N, K, V> {
  const separator = options.separator ?? ' '
  return createDirective({
    name,
    key,
    validate: (value): value is V =>
      isString(value) && options.isKeyword(value),
    parse: (value, self) =>
      parseKeyword(value, self, separator, options.isKeyword),
    stringify: (value, self) =>
      stringifyKeyword(value, self, separator, options.literal),
    operations: createKeywordOperations(key, options.isKeyword),
  })
}
