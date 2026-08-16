import type { VoxelShopClientCore } from './core.js';
import type {
  GetResourceInfoParams,
  GetResourceInfoResponse,
  GetResourceInfoSimpleParams,
  GetResourceUpdatesParams,
  GetResourceUpdatesResponse,
  PostUpdateParams,
  PostUpdateResponse,
  GetResourceUserDataParams,
  GetResourceUserDataResponse,
  AddBuyerParams,
  AddBuyerResponse,
  ImportExternalBuyerParams,
  ImportExternalBuyerResponse,
  AddCouponCodeParams,
  AddCouponCodeResponse,
} from '../types/index.js';

/** API namespace for actions on resources. */
export class ResourcesApi {
  constructor(private readonly core: VoxelShopClientCore) {}

  /** Returns information about a resource. */
  async getInfo(params: GetResourceInfoParams): Promise<GetResourceInfoResponse> {
    return this.core.requestJson<GetResourceInfoResponse>('v1/getResourceInfo', {
      resource_id: params.resourceId,
      api_key: params.apiKey ?? this.core.apiKey,
    });
  }

  /** Returns a single, raw data point about a resource, as plain unencoded text. */
  async getInfoSimple(params: GetResourceInfoSimpleParams): Promise<string> {
    return this.core.requestText('v1/getResourceInfoSimple', {
      resource_id: params.resourceId,
      key: params.key,
    });
  }

  /** Returns a list of updates to a resource. */
  async getUpdates(params: GetResourceUpdatesParams): Promise<GetResourceUpdatesResponse> {
    return this.core.requestJson<GetResourceUpdatesResponse>('v1/getResourceUpdates', {
      resource_id: params.resourceId,
      start: params.start,
      limit: params.limit,
    });
  }

  /** Uploads a new version for one of your resources. */
  async postUpdate(params: PostUpdateParams): Promise<PostUpdateResponse> {
    const apiKey = params.apiKey ?? this.core.apiKey;

    const form = new FormData();
    form.set('resource_id', String(params.resourceId));
    form.set('version', params.version);
    form.set('title', params.title);
    form.set('message', params.message);
    form.set('file', params.file, params.fileName);
    if (apiKey) form.set('api_key', apiKey);
    if (params.beta != null) form.set('beta', params.beta ? '1' : '0');
    if (params.snapshot != null) form.set('snapshot', params.snapshot ? '1' : '0');

    return this.core.requestMultipart<PostUpdateResponse>('v1/postUpdate', form);
  }

  /**
   * Returns info about a resource purchase for a given resource and user.
   * @remarks Don't use this to verify a download. Use {@link PluginsApi.verifyPurchase} instead.
   */
  async getUserData(params: GetResourceUserDataParams): Promise<GetResourceUserDataResponse> {
    return this.core.requestJson<GetResourceUserDataResponse>('v1/getResourceUserData', {
      api_key: params.apiKey ?? this.core.apiKey,
      resource_id: params.resourceId,
      user_id: params.userId,
    });
  }

  /** Adds a buyer to your resource by their user id. */
  async addBuyer(params: AddBuyerParams): Promise<AddBuyerResponse> {
    return this.core.requestJson<AddBuyerResponse>('v1/addBuyer', {
      api_key: params.apiKey ?? this.core.apiKey,
      resource_id: params.resourceId,
      user_id: params.userId,
    });
  }

  /**
   * Imports a buyer from an external platform (such as SpigotMC or BuiltByBit) to voxel.shop.
   * @remarks After importing, the user can claim their license by clicking "Already purchased somewhere else?" in the purchase dialog on the resource page.
   */
  async importExternalBuyer(params: ImportExternalBuyerParams): Promise<ImportExternalBuyerResponse> {
    return this.core.requestJson<ImportExternalBuyerResponse>('v1/importExternalBuyer', {
      api_key: params.apiKey ?? this.core.apiKey,
      resource_id: params.resourceId,
      external_user_id: params.externalUserId,
      external_user_payment_email: params.externalUserPaymentEmail,
      payment_transaction_id: params.paymentTransactionId,
      external_site_name: params.externalSiteName,
    });
  }

  /** Adds a coupon code to your resource, or modifies it if the code already exists. */
  async addCouponCode(params: AddCouponCodeParams): Promise<AddCouponCodeResponse> {
    return this.core.requestJson<AddCouponCodeResponse>('v1/addCouponCode', {
      api_key: params.apiKey ?? this.core.apiKey,
      resource_id: params.resourceId,
      coupon: params.coupon,
      percent: params.percent,
      amount: params.amount,
      max_uses: params.maxUses,
      delete: params.deleteCoupon,
    });
  }
}
