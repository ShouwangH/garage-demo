"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { NOTIFICATION_FREQUENCIES } from "@/lib/constants";
import { formatFilterSummary } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { SearchFilters, NotificationFrequency, SavedSearchInput } from "@/lib/types";

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: SavedSearchInput) => void;
  filters: SearchFilters;
  existingSearch?: {
    name: string;
    email: string;
    frequency: NotificationFrequency;
  };
}

interface FormErrors {
  name?: string;
  email?: string;
}

export function SaveSearchModal({
  isOpen,
  onClose,
  onSave,
  filters,
  existingSearch,
}: SaveSearchModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState<NotificationFrequency>("instant");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or existingSearch changes
  useEffect(() => {
    if (isOpen) {
      if (existingSearch) {
        setName(existingSearch.name);
        setEmail(existingSearch.email);
        setFrequency(existingSearch.frequency);
      } else {
        setName("");
        setEmail("");
        setFrequency("instant");
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, existingSearch]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Please enter a name for this search";
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      const input: SavedSearchInput = {
        name: name.trim(),
        email: email.trim(),
        frequency,
        filters,
      };

      onSave(input);
      onClose();
    },
    [name, email, frequency, filters, validateForm, onSave, onClose]
  );

  const filterSummary = formatFilterSummary(filters);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingSearch ? "Update Saved Search" : "Save This Search"}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        {/* Filter Summary */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Search Criteria
          </p>
          <p className="text-sm text-gray-900">{filterSummary}</p>
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="search-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Name
          </label>
          <input
            id="search-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="e.g., Texas Pierce Pumpers"
            className={cn(
              "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2",
              errors.name
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary-500"
            )}
            autoFocus
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label
            htmlFor="search-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="search-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="you@example.com"
            className={cn(
              "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2",
              errors.email
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary-500"
            )}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Notification Frequency */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notify me
          </label>
          <div className="flex gap-2">
            {NOTIFICATION_FREQUENCIES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFrequency(option.value as NotificationFrequency)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm rounded-lg border transition-colors",
                  frequency === option.value
                    ? "bg-primary-50 border-primary-500 text-primary-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {frequency === "instant"
              ? "Get notified immediately when new matches are posted"
              : frequency === "daily"
              ? "Receive a daily email with new matches"
              : "Receive a weekly summary of new matches"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors",
              isSubmitting
                ? "bg-primary-400 cursor-not-allowed"
                : "bg-primary-500 hover:bg-primary-600"
            )}
          >
            {isSubmitting
              ? "Saving..."
              : existingSearch
              ? "Update Search"
              : "Save Search"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
