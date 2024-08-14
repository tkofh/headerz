# headerz

todo: docs

```typescript
import { cacheControl } from 'headerz'

const request = cacheControl.request({
  maxAge: 100,
  noCache: true,
  noStore: true,
})

const response = cacheControl.response({
  maxAge: 100,
  noCache: true,
  noStore: true,
})

console.log(request.toValueString())
// max-age=100,no-cache,no-store

console.log(response.toHeaderString())
// cache-control: max-age=100,no-cache,no-store

console.log(
  request
    .pipe(cacheControl.request.noStore.set(true))
    .toString(),
)
// no-store
```
