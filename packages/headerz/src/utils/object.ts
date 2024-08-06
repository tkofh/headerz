export function keys<T extends object>(object: T): ReadonlyArray<keyof T> {
  return Object.keys(object) as unknown as ReadonlyArray<keyof T>
}
