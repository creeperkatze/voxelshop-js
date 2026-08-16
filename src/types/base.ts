/** A value that can be serialized as a form field sent to the voxel.shop API. */
export type QueryValue = string | number | boolean | null | undefined;

/** Options for creating a {@link VoxelShopClient}. */
export interface VoxelShopClientOptions {
  /**
   * Base URL of the voxel.shop API.
   * @defaultValue "https://api.voxel.shop"
   */
  baseUrl?: string;
  /**
   * Default API key sent as the `api_key` form field for methods that accept one, unless overridden
   * per call. Generate one from your voxel.shop account settings.
   */
  apiKey?: string;
  /**
   * Request timeout in milliseconds.
   * @defaultValue 10000
   */
  timeoutMs?: number;
  /** Value to send as the `User-Agent` header on every request. */
  userAgent?: string;
  /** Custom fetch implementation. */
  fetch?: typeof globalThis.fetch;
}

/**
 * Fields common to every voxel.shop API action response.
 * @remarks Every namespace method returns the `response` portion of the API's `{ request, response }`
 * envelope, typed with its action-specific fields. Most actions signal expected negative outcomes (an
 * invalid purchase, a validation error) with `success: false` in an HTTP 200 response rather than
 * throwing. Only network failures, timeouts, and non-2xx HTTP responses throw a {@link VoxelShopError}.
 * Always check `.success` on the returned value.
 */
export interface VoxelShopResponse {
  success: boolean;
}
