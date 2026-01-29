"use client";

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

export function FilterSidebar() {
  const { filters, setFilter, clearFilters, hasActiveFilters } = useFilters();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
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
