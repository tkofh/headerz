import { boolean } from './directives/boolean'
import { type HeaderInputs, createHeader } from './header'

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

export type XContentTypeOptions = HeaderInputs<typeof xContentTypeOptions>
