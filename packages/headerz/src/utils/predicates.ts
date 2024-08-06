export function isRecordOrArray(value: unknown): value is object {
  return typeof value === 'object' && value !== null
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function hasProperty<T extends object, K extends PropertyKey>(
  value: T,
  key: K,
): value is T & Record<K, unknown> {
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
