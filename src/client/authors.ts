import type { VoxelShopClientCore } from './core.js';
import type { GetUserDataParams, GetUserDataResponse, ListBuyersParams, ListBuyersResponse } from '../types/index.js';

/** API namespace for actions restricted to resource authors. */
export class AuthorsApi {
  constructor(private readonly core: VoxelShopClientCore) {}

  /**
   * Returns information about a user, including their resource purchases.
   * @remarks Don't use this to verify a download. Use {@link PluginsApi.verifyPurchase} instead.
   */
  async getUserData(params: GetUserDataParams): Promise<GetUserDataResponse> {
    return this.core.requestJson<GetUserDataResponse>('v1/getUserData', {
      api_key: params.apiKey ?? this.core.apiKey,
      user_id: params.userId,
    });
  }

  /**
   * Lists buyers on a resource.
   * @remarks Don't use this to verify a download. Use {@link PluginsApi.verifyPurchase} instead.
   */
  async listBuyers(params: ListBuyersParams): Promise<ListBuyersResponse> {
    return this.core.requestJson<ListBuyersResponse>('v1/listBuyers', {
      api_key: params.apiKey ?? this.core.apiKey,
      resource_id: params.resourceId,
      start: params.start,
    });
  }
}
