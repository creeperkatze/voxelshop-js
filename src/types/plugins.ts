import type { VoxelShopResponse } from './base.js';

/**
 * Parameters for {@link PluginsApi.verifyPurchase}.
 * @remarks Provide either `license` and `resourceId`, or all of the other fields. If neither
 * combination is fully provided, verification always fails. Values should be gathered from the
 * `%%__PLACEHOLDER__%%` tokens available inside your resource file.
 */
export interface VerifyPurchaseParams {
  /** The id of the resource being verified. Corresponds to the `%%__RESOURCE__%%` placeholder. */
  resourceId: number | string;
  /** The voxel.shop license key for this download. Corresponds to the `%%__LICENSE__%%` placeholder. */
  license?: string;
  /** The `n` from a numbered license placeholder, `%%__LICENSE_n__%%`, if one was used instead of `%%__LICENSE__%%`. */
  licenseNumber?: number;
  /** The version of the resource injector for this download. Corresponds to the `%%__INJECT_VER__%%` placeholder. */
  injectVersion?: string;
  /** The id of the user in question. Corresponds to the `%%__USER__%%` placeholder. */
  userId?: number | string;
  /** The nonce given to the download. Corresponds to the `%%__NONCE__%%` placeholder. */
  nonce?: string;
  /** The agent that downloaded the resource. Corresponds to the `%%__AGENT__%%` placeholder. */
  downloadAgent?: string;
  /** The unix time the resource was downloaded. Corresponds to the `%%__TIMESTAMP__%%` placeholder. */
  downloadTime?: number;
  /** The download token. Corresponds to the `%%__VERIFY_TOKEN__%%` placeholder. */
  downloadToken?: string;
}

/** Response for {@link PluginsApi.verifyPurchase}. */
export type VerifyPurchaseResponse = VoxelShopResponse;

/**
 * Parameters for {@link PluginsApi.requestUpdateURL}. All fields are required; values should be
 * gathered from the `%%__PLACEHOLDER__%%` tokens available inside your resource file.
 */
export interface RequestUpdateUrlParams {
  /** The id of the resource being updated. Corresponds to the `%%__RESOURCE__%%` placeholder. */
  resourceId: number | string;
  /** The id of the user in question. Corresponds to the `%%__USER__%%` placeholder. */
  userId: number | string;
  /** The nonce given to the download. Corresponds to the `%%__NONCE__%%` placeholder. */
  nonce: string;
  /** The version of the resource injector for this download. Corresponds to the `%%__INJECT_VER__%%` placeholder. */
  injectVersion: string;
  /** The agent that downloaded the resource. Corresponds to the `%%__AGENT__%%` placeholder. */
  downloadAgent: string;
  /** The unix time the resource was downloaded. Corresponds to the `%%__TIMESTAMP__%%` placeholder. */
  downloadTime: number;
  /** The download token. Corresponds to the `%%__VERIFY_TOKEN__%%` placeholder. */
  downloadToken: string;
  /**
   * Set to `true` for much faster downloads; the returned URL will HTTP redirect to the final download URL.
   * @defaultValue false
   */
  allowRedirects?: boolean;
}

/** Response for {@link PluginsApi.requestUpdateURL}. */
export interface RequestUpdateUrlResponse extends VoxelShopResponse {
  result?: {
    url: string;
    version: string;
    /** Unix timestamp at which `url` expires. */
    expires: number;
  };
}

/**
 * Parameters for {@link PluginsApi.downloadLatestUpdate}. All fields are required; values should be
 * gathered from the `%%__PLACEHOLDER__%%` tokens available inside your resource file.
 */
export interface DownloadLatestUpdateParams {
  /** The id of the resource being updated. Corresponds to the `%%__RESOURCE__%%` placeholder. */
  resourceId: number | string;
  /** The id of the user in question. Corresponds to the `%%__USER__%%` placeholder. */
  userId: number | string;
  /** The nonce given to the download. Corresponds to the `%%__NONCE__%%` placeholder. */
  nonce: string;
  /** The version of the resource injector for this download. Corresponds to the `%%__INJECT_VER__%%` placeholder. */
  injectVersion: string;
  /** The agent that downloaded the resource. Corresponds to the `%%__AGENT__%%` placeholder. */
  downloadAgent: string;
  /** The unix time the resource was downloaded. Corresponds to the `%%__TIMESTAMP__%%` placeholder. */
  downloadTime: number;
  /** The download token. Corresponds to the `%%__VERIFY_TOKEN__%%` placeholder. */
  downloadToken: string;
  /** Only download an update greater than this upload id. Corresponds to the `%%__UPLOAD__%%` placeholder. */
  greaterThanUpload: number;
}

/** Body returned by {@link PluginsApi.downloadLatestUpdate} when no file is returned (HTTP 400, 401, or 404). */
export interface DownloadLatestUpdateErrorBody {
  success: false;
  reason: string;
  message: string;
}
