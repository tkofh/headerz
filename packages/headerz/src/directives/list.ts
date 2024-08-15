import { type Directive, createDirective } from '../directive'
import type { Header } from '../header'
import { dual } from '../utils/function'
import { isArray } from '../utils/predicates'

function createListOperations<const K extends string, const E extends string>(
  key: K,
  isElement: (value: unknown) => value is E,
  comparator?: (a: E, b: E) => number,
) {
  const set: {
    <H extends Header<{ [P in K]: ReadonlyArray<E> }>>(
      header: H,
      value: ReadonlyArray<E>,
    ): H
    <H extends Header<{ [P in K]: ReadonlyArray<E> }>>(
      value: ReadonlyArray<E>,
    ): (header: H) => H
  } = dual(
    2,
    <H extends Header<{ [P in K]: ReadonlyArray<E> }>>(
      header: H,
      value: ReadonlyArray<E>,
    ) => {
      for (const element of value) {
        if (!isElement(element)) {
          throw new TypeError(`Invalid element: ${element}`)
        }
      }
      if (value.length === 0) {
        return unset(header)
      }
      return header.with(key, value.toSorted(comparator))
    },
  )

  const include: {
    <H extends Header<{ [P in K]: ReadonlyArray<E> }>>(header: H, value: E): H
    <H extends Header<{ [P in K]: ReadonlyArray<E> }>>(
      value: E,
    ): (header: H) => H
  } = dual(
    2,
    <H extends Header<{ [P in K]: ReadonlyArray<E> }>>(header: H, value: E) => {
      const current = header.directives[key]
      if (!isArray(current)) {
        return header.with(key, [value])
      }
      if (current.includes(value)) {
        return header
      }
      return header.with(
        key,
        ([...current, value] as ReadonlyArray<E>).toSorted(comparator),
      )
    },
  )

  const exclude: {
    <H extends Header<{ [P in K]: ReadonlyArray<E> }>>(header: H, value: E): H
    <H extends Header<{ [P in K]: ReadonlyArray<E> }>>(
      value: E,
    ): (header: H) => H
  } = dual(
    2,
    <H extends Header<{ [P in K]: ReadonlyArray<E> }>>(header: H, value: E) => {
      const current = header.directives[key]
      if (!isArray(current)) {
        return header
      }
      if (!current.includes(value)) {
        return header
      }
      return header.with(
        key,
        ([...current] as ReadonlyArray<E>).filter((v) => v !== value),
      )
    },
  )

  const unset = <H extends Header<{ [P in K]: ReadonlyArray<E> }>>(
    header: H,
  ): H => {
    return header.with(key, undefined)
  }

  return {
    set,
    include,
    exclude,
    unset,
  }
}

type ListOperations<K extends string, E extends string> = ReturnType<
  typeof createListOperations<K, E>
>

function stringifyList<E extends string>(
  value: ReadonlyArray<E>,
  self: Directive<string, string, ReadonlyArray<E>>,
  separator: string,
  comparator?: (a: E, b: E) => number,
  map?: (value: ReadonlyArray<E>) => ReadonlyArray<E>,
  literal?: boolean,
): string | null {
  if (value.length === 0) {
    return null
  }
  const result = map ? map(value) : value

  if (literal) {
    return result.toSorted(comparator).join(separator)
  }

  return `${self.name}${separator}${result.toSorted(comparator).join(separator)}`
}

function parseList<E extends string>(
  value: string,
  separator: string,
): ReadonlyArray<E> {
  return value.split(separator) as unknown as ReadonlyArray<E>
}

interface ListOptions<E extends string> {
  isElement: (value: unknown) => value is E
  separator: string
  literal?: boolean
  comparator?: (a: E, b: E) => number
  map?: (value: ReadonlyArray<E>) => ReadonlyArray<E>
}

export function list<
  const N extends string,
  const K extends string,
  const E extends string,
>(
  name: N,
  key: K,
  options: ListOptions<E>,
): Directive<N, K, ReadonlyArray<E>, ListOperations<K, E>> {
  return createDirective({
    name,
    key,
    validate: (value) => isArray(value) && value.every(options.isElement),
    parse: (value) => parseList(value, options.separator),
    stringify: (value, self) =>
      stringifyList(
        value,
        self,
        options.separator,
        options.comparator,
        options.map,
        options.literal,
      ),
    operations: createListOperations(
      key,
      options.isElement,
      options.comparator,
    ),
  })
}

export type ListDirective<
  N extends string,
  K extends string,
  E extends string,
> = Directive<N, K, ReadonlyArray<E>, ListOperations<K, E>>
