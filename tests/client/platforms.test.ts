import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { envelopeResponse } from '../utils/http.js';

describe('PlatformsApi', () => {
  it('authorizes a user, mapping camelCase params to the snake_case form fields', async () => {
    const response = { success: true, result: { url: 'https://voxel.shop/linkAccount/?param=value', token: '' } };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.platforms.authorizeUser({
      service: 'api.example.com',
      returnUrl: 'https://api.example.com/voxelShopResponse',
      returnToken: true,
      state: 'MM-UW_oJYaq_ruWPm4pTpiTY',
    });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('return_url')).toBe('https://api.example.com/voxelShopResponse');
    expect(body.get('return_token')).toBe('1');
    expect(body.get('state')).toBe('MM-UW_oJYaq_ruWPm4pTpiTY');
  });

  it('verifies an auth token', async () => {
    const response = { success: true, result: { success: true, message: 'SUCCESS', user: { id: '72631' }, expires: 1789486886 } };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.platforms.verifyAuthToken({ token: 'a-user-token' });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('token')).toBe('a-user-token');
  });

  it('invalidates an auth token', async () => {
    const response = { success: true, result: { message: 'SUCCESS' } };
    const { client } = createTestClient([envelopeResponse(response)]);
    const result = await client.platforms.invalidateAuthToken({ token: 'a-user-token' });
    expect(result).toEqual(response);
  });

  it('gets a download URL on a user\'s behalf', async () => {
    const response = { success: true, message: 'SUCCESS', result: { url: 'https://voxel.shop/download/?param=value', version: '2.17.4', expires: 1786894946 } };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.platforms.getDownloadURL({ resourceId: 4, token: 'a-user-token' });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('resource_id')).toBe('4');
    expect(body.get('token')).toBe('a-user-token');
  });
});
