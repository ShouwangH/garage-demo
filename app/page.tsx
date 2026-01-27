"use client";

import { useState } from "react";
import { useListings } from "@/hooks/useListings";
import { ListingGrid } from "@/components/ListingGrid";
import { sortListings } from "@/lib/matching";
import type { SortOption } from "@/lib/types";

export default function BrowsePage() {
  const { listings, isLoading } = useListings();
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const sortedListings = sortListings(listings, sortBy);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6 lg:gap-8">
        {/* Filter sidebar placeholder - hidden on mobile */}
        <aside className="hidden md:block w-64 lg:w-72 shrink-0">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>
              <p className="text-sm text-gray-500">
                Filter controls will be added in Phase 6
              </p>
            </div>
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
                  : `${listings.length} listings available`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter button placeholder */}
              <button className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
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
              </button>

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
    </div>
  );
}
