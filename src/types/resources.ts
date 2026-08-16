import type { VoxelShopResponse } from './base.js';
import type { ResourceOwner } from './common.js';

/** Generic, resource-scoped error bag returned by several {@link ResourcesApi} actions. */
export interface ResourceErrors {
  global?: string;
}

/** Summary of a resource's latest update, as included in {@link ResourceInfo}. */
export interface ResourceInfoLatestUpdate {
  id: string;
  version: string;
  title: string;
  description: string;
  time: string;
  /** `"1"` if this update is a snapshot version, `"0"` otherwise. */
  snapshot: string;
  /** `"1"` if this update is a beta version, `"0"` otherwise. */
  beta: string;
}

/** A resource, as returned by {@link ResourcesApi.getInfo}. */
export interface ResourceInfo {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  /** 3-letter currency code, e.g. `"USD"`. */
  currency: string;
  downloads: number;
  thumbnailURL: string;
  headerURL: string | null;
  creationTime: string;
  supportedMinecraftVersions: string[];
  owner: ResourceOwner;
  updates: {
    latest: ResourceInfoLatestUpdate;
  };
  reviews: {
    count: number;
    stars: number;
  };
  url: string;
}

/** Parameters for {@link ResourcesApi.getInfo}. */
export interface GetResourceInfoParams {
  resourceId: number | string;
  /**
   * Your API key. If you're the resource's author, pass it here for additional resource details.
   * @defaultValue the client's configured `apiKey`, if any
   */
  apiKey?: string;
}

/** Response for {@link ResourcesApi.getInfo}. */
export interface GetResourceInfoResponse extends VoxelShopResponse {
  resource?: ResourceInfo;
  errors?: ResourceErrors;
}

/** The single data point that can be requested via {@link ResourcesApi.getInfoSimple}. */
export type ResourceInfoSimpleKey = 'title' | 'subtitle' | 'version' | 'price' | 'lastUpdateTime';

/** Parameters for {@link ResourcesApi.getInfoSimple}. */
export interface GetResourceInfoSimpleParams {
  resourceId: number | string;
  key: ResourceInfoSimpleKey;
}

/** An update to a resource, as returned by {@link ResourcesApi.getUpdates}. */
export interface ResourceUpdate {
  id: number;
  url: string;
  version: string;
  title: string;
  description: string;
  time: number;
  downloadReady: boolean;
  snapshot: boolean;
  beta: boolean;
}

/** Parameters for {@link ResourcesApi.getUpdates}. */
export interface GetResourceUpdatesParams {
  resourceId: number | string;
  /**
   * Zero-based index to start from.
   * @defaultValue 0
   */
  start?: number;
  /**
   * Maximum number of results to return, between 5 and 50.
   * @defaultValue 25
   */
  limit?: number;
}

/** Response for {@link ResourcesApi.getUpdates}. */
export interface GetResourceUpdatesResponse extends VoxelShopResponse {
  result_count: number;
  more: boolean;
  next_start: number;
  total: number;
  remaining: number;
  resource: { id: number };
  updates: ResourceUpdate[];
  errors?: ResourceErrors;
}

/** Parameters for {@link ResourcesApi.postUpdate}. */
export interface PostUpdateParams {
  /**
   * Your API key. Must have the "Post Updates" permission.
   * @defaultValue the client's configured `apiKey`, if any
   */
  apiKey?: string;
  resourceId: number | string;
  /** The new version string, e.g. `"1.0"` or `"2.6.7"`. */
  version: string;
  title: string;
  /** The update message. Supports BBCode. */
  message: string;
  /** The file being uploaded. */
  file: Blob;
  /** The filename to submit alongside `file`, if `file` doesn't already carry one (e.g. a plain `Blob`). */
  fileName?: string;
  /**
   * Mark this version as a beta version.
   * @defaultValue false
   */
  beta?: boolean;
  /**
   * Mark this version as a snapshot version.
   * @defaultValue false
   */
  snapshot?: boolean;
}

/** Per-field validation errors returned by {@link ResourcesApi.postUpdate}. */
export interface PostUpdateErrors {
  global?: string;
  file?: string;
  version?: string;
  title?: string;
  message?: string;
}

