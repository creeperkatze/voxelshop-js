# Resources

Manage your resources: read their public info, publish updates, and manage buyers.

## Resource info

```ts
const { resource } = await client.resources.getInfo({ resourceId: 4 });

// a single, plain-text data point, without an author API key
const title = await client.resources.getInfoSimple({ resourceId: 4, key: 'title' });
```

Pass `apiKey` (or configure one on the client) to get additional detail as the resource's author.

## Resource updates

```ts
const { updates, more, next_start } = await client.resources.getUpdates({ resourceId: 4, limit: 10 });
```

## Post an update

Requires an API key with the "Post Updates" permission.

```ts
const file = new Blob([fileBytes], { type: 'application/java-archive' });

const result = await client.resources.postUpdate({
  apiKey: 'your-api-key',
  resourceId: 4,
  version: '3.6',
  title: 'New Release',
  message: 'Bug fixes and improvements',
  file,
  fileName: 'plugin.jar',
});
```

## Buyers

Requires an API key with the "Add & Edit Buyers" permission.

```ts
await client.resources.addBuyer({ apiKey: 'your-api-key', resourceId: 4, userId: 681148 });

await client.resources.importExternalBuyer({
  apiKey: 'your-api-key',
  resourceId: 4,
  externalUserId: 12345,
  externalUserPaymentEmail: 'buyer@example.com',
  paymentTransactionId: 'txn-1',
  externalSiteName: 'spigot',
});
```

## Coupon codes

```ts
await client.resources.addCouponCode({ apiKey: 'your-api-key', resourceId: 4, coupon: 'SUMMER-SALE', percent: 15 });

// delete a coupon
await client.resources.addCouponCode({ apiKey: 'your-api-key', resourceId: 4, coupon: 'SUMMER-SALE', deleteCoupon: true });
```

## Purchase status for a user

```ts
const { resource } = await client.resources.getUserData({ apiKey: 'your-api-key', resourceId: 4, userId: 747856 });
```

> [!WARNING]
> Don't use this to verify a download. Use [`plugins.verifyPurchase`](/guide/plugins) instead.
