import type { VoxelShopResponse } from './base.js';

/** Parameters for {@link AuthorsApi.getUserData}. */
export interface GetUserDataParams {
  /**
   * Your API key.
   * @defaultValue the client's configured `apiKey`, if any
   */
  apiKey?: string;
  /** Obtained via {@link ManagersApi.generateUserVerifyURL} and {@link ManagersApi.verifyUser}. */
  userId: number | string;
}

/** A resource purchase belonging to a user, as returned by {@link AuthorsApi.getUserData}. */
export interface UserResourcePurchase {
  id: string;
  title: string;
  subtitle: string;
  price?: string;
  currency?: string;
  url?: string;
  purchaseValid: boolean;
  purchaseStatus: string;
  downloaded: boolean;
  purchaseTime: number | null;
}

/** Response for {@link AuthorsApi.getUserData}. */
export interface GetUserDataResponse extends VoxelShopResponse {
  resources?: UserResourcePurchase[];
  user?: {
    id: number;
    username: string;
    profilePictureURL: string | null;
  };
  errors?: { global?: string } | [];
}

/** Parameters for {@link AuthorsApi.listBuyers}. */
export interface ListBuyersParams {
  /**
   * Your API key. Must have the "list resources & buyers" permission.
   * @defaultValue the client's configured `apiKey`, if any
   */
  apiKey?: string;
  resourceId: number | string;
  /**
   * Index to start listing from.
   * @defaultValue 0
   */
  start?: number;
}

/** A buyer on a resource, as returned by {@link AuthorsApi.listBuyers}. */
export interface ResourceBuyer {
  userID: number;
  price: string;
  currency: string;
  status: string;
  valid: boolean;
  fromBundle: string | null;
  purchaseTime: number;
  paymentProvider: string | null;
}

/** Response for {@link AuthorsApi.listBuyers}. */
export interface ListBuyersResponse extends VoxelShopResponse {
  more: boolean;
  total: number;
  remaining: number;
  next_start: number;
  buyers: ResourceBuyer[];
  resource: { id: number };
  errors?: { global?: string };
}
