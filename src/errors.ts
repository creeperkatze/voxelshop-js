/** Error thrown for network failures, timeouts, and HTTP-level voxel.shop API errors. */
export class VoxelShopError extends Error {
  override name = 'VoxelShopError' as const;
  status: number;
  response: Response | undefined;
  body: unknown;

  constructor(message: string, options: {
    status?: number;
    response?: Response;
    body?: unknown;
  } = {}) {
    super(message);
    this.status = options.status ?? 0;
    this.response = options.response;
    this.body = options.body;
  }
}
