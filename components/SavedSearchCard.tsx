"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { formatFilterSummary, getRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { SavedSearch, SearchFilters } from "@/lib/types";

interface SavedSearchCardProps {
  search: SavedSearch & { matchCount: number };
  onToggleStatus?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (search: SavedSearch & { matchCount: number }) => void;
  onPreviewEmail?: (search: SavedSearch & { matchCount: number }) => void;
}

export function SavedSearchCard({
  search,
  onToggleStatus,
  onDelete,
  onEdit,
  onPreviewEmail,
}: SavedSearchCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const filterSummary = formatFilterSummary(search.filters);
  const isActive = search.status === "active";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  // Build URL with filters for "View Matches" link
  const buildFilterUrl = (filters: SearchFilters): string => {
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
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit?.(search);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete?.(search.id);
  };

  const handlePreviewEmail = () => {
    setIsMenuOpen(false);
    onPreviewEmail?.(search);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Left side - Search info */}
        <div className="flex-1 min-w-0">
          {/* Name and status */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {search.name}
            </h3>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              {isActive ? "Active" : "Paused"}
            </span>
          </div>

          {/* Filter summary */}
          <p className="text-sm text-gray-600 mb-3">{filterSummary}</p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            {/* Match count */}
            <span className="flex items-center gap-1">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {search.matchCount} {search.matchCount === 1 ? "match" : "matches"}
            </span>

            {/* Notification frequency */}
            <span className="flex items-center gap-1">
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
              {search.frequency === "instant"
                ? "Instant"
                : search.frequency === "daily"
                ? "Daily"
                : "Weekly"}
            </span>

            {/* Created date */}
            <span className="flex items-center gap-1">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {getRelativeTime(search.createdAt)}
            </span>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View matches link */}
          <Link
            href={buildFilterUrl(search.filters)}
            className="px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
          >
            View Matches
          </Link>

          {/* Toggle status button */}
          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(search.id)}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-green-600 hover:bg-green-50"
              )}
            >
              {isActive ? "Pause" : "Resume"}
            </button>
          )}

          {/* More actions dropdown */}
          {(onEdit || onDelete || onPreviewEmail) && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isMenuOpen
                    ? "bg-gray-100 text-gray-700"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                )}
                aria-label="More actions"
                aria-expanded={isMenuOpen}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-10">
                  {onPreviewEmail && (
                    <button
                      onClick={handlePreviewEmail}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Preview Email
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
