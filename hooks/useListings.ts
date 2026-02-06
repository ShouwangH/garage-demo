"use client";

import { useState, useEffect, useCallback } from "react";
import type { Listing } from "@/lib/types";
import { getListings, saveListings, initializeStorage, resetStorage } from "@/lib/storage";
import { SIMULATABLE_LISTINGS } from "@/lib/mockData";

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [simulatedIndex, setSimulatedIndex] = useState(0);

  // Initialize listings from storage on mount
  useEffect(() => {
    initializeStorage();
    const storedListings = getListings();
    setListings(storedListings);
    setIsLoading(false);
  }, []);

  // Add a new listing and persist
  const addListing = useCallback((listing: Listing) => {
    setListings((prev) => {
      const updated = [listing, ...prev];
      saveListings(updated);
      return updated;
    });
  }, []);

  // Simulate adding a new listing (for demo)
  // Returns the added listing and which saved search it matches
  const simulateNewListing = useCallback(() => {
    if (SIMULATABLE_LISTINGS.length === 0) return null;

    // Cycle through simulatable listings
    const listing = {
      ...SIMULATABLE_LISTINGS[simulatedIndex % SIMULATABLE_LISTINGS.length],
      id: `sim-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    addListing(listing);
    setSimulatedIndex((prev) => prev + 1);

    return listing;
  }, [simulatedIndex, addListing]);

  // Remove a listing by ID
  const removeListing = useCallback((id: string) => {
    setListings((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      saveListings(updated);
      return updated;
    });
  }, []);

  // Reset all data to initial state (for demo)
  const resetToInitial = useCallback(() => {
    resetStorage();
    const storedListings = getListings();
    setListings(storedListings);
    setSimulatedIndex(0);
  }, []);

  return {
    listings,
    isLoading,
    addListing,
    removeListing,
    simulateNewListing,
    resetToInitial,
  };
}
