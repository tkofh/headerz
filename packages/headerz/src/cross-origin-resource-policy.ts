import { keyword } from './directives/keyword'
import { type HeaderInputs, createHeader } from './header'
import { isString } from './utils/predicates'

export type CrossOriginResourcePolicyValue =
  | 'same-site'
  | 'same-origin'
  | 'cross-origin'

const directives = ['same-site', 'same-origin', 'cross-origin'] as const

const directive = keyword('directive', 'directive', {
  separator: ' ',
  literal: true,
  isKeyword: (value): value is CrossOriginResourcePolicyValue =>
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

export type CrossOriginResourcePolicy = HeaderInputs<
  typeof crossOriginResourcePolicy
>
