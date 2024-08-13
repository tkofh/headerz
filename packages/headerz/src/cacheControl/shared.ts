import { BooleanDirective } from '../directives/boolean'
import { DurationDirective } from '../directives/duration'
import { type Duration, duration } from '../duration'
import { Header } from '../header'
import { hasProperty, isRecord } from '../utils/predicates'
import type { RequestCacheControl } from './request'
import type { ResponseCacheControl } from './response'

const TypeBrand: unique symbol = Symbol.for('headerz.cacheControl')

type TypeBrand = typeof TypeBrand

export interface CommonDirectives {
  maxAge: Duration | false
  noCache: boolean
  noStore: boolean
  noTransform: boolean
  staleIfError: Duration | false
}

export class CacheControl<
  Directives extends CommonDirectives,
> extends Header<Directives> {
  readonly [TypeBrand]: TypeBrand = TypeBrand

  constructor(directives: Partial<Directives> = {}) {
    if (directives.noStore === true) {
      super({ noStore: true } as Partial<Directives>)
    } else {
      super(directives)
    }
  }

  get maxAge(): number | false {
    return this.directives.maxAge !== undefined &&
      this.directives.maxAge !== false
      ? duration(this.directives.maxAge)
      : false
  }

  get noCache(): boolean {
    return this.directives.noCache ?? false
  }

  get noStore(): boolean {
    return this.directives.noStore ?? false
  }

  get noTransform(): boolean {
    return this.directives.noTransform ?? false
  }

  get staleIfError(): number | false {
    return this.directives.staleIfError !== undefined &&
      this.directives.staleIfError !== false
      ? duration(this.directives.staleIfError)
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
>('noCache')

export const noStore = new BooleanDirective<
  RequestCacheControl | ResponseCacheControl
>('noStore')

export const noTransform = new BooleanDirective<
  RequestCacheControl | ResponseCacheControl
>('noTransform')

export const maxAge = new DurationDirective<
  RequestCacheControl | ResponseCacheControl
>('maxAge')

export const staleIfError = new DurationDirective<
  RequestCacheControl | ResponseCacheControl
>('staleIfError')
