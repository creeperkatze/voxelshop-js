import type { VoxelShopClientCore } from './core.js';
import type { SearchOptions, SearchResponse } from '../types/index.js';

/** API namespace for general voxel.shop API actions. */
export class GeneralApi {
  constructor(private readonly core: VoxelShopClientCore) {}

  /** Checks the status of the voxel.shop API. Returns `true` only if it's up and responding correctly. */
  async status(): Promise<boolean> {
    const response = await this.core.requestRaw('v1/status', { method: 'GET' });
    const body = await response.text();
    return body.trim() === 'ok';
  }

  /** Searches voxel.shop for resources. */
  async search(options: SearchOptions = {}): Promise<SearchResponse> {
    return this.core.requestJson<SearchResponse>('v1/search', options);
  }
}
