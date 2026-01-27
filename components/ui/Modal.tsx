"use client";

import { cn } from "@/lib/utils";
import { useEffect, useCallback, ReactNode } from "react";

// Global state for managing stacked modals
declare global {
  interface Window {
    __modalOpenCount?: number;
    __previousBodyOverflow?: string;
  }
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  size = "md",
}: ModalProps) {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Lock body scroll when modal is open (handles stacked modals)
  useEffect(() => {
    if (!isOpen) return;

    // Initialize global counter if needed
    if (typeof window.__modalOpenCount === "undefined") {
      window.__modalOpenCount = 0;
    }

    // First modal opening - save current overflow and lock
    if (window.__modalOpenCount === 0) {
      window.__previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    window.__modalOpenCount++;
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.__modalOpenCount!--;
      document.removeEventListener("keydown", handleEscape);

      // Last modal closing - restore previous overflow
      if (window.__modalOpenCount === 0) {
        document.body.style.overflow = window.__previousBodyOverflow || "";
      }
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full bg-white rounded-xl shadow-xl",
            "transform transition-all",
            sizes[size]
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
                aria-label="Close modal"
              >
                <svg
                  className="h-5 w-5"
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
          )}

          {/* Content */}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
