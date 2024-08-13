import type { AssertProperty } from './types'

export function isRecordOrArray(value: unknown): value is object {
  return typeof value === 'object' && value !== null
}

export function isArray<T>(value: unknown): value is Array<T> {
  return Array.isArray(value)
}

export function isRecord(
  value: unknown,
): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null
}

export function hasProperty<
  const T extends object,
  const K extends PropertyKey,
>(value: T, key: K): value is AssertProperty<T, K> & T {
  return key in value && value[key as unknown as keyof T] !== undefined
}

export function isNumber(value: unknown): value is number {
  return Number.isFinite(value)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}
