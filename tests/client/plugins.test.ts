import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { envelopeResponse } from '../utils/http.js';

describe('PluginsApi', () => {
  it('verifies a purchase using a license and resourceId', async () => {
    const { client, mockFetch } = createTestClient([envelopeResponse({ success: true })]);
    const result = await client.plugins.verifyPurchase({ resourceId: 4, license: 'JxCq-Nv-IPwO' });
    expect(result).toEqual({ success: true });
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('resource_id')).toBe('4');
    expect(body.get('license')).toBe('JxCq-Nv-IPwO');
  });

  it('verifies a purchase using download placeholders, mapping camelCase params to the snake_case form fields', async () => {
    const { client, mockFetch } = createTestClient([envelopeResponse({ success: true })]);
    await client.plugins.verifyPurchase({
      resourceId: 4,
      userId: 1,
      nonce: '7318',
      injectVersion: '1',
      downloadAgent: '000000',
      downloadTime: 1587928929,
      downloadToken: 'MDAwY2QzZDk0MjdkYWNm',
    });
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('resource_id')).toBe('4');
    expect(body.get('user_id')).toBe('1');
    expect(body.get('nonce')).toBe('7318');
    expect(body.get('inject_version')).toBe('1');
    expect(body.get('download_agent')).toBe('000000');
    expect(body.get('download_time')).toBe('1587928929');
    expect(body.get('download_token')).toBe('MDAwY2QzZDk0MjdkYWNm');
  });

  it('requests an update URL', async () => {
    const response = { success: true, result: { url: 'https://voxel.shop/download/1/', version: '2.7.12', expires: 1786895186 } };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.plugins.requestUpdateURL({
      resourceId: 4,
      userId: 1,
      nonce: '7318',
      injectVersion: '1',
      downloadAgent: '000000',
      downloadTime: 1587928929,
      downloadToken: 'MDAwY2QzZDk0MjdkYWNm',
      allowRedirects: true,
    });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('allow_redirects')).toBe('1');
  });
});
