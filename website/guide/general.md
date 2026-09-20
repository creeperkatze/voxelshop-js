# General

Check API health and search for resources.

## Status

```ts
const status = await client.general.status();
```

Returns `true` only if the API responded with HTTP 200 and a body of exactly `"ok"`.

## Search

```ts
const { result, total, more, next_start } = await client.general.search({
  query: 'item',
  sort: 'relevant',
  premium: false,
  limit: 10,
});
```

- `sort` accepts `"updated"`, `"created"`, `"downloads"`, `"random"`, or `"relevant"` (default `"updated"`).
- `premium: true` returns only premium resources, `false` returns only free resources, and omitting it returns both.
- Pass `start` and `limit` (5-25) to paginate; `more` and `next_start` tell you whether and where to continue.
- Pass a user `token` to have `canDownload` reflect whether that user has purchased each premium result.

```ts
const { result } = await client.general.search({ token: 'a-user-token', premium: true });
for (const resource of result) {
  console.log(resource.title, resource.canDownload);
}
```
