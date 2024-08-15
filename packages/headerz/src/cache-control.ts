import { boolean } from './directives/boolean'
import { duration } from './directives/duration'
import { type HeaderInputs, createHeader } from './header'
import { hasProperty } from './utils/predicates'

// common
const noCache = boolean('no-cache', 'noCache')
const noStore = boolean('no-store', 'noStore')
const noTransform = boolean('no-transform', 'noTransform')
const maxAge = duration('max-age', 'maxAge')
const staleIfError = duration('stale-if-error', 'staleIfError')

// response
const mustRevalidate = boolean('must-revalidate', 'mustRevalidate')
const mustUnderstand = boolean('must-understand', 'mustUnderstand')
const privateDirective = boolean('private', 'private')
const proxyRevalidate = boolean('proxy-revalidate', 'proxyRevalidate')
const publicDirective = boolean('public', 'public')
const sMaxage = duration('s-maxage', 'sMaxage')
const staleWhileRevalidate = duration(
  'stale-while-revalidate',
  'staleWhileRevalidate',
)
const immutable = boolean('immutable', 'immutable')

// request
const maxStale = duration('max-stale', 'maxStale')
const minFresh = duration('min-fresh', 'minFresh')
const onlyIfCached = boolean('only-if-cached', 'onlyIfCached')

export const response = createHeader(
  'cache-control',
  [
    maxAge,
    mustRevalidate,
    mustUnderstand,
    noCache,
    noStore,
    noTransform,
    privateDirective,
    proxyRevalidate,
    publicDirective,
    sMaxage,
    staleIfError,
    staleWhileRevalidate,
    immutable,
  ],
  {
    separator: ',',
    transform: (directives) => {
      if (hasProperty(directives, 'noStore') && directives.noStore) {
        return { noStore: true }
      }
      return directives
    },
  },
)

export const request = createHeader(
  'cache-control',
  [
    maxAge,
    maxStale,
    minFresh,
    noCache,
    noStore,
    noTransform,
    onlyIfCached,
    staleIfError,
  ],
  {
    separator: ',',
    transform: (directives) => {
      if (hasProperty(directives, 'noStore') && directives.noStore) {
        return { noStore: true }
      }
      return directives
    },
  },
)

export type CacheControlRequest = HeaderInputs<typeof request>
export type CacheControlResponse = HeaderInputs<typeof response>

export const cacheControl = {
  request,
  response,
} as const