/** Response for {@link ResourcesApi.postUpdate}. */
export interface PostUpdateResponse extends VoxelShopResponse {
  /** Empty when there are no validation errors. */
  errors?: PostUpdateErrors | [];
  update?: {
    id: number;
    version: string;
    beta: boolean;
    snapshot: boolean;
  };
  resource?: { id: number };
}

/** Parameters for {@link ResourcesApi.getUserData}. */
export interface GetResourceUserDataParams {
  /**
   * Your API key.
   * @defaultValue the client's configured `apiKey`, if any
   */
  apiKey?: string;
  resourceId: number | string;
  /** Obtained via {@link ManagersApi.generateUserVerifyURL} and {@link ManagersApi.verifyUser}. */
  userId: number | string;
}

/** Response for {@link ResourcesApi.getUserData}. */
export interface GetResourceUserDataResponse extends VoxelShopResponse {
  resource?: {
    id: string;
    purchaseValid: boolean;
    purchaseStatus: string;
    purchaseTime: number | null;
  };
  user?: { id: number };
  errors?: ResourceErrors;
}

/** Parameters for {@link ResourcesApi.addBuyer}. */
export interface AddBuyerParams {
  /**
   * Your API key. Must have the "Add & Edit Buyers" permission.
   * @defaultValue the client's configured `apiKey`, if any
   */
  apiKey?: string;
  resourceId: number | string;
  /** Obtained via {@link ManagersApi.generateUserVerifyURL} and {@link ManagersApi.verifyUser}. */
  userId: number | string;
}

/** Response for {@link ResourcesApi.addBuyer}. */
export interface AddBuyerResponse extends VoxelShopResponse {
  resource?: {
    id: string;
    previousPurchaseValid: boolean;
    previousPurchaseStatus: string;
  };
  user?: { id: number };
  errors?: ResourceErrors;
}

/** Parameters for {@link ResourcesApi.importExternalBuyer}. */
export interface ImportExternalBuyerParams {
  /**
   * Your API key. Must have the "Add & Edit Buyers" permission.
   * @defaultValue the client's configured `apiKey`, if any
   */
  apiKey?: string;
  resourceId: number | string;
  /** The numeric id of the user on the external website. */
  externalUserId: number | string;
  /** The email address the user used to pay on the external website. Peppered and hashed before storage. */
  externalUserPaymentEmail: string;
  /** The transaction id from the original payment. */
  paymentTransactionId: string;
  /** The name of the external site, e.g. `"spigot"` or `"bbb"`. Used for tracking purposes only. */
  externalSiteName: string;
}

/** Response for {@link ResourcesApi.importExternalBuyer}. */
export interface ImportExternalBuyerResponse extends VoxelShopResponse {
  import?: { id: string };
  errors?: ResourceErrors;
}

/** Parameters for {@link ResourcesApi.addCouponCode}. */
export interface AddCouponCodeParams {
  /**
   * Your API key. Must have the "Add & Edit Buyers" permission.
   * @defaultValue the client's configured `apiKey`, if any
   */
  apiKey?: string;
  resourceId: number | string;
  /** 3-30 characters, letters/numbers/dashes only, case-insensitive. Editing an existing coupon re-submits the same code. */
  coupon: string;
  /** Percentage off, e.g. `15` for 15% off. Either this or `amount` is required; cannot bring the price below $0.75. */
  percent?: number;
  /** Flat amount off in the resource's currency, e.g. `2.25`. Either this or `percent` is required; cannot bring the price below $0.75. */
  amount?: number;
  /**
   * Maximum number of times this coupon can be used. Does not reset the current use count when changed.
   * @defaultValue unlimited
   */
  maxUses?: number;
  /** Deletes the coupon instead of creating or editing it. */
  deleteCoupon?: boolean;
}

/** Response for {@link ResourcesApi.addCouponCode}. */
export interface AddCouponCodeResponse extends VoxelShopResponse {
  message?: string;
  errors?: ResourceErrors & { coupon?: string };
}
