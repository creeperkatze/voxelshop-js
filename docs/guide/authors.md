# Authors

Actions restricted to resource authors: inspect a user's purchase history, or list everyone who's bought a resource. Both require an API key.

## A user's purchases

```ts
const { resources, user } = await client.authors.getUserData({ apiKey: 'your-api-key', userId: 90579 });

for (const purchase of resources ?? []) {
  console.log(purchase.title, purchase.purchaseStatus, purchase.downloaded);
}
```

## List buyers on a resource

Requires an API key with the "list resources & buyers" permission.

```ts
const { buyers, more, next_start } = await client.authors.listBuyers({ apiKey: 'your-api-key', resourceId: 323 });

if (more) {
  const nextPage = await client.authors.listBuyers({ apiKey: 'your-api-key', resourceId: 323, start: next_start });
}
```

> [!WARNING]
> Neither of these should be used to verify a download. Use [`plugins.verifyPurchase`](/guide/plugins) instead.
