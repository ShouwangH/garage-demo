import type { VehicleType, SelectOption, StateOption } from "./types";

// Fire apparatus manufacturers
export const MANUFACTURERS: string[] = [
  "Pierce",
  "E-One",
  "Seagrave",
  "Spartan",
  "KME",
  "Ferrara",
  "Rosenbauer",
  "Sutphen",
  "Smeal",
  "HME",
  "Freightliner",
  "International",
];

// Vehicle categories
export const CATEGORIES: SelectOption[] = [
  { value: "Fire Apparatus", label: "Fire Apparatus" },
  { value: "Ambulances", label: "Ambulances" },
  { value: "Rescue Trucks", label: "Rescue Trucks" },
  { value: "Tankers", label: "Tankers" },
];

// Vehicle types (subtypes within categories)
export const VEHICLE_TYPES: VehicleType[] = [
  "Pumper",
  "Tanker",
  "Aerial",
  "Rescue",
  "Ambulance",
  "Brush Truck",
  "Ladder",
];

// Listing type filter options
export const LISTING_TYPE_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Listings" },
  { value: "buy_now", label: "Buy Now" },
  { value: "auction", label: "Auction" },
];

// Notification frequency options
export const NOTIFICATION_FREQUENCIES: SelectOption[] = [
  { value: "instant", label: "Instantly" },
  { value: "daily", label: "Daily Digest" },
  { value: "weekly", label: "Weekly Digest" },
];

// Sort options for listing grid
export const SORT_OPTIONS: SelectOption[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "recent", label: "Most Recent" },
];

// US States
export const US_STATES: StateOption[] = [
  { abbreviation: "AL", name: "Alabama" },
  { abbreviation: "AK", name: "Alaska" },
  { abbreviation: "AZ", name: "Arizona" },
  { abbreviation: "AR", name: "Arkansas" },
  { abbreviation: "CA", name: "California" },
  { abbreviation: "CO", name: "Colorado" },
  { abbreviation: "CT", name: "Connecticut" },
  { abbreviation: "DE", name: "Delaware" },
  { abbreviation: "FL", name: "Florida" },
  { abbreviation: "GA", name: "Georgia" },
  { abbreviation: "HI", name: "Hawaii" },
  { abbreviation: "ID", name: "Idaho" },
  { abbreviation: "IL", name: "Illinois" },
  { abbreviation: "IN", name: "Indiana" },
  { abbreviation: "IA", name: "Iowa" },
  { abbreviation: "KS", name: "Kansas" },
  { abbreviation: "KY", name: "Kentucky" },
  { abbreviation: "LA", name: "Louisiana" },
  { abbreviation: "ME", name: "Maine" },
  { abbreviation: "MD", name: "Maryland" },
  { abbreviation: "MA", name: "Massachusetts" },
  { abbreviation: "MI", name: "Michigan" },
  { abbreviation: "MN", name: "Minnesota" },
  { abbreviation: "MS", name: "Mississippi" },
  { abbreviation: "MO", name: "Missouri" },
  { abbreviation: "MT", name: "Montana" },
  { abbreviation: "NE", name: "Nebraska" },
  { abbreviation: "NV", name: "Nevada" },
  { abbreviation: "NH", name: "New Hampshire" },
  { abbreviation: "NJ", name: "New Jersey" },
  { abbreviation: "NM", name: "New Mexico" },
  { abbreviation: "NY", name: "New York" },
  { abbreviation: "NC", name: "North Carolina" },
  { abbreviation: "ND", name: "North Dakota" },
  { abbreviation: "OH", name: "Ohio" },
  { abbreviation: "OK", name: "Oklahoma" },
  { abbreviation: "OR", name: "Oregon" },
  { abbreviation: "PA", name: "Pennsylvania" },
  { abbreviation: "RI", name: "Rhode Island" },
  { abbreviation: "SC", name: "South Carolina" },
  { abbreviation: "SD", name: "South Dakota" },
  { abbreviation: "TN", name: "Tennessee" },
  { abbreviation: "TX", name: "Texas" },
  { abbreviation: "UT", name: "Utah" },
  { abbreviation: "VT", name: "Vermont" },
  { abbreviation: "VA", name: "Virginia" },
  { abbreviation: "WA", name: "Washington" },
  { abbreviation: "WV", name: "West Virginia" },
  { abbreviation: "WI", name: "Wisconsin" },
  { abbreviation: "WY", name: "Wyoming" },
];

// Filter ranges (for UI hints and validation)
export const FILTER_RANGES = {
  price: { min: 0, max: 350000, step: 5000 },
  year: { min: 1990, max: new Date().getFullYear(), step: 1 },
  mileage: { min: 0, max: 200000, step: 5000 },
  pumpGPM: { min: 0, max: 2000, step: 250 },
  tankGallons: { min: 0, max: 3000, step: 250 },
};

// LocalStorage keys
export const STORAGE_KEYS = {
  LISTINGS: "garage-listings",
  SAVED_SEARCHES: "garage-saved-searches",
  INITIALIZED: "garage-initialized",
} as const;
