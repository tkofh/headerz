import { type Directive, createDirective } from '../directive'
import type { Header } from '../header'
import { dual } from '../utils/function'
import { isBoolean } from '../utils/predicates'

function createBooleanOperations<const K extends string>(key: K) {
  const set: {
    <H extends Header<{ [P in K]: boolean }>>(header: H, value: boolean): H
    <H extends Header<{ [P in K]: boolean }>>(value: boolean): (header: H) => H
  } = dual(2, (header: Header<{ [P in K]: boolean }>, value: boolean) => {
    return header.with(key, value)
  })

  const or: {
    <H extends Header<{ [P in K]: boolean }>>(header: H, value: boolean): H
    <H extends Header<{ [P in K]: boolean }>>(value: boolean): (header: H) => H
  } = dual(2, (header: Header<{ [P in K]: boolean }>, value: boolean) => {
    return header.with(key, !!header.directives[key] || value)
  })

  const and: {
    <H extends Header<{ [P in K]: boolean }>>(header: H, value: boolean): H
    <H extends Header<{ [P in K]: boolean }>>(value: boolean): (header: H) => H
  } = dual(2, (header: Header<{ [P in K]: boolean }>, value: boolean) => {
    return header.with(key, !!header.directives[key] && value)
  })

  const xor: {
    <H extends Header<{ [P in K]: boolean }>>(header: H, value: boolean): H
    <H extends Header<{ [P in K]: boolean }>>(value: boolean): (header: H) => H
  } = dual(2, (header: Header<{ [P in K]: boolean }>, value: boolean) => {
    return header.with(key, !!header.directives[key] !== value)
  })

  const negate = <H extends Header<{ [P in K]: boolean }>>(header: H): H => {
    return header.with(key, !header.directives[key])
  }

  return {
    set,
    or,
    and,
    xor,
    negate,
  }
}

export type BooleanOperations<K extends string> = ReturnType<
  typeof createBooleanOperations<K>
>

function stringifyBoolean(
  value: boolean,
  self: Directive<string, string, boolean>,
): string | null {
  if (value) {
    return self.name
  }
  return null
}

function parseBoolean(
  value: string,
  self: Directive<string, string, boolean>,
): boolean {
  return value === self.name
}

export function boolean<const N extends string, const K extends string>(
  name: N,
  key: K,
): Directive<N, K, boolean, BooleanOperations<K>> {
  return createDirective({
    name,
    key,
    validate: isBoolean,
    parse: parseBoolean,
    stringify: stringifyBoolean,
    operations: createBooleanOperations(key),
  })
}

export type BooleanDirective<N extends string, K extends string> = Directive<
  N,
  K,
  boolean,
  BooleanOperations<K>
>
