"use client";

import { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useListings } from "@/hooks/useListings";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import { useToast } from "@/hooks/useToast";
import { SavedSearchCard } from "@/components/SavedSearchCard";
import { SaveSearchModal } from "@/components/SaveSearchModal";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { Button } from "@/components/ui";
import type { SavedSearch, SavedSearchInput } from "@/lib/types";

function SavedSearchesContent() {
  const { listings } = useListings();
  const {
    savedSearches,
    isLoading,
    toggleSearchStatus,
    updateSavedSearch,
    deleteSavedSearch,
    counts,
  } = useSavedSearches(listings);
  const { addToast } = useToast();

  // Edit modal state
  const [editingSearch, setEditingSearch] = useState<
    (SavedSearch & { matchCount: number }) | null
  >(null);

  // Delete modal state
  const [deletingSearch, setDeletingSearch] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Handle edit
  const handleEdit = useCallback(
    (search: SavedSearch & { matchCount: number }) => {
      setEditingSearch(search);
    },
    []
  );

  // Handle save edit
  const handleSaveEdit = useCallback(
    (input: SavedSearchInput) => {
      if (!editingSearch) return;

      updateSavedSearch(editingSearch.id, {
        name: input.name,
        email: input.email,
        frequency: input.frequency,
      });
      addToast(`Search "${input.name}" updated successfully!`, "success");
      setEditingSearch(null);
    },
    [editingSearch, updateSavedSearch, addToast]
  );

  // Handle delete click
  const handleDeleteClick = useCallback((id: string) => {
    const search = savedSearches.find((s) => s.id === id);
    if (search) {
      setDeletingSearch({ id, name: search.name });
    }
  }, [savedSearches]);

  // Handle confirm delete
  const handleConfirmDelete = useCallback(() => {
    if (!deletingSearch) return;

    deleteSavedSearch(deletingSearch.id);
    addToast(`Search "${deletingSearch.name}" deleted`, "success");
    setDeletingSearch(null);
  }, [deletingSearch, deleteSavedSearch, addToast]);

  if (isLoading) {
    return <SavedSearchesSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Your Saved Searches
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {counts.total === 0
              ? "Get notified when new listings match your criteria"
              : `${counts.active} active, ${counts.paused} paused`}
          </p>
        </div>

        <Link href="/">
          <Button variant="primary">Create New Search</Button>
        </Link>
      </div>

      {/* Saved searches list */}
      {savedSearches.length > 0 ? (
        <div className="space-y-4">
          {savedSearches.map((search) => (
            <SavedSearchCard
              key={search.id}
              search={search}
              onToggleStatus={toggleSearchStatus}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Edit modal */}
      {editingSearch && (
        <SaveSearchModal
          isOpen={true}
          onClose={() => setEditingSearch(null)}
          onSave={handleSaveEdit}
          filters={editingSearch.filters}
          existingSearch={{
            name: editingSearch.name,
            email: editingSearch.email,
            frequency: editingSearch.frequency,
          }}
        />
      )}

      {/* Delete confirmation modal */}
      {deletingSearch && (
        <ConfirmDeleteModal
          isOpen={true}
          onClose={() => setDeletingSearch(null)}
          onConfirm={handleConfirmDelete}
          searchName={deletingSearch.name}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-primary-500"
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
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No saved searches yet
      </h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
        Save a search to get notified when new listings match your criteria.
        Never miss the perfect fire apparatus!
      </p>
      <Link href="/">
        <Button variant="primary">Browse Listings</Button>
      </Link>
    </div>
  );
}

function SavedSearchesSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="h-8 bg-gray-200 rounded w-56 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 bg-gray-200 rounded w-48" />
                  <div className="h-5 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-full max-w-md mb-3" />
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-28" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-9 bg-gray-200 rounded w-28" />
                <div className="h-9 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SavedSearchesPage() {
  return (
    <Suspense fallback={<SavedSearchesSkeleton />}>
      <SavedSearchesContent />
    </Suspense>
  );
}
