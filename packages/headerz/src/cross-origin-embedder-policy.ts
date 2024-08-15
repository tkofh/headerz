import { keyword } from './directives/keyword'
import { createHeader } from './header'
import { isString } from './utils/predicates'

export type CrossOriginEmbedderPolicy =
  | 'require-corp'
  | 'unsafe-none'
  | 'credentialless'

const directives = ['require-corp', 'unsafe-none', 'credentialless'] as const

const directive = keyword('directive', 'directive', {
  separator: ' ',
  literal: true,
  isKeyword: (value): value is CrossOriginEmbedderPolicy =>
    isString(value) && directives.includes(value as never),
})

export const crossOriginEmbedderPolicy = createHeader(
  'cross-origin-embedder-policy',
  [directive],
  {
    separator: '; ',
    transform: (directives) => {
      return directives
    },
  },
)
