import type { SearchFilters } from "./types";
import { US_STATES, CATEGORIES } from "./constants";

// Format price as currency string: $85,000
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Format number with commas: 28,000
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

// Generate a unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Get relative time string: "2 days ago", "just now", etc.
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
}

// Format a filter summary for display
export function formatFilterSummary(filters: SearchFilters): string {
  const parts: string[] = [];

  if (filters.category) {
    parts.push(filters.category);
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
      parts.push(`${formatPriceShort(filters.priceMin)}-${formatPriceShort(filters.priceMax)}`);
    } else if (filters.priceMin !== undefined) {
      parts.push(`${formatPriceShort(filters.priceMin)}+`);
    } else if (filters.priceMax !== undefined) {
      parts.push(`Under ${formatPriceShort(filters.priceMax)}`);
    }
  }

  if (filters.yearMin !== undefined || filters.yearMax !== undefined) {
    if (filters.yearMin !== undefined && filters.yearMax !== undefined) {
      parts.push(`${filters.yearMin}-${filters.yearMax}`);
    } else if (filters.yearMin !== undefined) {
      parts.push(`${filters.yearMin}+`);
    } else if (filters.yearMax !== undefined) {
      parts.push(`Pre-${filters.yearMax}`);
    }
  }

  if (filters.pumpSizeMin !== undefined) {
    parts.push(`${formatNumber(filters.pumpSizeMin)}+ GPM`);
  }

  if (filters.tankSizeMin !== undefined) {
    parts.push(`${formatNumber(filters.tankSizeMin)}+ gal`);
  }

  if (filters.manufacturers && filters.manufacturers.length > 0) {
    if (filters.manufacturers.length <= 2) {
      parts.push(filters.manufacturers.join(", "));
    } else {
      parts.push(`${filters.manufacturers.length} manufacturers`);
    }
  }

  if (filters.state) {
    const stateName = US_STATES.find((s) => s.abbreviation === filters.state)?.name;
    parts.push(stateName || filters.state);
  }

  if (filters.listingType && filters.listingType !== "all") {
    parts.push(filters.listingType === "buy_now" ? "Buy Now" : "Auction");
  }

  return parts.length > 0 ? parts.join(" · ") : "All listings";
}

// Format price in short form: $85k, $1.2M
function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `$${Math.round(price / 1000)}k`;
  }
  return `$${price}`;
}

// Merge class names (simple version of clsx/cn)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Debounce function for search inputs
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Get state name from abbreviation
export function getStateName(abbreviation: string): string {
  return US_STATES.find((s) => s.abbreviation === abbreviation)?.name || abbreviation;
}

// Get category label
export function getCategoryLabel(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.label || category;
}
