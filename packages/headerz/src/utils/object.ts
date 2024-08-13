export function keys<T extends object>(object: T): ReadonlyArray<keyof T> {
  return Object.keys(object) as unknown as ReadonlyArray<keyof T>
}

export function entries<T extends object>(
  object: T,
): ReadonlyArray<[keyof T, T[keyof T]]> {
  return Object.entries(object) as unknown as ReadonlyArray<
    [keyof T, T[keyof T]]
  >
}
