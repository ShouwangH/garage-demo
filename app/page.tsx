export default function BrowsePage() {
  return (
    <main className="min-h-screen">
      {/* Header placeholder */}
      <div className="h-16 border-b border-gray-200 flex items-center px-4">
        <span className="text-xl font-semibold text-primary-500">Garage</span>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter sidebar placeholder */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-gray-50 rounded-lg p-4 h-96">
              <p className="text-sm text-gray-500">Filters will go here</p>
            </div>
          </aside>

          {/* Listings area placeholder */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold">Browse Listings</h1>
              <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                Save This Search
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">Listings will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
