import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { envelopeResponse, errorResponse, textResponse, createMockFetch } from '../utils/http.js';
import { VoxelShopError } from '../../src/errors.js';
import { VoxelShopClient } from '../../src/client/voxelshop.js';

describe('VoxelShopClientCore', () => {
  it('sends requests as application/x-www-form-urlencoded POST bodies', async () => {
    const { client, mockFetch } = createTestClient([envelopeResponse({ success: true, result_count: 0 })]);
    await client.general.search({ query: 'item', limit: 5 });
    const call = mockFetch.lastCall()!;
    expect(call.method).toBe('POST');
    expect(call.headers.get('Content-Type')).toContain('application/x-www-form-urlencoded');
    const body = new URLSearchParams(await call.clone().text());
    expect(body.get('query')).toBe('item');
    expect(body.get('limit')).toBe('5');
  });

  it('encodes boolean form values as "1" and "0"', async () => {
    const { client, mockFetch } = createTestClient([envelopeResponse({ success: true, result_count: 0 })]);
    await client.general.search({ premium: true });
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('premium')).toBe('1');
  });

  it('omits null and undefined params from the request body', async () => {
    const { client, mockFetch } = createTestClient([envelopeResponse({ success: true, result_count: 0 })]);
    await client.general.search({ query: 'item' });
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.has('sort')).toBe(false);
    expect(body.has('premium')).toBe(false);
  });

  it('attaches the configured apiKey as the api_key form field', async () => {
    const mockFetch = createMockFetch([envelopeResponse({ success: true })]);
    const client = new VoxelShopClient({
      baseUrl: 'https://api.voxel.shop',
      apiKey: 'default-api-key',
      fetch: mockFetch as unknown as typeof fetch,
    });
    await client.resources.getInfo({ resourceId: 4 });
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('api_key')).toBe('default-api-key');
  });

  it('lets a per-call apiKey override the configured default', async () => {
    const mockFetch = createMockFetch([envelopeResponse({ success: true })]);
    const client = new VoxelShopClient({
      baseUrl: 'https://api.voxel.shop',
      apiKey: 'default-api-key',
      fetch: mockFetch as unknown as typeof fetch,
    });
    await client.resources.getInfo({ resourceId: 4, apiKey: 'override-api-key' });
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('api_key')).toBe('override-api-key');
  });

  it('sends a custom User-Agent header when configured', async () => {
    const mockFetch = createMockFetch([envelopeResponse({ success: true, result_count: 0 })]);
    const client = new VoxelShopClient({
      baseUrl: 'https://api.voxel.shop',
      userAgent: 'my-app/1.0',
      fetch: mockFetch as unknown as typeof fetch,
    });
    await client.general.search();
    expect(mockFetch.lastCall()?.headers.get('User-Agent')).toBe('my-app/1.0');
  });

  it('does not throw when a request succeeds with success: false in the response body', async () => {
    const { client } = createTestClient([envelopeResponse({ success: false })]);
    const result = await client.plugins.verifyPurchase({ resourceId: 4, license: 'invalid' });
    expect(result).toEqual({ success: false });
  });

  it('throws VoxelShopError on a non-ok HTTP response', async () => {
    const { client } = createTestClient([errorResponse(401)]);
    await expect(client.general.search()).rejects.toThrow(VoxelShopError);
  });

  it('extracts the error message from a top-level message field', async () => {
    const { client } = createTestClient([errorResponse(403, { message: 'Forbidden' })]);
    try {
      await client.general.search();
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(VoxelShopError);
      expect((err as VoxelShopError).message).toBe('Forbidden');
      expect((err as VoxelShopError).status).toBe(403);
    }
  });

  it('extracts the error message from a nested response.reason field', async () => {
    const { client } = createTestClient([
      errorResponse(404, { request: {}, response: { success: false, reason: 'no_update', message: 'No new updates are available' } }),
    ]);
    try {
      await client.plugins.downloadLatestUpdate({
        resourceId: 4,
        userId: 1,
        nonce: '7318',
        injectVersion: '1',
        downloadAgent: '000000',
        downloadTime: 1587928929,
        downloadToken: 'MDAwY2QzZDk0MjdkYWNm',
        greaterThanUpload: 9876543210,
      });
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(VoxelShopError);
      expect((err as VoxelShopError).message).toBe('No new updates are available');
      expect((err as VoxelShopError).status).toBe(404);
    }
  });

  it('returns the raw file response from downloadLatestUpdate on success', async () => {
    const { client, mockFetch } = createTestClient([textResponse('binary-file-contents')]);
    const response = await client.plugins.downloadLatestUpdate({
      resourceId: 4,
      userId: 1,
      nonce: '7318',
      injectVersion: '1',
      downloadAgent: '000000',
      downloadTime: 1587928929,
      downloadToken: 'MDAwY2QzZDk0MjdkYWNm',
      greaterThanUpload: 384,
    });
    expect(await response.text()).toBe('binary-file-contents');
    expect(mockFetch.lastCall()?.url).toContain('/v1/downloadLatestUpdate');
  });

  it('throws VoxelShopError with status 0 on a network timeout', async () => {
    const client = new VoxelShopClient({
      baseUrl: 'https://api.voxel.shop',
      timeoutMs: 1,
      fetch: (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        }),
    });
    try {
      await client.general.search();
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(VoxelShopError);
      expect((err as VoxelShopError).status).toBe(0);
    }
  });
});
