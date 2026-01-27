import { STORAGE_KEYS } from "./constants";
import { INITIAL_LISTINGS, DEFAULT_SAVED_SEARCH } from "./mockData";
import type { Listing, SavedSearch } from "./types";

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Get a value from localStorage with type safety
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;

  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    console.error(`Error reading from localStorage key "${key}"`);
    return defaultValue;
  }
}

// Set a value in localStorage
export function setToStorage<T>(key: string, value: T): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}"`, error);
  }
}

// Remove a value from localStorage
export function removeFromStorage(key: string): void {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}"`, error);
  }
}

// Initialize storage with default data on first visit
export function initializeStorage(): void {
  if (!isBrowser) return;

  const isInitialized = getFromStorage<boolean>(STORAGE_KEYS.INITIALIZED, false);

  if (!isInitialized) {
    // Seed initial listings
    setToStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);

    // Seed default saved search for demo
    setToStorage<SavedSearch[]>(STORAGE_KEYS.SAVED_SEARCHES, [DEFAULT_SAVED_SEARCH]);

    // Mark as initialized
    setToStorage(STORAGE_KEYS.INITIALIZED, true);
  }
}

// Reset storage to initial state (useful for demo reset)
export function resetStorage(): void {
  if (!isBrowser) return;

  removeFromStorage(STORAGE_KEYS.LISTINGS);
  removeFromStorage(STORAGE_KEYS.SAVED_SEARCHES);
  removeFromStorage(STORAGE_KEYS.INITIALIZED);

  // Re-initialize with defaults
  initializeStorage();
}

// Get listings from storage
export function getListings(): Listing[] {
  return getFromStorage<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
}

// Save listings to storage
export function saveListings(listings: Listing[]): void {
  setToStorage(STORAGE_KEYS.LISTINGS, listings);
}

// Get saved searches from storage
export function getSavedSearches(): SavedSearch[] {
  return getFromStorage<SavedSearch[]>(STORAGE_KEYS.SAVED_SEARCHES, []);
}

// Save saved searches to storage
export function saveSavedSearches(searches: SavedSearch[]): void {
  setToStorage(STORAGE_KEYS.SAVED_SEARCHES, searches);
}
