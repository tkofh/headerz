import { keyword } from './directives/keyword'
import { type HeaderInputs, createHeader } from './header'
import { isString } from './utils/predicates'

type CrossOriginEmbedderPolicyValue =
  | 'require-corp'
  | 'unsafe-none'
  | 'credentialless'

const directives = ['require-corp', 'unsafe-none', 'credentialless'] as const

const directive = keyword('directive', 'directive', {
  separator: ' ',
  literal: true,
  isKeyword: (value): value is CrossOriginEmbedderPolicyValue =>
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

export type CrossOriginEmbedderPolicy = HeaderInputs<
  typeof crossOriginEmbedderPolicy
>
