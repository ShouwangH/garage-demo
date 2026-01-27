# Garage Saved Search - Implementation Plan

This document outlines the phased implementation plan for the Saved Search feature demo.

---

## Phase 1: Project Setup & Foundation

### Goal
Initialize the Next.js project with all configuration and create the type system foundation.

### Files to Create/Modify
- `package.json` - Project dependencies
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind configuration with custom colors
- `app/globals.css` - Global styles and Tailwind imports
- `app/layout.tsx` - Minimal root layout (just wrapping children)
- `app/page.tsx` - Placeholder page
- `lib/types.ts` - All TypeScript interfaces
- `lib/constants.ts` - Manufacturers, states, categories, etc.

### Detailed Steps
1. Initialize Next.js 14 project:
   ```bash
   npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
   ```

2. Configure Tailwind with Garage-inspired colors:
   - Primary orange: `#f97316` (orange-500)
   - Secondary blue: `#3b82f6` (blue-500)
   - Neutral grays for backgrounds

3. Create `lib/types.ts` with interfaces:
   - `Listing` - Fire apparatus listing data
   - `SavedSearch` - User's saved search
   - `SearchFilters` - Filter criteria object

4. Create `lib/constants.ts` with:
   - `MANUFACTURERS` array (Pierce, E-One, Seagrave, etc.)
   - `US_STATES` array (abbreviation + name objects)
   - `CATEGORIES` array
   - `LISTING_TYPES` array
   - `VEHICLE_TYPES` array
   - `NOTIFICATION_FREQUENCIES` array
   - `SORT_OPTIONS` array

5. Create minimal `app/layout.tsx` and `app/page.tsx` placeholders

### Testing
- `npm run dev` starts without errors
- TypeScript compiles without errors
- Tailwind classes work in the placeholder page

### Dependencies
None - this is the first phase.

### Estimated Lines
~200 lines

---

## Phase 2: Mock Data & Core Utilities

### Goal
Create realistic mock listing data and core utility functions for data manipulation.

### Files to Create/Modify
- `lib/mockData.ts` - 18 realistic fire apparatus listings
- `lib/storage.ts` - LocalStorage helper functions
- `lib/matching.ts` - Filter matching logic
- `lib/utils.ts` - Formatting utilities

### Detailed Steps
1. Create `lib/mockData.ts` with 18 listings:
   - 5 pumpers (varied prices $45k-$180k)
   - 3 tankers ($35k-$95k)
   - 3 aerials ($150k-$285k)
   - 4 ambulances ($28k-$85k)
   - 3 rescue trucks ($55k-$145k)
   - Mix of manufacturers, years (1998-2022), states
   - 80% buy_now, 20% auction

2. Create `DEFAULT_SAVED_SEARCH` in mockData:
   - Name: "Texas Pierce Pumpers Under $150k"
   - Filters: category=Fire Apparatus, manufacturers=[Pierce], state=TX, priceMax=150000
   - Status: active
   - Email: "chief.johnson@demo-fd.gov"
   - Frequency: daily
   - This ensures ~2-3 listings match initially for a realistic demo

   Also create `SIMULATABLE_LISTINGS` array:
   - 3-4 pre-crafted Pierce pumpers in Texas under $150k
   - These are NOT in the initial listings - they get added when "Simulate" is clicked
   - Guarantees the demo flow works perfectly every time

3. Create `lib/storage.ts` with functions:
   - `getFromStorage<T>(key: string, defaultValue: T): T`
   - `setToStorage<T>(key: string, value: T): void`
   - `initializeStorage()` - seeds DEFAULT_SAVED_SEARCH on first visit (checks flag)
   - `STORAGE_KEYS` constant object

3. Create `lib/matching.ts` with:
   - `listingMatchesFilters(listing, filters): boolean`
   - `getMatchingListings(listings, filters): Listing[]`
   - `countMatches(listings, filters): number`

