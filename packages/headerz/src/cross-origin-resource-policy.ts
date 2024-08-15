import { keyword } from './directives/keyword'
import { createHeader } from './header'
import { isString } from './utils/predicates'

export type CrossOriginResourcePolicy =
  | 'same-site'
  | 'same-origin'
  | 'cross-origin'

const directives = ['same-site', 'same-origin', 'cross-origin'] as const

const directive = keyword('directive', 'directive', {
  separator: ' ',
  literal: true,
  isKeyword: (value): value is CrossOriginResourcePolicy =>
    isString(value) && directives.includes(value as never),
})

export const crossOriginResourcePolicy = createHeader(
  'cross-origin-resource-policy',
  [directive],
  {
    separator: '; ',
    transform: (directives) => {
      return directives
    },
  },
)

console.log(
  crossOriginResourcePolicy({
    directive: 'same-origin',
  }).pipe(crossOriginResourcePolicy.directive.set('same-site')),
)
