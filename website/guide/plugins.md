# Plugins

Actions meant to run inside a Minecraft plugin itself, to verify that it was purchased and downloaded through voxel.shop, and to fetch updates.

All of the values below should be read from the `%%__PLACEHOLDER__%%` tokens voxel.shop injects into your resource file. See the [API docs](https://voxel.shop/wiki/api) for the full list.

## Verify a purchase

```ts
const result = await client.plugins.verifyPurchase({
  resourceId: 4,
  downloadToken: '%%__VERIFY_TOKEN__%%',
  userId: '%%__USER__%%',
  nonce: '%%__NONCE__%%',
  injectVersion: '%%__INJECT_VER__%%',
  downloadAgent: '%%__AGENT__%%',
  downloadTime: '%%__TIMESTAMP__%%',
});

if (!result.success) {
  // not a genuine voxel.shop purchase. Remember this only deters non-motivated attackers
}
```

Alternatively, verify with just a license key:

```ts
await client.plugins.verifyPurchase({ resourceId: 4, license: '%%__LICENSE__%%' });
```

## Build an auto-updater

```ts
const update = await client.plugins.requestUpdateURL({
  resourceId: 4,
  downloadToken: '%%__VERIFY_TOKEN__%%',
  userId: '%%__USER__%%',
  nonce: '%%__NONCE__%%',
  injectVersion: '%%__INJECT_VER__%%',
  downloadAgent: '%%__AGENT__%%',
  downloadTime: '%%__TIMESTAMP__%%',
  allowRedirects: true,
});

if (update.success && update.result) {
  // download the new version from update.result.url before it expires at update.result.expires
}
```

> [!NOTE]
> `downloadLatestUpdate` is deprecated in favor of `requestUpdateURL` and is only included for completeness. It returns the raw file `Response` on success, or throws a `VoxelShopError` (HTTP 400/401/404) when no update is available or the download can't be verified.
