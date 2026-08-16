import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { envelopeResponse } from '../utils/http.js';

describe('ManagersApi', () => {
  it('generates a user verify URL', async () => {
    const response = { success: true, result: { url: 'https://voxel.shop/verifyUser?service=example' } };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.managers.generateUserVerifyURL({ service: 'org.example.MyService', nonce: '3ZvbLiEBaeB1' });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('service')).toBe('org.example.MyService');
    expect(body.get('nonce')).toBe('3ZvbLiEBaeB1');
  });

  it('verifies a user', async () => {
    const response = { success: true, result: { user: { id: 25626 } } };
    const { client } = createTestClient([envelopeResponse(response)]);
    const result = await client.managers.verifyUser({ service: 'org.example.MyService', nonce: '3ZvbLiEBaeB1', token: '7AY-NHY' });
    expect(result).toEqual(response);
  });

  it('gets account info for a user', async () => {
    const response = {
      success: true,
      user: {
        id: '1',
        username: 'jojodmo',
        type: 'user' as const,
        profilePictureURL: 'https://s3.amazonaws.com/polymart.shop.profilepictures/default/1',
        statistics: { resourceCount: 5, resourceDownloads: 200573, resourceRatings: 3771, resourceAverageRating: 4.8 },
      },
    };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.managers.getAccountInfo({ userId: 1 });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('user_id')).toBe('1');
    expect(body.has('shop_id')).toBe(false);
  });

  it('gets account info for a shop', async () => {
    const { client, mockFetch } = createTestClient([envelopeResponse({ success: true, shop: { id: '1' } })]);
    await client.managers.getAccountInfo({ shopId: 1 });
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('shop_id')).toBe('1');
    expect(body.has('user_id')).toBe(false);
  });

  it('gets a user id by username', async () => {
    const response = { success: true, user: { id: '1', username: 'jojodmo' } };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.managers.getUserId({ username: 'jojodmo' });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('username')).toBe('jojodmo');
  });
});
