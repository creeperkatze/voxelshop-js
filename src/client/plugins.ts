import type { VoxelShopClientCore } from './core.js';
import type {
  VerifyPurchaseParams,
  VerifyPurchaseResponse,
  RequestUpdateUrlParams,
  RequestUpdateUrlResponse,
  DownloadLatestUpdateParams,
} from '../types/index.js';

/** API namespace for actions used inside Minecraft plugins to verify purchases and fetch updates. */
export class PluginsApi {
  constructor(private readonly core: VoxelShopClientCore) {}

  /**
   * Verifies that a user has in-fact purchased a resource on voxel.shop. Only works for premium
   * resources downloaded through voxel.shop.
   */
  async verifyPurchase(params: VerifyPurchaseParams): Promise<VerifyPurchaseResponse> {
    return this.core.requestJson<VerifyPurchaseResponse>('v1/verifyPurchase', {
      resource_id: params.resourceId,
      license: params.license,
      license_number: params.licenseNumber,
      inject_version: params.injectVersion,
      user_id: params.userId,
      nonce: params.nonce,
      download_agent: params.downloadAgent,
      download_time: params.downloadTime,
      download_token: params.downloadToken,
    });
  }

  /**
   * Requests a URL that can be used to download the latest version of a resource, verifying the
   * download was made through voxel.shop. Only works for premium resources.
   */
  async requestUpdateURL(params: RequestUpdateUrlParams): Promise<RequestUpdateUrlResponse> {
    return this.core.requestJson<RequestUpdateUrlResponse>('v1/requestUpdateURL', {
      resource_id: params.resourceId,
      user_id: params.userId,
      nonce: params.nonce,
      inject_version: params.injectVersion,
      download_agent: params.downloadAgent,
      download_time: params.downloadTime,
      download_token: params.downloadToken,
      allow_redirects: params.allowRedirects,
    });
  }

  /**
   * Downloads the latest update for a resource directly, if one is available and all security
   * checks pass.
   * @deprecated Use {@link PluginsApi.requestUpdateURL} instead.
   * @returns The raw file {@link Response} on success (HTTP 200). On failure (HTTP 400, 401, or 404)
   * this throws a {@link VoxelShopError} whose `body` is a {@link DownloadLatestUpdateErrorBody}.
   */
  async downloadLatestUpdate(params: DownloadLatestUpdateParams): Promise<Response> {
    return this.core.requestRaw('v1/downloadLatestUpdate', {
      form: {
        resource_id: params.resourceId,
        user_id: params.userId,
        nonce: params.nonce,
        inject_version: params.injectVersion,
        download_agent: params.downloadAgent,
        download_time: params.downloadTime,
        download_token: params.downloadToken,
        greater_than_upload: params.greaterThanUpload,
      },
    });
  }
}
