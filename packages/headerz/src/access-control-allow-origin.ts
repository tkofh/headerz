import { string } from './directives/string'
import { type HeaderInputs, createHeader } from './header'

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

export type AccessControlAllowOrigin = HeaderInputs<
  typeof accessControlAllowOrigin
>
