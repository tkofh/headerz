import { duration } from './directives/duration'
import { type HeaderInputs, createHeader } from './header'

const allow = duration('maxAge', 'maxAge', true)

export const accessControlMaxAge = createHeader(
  'access-control-max-age',
  [allow],
  {
    separator: '; ',
    transform: (directives) => {
      return directives
    },
  },
)

console.log(
  accessControlMaxAge({
    maxAge: 100,
  }).pipe(accessControlMaxAge.maxAge.set(200)),
)

export type AccessControlMaxAge = HeaderInputs<typeof accessControlMaxAge>
