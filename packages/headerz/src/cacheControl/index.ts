import {
  normalizeRequestCacheControl,
  parseRequestCacheControl,
  requestCacheControl,
  requestDirectives,
  validateRequestCacheControl,
} from './request'
import {
  normalizeResponseCacheControl,
  parseResponseCacheControl,
  responseCacheControl,
  responseDirectives,
  validateResponseCacheControl,
} from './response'
import { maxAge, noCache, noStore, noTransform, staleIfError } from './shared'

export type {
  RequestCacheControl,
  RequestCacheControlDirectives,
} from './request'
export type {
  ResponseCacheControl,
  ResponseCacheControlDirectives,
} from './response'

const request = Object.assign(requestCacheControl, {
  parse: parseRequestCacheControl,
  normalize: normalizeRequestCacheControl,
  validate: validateRequestCacheControl,
  directives: requestDirectives,
})

const response = Object.assign(responseCacheControl, {
  parse: parseResponseCacheControl,
  normalize: normalizeResponseCacheControl,
  validate: validateResponseCacheControl,
  directives: responseDirectives,
})

export const cacheControl = {
  request,
  response,

  common: {
    'no-cache': noCache,
    'no-store': noStore,
    'no-transform': noTransform,
    'max-age': maxAge,
    'stale-if-error': staleIfError,
  },
} as const
