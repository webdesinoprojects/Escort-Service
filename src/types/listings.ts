export interface ListingAd {
  id: string;
  ad_id?: string;
  title: string;
  description: string;
  name: string;
  age: number;
  city: string;
  state?: string;
  isVip: boolean;
  photoCount: number;
  images: string[];
  phone: string;
  whatsapp: string;
  date: string;
  aboutMe: string[];
  tags: string[];
  services: string[];
  attentionTo: string[];
  placeOfService: string[];
  ethnicity?: string;
  nationality?: string;
  breast?: string;
  hair?: string;
  bodyType?: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface FetchListingsParams {
  categorySlug: string;
  citySlug?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
  // demographic filters
  ethnicity?: string;
  nationality?: string;
  breast?: string;
  hair?: string;
  bodyType?: string;
  services?: string;
  attentionTo?: string;
  placeOfService?: string;
  area?: string;
}

export interface ListingsResponse {
  listings: ListingAd[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
