import { createBooleanDirective } from '../directives/boolean'
import { createDurationDirective } from '../directives/duration'
import { createHeader } from '../header'
import { hasProperty } from '../utils/predicates'

// common
const noCache = createBooleanDirective('no-cache', 'noCache')
const noStore = createBooleanDirective('no-store', 'noStore')
const noTransform = createBooleanDirective('no-transform', 'noTransform')
const maxAge = createDurationDirective('max-age', 'maxAge')
const staleIfError = createDurationDirective('stale-if-error', 'staleIfError')

// response
const mustRevalidate = createBooleanDirective(
  'must-revalidate',
  'mustRevalidate',
)
const mustUnderstand = createBooleanDirective(
  'must-understand',
  'mustUnderstand',
)
const privateDirective = createBooleanDirective('private', 'private')
const proxyRevalidate = createBooleanDirective(
  'proxy-revalidate',
  'proxyRevalidate',
)
const publicDirective = createBooleanDirective('public', 'public')
const sMaxage = createDurationDirective('s-maxage', 'sMaxage')
const staleWhileRevalidate = createDurationDirective(
  'stale-while-revalidate',
  'staleWhileRevalidate',
)
const immutable = createBooleanDirective('immutable', 'immutable')

// request
const maxStale = createDurationDirective('max-stale', 'maxStale')
const minFresh = createDurationDirective('min-fresh', 'minFresh')
const onlyIfCached = createBooleanDirective('only-if-cached', 'onlyIfCached')

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

export const cacheControl = {
  request,
  response,
} as const

// import {
//   normalizeRequestCacheControl,
//   parseRequestCacheControl,
//   requestCacheControl,
//   requestDirectives,
//   validateRequestCacheControl,
// } from './request'
// import {
//   normalizeResponseCacheControl,
//   parseResponseCacheControl,
//   responseCacheControl,
//   responseDirectives,
//   validateResponseCacheControl,
// } from './response'
//
// export type {
//   RequestCacheControl,
//   RequestCacheControlDirectives,
// } from './request'
// export type {
//   ResponseCacheControl,
//   ResponseCacheControlDirectives,
// } from './response'
//
// const request = Object.assign(requestCacheControl, {
//   parse: parseRequestCacheControl,
//   normalize: normalizeRequestCacheControl,
//   validate: validateRequestCacheControl,
//   directives: requestDirectives,
// })
//
// const response = Object.assign(responseCacheControl, {
//   parse: parseResponseCacheControl,
//   normalize: normalizeResponseCacheControl,
//   validate: validateResponseCacheControl,
//   directives: responseDirectives,
// })
//
// export const cacheControl = {
//   request,
//   response,
// } as const
