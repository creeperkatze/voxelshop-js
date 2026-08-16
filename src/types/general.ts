import type { VoxelShopResponse } from './base.js';
import type { ResourceOwner } from './common.js';

/** Field to sort {@link GeneralApi.search} results by. */
export type SearchSortField = 'updated' | 'created' | 'downloads' | 'random' | 'relevant';

/** Query parameters for {@link GeneralApi.search}. */
export interface SearchOptions {
  /** Search terms to look up in resource titles and subtitles. Non-alphanumeric characters are stripped. */
  query?: string;
  /**
   * How results should be ordered.
   * @defaultValue "updated"
   */
  sort?: SearchSortField;
  /** Only return premium resources if `true`, or only free resources if `false`. Returns both if omitted. */
  premium?: boolean;
  /** Your voxel.shop user id, used to generate result URLs containing your referral code. */
  referrer?: number | string;
  /**
   * Zero-based index to start searching from.
   * @defaultValue 0
   */
  start?: number;
  /**
   * Maximum number of results to return, between 5 and 25.
   * @defaultValue 25
   */
  limit?: number;
  /**
   * A user token. When provided, `canDownload` reflects whether that user has purchased each premium
   * result. Sent as a POST field regardless of how other parameters are sent.
   */
  token?: string;
}

/** A single resource returned by {@link GeneralApi.search}. */
export interface SearchResult {
  id: string;
  url: string;
  owner: ResourceOwner;
  price?: string;
  currency?: string;
  title: string;
  subtitle: string;
  version: string;
  creationTime: string;
  lastUpdateTime: string;
  supportedServerSoftware: string | null;
  supportedLanguages: string | null;
  supportedMinecraftVersions: string | null;
  donationLink: string | null;
  thumbnailURL: string;
  headerURL: string | null;
  /** Whether the given `token`'s user can download this resource. Always `false` for premium resources when no `token` is provided. */
  canDownload: boolean;
}

/** Response for {@link GeneralApi.search}. */
export interface SearchResponse extends VoxelShopResponse {
  result_count: number;
  more: boolean;
  next_start: number;
  total: number;
  remaining: number;
  result: SearchResult[];
}
