import { boolean } from './directives/boolean'
import { duration } from './directives/duration'
import { createHeader } from './header'
import { hasProperty } from './utils/predicates'

const maxAge = duration('max-age', 'maxAge')
const includeSubDomains = boolean('includeSubDomains', 'includeSubDomains')
const preload = boolean('preload', 'preload')

export const strictTransportSecurity = createHeader(
  'strict-transport-security',
  [maxAge, includeSubDomains, preload],
  {
    separator: '; ',
    transform: (directives) => {
      if (!hasProperty(directives, 'maxAge')) {
        throw new TypeError('max-age is required')
      }

      return directives
    },
  },
)
