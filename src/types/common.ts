/** The account that owns a resource: either an individual user or a shop (team account). */
export interface ResourceOwner {
  type: 'user' | 'shop';
  id: string;
  name: string;
  url: string;
}
