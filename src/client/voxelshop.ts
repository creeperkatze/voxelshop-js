import { VoxelShopClientCore } from './core.js';
import { GeneralApi } from './general.js';
import { PluginsApi } from './plugins.js';
import { ResourcesApi } from './resources.js';
import { ManagersApi } from './managers.js';
import { AuthorsApi } from './authors.js';
import { PlatformsApi } from './platforms.js';
import type { VoxelShopClientOptions } from '../types/base.js';

/**
 * Client for the voxel.shop API (formerly Polymart).
 * @example
 * ```ts
 * import VoxelShopClient from 'voxelshop-js';
 * const client = new VoxelShopClient({ apiKey: 'your-api-key' });
 * const resource = await client.resources.getInfo({ resourceId: 4 });
 * ```
 */
export class VoxelShopClient {
  readonly #core: VoxelShopClientCore;

  readonly general: GeneralApi;
  readonly plugins: PluginsApi;
  readonly resources: ResourcesApi;
  readonly managers: ManagersApi;
  readonly authors: AuthorsApi;
  readonly platforms: PlatformsApi;

  constructor(options: VoxelShopClientOptions = {}) {
    this.#core = new VoxelShopClientCore(options);

    this.general = new GeneralApi(this.#core);
    this.plugins = new PluginsApi(this.#core);
    this.resources = new ResourcesApi(this.#core);
    this.managers = new ManagersApi(this.#core);
    this.authors = new AuthorsApi(this.#core);
    this.platforms = new PlatformsApi(this.#core);
  }
}
