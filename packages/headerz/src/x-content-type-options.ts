import { boolean } from './directives/boolean'
import { createHeader } from './header'

const noSniff = boolean('nosniff', 'nosniff')

export const xContentTypeOptions = createHeader(
  'x-content-type-options',
  [noSniff],
  {
    separator: '; ',
    transform: (directives) => {
      return directives
    },
  },
)