4. Create `lib/utils.ts` with:
   - `formatPrice(price: number): string` → "$85,000"
   - `formatNumber(num: number): string` → "28,000"
   - `formatFilterSummary(filters: SearchFilters): string`
   - `generateId(): string`
   - `getRelativeTime(date: string): string` → "2 days ago"
   - `cn(...classes)` - className merger utility

### Testing
- Import mockData and verify 18 listings exist
- Test matching logic with sample filters
- Test formatPrice outputs correct format
- Test storage functions in browser console

### Dependencies
Phase 1 complete (types and constants needed)

### Estimated Lines
~280 lines

---

## Phase 3: Basic UI Components

### Goal
Build the foundational UI component library that all other components will use.

### Files to Create/Modify
- `components/ui/Button.tsx` - Button with variants
- `components/ui/Input.tsx` - Text/number input
- `components/ui/Select.tsx` - Dropdown select
- `components/ui/Modal.tsx` - Dialog overlay
- `components/ui/Badge.tsx` - Status badges
- `components/ui/Toast.tsx` - Notification toasts
- `hooks/useToast.ts` - Toast state management

### Detailed Steps
1. Create `Button.tsx`:
   - Variants: `primary` (orange), `secondary` (gray), `ghost`
   - Sizes: `sm`, `md`, `lg`
   - Props: disabled, loading state, full-width option

2. Create `Input.tsx`:
   - Types: text, number, email
   - Label support
   - Error state
   - Placeholder styling

3. Create `Select.tsx`:
   - Label support
   - Placeholder option
   - Options array prop
   - Optional multi-select mode (checkboxes)

4. Create `Modal.tsx`:
   - Overlay with backdrop blur
   - Close on backdrop click (optional)
   - Close button (X)
   - Title and children slots
   - Animation on open/close (simple fade)

5. Create `Badge.tsx`:
   - Variants: `success` (green), `warning` (orange), `neutral` (gray), `info` (blue)
   - Size options

6. Create `Toast.tsx` and `hooks/useToast.ts`:
   - Toast provider context
   - Types: success, error, info
   - Auto-dismiss after 4 seconds
   - Stack multiple toasts

### Testing
- Create a test page `/test` that renders all components
- Verify all variants and states work
- Test modal open/close behavior
- Test toast auto-dismiss

### Dependencies
Phase 1 complete (Tailwind config)

### Estimated Lines
~300 lines

---

## Phase 4: Layout & Header

### Goal
Create the app shell with header navigation and responsive layout structure.

### Files to Create/Modify
- `components/Header.tsx` - Main navigation header
- `app/layout.tsx` - Update with Header and Toast provider
- `app/page.tsx` - Update with basic structure
- `app/saved-searches/page.tsx` - Create placeholder

### Detailed Steps
1. Create `Header.tsx`:
   - Garage logo (text or simple SVG)
   - Nav links: "Browse" (/) and "Saved Searches" (/saved-searches)
   - Active state styling for current route
   - Right side: mock user "Chief Johnson" with avatar placeholder
   - Mobile: hamburger menu (can be simple, nav items below)
   - Sticky header with white background

2. Update `app/layout.tsx`:
   - Import and render Header
   - Wrap children in ToastProvider
   - Set up basic page structure with max-width container
   - Meta tags for demo

3. Update `app/page.tsx`:
   - Basic two-column layout structure (sidebar + main)
   - Placeholder text for filters area
   - Placeholder text for listings area

4. Create `app/saved-searches/page.tsx`:
   - Basic page with title "Your Saved Searches"
   - Placeholder content

### Testing
- Navigation between / and /saved-searches works
- Header is sticky and styled correctly
- Active nav link is highlighted
- Layout is responsive (collapses on mobile)

### Dependencies
Phase 3 complete (Button component for nav styling)

### Estimated Lines
~200 lines

---

## Phase 5: Listing Card & Grid

### Goal
Create the listing display components showing fire apparatus cards in a responsive grid.

