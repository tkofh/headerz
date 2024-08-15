import { keyword } from './directives/keyword'
import { createHeader } from './header'
import { isString } from './utils/predicates'

export type CrossOriginOpenerPolicy =
  | 'unsafe-none'
  | 'same-origin'
  | 'same-origin-allow-popups'

const directives = [
  'unsafe-none',
  'same-origin',
  'same-origin-allow-popups',
] as const

const directive = keyword('directive', 'directive', {
  separator: ' ',
  literal: true,
  isKeyword: (value): value is CrossOriginOpenerPolicy =>
    isString(value) && directives.includes(value as never),
})

export const crossOriginOpenerPolicy = createHeader(
  'cross-origin-opener-policy',
  [directive],
  {
    separator: '; ',
    transform: (directives) => {
      return directives
    },
  },
)

console.log(
  crossOriginOpenerPolicy({
    directive: 'same-origin',
  }).pipe(crossOriginOpenerPolicy.directive.set('unsafe-none')),
)
