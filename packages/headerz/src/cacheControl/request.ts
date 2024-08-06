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
  'max-stale': Duration | false
  'min-fresh': Duration | false
  'only-if-cached': boolean
}

export class RequestCacheControl
  extends CacheControl<RequestCacheControlDirectives>
  implements Falsifiable<RequestCacheControlDirectives>
{
  static order = [
    'max-age',
    'max-stale',
    'min-fresh',
    'no-cache',
    'no-store',
    'no-transform',
    'only-if-cached',
    'stale-if-error',
  ] as const

  readonly [TypeBrand]: TypeBrand = TypeBrand

  constructor(directives: Partial<RequestCacheControlDirectives> = {}) {
    if (
      hasProperty(directives, 'max-age') &&
      (!isBoolean(directives['max-age']) || directives['max-age']) &&
      !isDuration(directives['max-age'])
    ) {
      throw new TypeError('Invalid max-age, expected a duration or false')
    }
    if (
      hasProperty(directives, 'max-stale') &&
      (!isBoolean(directives['max-stale']) || directives['max-stale']) &&
      !isDuration(directives['max-stale'])
    ) {
      throw new TypeError('Invalid max-stale, expected a duration or false')
    }
    if (
      hasProperty(directives, 'min-fresh') &&
      (!isBoolean(directives['min-fresh']) || directives['min-fresh']) &&
      !isDuration(directives['min-fresh'])
    ) {
      throw new TypeError('Invalid min-fresh, expected a duration or false')
    }
    if (
      hasProperty(directives, 'no-cache') &&
      !isBoolean(directives['no-cache'])
    ) {
      throw new TypeError('Invalid no-cache, expected a boolean')
    }
    if (
      hasProperty(directives, 'no-store') &&
      !isBoolean(directives['no-store'])
    ) {
      throw new TypeError('Invalid no-store, expected a boolean')
    }
    if (
      hasProperty(directives, 'no-transform') &&
      !isBoolean(directives['no-transform'])
    ) {
      throw new TypeError('Invalid no-transform, expected a boolean')
    }
    if (
      hasProperty(directives, 'only-if-cached') &&
      !isBoolean(directives['only-if-cached'])
    ) {
      throw new TypeError('Invalid only-if-cached, expected a boolean')
    }
    if (
      hasProperty(directives, 'stale-if-error') &&
      (!isBoolean(directives['stale-if-error']) ||
        directives['stale-if-error']) &&
      !isDuration(directives['stale-if-error'])
    ) {
      throw new TypeError('Invalid stale-if-error, expected a duration')
    }

    super(directives)
  }

  get 'max-stale'(): number | false {
    return this.directives['max-stale'] !== undefined &&
      this.directives['max-stale'] !== false
      ? duration(this.directives['max-stale'])
      : false
  }

  get 'min-fresh'(): number | false {
    return this.directives['min-fresh'] !== undefined &&
      this.directives['min-fresh'] !== false
      ? duration(this.directives['min-fresh'])
      : false
  }

  get 'only-if-cached'(): boolean {
    return this.directives['only-if-cached'] ?? false
  }

  protected override get order(): ReadonlyArray<
    keyof RequestCacheControlDirectives & string
  > {
    return RequestCacheControl.order
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

export const maxStale = new DurationDirective<RequestCacheControl>('max-stale')
export const minFresh = new DurationDirective<RequestCacheControl>('min-fresh')
export const onlyIfCached = new BooleanDirective<RequestCacheControl>(
  'only-if-cached',
)

export const maxAge = sharedMaxAge as DurationDirective<RequestCacheControl>
export const noCache = sharedNoCache as BooleanDirective<RequestCacheControl>
export const noStore = sharedNoStore as BooleanDirective<RequestCacheControl>
export const noTransform =
  sharedNoTransform as BooleanDirective<RequestCacheControl>
export const staleIfError =
  sharedStaleIfError as DurationDirective<RequestCacheControl>

export const requestDirectives = {
  'max-age': maxAge,
  'max-stale': maxStale,
  'min-fresh': minFresh,
  'no-cache': noCache,
  'no-store': noStore,
  'no-transform': noTransform,
  'only-if-cached': onlyIfCached,
  'stale-if-error': staleIfError,
} as const

const parser = new DirectiveParser(
  requestCacheControl,
  RequestCacheControl.order,
)

export function parseRequestCacheControl(value: string): RequestCacheControl {
  return parser.parse(value)
}

export function normalizeRequestCacheControl(value: string): string {
  return parser.normalize(value)
}

export function validateRequestCacheControl(value: string): boolean {
  return parser.validate(value)
}