### Files to Create/Modify
- `components/ListingCard.tsx` - Individual listing card
- `components/ListingGrid.tsx` - Grid layout for cards
- `hooks/useListings.ts` - Listings state with localStorage
- `app/page.tsx` - Update to show listings

### Detailed Steps
1. Create `hooks/useListings.ts`:
   - Initialize from localStorage or mockData
   - Persist changes to localStorage
   - `addListing(listing)` function for simulate feature later
   - `listings` array state

2. Create `ListingCard.tsx`:
   - Image placeholder (colored div with icon or placehold.co)
   - Title: "[Year] [Manufacturer] [Type]"
   - Price (large, bold)
   - Specs row: GPM | Tank | Mileage (with icons or labels)
   - Location: "City, State"
   - Auction badge if applicable
   - Hover effect (subtle shadow lift)
   - Click handler (show "Coming soon" toast)

3. Create `ListingGrid.tsx`:
   - Props: listings array, loading state
   - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
   - Gap spacing
   - Empty state if no listings

4. Update `app/page.tsx`:
   - Use useListings hook
   - Render ListingGrid with all listings
   - Add results count header

### Testing
- All 18 mock listings display
- Cards show correct information
- Grid is responsive at all breakpoints
- Clicking card shows toast

### Dependencies
Phase 4 complete (layout structure)
Phase 2 complete (mock data, utils)

### Estimated Lines
~250 lines

---

## Phase 6: Filter Sidebar (Desktop)

### Goal
Create the desktop filter sidebar with all filter inputs and URL-based state management.

### Files to Create/Modify
- `components/FilterSidebar.tsx` - Desktop filter panel
- `hooks/useFilters.ts` - URL-based filter state
- `app/page.tsx` - Integrate filters with listings

### Detailed Steps
1. Create `hooks/useFilters.ts`:
   - Read filters from URL search params
   - `setFilter(key, value)` updates URL
   - `clearFilters()` resets URL
   - `hasActiveFilters` boolean
   - `filters` object matching SearchFilters type
   - Use Next.js `useSearchParams` and `useRouter`

2. Create `FilterSidebar.tsx`:
   - Collapsible sections for each filter group
   - Category dropdown
   - Listing type pills (All/Buy Now/Auction)
   - Price range (min/max inputs)
   - Year range (min/max inputs)
   - Mileage range (min/max inputs)
   - Manufacturer multi-select (checkboxes, scrollable)
   - Pump size minimum input
   - Tank size minimum input
   - State dropdown
   - "Clear All" button when filters active
   - Each input updates URL via useFilters

3. Update `app/page.tsx`:
   - Render FilterSidebar in left column
   - Filter listings using `getMatchingListings`
   - Show "X listings match your filters" count
   - Add sort dropdown (Relevance, Price low/high, Recent)
   - Implement sort logic

### Testing
- Changing filters updates URL
- URL can be shared and loads correct filters
- Back button works with filter history
- Filtered results update instantly
- Sort works correctly

### Dependencies
Phase 5 complete (listing grid)
Phase 2 complete (matching logic)

### Estimated Lines
~300 lines

---

## Phase 7: Filter Drawer (Mobile)

### Goal
Create the mobile filter experience with a slide-out drawer.

### Files to Create/Modify
- `components/FilterDrawer.tsx` - Mobile slide-out filter panel
- `app/page.tsx` - Add mobile filter button and drawer

### Detailed Steps
1. Create `FilterDrawer.tsx`:
   - Slide-in from right animation
   - Full-height overlay
   - Header with "Filters" title and close button
   - Same filter inputs as sidebar (reuse or extract shared component)
   - Footer with "Apply Filters" and "Clear All" buttons
   - Backdrop overlay that closes drawer
   - Body scroll lock when open

