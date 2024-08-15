import { boolean } from './directives/boolean'
import { keyword } from './directives/keyword'
import { list } from './directives/list'
import { string } from './directives/string'
import { type HeaderInputs, createHeader } from './header'
import { isString } from './utils/predicates'

export type CSPFrameAncestorsValue =
  | "'none'"
  | "'self'"
  | "'https:'"
  | "'http:'"
  | "'data:'"
  | (string & {})

const cspFrameAncestorsKeywords = [
  "'none'",
  "'self'",
  "'https:'",
  "'http:'",
  "'data:'",
] as const

export type CSPSourceValue =
  | CSPFrameAncestorsValue
  | "'strict-dynamic'"
  | "'report-sample'"
  | "'inline-speculation-rules'"
  | "'unsafe-inline'"
  | "'unsafe-eval'"
  | "'unsafe-hashes'"
  | "'wasm-unsafe-eval'"
  // | "'nonce'"
  | "'sha256'"
  | "'sha384'"
  | "'sha512'"

const cspSourceValueKeywords = [
  "'none'",
  "'self'",
  "'strict-dynamic'",
  "'report-sample'",
  "'inline-speculation-rules'",
  'https:',
  'http:',
  'data:',
  "'unsafe-inline'",
  "'unsafe-eval'",
  "'unsafe-hashes'",
  "'wasm-unsafe-eval'",
  // 'nonce',
  "'sha256'",
  "'sha384'",
  "'sha512'",
] as const

const isCSPSourceValue = (value: unknown): value is CSPSourceValue =>
  isString(value) &&
  (cspSourceValueKeywords.includes(value as never) || !/\s/.test(value))

const sortCSPSourceValue = (a: CSPSourceValue, b: CSPSourceValue) => {
  const aIndex = cspSourceValueKeywords.indexOf(a as never)
  const bIndex = cspSourceValueKeywords.indexOf(b as never)

  if (aIndex === -1 && bIndex === -1) {
    return a < b ? -1 : a > b ? 1 : 0
  }

  if (aIndex === -1) {
    return 1
  }

  if (bIndex === -1) {
    return -1
  }

  return aIndex - bIndex
}

const cspSourceValue = <const N extends string, K extends string>(
  name: N,
  key: K,
) =>
  list(name, key, {
    isElement: isCSPSourceValue,
    separator: ' ',
    comparator: sortCSPSourceValue,
    map: (value) => {
      if (value.includes("'none'")) {
        return ["'none'"]
      }
      return value
    },
  })

const isCSPFrameAncestorsValue = (
  value: unknown,
): value is CSPFrameAncestorsValue =>
  isString(value) && cspFrameAncestorsKeywords.includes(value as never)

export type CSPSandboxValue =
  | 'allow-downloads'
  | 'allow-forms'
  | 'allow-modals'
  | 'allow-orientation-lock'
  | 'allow-pointer-lock'
  | 'allow-popups'
  | 'allow-popups-to-escape-sandbox'
  | 'allow-presentation'
  | 'allow-same-origin'
  | 'allow-scripts'
  | 'allow-top-navigation'
  | 'allow-top-navigation-by-user-activation'
  | 'allow-top-navigation-to-custom-protocols'

const sandboxValues = new Set([
  'allow-downloads',
  'allow-forms',
  'allow-modals',
  'allow-orientation-lock',
  'allow-pointer-lock',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
  'allow-presentation',
  'allow-same-origin',
  'allow-scripts',
  'allow-top-navigation',
  'allow-top-navigation-by-user-activation',
  'allow-top-navigation-to-custom-protocols',
])

const isCSPSandboxValue = (value: unknown): value is CSPSandboxValue =>
  isString(value) && sandboxValues.has(value)

const baseUri = cspSourceValue('base-uri', 'baseUri')
const childSrc = cspSourceValue('child-src', 'childSrc')
const connectSrc = cspSourceValue('connect-src', 'connectSrc')
const defaultSrc = cspSourceValue('default-src', 'defaultSrc')
const fontSrc = cspSourceValue('font-src', 'fontSrc')
const formAction = cspSourceValue('form-action', 'formAction')
const frameAncestors = list('frame-ancestors', 'frameAncestors', {
  isElement: isCSPFrameAncestorsValue,
  separator: ' ',
  map: (value) => {
    if (value.includes("'none'")) {
      return ["'none'"]
    }
    return value
  },
  comparator: sortCSPSourceValue,
})
const frameSrc = cspSourceValue('frame-src', 'frameSrc')
const imgSrc = cspSourceValue('img-src', 'imgSrc')
const manifestSrc = cspSourceValue('manifest-src', 'manifestSrc')
const mediaSrc = cspSourceValue('media-src', 'mediaSrc')
const objectSrc = cspSourceValue('object-src', 'objectSrc')
const sandbox = keyword('sandbox', 'sandbox', {
  separator: ' ',
  isKeyword: isCSPSandboxValue,
})
const scriptSrc = cspSourceValue('script-src', 'scriptSrc')
const scriptSrcElem = cspSourceValue('script-src-elem', 'scriptSrcElem')
const scriptSrcAttr = cspSourceValue('script-src-attr', 'scriptSrcAttr')
const styleSrc = cspSourceValue('style-src', 'styleSrc')
const styleSrcElem = cspSourceValue('style-src-elem', 'styleSrcElem')
const styleSrcAttr = cspSourceValue('style-src-attr', 'styleSrcAttr')
const workerSrc = cspSourceValue('worker-src', 'workerSrc')
const reportTo = string('report-to', 'reportTo', {
  separator: ' ',
})

const upgradeInsecureRequests = boolean(
  'upgrade-insecure-requests',
  'upgradeInsecureRequests',
)

export const contentSecurityPolicy = createHeader(
  'content-security-policy',
  [
    childSrc,
    connectSrc,
    defaultSrc,
    fontSrc,
    formAction,
    frameAncestors,
    frameSrc,
    imgSrc,
    manifestSrc,
    mediaSrc,
    objectSrc,
    sandbox,
    scriptSrc,
    scriptSrcElem,
    scriptSrcAttr,
    styleSrc,
    styleSrcElem,
    styleSrcAttr,
    workerSrc,
    upgradeInsecureRequests,
    baseUri,
    reportTo,
  ],
  {
    separator: ';',
    transform: (directives) => directives,
  },
)

export type ContentSecurityPolicy = HeaderInputs<typeof contentSecurityPolicy>
