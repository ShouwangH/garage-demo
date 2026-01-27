import type { Listing } from "@/lib/types";
import { ListingCard } from "./ListingCard";

interface ListingGridProps {
  listings: Listing[];
  isLoading?: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="flex gap-3 mb-3">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
      <div className="text-4xl mb-4">🚒</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No listings found
      </h3>
      <p className="text-sm text-gray-500">
        Try adjusting your filters to see more results
      </p>
    </div>
  );
}

export function ListingGrid({ listings, isLoading = false }: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
