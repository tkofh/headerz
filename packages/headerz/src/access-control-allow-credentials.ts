import { boolean } from './directives/boolean'
import { type HeaderInputs, createHeader } from './header'

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

export type AccessControlAllowCredentials = HeaderInputs<
  typeof accessControlAllowCredentials
>
