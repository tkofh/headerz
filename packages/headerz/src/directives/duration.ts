import { type Directive, createDirective } from '../directive'
import { type Duration, type DurationUnit, toNumber } from '../duration'
import { type Header, isHeader } from '../header'
import { dual } from '../utils/function'
import { isNumber, isString } from '../utils/predicates'

function createDurationOperations<const K extends string>(key: K) {
  const set: {
    <H extends Header<Record<K, Duration>>>(header: H, value: Duration): H
    <H extends Header<Record<K, Duration>>>(value: Duration): (header: H) => H
    <H extends Header<Record<K, Duration>>>(
      header: H,
      unit: DurationUnit,
      value: number,
    ): H
    <H extends Header<Record<K, Duration>>>(
      unit: DurationUnit,
      value: number,
    ): (header: H) => H
  } = dual(
    (args) => isHeader(args[0]),
    (
      header: Header<Record<K, Duration>>,
      valueOrUnit: Duration | DurationUnit,
      value?: number,
    ) => {
      if (isString(valueOrUnit)) {
        if (value === undefined) {
          throw new TypeError('Expected a number')
        }

        return header.with(key, toNumber(valueOrUnit as DurationUnit, value))
      }

      return header.with(key, toNumber(valueOrUnit))
    },
  )

  const withMin: {
    <H extends Header<Record<K, Duration>>>(header: H, value: Duration): H
    <H extends Header<Record<K, Duration>>>(value: Duration): (header: H) => H
    <H extends Header<Record<K, Duration>>>(
      header: H,
      unit: DurationUnit,
      value: number,
    ): H
    <H extends Header<Record<K, Duration>>>(
      unit: DurationUnit,
      value: number,
    ): (header: H) => H
  } = dual(
    (args) => isHeader(args[0]),
    (
      header: Header<Record<K, Duration>>,
      valueOrUnit: Duration | DurationUnit,
      value?: number,
    ) => {
      let min: number

      if (isString(valueOrUnit)) {
        if (!isNumber(value)) {
          throw new TypeError('Expected a number')
        }

        min = toNumber(valueOrUnit as DurationUnit, value)
      } else {
        min = toNumber(valueOrUnit)
      }

      const current = header.directives[key] as number | false

      if (current === false) {
        return header.with(key, min)
      }

      return header.with(key, Math.max(current, min))
    },
  )

  const withMax: {
    <H extends Header<Record<K, Duration>>>(header: H, value: Duration): H
    <H extends Header<Record<K, Duration>>>(value: Duration): (header: H) => H
    <H extends Header<Record<K, Duration>>>(
      header: H,
      unit: DurationUnit,
      value: number,
    ): H
    <H extends Header<Record<K, Duration>>>(
      unit: DurationUnit,
      value: number,
    ): (header: H) => H
  } = dual(
    (args) => isHeader(args[0]),
    (
      header: Header<Record<K, Duration>>,
      valueOrUnit: Duration | DurationUnit,
      value?: number,
    ) => {
      let max: number

      if (isString(valueOrUnit)) {
        if (!isNumber(value)) {
          throw new TypeError('Expected a number')
        }

        max = toNumber(valueOrUnit as DurationUnit, value)
      } else {
        max = toNumber(valueOrUnit)
      }

      const current = header.directives[key] as number | false

      if (current === false) {
        return header.with(key, max)
      }

      return header.with(key, Math.min(current, max))
    },
  )

  const normalizeMinMax = (
    a: Duration | DurationUnit,
    b?: Duration | number,
    c?: number,
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: encapsulating somewhat tedious logic
  ): [number, number] => {
    let minValue: number
    let maxValue: number

    if (isString(a)) {
      if (!isNumber(b)) {
        throw new TypeError('Expected a number')
      }

      if (b < 0) {
        throw new RangeError('Expected a positive number')
      }

      minValue = toNumber(a as DurationUnit, b)

      if (!isNumber(c)) {
        throw new TypeError('Expected a number')
      }

      if (c < 0) {
        throw new RangeError('Expected a positive number')
      }

      maxValue = toNumber(a as DurationUnit, c)
    } else {
      minValue = toNumber(a)

      if (b === undefined) {
        throw new TypeError('Expected a second duration')
      }

      maxValue = toNumber(b)
    }

    return [minValue, maxValue]
  }

  const clamp: {
    <H extends Header<Record<K, Duration>>>(
      header: H,
      min: Duration,
      max: Duration,
    ): H
    <H extends Header<Record<K, Duration>>>(
      min: Duration,
      max: Duration,
    ): (header: H) => H
    <H extends Header<Record<K, Duration>>>(
      header: H,
      unit: DurationUnit,
      min: number,
      max: number,
    ): H
    <H extends Header<Record<K, Duration>>>(
      unit: DurationUnit,
      min: number,
      max: number,
    ): (header: H) => H
  } = dual(
    (args) => isHeader(args[0]),
    (
      header: Header<Record<K, Duration>>,
      minOrUnit: Duration | DurationUnit,
      min?: number | Duration,
      max?: number,
    ) => {
      const [minValue, maxValue] = normalizeMinMax(minOrUnit, min, max)

      const current = header.directives[key] as number | false

      if (current === false) {
        return header.with(key, minValue)
      }

      return header.with(key, Math.min(Math.max(current, minValue), maxValue))
    },
  )

  const increase: {
    <H extends Header<Record<K, Duration>>>(header: H, value: Duration): H
    <H extends Header<Record<K, Duration>>>(value: Duration): (header: H) => H
    <H extends Header<Record<K, Duration>>>(
      header: H,
      unit: DurationUnit,
      value: number,
    ): H
    <H extends Header<Record<K, Duration>>>(
      unit: DurationUnit,
      value: number,
    ): (header: H) => H
  } = dual(
    (args) => isHeader(args[0]),
    (
      header: Header<Record<K, Duration>>,
      valueOrUnit: Duration | DurationUnit,
      value?: number,
    ) => {
      let amount: number

      if (isString(valueOrUnit)) {
        if (value === undefined) {
          throw new TypeError('Expected a number')
        }

        amount = toNumber(valueOrUnit as DurationUnit, value)
      } else {
        amount = toNumber(valueOrUnit)
      }

      const current = header.directives[key] as number | false

      if (current === false) {
        return header.with(key, amount)
      }

      return header.with(key, current + amount)
    },
  )

  const decrease: {
    <H extends Header<Record<K, Duration>>>(header: H, value: Duration): H
    <H extends Header<Record<K, Duration>>>(value: Duration): (header: H) => H
    <H extends Header<Record<K, Duration>>>(
      header: H,
      unit: DurationUnit,
      value: number,
    ): H
    <H extends Header<Record<K, Duration>>>(
      unit: DurationUnit,
      value: number,
    ): (header: H) => H
  } = dual(
    (args) => isHeader(args[0]),
    (
      header: Header<Record<K, Duration>>,
      valueOrUnit: Duration | DurationUnit,
      value?: number,
    ) => {
      let amount: number

      if (isString(valueOrUnit)) {
        if (value === undefined) {
          throw new TypeError('Expected a number')
        }

        amount = toNumber(valueOrUnit as DurationUnit, value)
      } else {
        amount = toNumber(valueOrUnit)
      }

      const current = header.directives[key] as number | false

      if (current === false) {
        return header
      }

      return header.with(key, Math.max(0, current - amount))
    },
  )

  const scale: {
    <H extends Header<Record<K, Duration>>>(header: H, value: number): H
    <H extends Header<Record<K, Duration>>>(value: number): (header: H) => H
  } = dual(2, (header: Header<Record<K, Duration>>, value: number) => {
    if (value <= 0) {
      return header.with(key, 0)
    }
    const current = header.directives[key] as number | undefined

    if (current === undefined) {
      return header
    }

    return header.with(key, current * value)
  })

  const unset = <H extends Header<Record<K, Duration>>>(header: H): H => {
    return header.with(key, undefined)
  }

  return {
    set,
    withMin,
    withMax,
    clamp,
    increase,
    decrease,
    scale,
    unset,
  }
}

type DurationOperations<K extends string> = ReturnType<
  typeof createDurationOperations<K>
>

function parseDuration(
  value: string,
  self: Directive<string, string, number>,
): number {
  const argument = Number(value.replace(`${self.name}=`, ''))

  if (Number.isNaN(argument)) {
    throw new TypeError('Invalid duration')
  }

  return toNumber(argument)
}

function stringifyDuration(
  value: Duration | false,
  self: Directive<string, string, number>,
  literal?: boolean,
): string {
  if (value === undefined) {
    return ''
  }

  if (literal) {
    return value.toString()
  }

  return `${self.name}=${value.toString()}`
}

export function duration<const N extends string, const K extends string>(
  name: N,
  key: K,
  literal?: boolean,
): Directive<N, K, number, DurationOperations<K>, Duration> {
  return createDirective({
    name,
    key,
    validate: isNumber,
    parse: parseDuration,
    stringify: (value, self) => stringifyDuration(value, self, literal),
    operations: createDurationOperations(key),
    translate: (input) => toNumber(input),
  })
}

export type DurationDirective<N extends string, K extends string> = Directive<
  N,
  K,
  number,
  DurationOperations<K>,
  Duration
>
