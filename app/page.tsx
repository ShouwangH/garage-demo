export default function BrowsePage() {
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
                18 listings available
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

              {/* Sort dropdown placeholder */}
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>Most Recent</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Listings grid placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Placeholder cards */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Listing {i}</span>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-6 bg-gray-100 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
