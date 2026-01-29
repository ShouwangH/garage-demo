"use client";

import Image from "next/image";
import type { Listing } from "@/lib/types";
import { formatPrice, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { addToast } = useToast();

  const handleClick = () => {
    addToast("Listing details coming soon!", "info");
  };

  return (
    <article
      onClick={handleClick}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {listing.listingType === "auction" && (
          <div className="absolute top-2 left-2">
            <Badge variant="warning">Auction</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
          {listing.title}
        </h3>

        {/* Price */}
        <p className="text-xl font-semibold text-gray-900 mb-3">
          {formatPrice(listing.price)}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          {listing.pumpGPM && (
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
                  strokeWidth={1.5}
                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                />
              </svg>
              {formatNumber(listing.pumpGPM)} GPM
            </span>
          )}
          {listing.tankGallons && (
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
                  strokeWidth={1.5}
                  d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                />
              </svg>
              {formatNumber(listing.tankGallons)} gal
            </span>
          )}
        </div>

        {/* Mileage and Location */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatNumber(listing.mileage)} miles</span>
          <span>
            {listing.city}, {listing.state}
          </span>
        </div>
      </div>
    </article>
  );
}
