import type { Listing, SearchFilters, SortOption } from "./types";

// Check if a single listing matches the given filters (AND logic)
export function listingMatchesFilters(
  listing: Listing,
  filters: SearchFilters
): boolean {
  // Category filter
  if (filters.category && listing.category !== filters.category) {
    return false;
  }

  // Listing type filter
  if (
    filters.listingType &&
    filters.listingType !== "all" &&
    listing.listingType !== filters.listingType
  ) {
    return false;
  }

  // Price range filters
  if (filters.priceMin !== undefined && listing.price < filters.priceMin) {
    return false;
  }
  if (filters.priceMax !== undefined && listing.price > filters.priceMax) {
    return false;
  }

  // Year range filters
  if (filters.yearMin !== undefined && listing.year < filters.yearMin) {
    return false;
  }
  if (filters.yearMax !== undefined && listing.year > filters.yearMax) {
    return false;
  }

  // Mileage range filters
  if (filters.mileageMin !== undefined && listing.mileage < filters.mileageMin) {
    return false;
  }
  if (filters.mileageMax !== undefined && listing.mileage > filters.mileageMax) {
    return false;
  }

  // Manufacturers filter (any of the selected)
  if (
    filters.manufacturers &&
    filters.manufacturers.length > 0 &&
    !filters.manufacturers.includes(listing.manufacturer)
  ) {
    return false;
  }

  // Pump size minimum
  if (filters.pumpSizeMin !== undefined) {
    if (listing.pumpGPM === null || listing.pumpGPM < filters.pumpSizeMin) {
      return false;
    }
  }

  // Tank size minimum
  if (filters.tankSizeMin !== undefined) {
    if (
      listing.tankGallons === null ||
      listing.tankGallons < filters.tankSizeMin
    ) {
      return false;
    }
  }

  // State filter
  if (filters.state && listing.state !== filters.state) {
    return false;
  }

  return true;
}

// Get all listings that match the given filters
export function getMatchingListings(
  listings: Listing[],
  filters: SearchFilters
): Listing[] {
  return listings.filter((listing) => listingMatchesFilters(listing, filters));
}

// Count how many listings match the given filters
export function countMatches(
  listings: Listing[],
  filters: SearchFilters
): number {
  return getMatchingListings(listings, filters).length;
}

// Sort listings by the given sort option
export function sortListings(
  listings: Listing[],
  sortBy: SortOption
): Listing[] {
  const sorted = [...listings];

  switch (sortBy) {
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "recent":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "relevance":
    default:
      // For relevance, we could implement a scoring system
      // For now, just return by most recent
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

// Check if any filters are active
export function hasActiveFilters(filters: SearchFilters): boolean {
  return (
    filters.category !== undefined ||
    (filters.listingType !== undefined && filters.listingType !== "all") ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.yearMin !== undefined ||
    filters.yearMax !== undefined ||
    filters.mileageMin !== undefined ||
    filters.mileageMax !== undefined ||
    (filters.manufacturers !== undefined && filters.manufacturers.length > 0) ||
    filters.pumpSizeMin !== undefined ||
    filters.tankSizeMin !== undefined ||
    filters.state !== undefined
  );
}
