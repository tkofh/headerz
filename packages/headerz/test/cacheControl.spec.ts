import { describe, expect, test } from 'vitest'
import { cacheControl } from '../src'
import {
  normalizeRequestCacheControl,
  parseRequestCacheControl,
  validateRequestCacheControl,
} from '../src/cacheControl/request'
import {
  normalizeResponseCacheControl,
  parseResponseCacheControl,
  validateResponseCacheControl,
} from '../src/cacheControl/response'
import { describeBooleanDirective } from './fixtures/boolean'
import { describeDurationDirective } from './fixtures/duration'

const requestBooleanDirectives = [
  ['no-cache', cacheControl.request.directives['no-cache']],
  ['no-store', cacheControl.request.directives['no-store']],
  ['no-transform', cacheControl.request.directives['no-transform']],
  ['only-if-cached', cacheControl.request.directives['only-if-cached']],
] as const
const requestDurationDirectives = [
  ['max-age', cacheControl.request.directives['max-age']],
  ['max-stale', cacheControl.request.directives['max-stale']],
  ['min-fresh', cacheControl.request.directives['min-fresh']],
  ['stale-if-error', cacheControl.request.directives['stale-if-error']],
] as const

const responseBooleanDirectives = [
  ['no-cache', cacheControl.response.directives['no-cache']],
  ['no-store', cacheControl.response.directives['no-store']],
  ['no-transform', cacheControl.response.directives['no-transform']],
  ['must-revalidate', cacheControl.response.directives['must-revalidate']],
  ['proxy-revalidate', cacheControl.response.directives['proxy-revalidate']],
  ['must-understand', cacheControl.response.directives['must-understand']],
  ['public', cacheControl.response.directives.public],
  ['private', cacheControl.response.directives.private],
  ['immutable', cacheControl.response.directives.immutable],
] as const
const responseDurationDirectives = [
  ['max-age', cacheControl.response.directives['max-age']],
  ['s-maxage', cacheControl.response.directives['s-maxage']],
  [
    'stale-while-revalidate',
    cacheControl.response.directives['stale-while-revalidate'],
  ],
  ['stale-if-error', cacheControl.response.directives['stale-if-error']],
] as const

describe('request', () => {
  for (const [key, directive] of requestBooleanDirectives) {
    describeBooleanDirective(cacheControl.request, key, directive)
  }
  for (const [key, directive] of requestDurationDirectives) {
    describeDurationDirective(cacheControl.request, key, directive)
  }

  test('parse', () => {
    expect(parseRequestCacheControl('max-age=100')).toEqual(
      cacheControl.request({ 'max-age': 100 }),
    )
    expect(parseRequestCacheControl('max-age=100, no-cache')).toEqual(
      cacheControl.request({ 'max-age': 100, 'no-cache': true }),
    )
    expect(parseRequestCacheControl('max-age=100, no-cache, no-store')).toEqual(
      cacheControl.request({
        'max-age': 100,
        'no-cache': true,
        'no-store': true,
      }),
    )
  })

  test('normalize', () => {
    expect(normalizeRequestCacheControl('max-age=100')).toEqual('max-age=100')
    expect(normalizeRequestCacheControl('no-cache, max-age=100')).toEqual(
      'max-age=100,no-cache',
    )
    expect(
      normalizeRequestCacheControl('max-age=100, no-cache, no-store'),
    ).toEqual('no-store')
  })

  test('validate', () => {
    expect(validateRequestCacheControl('max-age=100')).toEqual(true)
    expect(validateRequestCacheControl('max-age=100, no-cache')).toEqual(true)
    expect(
      validateRequestCacheControl('max-age=100, no-cache, no-store'),
    ).toEqual(true)
    expect(
      validateRequestCacheControl(
        'max-age=100, no-cache, no-store, max-age=100',
      ),
    ).toEqual(false)
  })
})

describe('response', () => {
  for (const [key, directive] of responseBooleanDirectives) {
    describeBooleanDirective(cacheControl.response, key, directive)
  }
  for (const [key, directive] of responseDurationDirectives) {
    describeDurationDirective(cacheControl.response, key, directive)
  }

  test('parse', () => {
    expect(parseResponseCacheControl('max-age=100')).toEqual(
      cacheControl.response({ 'max-age': 100 }),
    )
    expect(parseResponseCacheControl('max-age=100, no-cache')).toEqual(
      cacheControl.response({ 'max-age': 100, 'no-cache': true }),
    )
    expect(
      parseResponseCacheControl('max-age=100, no-cache, no-store'),
    ).toEqual(
      cacheControl.response({
        'max-age': 100,
        'no-cache': true,
        'no-store': true,
      }),
    )
  })

  test('normalize', () => {
    expect(normalizeResponseCacheControl('max-age=100')).toEqual('max-age=100')
    expect(normalizeResponseCacheControl('no-cache, max-age=100')).toEqual(
      'max-age=100,no-cache',
    )
    expect(
      normalizeResponseCacheControl('max-age=100, no-cache, no-store'),
    ).toEqual('no-store')
  })

  test('validate', () => {
    expect(validateResponseCacheControl('max-age=100')).toEqual(true)
    expect(validateResponseCacheControl('max-age=100, no-cache')).toEqual(true)
    expect(
      validateResponseCacheControl('max-age=100, no-cache, no-store'),
    ).toEqual(true)
    expect(
      validateResponseCacheControl(
        'max-age=100, no-cache, no-store, max-age=100',
      ),
    ).toEqual(false)
  })
})
