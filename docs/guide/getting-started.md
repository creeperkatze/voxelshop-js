# Getting Started

## Installation

::: code-group

```sh [npm]
npm install voxelshop-js
```

```sh [pnpm]
pnpm add voxelshop-js
```

```sh [yarn]
yarn add voxelshop-js
```

```sh [bun]
bun add voxelshop-js
```

:::

## Get an API key

Generate an API key from your voxel.shop account settings. Different actions require different key permissions ("Post Updates", "Add & Edit Buyers", "list resources & buyers", etc.). Grant only what you need.

> [!WARNING]
> An API key grants access to your entire account. Never use it in client-side code.

## Create a client

```ts
import VoxelShopClient from 'voxelshop-js';

const client = new VoxelShopClient({
  apiKey: 'your-api-key',
  userAgent: 'my-app/1.0',
});
```

`apiKey` is optional at construction time. Most actions (`status`, `search`, purchase verification, user lookup, ...) don't require one at all. When set, it's used as the default `api_key` for any method whose parameters accept one, unless you override it per call.

## Fetch some data

```ts
const status = await client.general.status();
const resource = await client.resources.getInfo({ resourceId: 4 });
const { result } = await client.general.search({ query: 'item bridge' });
```

## Common options

```ts
const client = new VoxelShopClient({
  baseUrl: 'https://api.voxel.shop',
  apiKey: 'your-api-key',
  timeoutMs: 10_000,
  userAgent: 'my-app/1.0',
});
```

## Where to go next

- See [Error Handling](/guide/error-handling) for catching and inspecting errors, and how `success: false` differs from a thrown error
- See [General](/guide/general) for checking API status and searching resources
- See [Plugins](/guide/plugins) for verifying purchases and building auto-updaters
- See [Resources](/guide/resources) for managing your resources as an author
- See [Managers](/guide/managers) for verifying and identifying users
- See [Authors](/guide/authors) for listing buyers and user purchase history
- See [Platforms](/guide/platforms) for building integrations that act on a user's behalf
- See [API Reference](/api/) for the generated public API docs
