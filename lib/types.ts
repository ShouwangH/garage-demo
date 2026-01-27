// Listing represents a fire apparatus for sale
export interface Listing {
  id: string;
  title: string;
  year: number;
  manufacturer: string;
  category: Category;
  type: VehicleType;
  price: number;
  mileage: number;
  pumpGPM: number | null;
  tankGallons: number | null;
  city: string;
  state: string;
  imageUrl: string;
  listingType: ListingType;
  createdAt: string;
}

// SavedSearch represents a user's saved search criteria
export interface SavedSearch {
  id: string;
  name: string;
  email: string;
  frequency: NotificationFrequency;
  status: SearchStatus;
  createdAt: string;
  filters: SearchFilters;
}

// SearchFilters represents the filter criteria for browsing/saved searches
export interface SearchFilters {
  category?: Category;
  listingType?: ListingTypeFilter;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  manufacturers?: string[];
  pumpSizeMin?: number;
  tankSizeMin?: number;
  state?: string;
}

// Input type for creating/updating a saved search (omits generated fields)
export interface SavedSearchInput {
  name: string;
  email: string;
  frequency: NotificationFrequency;
  filters: SearchFilters;
}

// Category types
export type Category =
  | "Fire Apparatus"
  | "Ambulances"
  | "Rescue Trucks"
  | "Tankers";

// Vehicle subtypes
export type VehicleType =
  | "Pumper"
  | "Tanker"
  | "Aerial"
  | "Rescue"
  | "Ambulance"
  | "Brush Truck"
  | "Ladder";

// Listing type for buy now vs auction
export type ListingType = "buy_now" | "auction";

// Filter option for listing type (includes 'all')
export type ListingTypeFilter = "all" | "buy_now" | "auction";

// Notification frequency options
export type NotificationFrequency = "instant" | "daily" | "weekly";

// Saved search status
export type SearchStatus = "active" | "paused";

// Sort options for listing grid
export type SortOption =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "recent";

// Option type for dropdowns/selects
export interface SelectOption {
  value: string;
  label: string;
}

// State option with abbreviation
export interface StateOption {
  abbreviation: string;
  name: string;
}
