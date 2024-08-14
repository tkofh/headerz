import { describe, expect, test } from 'vitest'
import { cacheControl } from '../src'
import { describeBooleanDirective } from './fixtures/boolean'
import { describeDurationDirective } from './fixtures/duration'

const requestBooleanDirectives = [
  ['noCache', cacheControl.request.noCache],
  ['noStore', cacheControl.request.noStore],
  ['noTransform', cacheControl.request.noTransform],
  ['onlyIfCached', cacheControl.request.onlyIfCached],
] as const
const requestDurationDirectives = [
  ['maxAge', cacheControl.request.maxAge],
  ['maxStale', cacheControl.request.maxStale],
  ['minFresh', cacheControl.request.minFresh],
  ['staleIfError', cacheControl.request.staleIfError],
] as const

const responseBooleanDirectives = [
  ['noCache', cacheControl.response.noCache],
  ['noStore', cacheControl.response.noStore],
  ['noTransform', cacheControl.response.noTransform],
  ['mustRevalidate', cacheControl.response.mustRevalidate],
  ['proxyRevalidate', cacheControl.response.proxyRevalidate],
  ['mustUnderstand', cacheControl.response.mustUnderstand],
  ['public', cacheControl.response.public],
  ['private', cacheControl.response.private],
  ['immutable', cacheControl.response.immutable],
] as const
const responseDurationDirectives = [
  ['maxAge', cacheControl.response.maxAge],
  ['sMaxage', cacheControl.response.sMaxage],
  ['staleWhileRevalidate', cacheControl.response.staleWhileRevalidate],
  ['staleIfError', cacheControl.response.staleIfError],
] as const

describe('request', () => {
  for (const [key, _directive] of requestBooleanDirectives) {
    describeBooleanDirective(cacheControl.request, key)
  }
  for (const [key, _directive] of requestDurationDirectives) {
    describeDurationDirective(cacheControl.request, key)
  }

  test('parse', () => {
    expect(cacheControl.request.parse('max-age=100')).toEqual(
      cacheControl.request({ maxAge: 100 }),
    )
    expect(cacheControl.request.parse('max-age=100, no-cache')).toEqual(
      cacheControl.request({ maxAge: 100, noCache: true }),
    )
    expect(
      cacheControl.request.parse('max-age=100, no-cache, no-store'),
    ).toEqual(
      cacheControl.request({
        maxAge: 100,
        noCache: true,
        noStore: true,
      }),
    )
  })

  test('normalize', () => {
    expect(cacheControl.request.normalize('max-age=100')).toEqual('max-age=100')
    expect(cacheControl.request.normalize('no-cache, max-age=100')).toEqual(
      'max-age=100,no-cache',
    )
    expect(
      cacheControl.request.normalize('max-age=100, no-cache, no-store'),
    ).toEqual('no-store')
  })

  test('validate', () => {
    expect(cacheControl.request.validate('max-age=100')).toEqual(true)
    expect(cacheControl.request.validate('max-age=100, no-cache')).toEqual(true)
    expect(
      cacheControl.request.validate('max-age=100, no-cache, no-store'),
    ).toEqual(true)
    expect(
      cacheControl.request.validate(
        'max-age=100, no-cache, no-store, max-age=100',
      ),
    ).toEqual(false)
  })
})

describe('response', () => {
  for (const [key, _directive] of responseBooleanDirectives) {
    describeBooleanDirective(cacheControl.response, key)
  }
  for (const [key, _directive] of responseDurationDirectives) {
    describeDurationDirective(cacheControl.response, key)
  }

  // test('parse', () => {
  //   expect(parseResponseCacheControl('max-age=100')).toEqual(
  //     cacheControl.response({ maxAge: 100 }),
  //   )
  //   expect(parseResponseCacheControl('max-age=100, no-cache')).toEqual(
  //     cacheControl.response({ maxAge: 100, noCache: true }),
  //   )
  //   expect(
  //     parseResponseCacheControl('max-age=100, no-cache, no-store'),
  //   ).toEqual(
  //     cacheControl.response({
  //       maxAge: 100,
  //       noCache: true,
  //       noStore: true,
  //     }),
  //   )
  // })
  //
  // test('normalize', () => {
  //   expect(normalizeResponseCacheControl('max-age=100')).toEqual('max-age=100')
  //   expect(normalizeResponseCacheControl('no-cache, max-age=100')).toEqual(
  //     'max-age=100,no-cache',
  //   )
  //   expect(
  //     normalizeResponseCacheControl('max-age=100, no-cache, no-store'),
  //   ).toEqual('no-store')
  // })
  //
  // test('validate', () => {
  //   expect(validateResponseCacheControl('max-age=100')).toEqual(true)
  //   expect(validateResponseCacheControl('max-age=100, no-cache')).toEqual(true)
  //   expect(
  //     validateResponseCacheControl('max-age=100, no-cache, no-store'),
  //   ).toEqual(true)
  //   expect(
  //     validateResponseCacheControl(
  //       'max-age=100, no-cache, no-store, max-age=100',
  //     ),
  //   ).toEqual(false)
  // })
})
