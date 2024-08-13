export function minMax(min: number, max: number) {
  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
  }
}

export function clamp(value: number, min: number, max: number) {
  const bounds = minMax(min, max)
  return Math.min(Math.max(value, bounds.min), bounds.max)
}

export function roundTo(value: number, precision: number) {
  const scale = 10 ** precision
  return Math.round(value * scale) / scale
}

export function normalizeZero(value: number) {
  return value === 0 ? 0 : value
}
