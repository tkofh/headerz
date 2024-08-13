import { BooleanDirective } from '../directives/boolean'
import { DurationDirective } from '../directives/duration'
import { DirectiveParser } from '../directives/parse'
import { type Duration, duration, isDuration } from '../duration'
import { hasProperty, isBoolean, isRecord } from '../utils/predicates'
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

const TypeBrand: unique symbol = Symbol.for('headerz.cacheControl.request')
type TypeBrand = typeof TypeBrand

export interface RequestCacheControlDirectives extends CommonDirectives {
  maxStale: Duration | false
  minFresh: Duration | false
  onlyIfCached: boolean
}

const thing = {} as Partial<RequestCacheControlDirectives>
if (hasProperty(thing, 'maxAge')) {
  console.log(thing.maxAge)
}

const SERIALIZATION_LOOKUP = new Map([
  ['maxAge', 'max-age'],
  ['maxStale', 'max-stale'],
  ['minFresh', 'min-fresh'],
  ['noCache', 'no-cache'],
  ['noStore', 'no-store'],
  ['noTransform', 'no-transform'],
  ['onlyIfCached', 'only-if-cached'],
  ['staleIfError', 'stale-if-error'],
] as const)

const PARSING_LOOKUP = new Map([
  ['max-age', 'maxAge'],
  ['max-stale', 'maxStale'],
  ['min-fresh', 'minFresh'],
  ['no-cache', 'noCache'],
  ['no-store', 'noStore'],
  ['no-transform', 'noTransform'],
  ['only-if-cached', 'onlyIfCached'],
  ['stale-if-error', 'staleIfError'],
] as const)

// validate in constructor function (not class constructor) and inside `with()`

export class RequestCacheControl
  extends CacheControl<RequestCacheControlDirectives>
  implements Falsifiable<RequestCacheControlDirectives>
{
  readonly [TypeBrand]: TypeBrand = TypeBrand
  protected override lookup = SERIALIZATION_LOOKUP

  constructor(directives: Partial<RequestCacheControlDirectives> = {}) {
    if (
      hasProperty(directives, 'maxAge') &&
      (!isBoolean(directives.maxAge) || directives.maxAge) &&
      !isDuration(directives.maxAge)
    ) {
      throw new TypeError('Invalid max-age, expected a duration or false')
    }
    if (
      hasProperty(directives, 'maxStale') &&
      (!isBoolean(directives.maxStale) || directives.maxStale) &&
      !isDuration(directives.maxStale)
    ) {
      throw new TypeError('Invalid max-stale, expected a duration or false')
    }
    if (
      hasProperty(directives, 'minFresh') &&
      (!isBoolean(directives.minFresh) || directives.minFresh) &&
      !isDuration(directives.minFresh)
    ) {
      throw new TypeError('Invalid min-fresh, expected a duration or false')
    }
    if (hasProperty(directives, 'noCache') && !isBoolean(directives.noCache)) {
      throw new TypeError('Invalid no-cache, expected a boolean')
    }
    if (hasProperty(directives, 'noStore') && !isBoolean(directives.noStore)) {
      throw new TypeError('Invalid no-store, expected a boolean')
    }
    if (
      hasProperty(directives, 'noTransform') &&
      !isBoolean(directives.noTransform)
    ) {
      throw new TypeError('Invalid no-transform, expected a boolean')
    }
    if (
      hasProperty(directives, 'onlyIfCached') &&
      !isBoolean(directives.onlyIfCached)
    ) {
      throw new TypeError('Invalid only-if-cached, expected a boolean')
    }
    if (
      hasProperty(directives, 'staleIfError') &&
      (!isBoolean(directives.staleIfError) || directives.staleIfError) &&
      !isDuration(directives.staleIfError)
    ) {
      throw new TypeError('Invalid stale-if-error, expected a duration')
    }

    super(directives)
  }

  get maxStale(): number | false {
    return this.directives.maxStale !== undefined &&
      this.directives.maxStale !== false
      ? duration(this.directives.maxStale)
      : false
  }

  get minFresh(): number | false {
    return this.directives.minFresh !== undefined &&
      this.directives.minFresh !== false
      ? duration(this.directives.minFresh)
      : false
  }

  get onlyIfCached(): boolean {
    return this.directives.onlyIfCached ?? false
  }

  static override [Symbol.hasInstance](value: unknown) {
    // biome-ignore lint/complexity/noThisInStatic: need both behaviors
    return super[Symbol.hasInstance](value) && isRequestCacheControl(value)
  }

  protected override instance(
    directives: Partial<RequestCacheControlDirectives>,
  ): this {
    return new RequestCacheControl(directives) as this
  }
}

export function isRequestCacheControl(
  value: unknown,
): value is RequestCacheControl {
  return (
    isRecord(value) &&
    hasProperty(value, TypeBrand) &&
    value[TypeBrand] === TypeBrand
  )
}

export function requestCacheControl(
  directives: Partial<RequestCacheControlDirectives> = {},
): RequestCacheControl {
  return new RequestCacheControl(directives)
}

export const maxStale = new DurationDirective<RequestCacheControl>('maxStale')
export const minFresh = new DurationDirective<RequestCacheControl>('minFresh')
export const onlyIfCached = new BooleanDirective<RequestCacheControl>(
  'onlyIfCached',
)

export const maxAge = sharedMaxAge as DurationDirective<RequestCacheControl>
export const noCache = sharedNoCache as BooleanDirective<RequestCacheControl>
export const noStore = sharedNoStore as BooleanDirective<RequestCacheControl>
export const noTransform =
  sharedNoTransform as BooleanDirective<RequestCacheControl>
export const staleIfError =
  sharedStaleIfError as DurationDirective<RequestCacheControl>

export const requestDirectives = {
  maxAge,
  maxStale,
  minFresh,
  noCache,
  noStore,
  noTransform,
  onlyIfCached,
  staleIfError,
} as const

const parser = new DirectiveParser(requestCacheControl, PARSING_LOOKUP, ',')

export function parseRequestCacheControl(value: string): RequestCacheControl {
  return parser.parse(value)
}

export function normalizeRequestCacheControl(value: string): string {
  return parser.normalize(value)
}

export function validateRequestCacheControl(value: string): boolean {
  return parser.validate(value)
}
