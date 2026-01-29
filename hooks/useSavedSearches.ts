"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { SavedSearch, SavedSearchInput, Listing } from "@/lib/types";
import {
  getSavedSearches,
  saveSavedSearches,
  initializeStorage,
} from "@/lib/storage";
import { countMatches } from "@/lib/matching";

interface SavedSearchWithCount extends SavedSearch {
  matchCount: number;
}

export function useSavedSearches(listings: Listing[] = []) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize saved searches from storage on mount
  useEffect(() => {
    initializeStorage();
    const stored = getSavedSearches();
    setSavedSearches(stored);
    setIsLoading(false);
  }, []);

  // Compute match counts for all saved searches
  const savedSearchesWithCounts: SavedSearchWithCount[] = useMemo(() => {
    return savedSearches.map((search) => ({
      ...search,
      matchCount: countMatches(listings, search.filters),
    }));
  }, [savedSearches, listings]);

  // Create a new saved search
  const createSavedSearch = useCallback(
    (input: SavedSearchInput): SavedSearch => {
      const newSearch: SavedSearch = {
        id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: input.name,
        email: input.email,
        frequency: input.frequency,
        status: "active",
        createdAt: new Date().toISOString(),
        filters: input.filters,
      };

      setSavedSearches((prev) => {
        const updated = [newSearch, ...prev];
        saveSavedSearches(updated);
        return updated;
      });

      return newSearch;
    },
    []
  );

  // Update an existing saved search
  const updateSavedSearch = useCallback(
    (id: string, input: Partial<SavedSearchInput>): SavedSearch | null => {
      let updatedSearch: SavedSearch | null = null;

      setSavedSearches((prev) => {
        const updated = prev.map((search) => {
          if (search.id === id) {
            updatedSearch = {
              ...search,
              ...(input.name !== undefined && { name: input.name }),
              ...(input.email !== undefined && { email: input.email }),
              ...(input.frequency !== undefined && { frequency: input.frequency }),
              ...(input.filters !== undefined && { filters: input.filters }),
            };
            return updatedSearch;
          }
          return search;
        });
        saveSavedSearches(updated);
        return updated;
      });

      return updatedSearch;
    },
    []
  );

  // Delete a saved search
  const deleteSavedSearch = useCallback((id: string): void => {
    setSavedSearches((prev) => {
      const updated = prev.filter((search) => search.id !== id);
      saveSavedSearches(updated);
      return updated;
    });
  }, []);

  // Toggle saved search status (active/paused)
  const toggleSearchStatus = useCallback((id: string): void => {
    setSavedSearches((prev) => {
      const updated = prev.map((search) => {
        if (search.id === id) {
          return {
            ...search,
            status: search.status === "active" ? "paused" : "active",
          } as SavedSearch;
        }
        return search;
      });
      saveSavedSearches(updated);
      return updated;
    });
  }, []);

  // Get a single saved search by ID
  const getSavedSearchById = useCallback(
    (id: string): SavedSearchWithCount | undefined => {
      return savedSearchesWithCounts.find((search) => search.id === id);
    },
    [savedSearchesWithCounts]
  );

  // Check if a saved search with similar filters already exists
  const findSimilarSearch = useCallback(
    (filters: SavedSearchInput["filters"]): SavedSearch | undefined => {
      return savedSearches.find((search) => {
        const f1 = search.filters;
        const f2 = filters;

        // Compare all filter fields
        return (
          f1.category === f2.category &&
          f1.listingType === f2.listingType &&
          f1.priceMin === f2.priceMin &&
          f1.priceMax === f2.priceMax &&
          f1.yearMin === f2.yearMin &&
          f1.yearMax === f2.yearMax &&
          f1.mileageMin === f2.mileageMin &&
          f1.mileageMax === f2.mileageMax &&
          f1.pumpSizeMin === f2.pumpSizeMin &&
          f1.tankSizeMin === f2.tankSizeMin &&
          f1.state === f2.state &&
          JSON.stringify(f1.manufacturers?.sort()) ===
            JSON.stringify(f2.manufacturers?.sort())
        );
      });
    },
    [savedSearches]
  );

  // Get counts summary
  const counts = useMemo(() => {
    const active = savedSearches.filter((s) => s.status === "active").length;
    const paused = savedSearches.filter((s) => s.status === "paused").length;
    const total = savedSearches.length;
    return { active, paused, total };
  }, [savedSearches]);

  return {
    savedSearches: savedSearchesWithCounts,
    isLoading,
    createSavedSearch,
    updateSavedSearch,
    deleteSavedSearch,
    toggleSearchStatus,
    getSavedSearchById,
    findSimilarSearch,
    counts,
  };
}
