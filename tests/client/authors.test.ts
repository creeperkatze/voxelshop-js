import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { envelopeResponse } from '../utils/http.js';

describe('AuthorsApi', () => {
  it('gets user data, including resource purchases', async () => {
    const response = {
      success: true,
      resources: [
        {
          id: '1',
          title: 'Custom Items',
          subtitle: 'Make any item/block you imagine',
          price: '16.00',
          currency: 'USD',
          url: 'https://voxel.shop/resource/custom-items.1',
          purchaseValid: true,
          purchaseStatus: 'Confirmed',
          downloaded: true,
          purchaseTime: 1786894886,
        },
      ],
      user: { id: 90579, username: 'AnonymousFox', profilePictureURL: null },
      errors: [] as [],
    };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.authors.getUserData({ apiKey: 'author-api-key', userId: 90579 });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('api_key')).toBe('author-api-key');
    expect(body.get('user_id')).toBe('90579');
  });

  it('lists buyers on a resource', async () => {
    const response = {
      success: true,
      more: true,
      total: 8200,
      remaining: 1400,
      next_start: 194773,
      buyers: [
        { userID: 1, price: '14.40', currency: 'USD', status: 'COMPLETED', valid: true, fromBundle: null, purchaseTime: 1786894886, paymentProvider: 'paypal' },
      ],
      resource: { id: 323 },
    };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.authors.listBuyers({ apiKey: 'author-api-key', resourceId: 323, start: 0 });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('resource_id')).toBe('323');
    expect(body.get('start')).toBe('0');
  });

  it('falls back to the client-configured apiKey when none is given per call', async () => {
    const { client, mockFetch } = createTestClient([envelopeResponse({ success: true, more: false, total: 0, remaining: 0, next_start: 0, buyers: [], resource: { id: 1 } })]);
    await client.authors.listBuyers({ resourceId: 1 });
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.has('api_key')).toBe(false);
  });
});
