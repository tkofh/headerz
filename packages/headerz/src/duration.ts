import {
  hasProperty,
  isBoolean,
  isNumber,
  isRecord,
  isString,
} from './utils/predicates'

const scales = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  years: 31536000,
} as const

export type DurationUnit = keyof typeof scales

export type Duration =
  | number
  | { readonly seconds: number }
  | { readonly minutes: number }
  | { readonly hours: number }
  | { readonly days: number }
  | { readonly years: number }

interface NormalizedDuration {
  readonly unit: DurationUnit
  readonly amount: number
  readonly allowNegative: boolean
}

function normalizeFromString(
  unit: DurationUnit,
  amount: number,
  allowNegative?: boolean,
): NormalizedDuration {
  if (!hasProperty(scales, unit)) {
    throw new TypeError('Invalid unit')
  }

  const scale = scales[unit]
  return {
    unit,
    amount: amount * scale,
    allowNegative: isBoolean(allowNegative) ? allowNegative : false,
  }
}

function normalizeFromNumber(
  value: number,
  allowNegative?: boolean,
): NormalizedDuration {
  return {
    unit: 'seconds',
    amount: value,
    allowNegative: isBoolean(allowNegative) ? allowNegative : false,
  }
}

function normalizeFromRecord(
  record: Duration,
  allowNegative?: boolean,
): NormalizedDuration {
  const keys = Object.keys(record)
  if (keys.length !== 1) {
    throw new TypeError('Expected a single key')
  }
  const key = keys[0] as DurationUnit
  if (!hasProperty(scales, key)) {
    throw new TypeError('Invalid unit')
  }

  return {
    unit: key,
    amount: record[key as keyof typeof record],
    allowNegative: isBoolean(allowNegative) ? allowNegative : false,
  }
}

export function duration(value: Duration, allowNegative?: boolean): number
export function duration(
  unit: DurationUnit,
  value: number,
  allowNegative?: boolean,
): number
export function duration(
  unitOrValue: DurationUnit | Duration,
  value?: number | boolean,
  allowNegative?: boolean,
): number {
  let normalized: NormalizedDuration | undefined
  if (isString(unitOrValue)) {
    normalized = normalizeFromString(
      unitOrValue,
      value as number,
      allowNegative,
    )
  } else if (isNumber(unitOrValue) && !isNumber(value)) {
    normalized = normalizeFromNumber(unitOrValue, value)
  } else if (isRecord(unitOrValue) && !isNumber(value)) {
    normalized = normalizeFromRecord(unitOrValue, value)
  }

  if (normalized === undefined) {
    throw new TypeError('Expected a number')
  }

  if (normalized.amount < 0 && !normalized.allowNegative) {
    throw new RangeError('Expected a positive number')
  }

  return normalized.amount * scales[normalized.unit]
}

export function isDuration(value: unknown): value is Duration {
  return (
    (isNumber(value) && value >= 0) ||
    (isRecord(value) &&
      ((hasProperty(value, 'seconds') &&
        isNumber(value.seconds) &&
        value.seconds >= 0) ||
        (hasProperty(value, 'minutes') &&
          isNumber(value.minutes) &&
          value.minutes >= 0) ||
        (hasProperty(value, 'hours') &&
          isNumber(value.hours) &&
          value.hours >= 0) ||
        (hasProperty(value, 'days') &&
          isNumber(value.days) &&
          value.days >= 0) ||
        (hasProperty(value, 'years') &&
          isNumber(value.years) &&
          value.years >= 0)))
  )
}
