import { type Directive, createDirective } from '../directive'
import type { Header } from '../header'
import { dual } from '../utils/function'
import { isBoolean } from '../utils/predicates'

function createBooleanOperations<const K extends string>(key: K) {
  const set: {
    <H extends Header<Record<K, boolean>>>(header: H, value: boolean): H
    <H extends Header<Record<K, boolean>>>(value: boolean): (header: H) => H
  } = dual(2, (header: Header<Record<K, boolean>>, value: boolean) => {
    return header.with(key, value)
  })

  const or: {
    <H extends Header<Record<K, boolean>>>(header: H, value: boolean): H
    <H extends Header<Record<K, boolean>>>(value: boolean): (header: H) => H
  } = dual(2, (header: Header<Record<K, boolean>>, value: boolean) => {
    return header.with(key, !!header.directives[key] || value)
  })

  const and: {
    <H extends Header<Record<K, boolean>>>(header: H, value: boolean): H
    <H extends Header<Record<K, boolean>>>(value: boolean): (header: H) => H
  } = dual(2, (header: Header<Record<K, boolean>>, value: boolean) => {
    return header.with(key, !!header.directives[key] && value)
  })

  const xor: {
    <H extends Header<Record<K, boolean>>>(header: H, value: boolean): H
    <H extends Header<Record<K, boolean>>>(value: boolean): (header: H) => H
  } = dual(2, (header: Header<Record<K, boolean>>, value: boolean) => {
    return header.with(key, !!header.directives[key] !== value)
  })

  const negate = <H extends Header<Record<K, boolean>>>(header: H): H => {
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

type BooleanOperations<K extends string> = ReturnType<
  typeof createBooleanOperations<K>
>

function stringifyBoolean(
  value: boolean,
  self: Directive<string, string, boolean>,
): string | null {
  if (value) {
    return self.key
  }
  return null
}

export function createBooleanDirective<
  const N extends string,
  const K extends string,
>(name: N, key: K): Directive<N, K, boolean, BooleanOperations<K>> {
  return createDirective(
    name,
    key,
    isBoolean,
    stringifyBoolean,
    createBooleanOperations(key),
  )
}