2. Update `app/page.tsx`:
   - Add "Filters" button visible only on mobile (with filter count badge)
   - Toggle drawer state
   - Hide sidebar on mobile, show drawer trigger
   - Show sidebar on desktop, hide drawer trigger
   - Use Tailwind responsive classes

3. Optional: Extract shared filter inputs:
   - Could create `FilterInputs.tsx` used by both
   - Or keep them duplicated if simpler

### Testing
- On mobile: filter button shows, clicking opens drawer
- Drawer slides in smoothly
- Filters work same as desktop
- Backdrop click closes drawer
- On desktop: sidebar shows, no drawer button

### Dependencies
Phase 6 complete (filter logic and sidebar)

### Estimated Lines
~200 lines

---

## Phase 8: Saved Searches Hook & Storage

### Goal
Create the core saved searches functionality with CRUD operations.

### Files to Create/Modify
- `hooks/useSavedSearches.ts` - Full CRUD hook
- Update `lib/storage.ts` if needed

### Detailed Steps
1. Create `hooks/useSavedSearches.ts`:
   - Load saved searches from localStorage on mount
   - `savedSearches` array state
   - `createSavedSearch(data)` - generates ID, sets createdAt, saves
   - `updateSavedSearch(id, updates)` - partial update
   - `deleteSavedSearch(id)` - remove by ID
   - `toggleSearchStatus(id)` - flip active/paused
   - `getSavedSearchById(id)` - find by ID
   - `getMatchCountForSearch(search, listings)` - count current matches
   - All operations persist to localStorage

2. Create sample saved search for testing:
   - Add a default saved search in mockData or storage init
   - Something like "Texas Pumpers" with some filters

3. Export types if needed:
   - `SavedSearchInput` (omits id, createdAt)

### Testing
- Create a saved search via console
- Reload page, search persists
- Update search, changes persist
- Delete search, it's removed
- Toggle status works

### Dependencies
Phase 2 complete (storage utilities)

### Estimated Lines
~150 lines

---

## Phase 9: Save Search Modal

### Goal
Create the modal for saving/editing searches with form validation.

### Files to Create/Modify
- `components/SaveSearchModal.tsx` - The modal form
- `components/FilterSummary.tsx` - Reusable filter display

### Detailed Steps
1. Create `components/FilterSummary.tsx`:
   - Takes `filters` prop
   - Displays active filters as badges/pills
   - Format: "Category: Fire Apparatus" | "$50k - $100k" | "Pierce, E-One"
   - Handles empty state gracefully

2. Create `components/SaveSearchModal.tsx`:
   - Props: `isOpen`, `onClose`, `filters`, `existingSearch?` (for edit mode)
   - Title: "Save This Search" or "Edit Saved Search"
   - FilterSummary showing current filters (read-only)
   - Form fields:
     - Search name (required, text input)
     - Email (required, email validation)
     - Notification frequency (radio group: Instant/Daily/Weekly)
   - Validation:
     - Name required, min 2 chars
     - Email required, valid format
   - Error messages inline
   - Buttons: Cancel (secondary), Save (primary orange)
   - On save: call hook function, show toast, close modal
   - Pre-fill values in edit mode

### Testing
- Modal opens and closes properly
- Validation prevents empty submission
- Email validation works
- Save creates new search (check localStorage)
- Edit mode pre-fills values
- Toast shows on success

### Dependencies
Phase 8 complete (useSavedSearches hook)
Phase 3 complete (UI components)

### Estimated Lines
~250 lines

---

## Phase 10: Save Search Button & Browse Integration

### Goal
Add the "Save This Search" button to the browse page with full integration.

### Files to Create/Modify
- `components/SaveSearchButton.tsx` - The CTA button
- `app/page.tsx` - Integrate button and modal

### Detailed Steps
1. Create `components/SaveSearchButton.tsx`:
   - Props: `filters`, `onSave`
   - Only visible when `hasActiveFilters` is true
   - States:
     - Default: "Save This Search" (orange button)
     - Loading: disabled with spinner
     - Success: "Search Saved ✓" (green, briefly, then reset)
   - Fixed position on mobile (bottom of screen)
   - Inline with results header on desktop

