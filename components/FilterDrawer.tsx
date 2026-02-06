"use client";

import { useState, useEffect, useCallback } from "react";
import { useFilters } from "@/hooks/useFilters";
import {
  CATEGORIES,
  LISTING_TYPE_OPTIONS,
  MANUFACTURER_OPTIONS,
  US_STATES,
  FILTER_RANGES,
} from "@/lib/constants";
import { Select, RangeSlider, MultiSelect } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Category, ListingTypeFilter } from "@/lib/types";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDemoFilters?: () => void;
  onSaveSearch?: () => void;
}

export function FilterDrawer({ isOpen, onClose, onLoadDemoFilters, onSaveSearch }: FilterDrawerProps) {
  const {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useFilters();

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

  // Format functions for sliders
  const formatPrice = useCallback(
    (value: number) => (value === 0 ? "$0" : `$${(value / 1000).toFixed(0)}k`),
    []
  );
  const formatYear = useCallback((value: number) => String(value), []);
  const formatMileage = useCallback(
    (value: number) => (value === 0 ? "0" : `${(value / 1000).toFixed(0)}k`),
    []
  );

  // Handle range slider changes
  const handlePriceChange = useCallback(
    (value: [number, number]) => {
      setFilters({
        priceMin: value[0] > FILTER_RANGES.price.min ? value[0] : undefined,
        priceMax: value[1] < FILTER_RANGES.price.max ? value[1] : undefined,
      });
    },
    [setFilters]
  );

  const handleYearChange = useCallback(
    (value: [number, number]) => {
      setFilters({
        yearMin: value[0] > FILTER_RANGES.year.min ? value[0] : undefined,
        yearMax: value[1] < FILTER_RANGES.year.max ? value[1] : undefined,
      });
    },
    [setFilters]
  );

  const handleMileageChange = useCallback(
    (value: [number, number]) => {
      setFilters({
        mileageMin: value[0] > FILTER_RANGES.mileage.min ? value[0] : undefined,
        mileageMax: value[1] < FILTER_RANGES.mileage.max ? value[1] : undefined,
      });
    },
    [setFilters]
  );

  // Category options with "All" option
  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...CATEGORIES,
  ];

  // State options with "All" option
  const stateOptions = [
    { value: "", label: "All States" },
    ...US_STATES.map((s) => ({ value: s.abbreviation, label: s.name })),
  ];

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
        <div className="flex-1 overflow-y-auto p-4">
          {/* Demo button - at top */}
          {onLoadDemoFilters && !hasActiveFilters && (
            <button
              onClick={() => {
                onLoadDemoFilters();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Load Demo Filters
            </button>
          )}

          <div className="space-y-1">
            {/* Category */}
            <CollapsibleSection title="Category">
              <Select
                options={categoryOptions}
                value={filters.category || ""}
                onChange={(e) =>
                  setFilter(
                    "category",
                    (e.target.value as Category) || undefined
                  )
                }
              />
            </CollapsibleSection>

            {/* Listing Type */}
            <CollapsibleSection title="Listing Type">
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
            </CollapsibleSection>

            {/* Price Range */}
            <CollapsibleSection title="Price">
              <RangeSlider
                min={FILTER_RANGES.price.min}
                max={FILTER_RANGES.price.max}
                step={FILTER_RANGES.price.step}
                value={[
                  filters.priceMin ?? FILTER_RANGES.price.min,
                  filters.priceMax ?? FILTER_RANGES.price.max,
                ]}
                onChange={handlePriceChange}
                formatValue={formatPrice}
              />
            </CollapsibleSection>

            {/* Year Range */}
            <CollapsibleSection title="Year">
              <RangeSlider
                min={FILTER_RANGES.year.min}
                max={FILTER_RANGES.year.max}
                step={FILTER_RANGES.year.step}
                value={[
                  filters.yearMin ?? FILTER_RANGES.year.min,
                  filters.yearMax ?? FILTER_RANGES.year.max,
                ]}
                onChange={handleYearChange}
                formatValue={formatYear}
              />
            </CollapsibleSection>

            {/* Mileage Range */}
            <CollapsibleSection title="Mileage">
              <RangeSlider
                min={FILTER_RANGES.mileage.min}
                max={FILTER_RANGES.mileage.max}
                step={FILTER_RANGES.mileage.step}
                value={[
                  filters.mileageMin ?? FILTER_RANGES.mileage.min,
                  filters.mileageMax ?? FILTER_RANGES.mileage.max,
                ]}
                onChange={handleMileageChange}
                formatValue={formatMileage}
              />
            </CollapsibleSection>

            {/* Manufacturers */}
            <CollapsibleSection title="Manufacturer">
              <div className="relative">
                <MultiSelect
                  options={MANUFACTURER_OPTIONS}
                  value={filters.manufacturers || []}
                  onChange={(value) =>
                    setFilter(
                      "manufacturers",
                      value.length > 0 ? value : undefined
                    )
                  }
                  placeholder="Select manufacturers..."
                  searchPlaceholder="Search manufacturers..."
                />
              </div>
            </CollapsibleSection>

            {/* Pump Size */}
            <CollapsibleSection title="Pump Size (GPM)">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Min: {filters.pumpSizeMin ?? 0} GPM</span>
                </div>
                <input
                  type="range"
                  min={FILTER_RANGES.pumpGPM.min}
                  max={FILTER_RANGES.pumpGPM.max}
                  step={FILTER_RANGES.pumpGPM.step}
                  value={filters.pumpSizeMin ?? FILTER_RANGES.pumpGPM.min}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setFilter(
                      "pumpSizeMin",
                      value > FILTER_RANGES.pumpGPM.min ? value : undefined
                    );
                  }}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </CollapsibleSection>

            {/* Tank Size */}
            <CollapsibleSection title="Tank Size (Gallons)">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Min: {filters.tankSizeMin ?? 0} gal</span>
                </div>
                <input
                  type="range"
                  min={FILTER_RANGES.tankGallons.min}
                  max={FILTER_RANGES.tankGallons.max}
                  step={FILTER_RANGES.tankGallons.step}
                  value={filters.tankSizeMin ?? FILTER_RANGES.tankGallons.min}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setFilter(
                      "tankSizeMin",
                      value > FILTER_RANGES.tankGallons.min ? value : undefined
                    );
                  }}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </CollapsibleSection>

            {/* State */}
            <CollapsibleSection title="State">
              <Select
                options={stateOptions}
                value={filters.state || ""}
                onChange={(e) =>
                  setFilter("state", e.target.value || undefined)
                }
              />
            </CollapsibleSection>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-3 space-y-3">
          {/* Save Search button */}
          {onSaveSearch && (
            <button
              onClick={() => {
                onSaveSearch();
                onClose();
              }}
              disabled={!hasActiveFilters}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                hasActiveFilters
                  ? "bg-primary-500 text-white hover:bg-primary-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
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
              Save Search
            </button>
          )}

          <div className="flex gap-3">
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
                "px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors",
                hasActiveFilters ? "flex-1" : "w-full"
              )}
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-left"
      >
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <svg
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}
