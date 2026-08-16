import { VoxelShopClient } from '../../src/client/voxelshop.js';
import { createMockFetch } from './http.js';

export function createTestClient(responses: Response[] = []) {
  const mockFetch = createMockFetch(responses);
  const client = new VoxelShopClient({
    baseUrl: 'https://api.voxel.shop',
    fetch: mockFetch as unknown as typeof fetch,
  });
  return { client, mockFetch };
}
