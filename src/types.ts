export interface ImageItem {
  id: string; // Unique ID, e.g. "img-1"
  title: string;
  category: string;
  url: string;
  photographer: string;
  photographerUrl: string;
  description: string;
  location?: string;
  date?: string;
  camera?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
  likes: number;
  isUserAdded?: boolean;
}

export type Category = 'All' | 'Nature' | 'Architecture' | 'Animals' | 'Travel' | 'Food' | 'Portraits' | 'Favorites';

export type ViewLayout = 'grid' | 'masonry' | 'list';

export interface FilterOptions {
  searchQuery: string;
  category: Category;
  sortBy: 'default' | 'title-asc' | 'title-desc' | 'likes-desc';
}
