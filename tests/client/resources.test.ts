import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/client.js';
import { envelopeResponse, textResponse } from '../utils/http.js';

describe('ResourcesApi', () => {
  it('gets resource info', async () => {
    const response = {
      success: true,
      resource: {
        id: '4',
        title: 'Item Bridge',
        subtitle: 'Use one plugin\'s items in other plugins',
        price: '0.00',
        currency: 'USD',
        downloads: 24716,
        thumbnailURL: 'https://s3.amazonaws.com/polymart.product.thumbnails/default/4',
        headerURL: null,
        creationTime: '1587437238',
        supportedMinecraftVersions: ['1.19', '1.18', '1.17'],
        owner: { name: 'jojodmo', id: '1', type: 'user' as const, url: 'https://voxel.shop/user/jojodmo.1' },
        updates: { latest: { id: '384', version: '2.0', title: 'New methods', description: 'desc', time: '1595888974', snapshot: '0', beta: '0' } },
        reviews: { count: 17, stars: 4.8235 },
        url: 'https://voxel.shop/resource/item-bridge.4',
      },
    };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.resources.getInfo({ resourceId: 4 });
    expect(result).toEqual(response);
    expect(mockFetch.lastCall()?.url).toContain('/v1/getResourceInfo');
  });

  it('gets a simple, plain-text resource data point', async () => {
    const { client, mockFetch } = createTestClient([textResponse('Item Bridge')]);
    const title = await client.resources.getInfoSimple({ resourceId: 4, key: 'title' });
    expect(title).toBe('Item Bridge');
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('key')).toBe('title');
  });

  it('gets resource updates', async () => {
    const response = {
      success: true,
      result_count: 1,
      more: false,
      next_start: 1,
      total: 1,
      remaining: 0,
      resource: { id: 4 },
      updates: [
        {
          id: 6915,
          version: '3.1',
          url: 'https://voxel.shop/r/4/updates?update=6915',
          title: 'New listener',
          description: 'desc',
          time: 1629520547,
          downloadReady: true,
          snapshot: false,
          beta: false,
        },
      ],
    };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.resources.getUpdates({ resourceId: 4, start: 0, limit: 5 });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('resource_id')).toBe('4');
    expect(body.get('limit')).toBe('5');
  });

  it('posts an update as multipart/form-data', async () => {
    const response = { success: true, update: { id: 17263, version: '3.6', beta: false, snapshot: false }, resource: { id: 4 } };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const file = new Blob(['plugin-bytes'], { type: 'application/java-archive' });

    const result = await client.resources.postUpdate({
      apiKey: 'author-api-key',
      resourceId: 4,
      version: '3.6',
      title: 'New Release',
      message: 'Bug fixes',
      file,
      fileName: 'plugin.jar',
      beta: false,
    });

    expect(result).toEqual(response);
    const call = mockFetch.lastCall()!;
    expect(call.headers.get('Content-Type')).toContain('multipart/form-data');

    const form = await call.clone().formData();
    expect(form.get('resource_id')).toBe('4');
    expect(form.get('version')).toBe('3.6');
    expect(form.get('title')).toBe('New Release');
    expect(form.get('message')).toBe('Bug fixes');
    expect(form.get('api_key')).toBe('author-api-key');
    expect(form.get('beta')).toBe('0');
    const uploadedFile = form.get('file') as File;
    expect(uploadedFile.name).toBe('plugin.jar');
  });

  it('gets resource user data', async () => {
    const response = { success: true, resource: { id: '4', purchaseValid: true, purchaseStatus: 'Confirmed', purchaseTime: 1786894886 }, user: { id: 747856 } };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.resources.getUserData({ apiKey: 'author-api-key', resourceId: 4, userId: 747856 });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('api_key')).toBe('author-api-key');
    expect(body.get('user_id')).toBe('747856');
  });

  it('adds a buyer', async () => {
    const response = { success: true, resource: { id: '4', previousPurchaseValid: true, previousPurchaseStatus: 'Confirmed' }, user: { id: 681148 } };
    const { client } = createTestClient([envelopeResponse(response)]);
    const result = await client.resources.addBuyer({ apiKey: 'author-api-key', resourceId: 4, userId: 681148 });
    expect(result).toEqual(response);
  });

  it('imports an external buyer, mapping camelCase params to the snake_case form fields', async () => {
    const response = { success: true, import: { id: '4' } };
    const { client, mockFetch } = createTestClient([envelopeResponse(response)]);
    const result = await client.resources.importExternalBuyer({
      apiKey: 'author-api-key',
      resourceId: 4,
      externalUserId: 123,
      externalUserPaymentEmail: 'buyer@example.com',
      paymentTransactionId: 'txn-1',
      externalSiteName: 'spigot',
    });
    expect(result).toEqual(response);
    const body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('external_user_id')).toBe('123');
    expect(body.get('external_user_payment_email')).toBe('buyer@example.com');
    expect(body.get('payment_transaction_id')).toBe('txn-1');
    expect(body.get('external_site_name')).toBe('spigot');
  });

  it('adds a coupon code and maps deleteCoupon to the delete form field', async () => {
    const { client, mockFetch } = createTestClient([envelopeResponse({ success: true, message: "Coupon 'SECRET' created" })]);
    await client.resources.addCouponCode({ apiKey: 'author-api-key', resourceId: 4, coupon: 'SECRET', percent: 15 });
    let body = new URLSearchParams(await mockFetch.lastCall()!.clone().text());
    expect(body.get('coupon')).toBe('SECRET');
    expect(body.get('percent')).toBe('15');

    const { client: client2, mockFetch: mockFetch2 } = createTestClient([envelopeResponse({ success: true })]);
    await client2.resources.addCouponCode({ apiKey: 'author-api-key', resourceId: 4, coupon: 'SECRET', deleteCoupon: true });
    body = new URLSearchParams(await mockFetch2.lastCall()!.clone().text());
    expect(body.get('delete')).toBe('1');
  });
});