2. Update `app/page.tsx`:
   - Import SaveSearchButton and SaveSearchModal
   - Add modal state (open/closed)
   - Wire button click to open modal
   - Pass current filters to modal
   - On save callback:
     - Use useSavedSearches hook to create
     - Show success state on button
     - Show success toast
   - Position button appropriately

3. Add visual feedback:
   - Button appears with animation when filters become active
   - Success state lasts 2 seconds before reset

### Testing
- Button hidden when no filters
- Button appears when filter applied
- Click opens modal with current filters
- Save works end-to-end
- Success state shows briefly
- Toast notification appears

### Dependencies
Phase 9 complete (SaveSearchModal)
Phase 6 complete (useFilters)

### Estimated Lines
~150 lines

---

## Phase 11: Saved Searches Dashboard - Basic

### Goal
Create the saved searches dashboard page with list view and empty state.

### Files to Create/Modify
- `components/SavedSearchCard.tsx` - Individual search card
- `components/EmptyState.tsx` - Reusable empty state
- `app/saved-searches/page.tsx` - Full dashboard implementation

### Detailed Steps
1. Create `components/EmptyState.tsx`:
   - Props: `icon`, `title`, `description`, `action` (button)
   - Centered layout
   - Large icon (could use emoji or simple SVG)
   - Configurable for different contexts

2. Create `components/SavedSearchCard.tsx`:
   - Props: `savedSearch`, `matchCount`, action callbacks
   - Layout (horizontal card):
     - Left: Search name, status badge, filter summary
     - Right: Match count, action buttons
   - Status badge: Active (green) / Paused (gray)
   - Filter summary using FilterSummary component
   - "X current matches" link
   - "Created [relative time]" subtitle
   - Mobile: stack vertically

3. Update `app/saved-searches/page.tsx`:
   - Page header: "Your Saved Searches"
   - "Create New Search" button (links to / or opens modal)
   - Use useSavedSearches hook
   - Use useListings hook for match counts
   - Map saved searches to SavedSearchCard components
   - Empty state when no saved searches
   - Loading state

### Testing
- Empty state shows when no saved searches
- Cards display correct information
- Match count is accurate
- Status badge shows correctly
- Layout responsive on mobile

### Dependencies
Phase 8 complete (useSavedSearches hook)
Phase 5 complete (useListings for match counts)

### Estimated Lines
~280 lines

---

## Phase 12: Dashboard Actions

### Goal
Implement all action buttons on saved search cards (view, edit, pause, delete).

### Files to Create/Modify
- `components/SavedSearchCard.tsx` - Add action handlers
- `components/ConfirmDialog.tsx` - Delete confirmation
- `app/saved-searches/page.tsx` - Wire up all actions

### Detailed Steps
1. Create `components/ConfirmDialog.tsx`:
   - Reusable confirmation modal
   - Props: `isOpen`, `title`, `message`, `onConfirm`, `onCancel`
   - Danger variant for delete actions
   - "Cancel" and "Confirm" buttons

2. Update `components/SavedSearchCard.tsx`:
   - Add action buttons:
     - "View Matches" - navigates to browse with filters in URL
     - "Edit" - opens modal with search data
     - Pause/Resume toggle button
     - "Delete" - opens confirmation dialog
   - Button styling: icon buttons or text links
   - Mobile: buttons in row or dropdown menu

3. Update `app/saved-searches/page.tsx`:
   - Add edit modal state with selected search
   - Add delete confirmation state
   - Handle "View Matches":
     - Build URL from saved search filters
     - Navigate to / with query params
   - Handle "Edit":
     - Open SaveSearchModal with existingSearch prop
   - Handle "Pause/Resume":
     - Call toggleSearchStatus from hook
     - Show toast confirmation
   - Handle "Delete":
     - Show confirmation dialog
     - On confirm: call deleteSavedSearch
     - Show toast

