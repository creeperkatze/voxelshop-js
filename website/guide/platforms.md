# Platforms

For hosts, control panels, and platforms that act on behalf of voxel.shop users, e.g. letting a user download their purchased resources directly from your service.

## Authorize a user

```ts
const { result } = await client.platforms.authorizeUser({
  service: 'api.example.com',
  returnUrl: 'https://api.example.com/voxelShopResponse',
  state: 'a-secure-random-string', // verify this matches on the way back
});

// redirect the user to result.url
```

The user is redirected back to `returnUrl` with `success`, `token`, and `state` as POST parameters. Verify `state` matches what you sent, then store `token`. It's valid for roughly 365 days.

```ts
const { result } = await client.platforms.verifyAuthToken({ token: storedToken });

if (result?.success) {
  // token is valid, result.user.id identifies the user, result.expires is the expiry timestamp
}
```

```ts
// call this when a user unlinks their voxel.shop account from your service
await client.platforms.invalidateAuthToken({ token: storedToken });
```

## Download a resource on a user's behalf

```ts
const { result } = await client.platforms.getDownloadURL({
  resourceId: 4,
  token: storedToken, // recommended for free resources, required for premium ones
});

if (result) {
  // fetch result.url before it expires at result.expires
}
```
