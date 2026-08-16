import type { VoxelShopResponse } from './base.js';

/** Parameters for {@link ManagersApi.generateUserVerifyURL}. */
export interface GenerateUserVerifyUrlParams {
  /** A unique name for your service, ideally in reverse-domain format, e.g. `"com.example.MyService"`. */
  service: string;
  /**
   * A unique, random value to prevent tokens from being re-used. If provided, the same value must be
   * passed to {@link ManagersApi.verifyUser}.
   */
  nonce?: string;
  /** URL-encoded URL to instantly redirect the user to, with the verification token set as the `token` GET parameter. */
  redirect?: string;
}

/** Response for {@link ManagersApi.generateUserVerifyURL}. */
export interface GenerateUserVerifyUrlResponse extends VoxelShopResponse {
  result?: { url: string };
}

/** Parameters for {@link ManagersApi.verifyUser}. */
export interface VerifyUserParams {
  /** Must match the `service` passed to {@link ManagersApi.generateUserVerifyURL}. */
  service: string;
  /** Must match the `nonce` passed to {@link ManagersApi.generateUserVerifyURL}. */
  nonce?: string;
  /** The token the user was given after visiting the URL from {@link ManagersApi.generateUserVerifyURL}. */
  token: string;
}

/** Response for {@link ManagersApi.verifyUser}. */
export interface VerifyUserResponse extends VoxelShopResponse {
  result?: { user: { id: number } };
}

/** Aggregate resource statistics for a user or shop account. */
export interface AccountStatistics {
  resourceCount: number;
  resourceDownloads: number;
  resourceRatings: number;
  resourceAverageRating: number;
}

/** A user or shop account, as returned by {@link ManagersApi.getAccountInfo}. */
export interface AccountInfo {
  id: string;
  username: string;
  discordId?: string;
  type: 'user' | 'shop';
  profilePictureURL: string | null;
  statistics: AccountStatistics;
}

/** Parameters for {@link ManagersApi.getAccountInfo}. Provide exactly one of `userId` or `shopId`. */
export type GetAccountInfoParams = { userId: number | string; shopId?: never } | { shopId: number | string; userId?: never };

/** Response for {@link ManagersApi.getAccountInfo}. Exactly one of `user` or `shop` is set, matching the request. */
export interface GetAccountInfoResponse extends VoxelShopResponse {
  user?: AccountInfo;
  shop?: AccountInfo;
}

/** Parameters for {@link ManagersApi.getUserId}. */
export interface GetUserIdParams {
  username: string;
}

/** Response for {@link ManagersApi.getUserId}. */
export interface GetUserIdResponse extends VoxelShopResponse {
  user?: { id: string; username: string };
}
