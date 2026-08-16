import type { QueryValue } from '../types/base.js';

/** Strips trailing slashes from a base URL. */
export function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl || typeof baseUrl !== 'string') {
    throw new TypeError('baseUrl must be a non-empty string');
  }

  return baseUrl.replace(/\/+$/, '');
}

/** Constructs the full API URL for a given path, with no query parameters. */
export function buildApiUrl(baseUrl: string, path: string): string {
  const trimmedPath = path.replace(/^\/+/, '');
  return `${normalizeBaseUrl(baseUrl)}/${trimmedPath}`;
}

/**
 * Serializes a single form value the way the voxel.shop API expects it: booleans become `"1"`/`"0"`,
 * everything else is coerced with `String()`.
 */
export function encodeFormValue(value: Exclude<QueryValue, null | undefined>): string {
  if (typeof value === 'boolean') return value ? '1' : '0';
  return String(value);
}

/** Builds a `URLSearchParams` body from a plain params object, skipping null and undefined values. */
export function buildFormBody(params?: object): URLSearchParams {
  const body = new URLSearchParams();
  if (!params) return body;

  for (const [key, rawValue] of Object.entries(params as Record<string, QueryValue>)) {
    if (rawValue == null) continue;
    body.set(key, encodeFormValue(rawValue));
  }

  return body;
}

/** Extracts a human-readable message from an API error response body. */
export function extractErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    const response = record['response'];
    const target = response && typeof response === 'object' ? (response as Record<string, unknown>) : record;

    const message = target['message'];
    if (typeof message === 'string' && message.length > 0) return message;

    const reason = target['reason'];
    if (typeof reason === 'string' && reason.length > 0) return reason;
  }

  return `HTTP ${status}`;
}

/** Attempts to parse the error response body as JSON, falling back to text. */
export async function parseErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json().catch(() => null);
  }
  return response.text().catch(() => null);
}
