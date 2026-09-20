# Custom Fetch

## Injecting a fetch implementation

You can provide your own `fetch` for non-standard runtimes or to add middleware such as logging or retry logic.

```ts
import VoxelShopClient from 'voxelshop-js';
import fetch from 'node-fetch';

const client = new VoxelShopClient({
  fetch,
});
```

## User-Agent

Set a custom `User-Agent` once at client creation time:

```ts
const client = new VoxelShopClient({
  userAgent: 'my-dashboard/1.0',
});
```

The value is sent on every request made by that client instance.

## Timeout

The default request timeout is 10 000 ms. Override it with `timeoutMs`:

```ts
const client = new VoxelShopClient({
  timeoutMs: 30_000,
});
```

A timed-out request throws a `VoxelShopError` with `status: 0`.

## Base URL

The default base URL is `https://api.voxel.shop`. Override it to point at a proxy or gateway:

```ts
const client = new VoxelShopClient({
  baseUrl: 'https://my-proxy.example.com',
});
```
