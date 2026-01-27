import Link from "next/link";
import { Button } from "@/components/ui";

export default function SavedSearchesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Your Saved Searches
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Get notified when new listings match your criteria
          </p>
        </div>

        <Link href="/">
          <Button variant="primary">Create New Search</Button>
        </Link>
      </div>

      {/* Saved searches list placeholder */}
      <div className="space-y-4">
        {/* Placeholder card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 bg-gray-100 rounded w-48" />
                <div className="h-5 bg-green-100 rounded w-16" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-full max-w-md mb-3" />
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Saved search cards will be added in Phase 11</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 bg-gray-100 rounded w-24" />
              <div className="h-9 bg-gray-100 rounded w-16" />
            </div>
          </div>
        </div>

        {/* Empty state hint */}
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No saved searches yet
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Save a search to get notified when new listings match your criteria
          </p>
          <Link href="/">
            <Button variant="primary">Browse Listings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
