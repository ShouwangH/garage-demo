"use client";

import { useState, useCallback, Suspense } from "react";
import { useListings } from "@/hooks/useListings";
import { useFilters } from "@/hooks/useFilters";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import { useToast } from "@/hooks/useToast";
import { ListingGrid } from "@/components/ListingGrid";
import { FilterSidebar } from "@/components/FilterSidebar";
import { FilterDrawer } from "@/components/FilterDrawer";
import { SaveSearchModal } from "@/components/SaveSearchModal";
import { getMatchingListings, sortListings } from "@/lib/matching";
import type { SortOption, SavedSearchInput } from "@/lib/types";

function BrowseContent() {
  const { listings, isLoading } = useListings();
  const { filters, hasActiveFilters, activeFilterCount } = useFilters();
  const { createSavedSearch, findSimilarSearch } = useSavedSearches(listings);
  const { addToast } = useToast();
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Apply filters then sort
  const filteredListings = getMatchingListings(listings, filters);
  const sortedListings = sortListings(filteredListings, sortBy);

  // Handle saving a search
  const handleSaveSearch = useCallback(
    (input: SavedSearchInput) => {
      // Check for duplicate filters
      const existing = findSimilarSearch(input.filters);
      if (existing) {
        addToast(`A similar search "${existing.name}" already exists`, "info");
        return;
      }

      createSavedSearch(input);
      addToast(`Search "${input.name}" saved successfully!`, "success");
    },
    [createSavedSearch, findSimilarSearch, addToast]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6 lg:gap-8">
        {/* Filter sidebar - hidden on mobile */}
        <aside className="hidden md:block w-64 lg:w-72 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Browse Listings
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isLoading
                  ? "Loading..."
                  : hasActiveFilters
                  ? `${sortedListings.length} of ${listings.length} listings match your filters`
                  : `${listings.length} listings available`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Save Search button - only show when filters are active */}
              {hasActiveFilters && (
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="hidden sm:inline">Save Search</span>
                </button>
              )}

              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="recent">Most Recent</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>
          </div>

          {/* Listings grid */}
          <ListingGrid listings={sortedListings} isLoading={isLoading} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      />

      {/* Save search modal */}
      <SaveSearchModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveSearch}
        filters={filters}
      />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowsePageSkeleton />}>
      <BrowseContent />
    </Suspense>
  );
}

function BrowsePageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6 lg:gap-8">
        <aside className="hidden md:block w-64 lg:w-72 shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4 h-96 animate-pulse" />
        </aside>
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
