# Managers

Verify and identify voxel.shop users. Useful for linking accounts, e.g. verifying buyers on a Discord server.

## Verify a user

```ts
const { result } = await client.managers.generateUserVerifyURL({
  service: 'org.example.MyService',
  nonce: 'a-random-value',
});

// send the user to result.url, they'll receive a token to give back to you
```

```ts
const { result } = await client.managers.verifyUser({
  service: 'org.example.MyService',
  nonce: 'a-random-value', // must match the nonce used above
  token: 'the-token-the-user-gave-you',
});

const userId = result?.user.id;
```

> [!NOTE]
> If you need to download resources on the user's behalf instead of just identifying them, use [`platforms.authorizeUser`](/guide/platforms).

## Look up accounts

```ts
const { user } = await client.managers.getAccountInfo({ userId: 1 });
const { shop } = await client.managers.getAccountInfo({ shopId: 1 });

const { user: lookedUp } = await client.managers.getUserId({ username: 'jojodmo' });
```
