"use client";

import { useEffect, useCallback } from "react";
import { useFilters } from "@/hooks/useFilters";
import {
  CATEGORIES,
  LISTING_TYPE_OPTIONS,
  MANUFACTURERS,
  US_STATES,
  FILTER_RANGES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Category, ListingTypeFilter } from "@/lib/types";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { filters, setFilter, clearFilters, hasActiveFilters, activeFilterCount } =
    useFilters();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleClearAll = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close filters"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Filter Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Category */}
          <FilterSection title="Category">
            <select
              value={filters.category || ""}
              onChange={(e) =>
                setFilter("category", (e.target.value as Category) || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </FilterSection>

          {/* Listing Type */}
          <FilterSection title="Listing Type">
            <div className="flex gap-2">
              {LISTING_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFilter(
                      "listingType",
                      option.value === "all"
                        ? undefined
                        : (option.value as ListingTypeFilter)
                    )
                  }
                  className={cn(
                    "flex-1 px-3 py-1.5 text-sm rounded-lg border transition-colors",
                    (filters.listingType || "all") === option.value
                      ? "bg-primary-50 border-primary-500 text-primary-700"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin || ""}
                onChange={(e) =>
                  setFilter(
                    "priceMin",
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                min={FILTER_RANGES.price.min}
                step={FILTER_RANGES.price.step}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax || ""}
                onChange={(e) =>
                  setFilter(
                    "priceMax",
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                min={FILTER_RANGES.price.min}
                step={FILTER_RANGES.price.step}
              />
            </div>
          </FilterSection>

          {/* Year Range */}
          <FilterSection title="Year">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={filters.yearMin || ""}
                onChange={(e) =>
                  setFilter(
                    "yearMin",
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                min={FILTER_RANGES.year.min}
                max={FILTER_RANGES.year.max}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.yearMax || ""}
                onChange={(e) =>
                  setFilter(
                    "yearMax",
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                min={FILTER_RANGES.year.min}
                max={FILTER_RANGES.year.max}
              />
            </div>
          </FilterSection>

          {/* Mileage Range */}
          <FilterSection title="Mileage">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={filters.mileageMin || ""}
                onChange={(e) =>
                  setFilter(
                    "mileageMin",
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                min={FILTER_RANGES.mileage.min}
                step={FILTER_RANGES.mileage.step}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.mileageMax || ""}
                onChange={(e) =>
                  setFilter(
                    "mileageMax",
                    e.target.value ? parseInt(e.target.value, 10) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                min={FILTER_RANGES.mileage.min}
                step={FILTER_RANGES.mileage.step}
              />
            </div>
          </FilterSection>

          {/* Manufacturers */}
          <FilterSection title="Manufacturer">
            <div className="max-h-40 overflow-y-auto space-y-2">
              {MANUFACTURERS.map((manufacturer) => {
                const isSelected =
                  filters.manufacturers?.includes(manufacturer) || false;
                return (
                  <label
                    key={manufacturer}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        const current = filters.manufacturers || [];
                        const updated = isSelected
                          ? current.filter((m) => m !== manufacturer)
                          : [...current, manufacturer];
                        setFilter(
                          "manufacturers",
                          updated.length > 0 ? updated : undefined
                        );
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{manufacturer}</span>
                  </label>
                );
              })}
            </div>
          </FilterSection>

          {/* Pump Size */}
          <FilterSection title="Pump Size (GPM)">
            <input
              type="number"
              placeholder="Minimum GPM"
              value={filters.pumpSizeMin || ""}
              onChange={(e) =>
                setFilter(
                  "pumpSizeMin",
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              min={FILTER_RANGES.pumpGPM.min}
              step={FILTER_RANGES.pumpGPM.step}
            />
          </FilterSection>

          {/* Tank Size */}
          <FilterSection title="Tank Size (Gallons)">
            <input
              type="number"
              placeholder="Minimum gallons"
              value={filters.tankSizeMin || ""}
              onChange={(e) =>
                setFilter(
                  "tankSizeMin",
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              min={FILTER_RANGES.tankGallons.min}
              step={FILTER_RANGES.tankGallons.step}
            />
          </FilterSection>

          {/* State */}
          <FilterSection title="State">
            <select
              value={filters.state || ""}
              onChange={(e) =>
                setFilter("state", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All States</option>
              {US_STATES.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>
          </FilterSection>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-3 flex gap-3">
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className={cn(
              "px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors",
              hasActiveFilters ? "flex-1" : "w-full"
            )}
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      {children}
    </div>
  );
}
