import { VoxelShopError } from '../errors.js';
import { buildApiUrl, buildFormBody, parseErrorBody, extractErrorMessage } from '../utils/request.js';
import type { VoxelShopClientOptions } from '../types/base.js';

const DEFAULT_BASE_URL = 'https://api.voxel.shop';
const DEFAULT_TIMEOUT_MS = 10_000;

/** Options passed to {@link VoxelShopClientCore.requestRaw}. */
export interface RequestOptions {
  method?: string;
  form?: object;
  multipart?: FormData;
  headers?: HeadersInit;
}

/** Envelope every voxel.shop API action responds with. */
interface VoxelShopEnvelope<T> {
  request: unknown;
  response: T;
}

/** Low-level HTTP client used internally by all API namespace classes. */
export class VoxelShopClientCore {
  readonly #baseUrl: string;
  readonly #apiKey: string | undefined;
  readonly #timeoutMs: number;
  readonly #userAgent: string | undefined;
  readonly #fetch: typeof globalThis.fetch;

  constructor(options: VoxelShopClientOptions = {}) {
    this.#baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.#apiKey = options.apiKey;
    this.#timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.#userAgent = options.userAgent;
    this.#fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  /** The default API key configured on this client, used when a method's `apiKey` parameter is omitted. */
  get apiKey(): string | undefined {
    return this.#apiKey;
  }

  /** Sends a form-encoded POST request and unwraps the JSON `response` envelope. */
  async requestJson<T>(path: string, form?: object): Promise<T> {
    const response = await this.#send(path, { form });
    const envelope = (await response.json()) as VoxelShopEnvelope<T>;
    return envelope.response;
  }

  /** Sends a `multipart/form-data` POST request and unwraps the JSON `response` envelope. */
  async requestMultipart<T>(path: string, multipart: FormData): Promise<T> {
    const response = await this.#send(path, { multipart });
    const envelope = (await response.json()) as VoxelShopEnvelope<T>;
    return envelope.response;
  }

  /** Sends a form-encoded POST request and returns the raw response body as text. */
  async requestText(path: string, form?: object): Promise<string> {
    const response = await this.#send(path, { form });
    return response.text();
  }

  /**
   * Sends a request and returns the raw {@link Response} without parsing its body.
   * Used by endpoints that may respond with a binary file instead of the JSON envelope.
   */
  async requestRaw(path: string, options: RequestOptions = {}): Promise<Response> {
    return this.#send(path, options);
  }

  async #send(path: string, options: RequestOptions): Promise<Response> {
    const { form, multipart, headers: extraHeaders } = options;
    const method = options.method ?? 'POST';

    const url = buildApiUrl(this.#baseUrl, path);
    const headers = new Headers(extraHeaders);
    headers.set('Accept', 'application/json');

    if (this.#userAgent) {
      headers.set('User-Agent', this.#userAgent);
    }

    let body: BodyInit | undefined;
    if (multipart) {
      body = multipart;
    } else if (method !== 'GET') {
      body = buildFormBody(form);
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.#timeoutMs);

    let response: Response;
    try {
      response = await this.#fetch(url, { method, headers, body, signal: controller.signal });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new VoxelShopError(`Request timed out after ${this.#timeoutMs}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      const responseBody = await parseErrorBody(response);
      throw new VoxelShopError(extractErrorMessage(responseBody, response.status), {
        status: response.status,
        response,
        body: responseBody,
      });
    }

    return response;
  }
}
