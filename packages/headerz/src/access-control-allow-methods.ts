import { list } from './directives/list'
import { createHeader } from './header'

const methods = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'TRACE',
  'PATCH',
  '*',
] as const

export type AccessControlAllowMethod = (typeof methods)[number]

const headers = list('headers', 'headers', {
  isElement: (value): value is AccessControlAllowMethod =>
    typeof value === 'string' && methods.includes(value as never),
  separator: ',',
  comparator: (a, b) => a.localeCompare(b),
  literal: true,
  map: (value) => {
    const upper = value.map((v) =>
      v.toUpperCase(),
    ) as ReadonlyArray<AccessControlAllowMethod>

    if (upper.includes('*')) {
      return ['*']
    }

    return upper
  },
})

export const accessControlAllowMethods = createHeader(
  'access-control-allow-methods',
  [headers],
  {
    separator: '; ',
    transform: (directives) => {
      return directives
    },
  },
)
