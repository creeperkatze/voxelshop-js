import { describe, it, expect } from 'vitest';
import { normalizeBaseUrl, buildApiUrl, encodeFormValue, buildFormBody, extractErrorMessage } from '../../src/utils/request.js';

describe('normalizeBaseUrl', () => {
  it('strips trailing slashes', () => {
    expect(normalizeBaseUrl('https://api.voxel.shop/')).toBe('https://api.voxel.shop');
  });

  it('leaves plain base URL unchanged', () => {
    expect(normalizeBaseUrl('https://api.voxel.shop')).toBe('https://api.voxel.shop');
  });

  it('throws on empty string', () => {
    expect(() => normalizeBaseUrl('')).toThrow(TypeError);
  });
});

describe('buildApiUrl', () => {
  it('constructs a URL for a v1 path', () => {
    expect(buildApiUrl('https://api.voxel.shop', 'v1/status')).toBe('https://api.voxel.shop/v1/status');
  });

  it('strips a leading slash from the path', () => {
    expect(buildApiUrl('https://api.voxel.shop', '/v1/status')).toBe('https://api.voxel.shop/v1/status');
  });
});

describe('encodeFormValue', () => {
  it('encodes true as "1"', () => {
    expect(encodeFormValue(true)).toBe('1');
  });

  it('encodes false as "0"', () => {
    expect(encodeFormValue(false)).toBe('0');
  });

  it('coerces numbers with String()', () => {
    expect(encodeFormValue(4)).toBe('4');
  });

  it('leaves strings unchanged', () => {
    expect(encodeFormValue('item')).toBe('item');
  });
});

describe('buildFormBody', () => {
  it('builds a URLSearchParams body from a plain object', () => {
    const body = buildFormBody({ resource_id: 4, query: 'item' });
    expect(body.get('resource_id')).toBe('4');
    expect(body.get('query')).toBe('item');
  });

  it('skips null and undefined values', () => {
    const body = buildFormBody({ resource_id: 4, start: undefined, limit: null });
    expect(body.has('start')).toBe(false);
    expect(body.has('limit')).toBe(false);
  });

  it('returns an empty body when no params are given', () => {
    expect([...buildFormBody().keys()]).toEqual([]);
  });
});

describe('extractErrorMessage', () => {
  it('reads a top-level message field', () => {
    expect(extractErrorMessage({ message: 'Forbidden' }, 403)).toBe('Forbidden');
  });

  it('reads a nested response.message field', () => {
    expect(extractErrorMessage({ response: { message: 'No new updates are available' } }, 404)).toBe(
      'No new updates are available',
    );
  });

  it('reads a nested response.reason field when no message is present', () => {
    expect(extractErrorMessage({ response: { reason: 'no_update' } }, 404)).toBe('no_update');
  });

  it('falls back to the HTTP status when nothing usable is found', () => {
    expect(extractErrorMessage({}, 500)).toBe('HTTP 500');
    expect(extractErrorMessage(null, 500)).toBe('HTTP 500');
  });
});
