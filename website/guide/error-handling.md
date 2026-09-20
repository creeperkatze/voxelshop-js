# Error Handling

Network errors, timeouts, and non-2xx HTTP responses throw a `VoxelShopError`.

## `success: false` is not an error

Most voxel.shop actions respond with HTTP 200 even for expected negative outcomes - an invalid purchase, a resource that doesn't exist, a validation failure. These are returned normally as `{ success: false, ... }` rather than thrown, since they're often a legitimate result your code needs to branch on:

```ts
const result = await client.plugins.verifyPurchase({ resourceId: 4, license: 'JxCq-Nv-IPwO' });

if (!result.success) {
  // the license is invalid, or the resource wasn't purchased on voxel.shop - not exceptional
}
```

`VoxelShopError` is reserved for failures where the request itself couldn't be completed: the network is down, the request timed out, or the API rejected the request outright (e.g. `downloadLatestUpdate` returning HTTP 404 when no update is available).

## Catching errors

```ts
import VoxelShopClient, { VoxelShopError } from 'voxelshop-js';

try {
  await client.resources.postUpdate({ resourceId: 4, version: '1.0', title: '...', message: '...', file });
} catch (err) {
  if (err instanceof VoxelShopError) {
    console.error(err.status, err.message);
  }
}
```

## VoxelShopError properties

| Property | Type | Description |
|---|---|---|
| `message` | `string` | Human-readable description |
| `status` | `number` | HTTP status code, or `0` for network/timeout errors |
| `body` | `unknown` | Raw parsed response body if available |
| `response` | `Response \| undefined` | The raw fetch `Response` if available |

## Common status codes

- `0` - the request never reached the server (network error, timeout, DNS failure)
- `400` / `401` / `404` - documented failure statuses for `plugins.downloadLatestUpdate`; inspect `err.body` for `reason` and `message`
- anything else - an unexpected failure; inspect `err.body` for details
