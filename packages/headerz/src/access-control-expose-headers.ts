import { list } from './directives/list'
import { createHeader } from './header'

const headers = list('headers', 'headers', {
  isElement: (value) => typeof value === 'string',
  separator: ',',
  comparator: (a, b) => a.localeCompare(b),
  literal: true,
  map: (value) => {
    const lower = value.map((v) => v.toLowerCase())

    if (lower.includes('*')) {
      return ['*']
    }

    return lower
  },
})

export const accessControlExposeHeaders = createHeader(
  'access-control-expose-headers',
  [headers],
  {
    separator: '; ',
    transform: (directives) => {
      return directives
    },
  },
)
