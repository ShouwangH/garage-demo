"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { SearchFilters, Category, ListingTypeFilter } from "@/lib/types";

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse filters from URL search params
  const filters: SearchFilters = useMemo(() => {
    const category = searchParams.get("category") as Category | null;
    const listingType = searchParams.get("listingType") as ListingTypeFilter | null;
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const yearMin = searchParams.get("yearMin");
    const yearMax = searchParams.get("yearMax");
    const mileageMin = searchParams.get("mileageMin");
    const mileageMax = searchParams.get("mileageMax");
    const manufacturers = searchParams.get("manufacturers");
    const pumpSizeMin = searchParams.get("pumpSizeMin");
    const tankSizeMin = searchParams.get("tankSizeMin");
    const state = searchParams.get("state");

    return {
      category: category || undefined,
      listingType: listingType || undefined,
      priceMin: priceMin ? parseInt(priceMin, 10) : undefined,
      priceMax: priceMax ? parseInt(priceMax, 10) : undefined,
      yearMin: yearMin ? parseInt(yearMin, 10) : undefined,
      yearMax: yearMax ? parseInt(yearMax, 10) : undefined,
      mileageMin: mileageMin ? parseInt(mileageMin, 10) : undefined,
      mileageMax: mileageMax ? parseInt(mileageMax, 10) : undefined,
      manufacturers: manufacturers ? manufacturers.split(",") : undefined,
      pumpSizeMin: pumpSizeMin ? parseInt(pumpSizeMin, 10) : undefined,
      tankSizeMin: tankSizeMin ? parseInt(tankSizeMin, 10) : undefined,
      state: state || undefined,
    };
  }, [searchParams]);

  // Update URL with new filter value
  const setFilter = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          params.delete(key);
        } else {
          params.set(key, value.join(","));
        }
      } else {
        params.set(key, String(value));
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Set multiple filters at once
  const setFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            params.delete(key);
          } else {
            params.set(key, value.join(","));
          }
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.category !== undefined ||
      (filters.listingType !== undefined && filters.listingType !== "all") ||
      filters.priceMin !== undefined ||
      filters.priceMax !== undefined ||
      filters.yearMin !== undefined ||
      filters.yearMax !== undefined ||
      filters.mileageMin !== undefined ||
      filters.mileageMax !== undefined ||
      (filters.manufacturers !== undefined && filters.manufacturers.length > 0) ||
      filters.pumpSizeMin !== undefined ||
      filters.tankSizeMin !== undefined ||
      filters.state !== undefined
    );
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.listingType && filters.listingType !== "all") count++;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) count++;
    if (filters.yearMin !== undefined || filters.yearMax !== undefined) count++;
    if (filters.mileageMin !== undefined || filters.mileageMax !== undefined) count++;
    if (filters.manufacturers && filters.manufacturers.length > 0) count++;
    if (filters.pumpSizeMin !== undefined) count++;
    if (filters.tankSizeMin !== undefined) count++;
    if (filters.state) count++;
    return count;
  }, [filters]);

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
