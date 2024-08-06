import { DirectiveBag } from '../directives/bag'
import { BooleanDirective } from '../directives/boolean'
import { DurationDirective } from '../directives/duration'
import { type Duration, duration } from '../duration'
import { hasProperty, isRecord } from '../utils/predicates'
import type { RequestCacheControl } from './request'
import type { ResponseCacheControl } from './response'

const TypeBrand: unique symbol = Symbol.for('headerz.cacheControl')

type TypeBrand = typeof TypeBrand

export type CommonDirectives = {
  'max-age': Duration | false
  'no-cache': boolean
  'no-store': boolean
  'no-transform': boolean
  'stale-if-error': Duration | false
}

export class CacheControl<
  Directives extends CommonDirectives,
> extends DirectiveBag<Directives> {
  readonly [TypeBrand]: TypeBrand = TypeBrand

  constructor(directives: Partial<Directives> = {}) {
    if (directives['no-store'] === true) {
      super({ 'no-store': true } as Partial<Directives>)
    } else {
      super(directives)
    }
  }

  get 'max-age'(): number | false {
    return this.directives['max-age'] !== undefined &&
      this.directives['max-age'] !== false
      ? duration(this.directives['max-age'])
      : false
  }

  get 'no-cache'(): boolean {
    return this.directives['no-cache'] ?? false
  }

  get 'no-store'(): boolean {
    return this.directives['no-store'] ?? false
  }

  get 'no-transform'(): boolean {
    return this.directives['no-transform'] ?? false
  }

  get 'stale-if-error'(): number | false {
    return this.directives['stale-if-error'] !== undefined &&
      this.directives['stale-if-error'] !== false
      ? duration(this.directives['stale-if-error'])
      : false
  }

  static override [Symbol.hasInstance](value: unknown) {
    // biome-ignore lint/complexity/noThisInStatic: need both behaviors
    return super[Symbol.hasInstance](value) && isCacheControl(value)
  }
}

export function isCacheControl<Directives extends CommonDirectives>(
  value: unknown,
): value is CacheControl<Directives> {
  return (
    isRecord(value) &&
    hasProperty(value, TypeBrand) &&
    value[TypeBrand] === TypeBrand
  )
}

export const noCache = new BooleanDirective<
  RequestCacheControl | ResponseCacheControl
>('no-cache')

export const noStore = new BooleanDirective<
  RequestCacheControl | ResponseCacheControl
>('no-store')

export const noTransform = new BooleanDirective<
  RequestCacheControl | ResponseCacheControl
>('no-transform')

export const maxAge = new DurationDirective<
  RequestCacheControl | ResponseCacheControl
>('max-age')

export const staleIfError = new DurationDirective<
  RequestCacheControl | ResponseCacheControl
>('stale-if-error')
