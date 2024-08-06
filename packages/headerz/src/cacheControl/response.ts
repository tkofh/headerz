import { BooleanDirective } from '../directives/boolean'
import { DurationDirective } from '../directives/duration'
import { DirectiveParser } from '../directives/parse'
import { type Duration, duration } from '../duration'
import { hasProperty, isRecord } from '../utils/predicates'
import type { Falsifiable } from '../utils/types'
import {
  CacheControl,
  type CommonDirectives,
  maxAge as sharedMaxAge,
  noCache as sharedNoCache,
  noStore as sharedNoStore,
  noTransform as sharedNoTransform,
  staleIfError as sharedStaleIfError,
} from './shared'

const TypeBrand: unique symbol = Symbol.for('headerz.cacheControl.response')
type TypeBrand = typeof TypeBrand

export interface ResponseCacheControlDirectives extends CommonDirectives {
  's-maxage': Duration | false
  'must-revalidate': boolean
  'proxy-revalidate': boolean
  'must-understand': boolean
  public: boolean
  private: boolean
  immutable: boolean
  'stale-while-revalidate': Duration | false
}

export class ResponseCacheControl
  extends CacheControl<ResponseCacheControlDirectives>
  implements Falsifiable<ResponseCacheControlDirectives>
{
  static order = [
    'max-age',
    'must-revalidate',
    'must-understand',
    'no-cache',
    'no-store',
    'no-transform',
    'private',
    'proxy-revalidate',
    'public',
    's-maxage',
    'stale-if-error',
    'stale-while-revalidate',
    'immutable',
  ] as const

  readonly [TypeBrand]: TypeBrand = TypeBrand

  get 's-maxage'(): number | false {
    return this.directives['s-maxage'] !== undefined &&
      this.directives['s-maxage'] !== false
      ? duration(this.directives['s-maxage'])
      : false
  }

  get 'must-revalidate'(): boolean {
    return this.directives['must-revalidate'] ?? false
  }

  get 'proxy-revalidate'(): boolean {
    return this.directives['proxy-revalidate'] ?? false
  }

  get 'must-understand'(): boolean {
    return this.directives['must-understand'] ?? false
  }

  get public(): boolean {
    return this.directives.public ?? false
  }

  get private(): boolean {
    return this.directives.private ?? false
  }

  get immutable(): boolean {
    return this.directives.immutable ?? false
  }

  get 'stale-while-revalidate'(): number | false {
    return this.directives['stale-while-revalidate'] !== undefined &&
      this.directives['stale-while-revalidate'] !== false
      ? duration(this.directives['stale-while-revalidate'])
      : false
  }

  protected override get order() {
    return ResponseCacheControl.order
  }

  static override [Symbol.hasInstance](value: unknown) {
    // biome-ignore lint/complexity/noThisInStatic: need both behaviors
    return super[Symbol.hasInstance](value) && isResponseCacheControl(value)
  }

  protected override instance(
    directives: Partial<ResponseCacheControlDirectives>,
  ): this {
    return new ResponseCacheControl(directives) as this
  }
}

export function isResponseCacheControl(
  value: unknown,
): value is ResponseCacheControl {
  return (
    isRecord(value) &&
    hasProperty(value, TypeBrand) &&
    value[TypeBrand] === TypeBrand
  )
}

export function responseCacheControl(
  directives: Partial<ResponseCacheControlDirectives> = {},
): ResponseCacheControl {
  return new ResponseCacheControl(directives)
}

export const mustRevalidate = new BooleanDirective<ResponseCacheControl>(
  'must-revalidate',
)
export const proxyRevalidate = new BooleanDirective<ResponseCacheControl>(
  'proxy-revalidate',
)
export const mustUnderstand = new BooleanDirective<ResponseCacheControl>(
  'must-understand',
)
export const publicDirective = new BooleanDirective<ResponseCacheControl>(
  'public',
)
export const privateDirective = new BooleanDirective<ResponseCacheControl>(
  'private',
)
export const immutable = new BooleanDirective<ResponseCacheControl>('immutable')
export const sMaxAge = new DurationDirective<ResponseCacheControl>('s-maxage')
export const staleWhileRevalidate = new DurationDirective<ResponseCacheControl>(
  'stale-while-revalidate',
)

export const maxAge = sharedMaxAge as DurationDirective<ResponseCacheControl>
export const noCache = sharedNoCache as BooleanDirective<ResponseCacheControl>
export const noStore = sharedNoStore as BooleanDirective<ResponseCacheControl>
export const noTransform =
  sharedNoTransform as BooleanDirective<ResponseCacheControl>
export const staleIfError =
  sharedStaleIfError as DurationDirective<ResponseCacheControl>

export const responseDirectives = {
  'max-age': maxAge,
  'must-revalidate': mustRevalidate,
  'must-understand': mustUnderstand,
  'no-cache': noCache,
  'no-store': noStore,
  'no-transform': noTransform,
  'proxy-revalidate': proxyRevalidate,
  's-maxage': sMaxAge,
  'stale-if-error': staleIfError,
  'stale-while-revalidate': staleWhileRevalidate,
  immutable: immutable,
  private: privateDirective,
  public: publicDirective,
} as const

const parser = new DirectiveParser(
  responseCacheControl,
  ResponseCacheControl.order,
)

export function parseResponseCacheControl(value: string): ResponseCacheControl {
  return parser.parse(value)
}

export function normalizeResponseCacheControl(value: string): string {
  return parser.normalize(value)
}

export function validateResponseCacheControl(value: string): boolean {
  return parser.validate(value)
}
