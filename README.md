# headerz

todo: docs

```typescript
import { cacheControl } from 'headerz'

const request = cacheControl.request({
  'max-age': 100,
  'no-cache': true,
  'no-store': true,
})

const response = cacheControl.response({
  'max-age': 100,
  'no-cache': true,
  'no-store': true,
})

console.log(request.toString())
// max-age=100,no-cache,no-store

console.log(response.toString())
// max-age=100,no-cache,no-store

console.log(
  request
    .pipe(cacheControl.request.directives['no-store'].set(true))
    .toString(),
)
// no-store
```
