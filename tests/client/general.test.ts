import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { envelopeResponse, textResponse } from '../utils/http.js';
import type { SearchResponse } from '../../src/types/index.js';

describe('GeneralApi', () => {
  it('reports the API as up when status returns "ok" with HTTP 200', async () => {
    const { client } = createTestClient([textResponse('ok')]);
    await expect(client.general.status()).resolves.toBe(true);
  });

  it('reports the API as down when the body is not exactly "ok"', async () => {
    const { client } = createTestClient([textResponse('down for maintenance')]);
    await expect(client.general.status()).resolves.toBe(false);
  });

  it('sends status as a GET request with no body', async () => {
    const { client, mockFetch } = createTestClient([textResponse('ok')]);
    await client.general.status();
    const call = mockFetch.lastCall()!;
    expect(call.method).toBe('GET');
    expect(call.url).toContain('/v1/status');
  });

  it('searches with the given options', async () => {
    const response: SearchResponse = {
      success: true,
      result_count: 1,
      more: false,
      next_start: 1,
      total: 1,
      remaining: 0,
      result: [
        {
          id: '4',
          url: 'https://voxel.shop/resource/item-bridge.4',
          owner: { type: 'user', id: '1', name: 'jojodmo', url: 'https://voxel.shop/u/jojodmo.1' },
          title: 'Item Bridge',
          subtitle: 'Use items from one plugin with another',
          version: '2.0',
          creationTime: '1587437238',
          lastUpdateTime: '1595888974',
          supportedServerSoftware: null,
          supportedLanguages: null,
          supportedMinecraftVersions: null,
          donationLink: null,
          thumbnailURL: 'https://s3.amazonaws.com/polymart.product.thumbnails/default/4',
          headerURL: null,
          canDownload: false,
        },
      ],
    };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.general.search({ query: 'item', sort: 'relevant', premium: false, limit: 5 });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('query')).toBe('item');
    expect(body.get('sort')).toBe('relevant');
    expect(body.get('premium')).toBe('0');
    expect(body.get('limit')).toBe('5');
  });

  it('sends token as a form field on search', async () => {
    const { client, mockFetch } = createTestClient([envelopeResponse({ success: true, result_count: 0 })]);
    await client.general.search({ token: 'user-token' });
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('token')).toBe('user-token');
  });
});