### Testing
- "View Matches" navigates with correct filters
- "Edit" opens modal with pre-filled values
- Edit saves changes correctly
- "Pause/Resume" toggles status
- "Delete" shows confirmation
- Confirm delete removes the search
- All actions show appropriate toasts

### Dependencies
Phase 11 complete (basic dashboard)
Phase 9 complete (modal for edit)

### Estimated Lines
~200 lines

---

## Phase 13: Email Preview & Polish

### Goal
Add email preview, simulate new listing feature, and final polish.

### Files to Create/Modify
- `components/EmailPreview.tsx` - Email notification mockup
- `components/SimulateButton.tsx` - Add new matching listing
- `app/saved-searches/page.tsx` - Add email preview
- Various files for polish

### Detailed Steps
1. Create `components/EmailPreview.tsx`:
   - Styled to look like an email
   - Shows what notification would look like
   - Props: `savedSearch`, `listing` (example match)
   - Sections: Logo, subject line, listing card, footer
   - Toggle to show/hide (accordion or modal)

2. Create `components/SimulateButton.tsx`:
   - Small button in header: "+ Simulate Listing"
   - On click:
     - Pick from `SIMULATABLE_LISTINGS` array in mockData (pre-defined listings that match the DEFAULT_SAVED_SEARCH)
     - Add to listings via useListings hook
     - Show toast: "New listing added! Matches 'Texas Pierce Pumpers Under $150k'"
   - No random generation needed - use pre-crafted listings for reliable demo
   - Include 3-4 simulatable listings in mockData (Pierce pumpers in TX under $150k)

3. Add email preview to dashboard:
   - Button on each card: "Preview Email"
   - Opens modal or expands to show EmailPreview

4. Final polish:
   - Consistent focus states for accessibility
   - Loading states for all async operations
   - Error boundaries
   - Smooth transitions
   - Check all responsive breakpoints
   - Test full user flows end-to-end

### Testing
- Simulate button creates matching listing
- Toast shows which search matched
- Match counts update on dashboard
- Email preview displays correctly
- All user flows work smoothly
- App works well on mobile

### Dependencies
Phase 12 complete (full dashboard)

### Estimated Lines
~250 lines

---

## Summary

| Phase | Name | Est. Lines | Key Deliverable |
|-------|------|------------|-----------------|
| 1 | Project Setup & Foundation | ~200 | Types, constants, Tailwind config |
| 2 | Mock Data & Core Utilities | ~280 | 18 listings, matching logic, utils |
| 3 | Basic UI Components | ~300 | Button, Input, Select, Modal, Toast |
| 4 | Layout & Header | ~200 | Header nav, app shell |
| 5 | Listing Card & Grid | ~250 | ListingCard, ListingGrid, useListings |
| 6 | Filter Sidebar (Desktop) | ~300 | FilterSidebar, useFilters, URL state |
| 7 | Filter Drawer (Mobile) | ~200 | FilterDrawer, responsive filter UI |
| 8 | Saved Searches Hook | ~150 | useSavedSearches CRUD |
| 9 | Save Search Modal | ~250 | SaveSearchModal with validation |
| 10 | Save Button & Integration | ~150 | SaveSearchButton, browse page integration |
| 11 | Dashboard Basic | ~280 | SavedSearchCard, EmptyState, list view |
| 12 | Dashboard Actions | ~200 | View, Edit, Pause, Delete actions |
| 13 | Email Preview & Polish | ~250 | EmailPreview, SimulateButton, polish |

**Total Estimated: ~3,010 lines**

---

## Execution Notes

- Each phase should be committed separately for easy PR review
- Run `npm run build` at end of each phase to verify no errors
- Test on both desktop and mobile at each phase
- Keep components focused and avoid premature optimization
- Use descriptive commit messages referencing phase number
