import { BooleanDirective } from '../directives/boolean'
import { DurationDirective } from '../directives/duration'
import { DirectiveParser } from '../directives/parse'
import { type Duration, duration, isDuration } from '../duration'
import { hasProperty, isBoolean, isRecord } from '../utils/predicates'
import type { Falsifiable, Identity } from '../utils/types'
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

export type ResponseCacheControlDirectives = Identity<
  CommonDirectives & {
    sMaxage: Duration | false
    mustRevalidate: boolean
    proxyRevalidate: boolean
    mustUnderstand: boolean
    public: boolean
    private: boolean
    immutable: boolean
    staleWhileRevalidate: Duration | false
  }
>

const SERIALIZATION_LOOKUP = new Map([
  ['maxAge', 'max-age'],
  ['mustRevalidate', 'must-revalidate'],
  ['mustUnderstand', 'must-understand'],
  ['noCache', 'no-cache'],
  ['noStore', 'no-store'],
  ['noTransform', 'no-transform'],
  ['private', 'private'],
  ['proxyRevalidate', 'proxy-revalidate'],
  ['public', 'public'],
  ['sMaxage', 's-maxage'],
  ['staleIfError', 'stale-if-error'],
  ['staleWhileRevalidate', 'stale-while-revalidate'],
  ['immutable', 'immutable'],
] as const)

const PARSING_LOOKUP = new Map([
  ['max-age', 'maxAge'],
  ['must-revalidate', 'mustRevalidate'],
  ['must-understand', 'mustUnderstand'],
  ['no-cache', 'noCache'],
  ['no-store', 'noStore'],
  ['no-transform', 'noTransform'],
  ['private', 'private'],
  ['proxy-revalidate', 'proxyRevalidate'],
  ['public', 'public'],
  ['s-maxage', 'sMaxage'],
  ['stale-if-error', 'staleIfError'],
  ['stale-while-revalidate', 'staleWhileRevalidate'],
  ['immutable', 'immutable'],
] as const)

export class ResponseCacheControl
  extends CacheControl<ResponseCacheControlDirectives>
  implements Falsifiable<ResponseCacheControlDirectives>
{
  readonly [TypeBrand]: TypeBrand = TypeBrand
  protected override lookup = SERIALIZATION_LOOKUP

  constructor(directives: Partial<ResponseCacheControlDirectives> = {}) {
    if (
      hasProperty(directives, 'maxAge') &&
      (!isBoolean(directives.maxAge) || directives.maxAge) &&
      !isDuration(directives.maxAge)
    ) {
      throw new TypeError('Invalid maxAge, expected a duration or false')
    }
    if (
      hasProperty(directives, 'mustRevalidate') &&
      !isBoolean(directives.mustRevalidate)
    ) {
      throw new TypeError('Invalid mustRevalidate, expected a boolean')
    }
    if (
      hasProperty(directives, 'mustUnderstand') &&
      !isBoolean(directives.mustUnderstand)
    ) {
      throw new TypeError('Invalid mustUnderstand, expected a boolean')
    }
    if (hasProperty(directives, 'noCache') && !isBoolean(directives.noCache)) {
      throw new TypeError('Invalid noCache, expected a boolean')
    }
    if (hasProperty(directives, 'noStore') && !isBoolean(directives.noStore)) {
      throw new TypeError('Invalid noStore, expected a boolean')
    }
    if (
      hasProperty(directives, 'noTransform') &&
      !isBoolean(directives.noTransform)
    ) {
      throw new TypeError('Invalid noTransform, expected a boolean')
    }
    if (hasProperty(directives, 'private') && !isBoolean(directives.private)) {
      throw new TypeError('Invalid private, expected a boolean')
    }

    if (
      hasProperty(directives, 'proxyRevalidate') &&
      !isBoolean(directives.proxyRevalidate)
    ) {
      throw new TypeError('Invalid proxyRevalidate, expected a boolean')
    }

    if (hasProperty(directives, 'public') && !isBoolean(directives.public)) {
      throw new TypeError('Invalid public, expected a boolean')
    }
    if (
      hasProperty(directives, 'sMaxage') &&
      (!isBoolean(directives.sMaxage) || directives.sMaxage) &&
      !isDuration(directives.sMaxage)
    ) {
      throw new TypeError('Invalid sMaxage, expected a duration or false')
    }
    if (
      hasProperty(directives, 'staleWhileRevalidate') &&
      (!isBoolean(directives.staleWhileRevalidate) ||
        directives.staleWhileRevalidate) &&
      !isDuration(directives.staleWhileRevalidate)
    ) {
      throw new TypeError('Invalid staleWhileRevalidate, expected a duration')
    }
    if (
      hasProperty(directives, 'staleIfError') &&
      (!isBoolean(directives.staleIfError) || directives.staleIfError) &&
      !isDuration(directives.staleIfError)
    ) {
      throw new TypeError('Invalid staleIfError, expected a duration')
    }
    if (
      hasProperty(directives, 'immutable') &&
      !isBoolean(directives.immutable)
    ) {
      throw new TypeError('Invalid immutable, expected a boolean')
    }

    super(directives)
  }

  get sMaxage(): number | false {
    return this.directives.sMaxage !== undefined &&
      this.directives.sMaxage !== false
      ? duration(this.directives.sMaxage)
      : false
  }

  get mustRevalidate(): boolean {
    return this.directives.mustRevalidate ?? false
  }

  get proxyRevalidate(): boolean {
    return this.directives.proxyRevalidate ?? false
  }

  get mustUnderstand(): boolean {
    return this.directives.mustUnderstand ?? false
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

  get staleWhileRevalidate(): number | false {
    return this.directives.staleWhileRevalidate !== undefined &&
      this.directives.staleWhileRevalidate !== false
      ? duration(this.directives.staleWhileRevalidate)
      : false
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
  'mustRevalidate',
)
export const proxyRevalidate = new BooleanDirective<ResponseCacheControl>(
  'proxyRevalidate',
)
export const mustUnderstand = new BooleanDirective<ResponseCacheControl>(
  'mustUnderstand',
)
export const publicDirective = new BooleanDirective<ResponseCacheControl>(
  'public',
)
export const privateDirective = new BooleanDirective<ResponseCacheControl>(
  'private',
)
export const immutable = new BooleanDirective<ResponseCacheControl>('immutable')
export const sMaxage = new DurationDirective<ResponseCacheControl>('sMaxage')
export const staleWhileRevalidate = new DurationDirective<ResponseCacheControl>(
  'staleWhileRevalidate',
)

export const maxAge = sharedMaxAge as DurationDirective<ResponseCacheControl>
export const noCache = sharedNoCache as BooleanDirective<ResponseCacheControl>
export const noStore = sharedNoStore as BooleanDirective<ResponseCacheControl>
export const noTransform =
  sharedNoTransform as BooleanDirective<ResponseCacheControl>
export const staleIfError =
  sharedStaleIfError as DurationDirective<ResponseCacheControl>

export const responseDirectives = {
  maxAge,
  mustRevalidate,
  mustUnderstand,
  noCache,
  noStore,
  noTransform,
  proxyRevalidate,
  sMaxage,
  staleIfError,
  staleWhileRevalidate,
  immutable,
  private: privateDirective,
  public: publicDirective,
} as const

const parser = new DirectiveParser(responseCacheControl, PARSING_LOOKUP, ',')

export function parseResponseCacheControl(value: string): ResponseCacheControl {
  return parser.parse(value)
}

export function normalizeResponseCacheControl(value: string): string {
  return parser.normalize(value)
}

export function validateResponseCacheControl(value: string): boolean {
  return parser.validate(value)
}
