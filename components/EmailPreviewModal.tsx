"use client";

import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { formatPrice, formatNumber, formatFilterSummary } from "@/lib/utils";
import type { SavedSearch, Listing, SearchFilters } from "@/lib/types";

// Build URL with filters for browse page
function buildFilterUrl(filters: SearchFilters): string {
  const params = new URLSearchParams();

  if (filters.category) params.set("category", filters.category);
  if (filters.listingType && filters.listingType !== "all") {
    params.set("listingType", filters.listingType);
  }
  if (filters.priceMin !== undefined) params.set("priceMin", String(filters.priceMin));
  if (filters.priceMax !== undefined) params.set("priceMax", String(filters.priceMax));
  if (filters.yearMin !== undefined) params.set("yearMin", String(filters.yearMin));
  if (filters.yearMax !== undefined) params.set("yearMax", String(filters.yearMax));
  if (filters.mileageMin !== undefined) params.set("mileageMin", String(filters.mileageMin));
  if (filters.mileageMax !== undefined) params.set("mileageMax", String(filters.mileageMax));
  if (filters.manufacturers && filters.manufacturers.length > 0) {
    params.set("manufacturers", filters.manufacturers.join(","));
  }
  if (filters.pumpSizeMin !== undefined) params.set("pumpSizeMin", String(filters.pumpSizeMin));
  if (filters.tankSizeMin !== undefined) params.set("tankSizeMin", String(filters.tankSizeMin));
  if (filters.state) params.set("state", filters.state);

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
}

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  search: SavedSearch;
  matchingListings: Listing[];
}

export function EmailPreviewModal({
  isOpen,
  onClose,
  search,
  matchingListings,
}: EmailPreviewModalProps) {
  const filterSummary = formatFilterSummary(search.filters);
  const previewListings = matchingListings.slice(0, 3);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Preview" size="lg">
      <div className="text-sm text-gray-500 mb-4">
        This is a preview of the notification email that would be sent to{" "}
        <span className="font-medium text-gray-700">{search.email}</span>
      </div>

      {/* Email Preview Container */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        {/* Email Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="font-medium">From:</span>
            <span>Garage Alerts &lt;alerts@shopgarage.com&gt;</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="font-medium">To:</span>
            <span>{search.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium">Subject:</span>
            <span className="font-medium text-gray-900">
              {matchingListings.length} new{" "}
              {matchingListings.length === 1 ? "listing matches" : "listings match"}{" "}
              &quot;{search.name}&quot;
            </span>
          </div>
        </div>

        {/* Email Body */}
        <div className="bg-white p-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Garage</span>
            </div>
          </div>

          {/* Greeting */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              New Matches for Your Search!
            </h2>
            <p className="text-gray-600">
              We found {matchingListings.length} new{" "}
              {matchingListings.length === 1 ? "listing" : "listings"} matching
              your saved search <strong>&quot;{search.name}&quot;</strong>:
            </p>
            <p className="text-sm text-gray-500 mt-1">{filterSummary}</p>
          </div>

          {/* Listings */}
          <div className="space-y-4 mb-6">
            {previewListings.map((listing) => (
              <div
                key={listing.id}
                className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                {/* Thumbnail */}
                <div className="w-24 h-18 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${listing.imageUrl})`,
                      minHeight: "72px",
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {listing.title}
                  </h3>
                  <p className="text-lg font-bold text-primary-600">
                    {formatPrice(listing.price)}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{formatNumber(listing.mileage)} mi</span>
                    {listing.pumpGPM && <span>{listing.pumpGPM} GPM</span>}
                    <span>
                      {listing.city}, {listing.state}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          {matchingListings.length > 3 && (
            <p className="text-sm text-gray-500 text-center mb-4">
              + {matchingListings.length - 3} more{" "}
              {matchingListings.length - 3 === 1 ? "listing" : "listings"}
            </p>
          )}

          <div className="text-center">
            <Link
              href={buildFilterUrl(search.filters)}
              onClick={onClose}
              className="inline-block px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
            >
              View All Matches on Garage
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p className="mb-2">
              You&apos;re receiving this because you have a saved search on Garage.
            </p>
            <p>
              <span className="text-primary-600 underline cursor-pointer">
                Manage notification settings
              </span>{" "}
              |{" "}
              <span className="text-primary-600 underline cursor-pointer">
                Unsubscribe
              </span>
            </p>
            <p className="mt-4 text-gray-400">
              Garage Inc. | 123 Fire Station Way | San Francisco, CA 94102
            </p>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Close Preview
        </button>
      </div>
    </Modal>
  );
}
