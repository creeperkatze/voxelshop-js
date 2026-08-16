import type { VoxelShopResponse } from './base.js';

/** Parameters for {@link PlatformsApi.authorizeUser}. */
export interface AuthorizeUserParams {
  /** The domain from which you'll make API calls, e.g. `"api.example.com"`. */
  service: string;
  /**
   * The URL the user is redirected to after allowing or denying access. Its domain must exactly
   * match `service`.
   */
  returnUrl: string;
  /**
   * Set to `true` to have `response.result.token` populated directly, instead of only via the
   * `return_url` redirect. Requires prior authorization from voxel.shop, contact them first.
   */
  returnToken?: boolean;
  /**
   * A secure, random, URL-safe string used to verify that the redirect to `returnUrl` is genuine.
   * Without this, an attacker could forge a redirect with a fake token.
   */
  state: string;
}

/** Response for {@link PlatformsApi.authorizeUser}. */
export interface AuthorizeUserResponse extends VoxelShopResponse {
  result?: {
    /** URL to redirect the user to so they can allow or deny the request. */
    url: string;
    /** Only populated when `returnToken` was set to `true`. */
    token?: string;
  };
}

/** Parameters for {@link PlatformsApi.verifyAuthToken}. */
export interface VerifyAuthTokenParams {
  /** A user token obtained via {@link PlatformsApi.authorizeUser}. */
  token: string;
}

/** Response for {@link PlatformsApi.verifyAuthToken}. */
export interface VerifyAuthTokenResponse extends VoxelShopResponse {
  result?: {
    success: boolean;
    message: string;
    user: { id: string };
    /** Unix timestamp at which the token expires. */
    expires: number;
  };
}

/** Parameters for {@link PlatformsApi.invalidateAuthToken}. */
export interface InvalidateAuthTokenParams {
  /** A user token obtained via {@link PlatformsApi.authorizeUser}. */
  token: string;
}

/** Response for {@link PlatformsApi.invalidateAuthToken}. */
export interface InvalidateAuthTokenResponse extends VoxelShopResponse {
  result?: { message: string };
}

/** Parameters for {@link PlatformsApi.getDownloadURL}. */
export interface GetDownloadUrlParams {
  resourceId: number | string;
  /**
   * A user token obtained via {@link PlatformsApi.authorizeUser}. Recommended for free resources,
   * required for premium ones.
   */
  token?: string;
  /**
   * Set to `true` to have the returned URL HTTP redirect to the final download URL.
   * @defaultValue false
   */
  allowRedirects?: boolean;
}

/** Response for {@link PlatformsApi.getDownloadURL}. */
export interface GetDownloadUrlResponse extends VoxelShopResponse {
  message?: string;
  result?: {
    url: string;
    version: string;
    /** Unix timestamp at which `url` expires. */
    expires: number;
  };
}
