import type { VoxelShopClientCore } from './core.js';
import type {
  AuthorizeUserParams,
  AuthorizeUserResponse,
  VerifyAuthTokenParams,
  VerifyAuthTokenResponse,
  InvalidateAuthTokenParams,
  InvalidateAuthTokenResponse,
  GetDownloadUrlParams,
  GetDownloadUrlResponse,
} from '../types/index.js';

/** API namespace for hosts, control panels, and platforms that act on behalf of voxel.shop users. */
export class PlatformsApi {
  constructor(private readonly core: VoxelShopClientCore) {}

  /**
   * Requests a token that can be used to take actions on a user's behalf, such as downloading their
   * purchased resources.
   * @remarks After making the request, redirect the user to `response.result.url`. They're then
   * redirected back to `returnUrl` with `success` and `token` POST parameters.
   */
  async authorizeUser(params: AuthorizeUserParams): Promise<AuthorizeUserResponse> {
    return this.core.requestJson<AuthorizeUserResponse>('v1/authorizeUser', {
      service: params.service,
      return_url: params.returnUrl,
      return_token: params.returnToken,
      state: params.state,
    });
  }

  /** Verifies that a token obtained via {@link PlatformsApi.authorizeUser} is valid and has not expired. */
  async verifyAuthToken(params: VerifyAuthTokenParams): Promise<VerifyAuthTokenResponse> {
    return this.core.requestJson<VerifyAuthTokenResponse>('v1/verifyAuthToken', {
      token: params.token,
    });
  }

  /** Invalidates a token obtained via {@link PlatformsApi.authorizeUser}. Call this when a user unlinks their voxel.shop account from your service. */
  async invalidateAuthToken(params: InvalidateAuthTokenParams): Promise<InvalidateAuthTokenResponse> {
    return this.core.requestJson<InvalidateAuthTokenResponse>('v1/invalidateAuthToken', {
      token: params.token,
    });
  }

  /** Returns a URL that can be used to download a resource on a user's behalf, e.g. for a Minecraft server host. */
  async getDownloadURL(params: GetDownloadUrlParams): Promise<GetDownloadUrlResponse> {
    return this.core.requestJson<GetDownloadUrlResponse>('v1/getDownloadURL', {
      resource_id: params.resourceId,
      token: params.token,
      allow_redirects: params.allowRedirects,
    });
  }
}
