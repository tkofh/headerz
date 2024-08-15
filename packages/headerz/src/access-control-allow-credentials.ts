import { boolean } from './directives/boolean'
import { createHeader } from './header'

const allow = boolean('allow', 'allow', true)

export const accessControlAllowCredentials = createHeader(
  'access-control-allow-credentials',
  [allow],
  {
    separator: '; ',
    transform: (directives) => {
      return directives
    },
  },
)
