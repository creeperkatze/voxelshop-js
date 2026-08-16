# voxelshop-js

A framework-agnostic fully typed JavaScript client for the [voxel.shop API](https://voxel.shop/wiki/api) (formerly Polymart).

[![NPM Version](https://img.shields.io/npm/v/voxelshop-js)](https://www.npmjs.com/package/voxelshop-js)
[![NPM Downloads](https://img.shields.io/npm/dt/voxelshop-js)](https://www.npmjs.com/package/voxelshop-js)
[![GitHub Branch Check Runs](https://img.shields.io/github/check-runs/creeperkatze/voxelshop-js/main)](https://github.com/creeperkatze/voxelshop-js/actions)
[![Codecov](https://img.shields.io/codecov/c/github/creeperkatze/voxelshop-js)](https://codecov.io/github/creeperkatze/voxelshop-js)
[![GitHub Issues](https://img.shields.io/github/issues/creeperkatze/voxelshop-js)](https://github.com/creeperkatze/voxelshop-js/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/creeperkatze/voxelshop-js)](https://github.com/creeperkatze/voxelshop-js/pulls)
[![GitHub Repo stars](https://img.shields.io/github/stars/creeperkatze/voxelshop-js?style=flat)](https://github.com/creeperkatze/voxelshop-js/stargazers)

[📚 Docs](https://voxelshop-js.creeperkatze.dev/) •
[🚀 Getting Started](https://voxelshop-js.creeperkatze.dev/guide/getting-started) •
[📖 API Reference](https://voxelshop-js.creeperkatze.dev/api) •
[📝 Changelog](https://github.com/creeperkatze/voxelshop-js/releases)

## 📦 Installation

```sh
npm install voxelshop-js
pnpm add voxelshop-js
yarn add voxelshop-js
bun add voxelshop-js
```

## 🚀 Usage

```ts
import VoxelShopClient from 'voxelshop-js';

const client = new VoxelShopClient({
  apiKey: 'your-api-key',
  userAgent: 'my-app/1.0',
});

const status = await client.general.status();
const resource = await client.resources.getInfo({ resourceId: 4 });

console.log(status);
console.log(resource);
```

## 📖 API

### `new VoxelShopClient(options)`

```ts
const client = new VoxelShopClient({
  baseUrl: 'https://api.voxel.shop',
  apiKey: 'your-api-key',
  timeoutMs: 10_000,
  userAgent: 'my-app/1.0',
});
```

### Options

```ts
interface VoxelShopClientOptions {
  baseUrl?: string;   // default: "https://api.voxel.shop"
  apiKey?: string;    // default api_key used for methods that accept one
  timeoutMs?: number; // default: 10000
  userAgent?: string;
  fetch?: typeof globalThis.fetch;
}
```

### Selected Methods

General:
- `client.general.status()`
- `client.general.search(options?)`

Plugins:
- `client.plugins.verifyPurchase(params)`
- `client.plugins.requestUpdateURL(params)`
- `client.plugins.downloadLatestUpdate(params)` — deprecated, use `requestUpdateURL`

Resources:
- `client.resources.getInfo(params)`
- `client.resources.getInfoSimple(params)`
- `client.resources.getUpdates(params)`
- `client.resources.postUpdate(params)`
- `client.resources.getUserData(params)`
- `client.resources.addBuyer(params)`
- `client.resources.importExternalBuyer(params)`
- `client.resources.addCouponCode(params)`

Managers:
- `client.managers.generateUserVerifyURL(params)`
- `client.managers.verifyUser(params)`
- `client.managers.getAccountInfo(params)`
- `client.managers.getUserId(params)`

Authors:
- `client.authors.getUserData(params)`
- `client.authors.listBuyers(params)`

Platforms:
- `client.platforms.authorizeUser(params)`
- `client.platforms.verifyAuthToken(params)`
- `client.platforms.invalidateAuthToken(params)`
- `client.platforms.getDownloadURL(params)`

## 🔐 Authentication

Generate an API key from your voxel.shop account settings. Different actions require different key permissions - grant only what you need.

```ts
const client = new VoxelShopClient({
  apiKey: 'your-api-key',
});

const { resource } = await client.resources.getInfo({ resourceId: 4 });
```

## 🌐 Custom Fetch

You can inject your own `fetch` implementation.

```ts
import VoxelShopClient from 'voxelshop-js';
import fetch from 'node-fetch';

const client = new VoxelShopClient({
  apiKey: 'your-api-key',
  fetch,
});
```

## ⚠️ Error Handling

Network errors, timeouts, and non-2xx HTTP responses throw a `VoxelShopError`. Most actions instead respond with HTTP 200 and `success: false` for expected negative outcomes (an invalid purchase, a validation error) - always check `.success` on the returned value.

```ts
import VoxelShopClient, { VoxelShopError } from 'voxelshop-js';

const client = new VoxelShopClient({ apiKey: 'your-api-key' });

try {
  const result = await client.plugins.verifyPurchase({ resourceId: 4, license: 'invalid' });
  if (!result.success) {
    // not a genuine purchase - handled as a normal result, not an exception
  }
} catch (error) {
  if (error instanceof VoxelShopError) {
    console.error(error.status);
    console.error(error.message);
    console.error(error.body);
  }
}
```

## 👨‍💻 Development

```sh
pnpm build

pnpm test
```

## 🤝 Contributing

Contributions are always welcome!

Please ensure you run `pnpm lint:fix` before opening a pull request.

## 📜 License

AGPL-3.0
