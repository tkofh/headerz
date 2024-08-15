import { string } from './directives/string'
import { createHeader } from './header'

export type AccessControlAllowOrigin = '*' | 'null' | (string & {})

const origin = string('origin', 'origin', {
  separator: ',',
  literal: true,
})

export const accessControlAllowOrigin = createHeader(
  'access-control-allow-origin',
  [origin],
  {
    separator: '; ',
    transform: (directives) => {
      return directives
    },
  },
)
