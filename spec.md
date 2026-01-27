# Garage Saved Search Feature - Technical Specification

## Overview

Build a saved search feature for Garage (shopgarage.com), a marketplace for used fire apparatus. Users can save their filter criteria and get notified when new matching listings appear.

This is a demo/prototype to demonstrate product thinking and engineering skills for an interview. It should look and feel like it could be a real feature on Garage's platform.

---

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- LocalStorage for persistence
- No backend required

---

## Design Guidelines

- Match Garage's aesthetic: clean, minimal, mostly white backgrounds
- **Orange** accent color for primary CTAs and highlights
- **Blue** as secondary accent color
- Mobile-first, simple UI
- Card-based layouts
- Professional but not over-designed

---

## Pages

### 1. Browse Page (`/`)

Simplified version of Garage's browse page with filters and listings.

#### Layout

**Mobile:** 
- Filter button that opens a slide-out drawer
- Single-column listing grid

**Desktop:**
- Left sidebar with filters (collapsible)
- Main content area with listings grid (2-3 columns)

#### Filter Sidebar

Filters to include:

| Filter | Input Type | Options/Range |
|--------|-----------|---------------|
| Category | Dropdown | Fire Apparatus, Ambulances, Rescue Trucks, Tankers |
| Listing Type | Radio/Pills | All, Buy Now, Auction |
| Price | Min/Max inputs | $0 - $350,000+ |
| Year | Min/Max inputs | 1990 - 2025 |
| Mileage | Min/Max inputs | 0 - 200,000+ |
| Manufacturer | Multi-select/Searchable | Pierce, E-One, Seagrave, Spartan, KME, Ferrara, Rosenbauer, Sutphen, Smeal, HME, Freightliner, International |
| Pump Size | Min input | 0 - 2,000+ GPM |
| Tank Size | Min input | 0 - 3,000+ gallons |
| State | Dropdown | All 50 US states |

#### Main Content Area

- **Results count:** "X listings match your filters"
- **Sort dropdown:** Relevance, Price (low→high), Price (high→low), Most recent
- **"Save This Search" button:** Prominent, orange, appears when any filter is active
- **Listing cards grid**

#### Listing Card Component

Each card displays:
- Image (placeholder/mock image)
- Title: "[Year] [Manufacturer] [Type]" (e.g., "2012 Pierce Pumper")
- Price (formatted with $ and commas)
- Key specs in a row: GPM | Tank size | Mileage
- Location: "City, State"
- Listing type badge if auction

Cards are clickable but can link to "#" or show a "Coming soon" toast - detail page is out of scope.

---

### 2. Saved Searches Dashboard (`/saved-searches`)

#### Layout

**Header:**
- Page title: "Your Saved Searches"
- "Create New Search" button (orange)

**Content:**
- List of saved search cards (single column, full width)
- Empty state when no saved searches exist

#### Saved Search Card Component

Each card displays:
- **Search name** (user-defined, prominent)
- **Status badge:** Active (green) / Paused (gray)
- **Filter summary:** Condensed view of criteria (e.g., "Pumper · $50k-$120k · 1,250+ GPM · Pierce, E-One · Texas")
- **Match info:** "X current matches" (clickable, links to browse with filters applied)
- **Last match:** "2 days ago" or "No matches yet"
- **Notification setting:** Icon + "Daily digest → email@example.com"
- **Action buttons:** View Matches, Edit, Pause/Resume, Delete

#### Empty State

- Illustration or icon (optional)
- Text: "No saved searches yet"
- Subtext: "Save a search to get notified when new listings match your criteria"
- CTA button: "Browse Listings" (links to /)

---

## Components

### SaveSearchModal

Triggered by:
- "Save This Search" button on browse page
- "Create New Search" button on dashboard
- "Edit" button on a saved search card

#### Contents

- **Title:** "Save This Search" or "Edit Saved Search"
- **Filter summary:** Read-only display of current/saved criteria
- **Search name input:** Text field, placeholder "e.g., Engine for Station 2"
- **Email input:** Email field with validation
- **Notification frequency:** Radio group
  - Instantly (as soon as listed)
  - Daily digest (morning summary)
  - Weekly digest (Monday morning)
- **Action buttons:** Cancel (secondary), Save Search (primary, orange)

#### Behavior

- On save: 
  - Validate required fields (name, email)
  - Save to LocalStorage
  - Show success toast
  - Close modal
  - If on browse page, briefly change button to "Search Saved ✓"

---

### EmailPreview

Static component showing what a notification email would look like.

#### Display Location

- On dashboard, perhaps as an expandable section or info tooltip
- Or as a separate "Preview Email" button/modal

#### Contents

```
[Garage Logo]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

New match for "[Search Name]"

┌─────────────────────────────┐
│ [Listing Image]             │
│                             │
│ 2012 Pierce Arrow XT Pumper │
│ $87,500 · Mason City, IA    │
│                             │
│ ✓ 1,500 GPM pump            │
│ ✓ 1,000 gallon tank         │
│ ✓ 28,000 miles              │
│                             │
│ Listed 2 hours ago          │
│                             │
│    [ View Listing → ]       │
└─────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're receiving this because you saved 
a search on Garage.

Manage searches · Unsubscribe
```

---

### Header/Navigation

Simple header with:
- Garage logo (left)
- Nav links: Browse, Saved Searches
- Mock logged-in state: "Chief Johnson" or user icon (right)

---

### SimulateNewListingButton

Developer/demo helper component.

#### Appearance
- Small button, perhaps in header or floating corner
- Text: "Simulate New Listing" or just "+ Add Listing"
- Styled subtly (not prominent)

#### Behavior
1. Adds a new mock listing to the data that matches at least one saved search
2. Shows toast: "New listing added! Matches '[Search Name]'"
3. If on dashboard, match count updates

---

## Data Models

### Listing

```typescript
interface Listing {
  id: string;
  title: string;           // "2012 Pierce Arrow XT Pumper"
  year: number;
  manufacturer: string;
  category: string;        // "Fire Apparatus", "Ambulances", etc.
  type: string;            // "Pumper", "Tanker", "Aerial", "Rescue"
  price: number;
  mileage: number;
  pumpGPM: number | null;
  tankGallons: number | null;
  city: string;
  state: string;
  imageUrl: string;
  listingType: 'buy_now' | 'auction';
  createdAt: string;       // ISO date string
}
```

### SavedSearch

```typescript
interface SavedSearch {
  id: string;
  name: string;
  email: string;
  frequency: 'instant' | 'daily' | 'weekly';
  status: 'active' | 'paused';
  createdAt: string;       // ISO date string
  filters: SearchFilters;
}

interface SearchFilters {
  category?: string;
  listingType?: 'all' | 'buy_now' | 'auction';
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  manufacturers?: string[];
  pumpSizeMin?: number;
  tankSizeMin?: number;
  state?: string;
}
```

---

## Mock Data

### Listings (15-20 total)

Create realistic variety:

| Field | Range/Options |
|-------|---------------|
| Category | Fire Apparatus (70%), Ambulances (20%), Rescue (10%) |
| Type | Pumper, Tanker, Aerial, Rescue, Ambulance |
| Year | 1998 - 2022 |
| Price | $25,000 - $300,000 |
| Mileage | 8,000 - 150,000 |
| Manufacturer | Mix from the list above |
| Pump GPM | 500 - 2,000 (null for ambulances) |
| Tank Gallons | 300 - 3,000 |
| States | Mix of 8-10 different states |
| Listing Type | 80% buy_now, 20% auction |

Include at least:
- 3-4 pumpers in different price ranges
- 2-3 tankers
- 2 aerials (higher priced)
- 2-3 ambulances
- 2 rescue trucks
- Mix of low and high mileage
- Mix of older (good deals) and newer (premium)

### Placeholder Image

Use a single placeholder image URL or generate colored rectangles with text. Could use:
- `https://placehold.co/400x300/f5f5f5/666?text=Fire+Apparatus`
- Or inline SVG placeholders

---

## Matching Logic

A listing matches a saved search if it meets **ALL** specified criteria (AND logic):

```typescript
function listingMatchesSearch(listing: Listing, filters: SearchFilters): boolean {
  if (filters.category && listing.category !== filters.category) return false;
  if (filters.listingType && filters.listingType !== 'all' && listing.listingType !== filters.listingType) return false;
  if (filters.priceMin && listing.price < filters.priceMin) return false;
  if (filters.priceMax && listing.price > filters.priceMax) return false;
  if (filters.yearMin && listing.year < filters.yearMin) return false;
  if (filters.yearMax && listing.year > filters.yearMax) return false;
  if (filters.mileageMin && listing.mileage < filters.mileageMin) return false;
  if (filters.mileageMax && listing.mileage > filters.mileageMax) return false;
  if (filters.manufacturers?.length && !filters.manufacturers.includes(listing.manufacturer)) return false;
  if (filters.pumpSizeMin && (listing.pumpGPM === null || listing.pumpGPM < filters.pumpSizeMin)) return false;
  if (filters.tankSizeMin && (listing.tankGallons === null || listing.tankGallons < filters.tankSizeMin)) return false;
  if (filters.state && listing.state !== filters.state) return false;
  
  return true;
}
```

---

## State Management

### Filter State (Browse Page)

- Use URL query parameters for filter state
- Enables shareable URLs and back button support
- Example: `/?category=Fire+Apparatus&priceMax=100000&manufacturers=Pierce,E-One`

### Saved Searches (Persistent)

- Store in LocalStorage under key: `garage-saved-searches`
- Load on app initialization
- Update on any CRUD operation
- Use a custom hook: `useSavedSearches()`

### Mock Listings (Persistent)

- Store in LocalStorage under key: `garage-listings`
- Initialize with default mock data if empty
- "Simulate new listing" adds to this array

---

## User Flows

### Flow 1: Save a Search from Browse Page

1. User navigates to browse page
2. User applies one or more filters
3. "Save This Search" button appears/becomes prominent
4. User clicks button
5. SaveSearchModal opens with filter summary
6. User enters name and email, selects frequency
7. User clicks "Save Search"
8. Toast: "Search saved! We'll notify you at [email]"
9. Modal closes
10. Button briefly shows "Saved ✓" state

### Flow 2: View and Manage Saved Searches

1. User navigates to /saved-searches
2. User sees list of their saved searches
3. User can:
   - Click "View Matches" → navigates to browse with filters in URL
   - Click "Edit" → opens modal with current values populated
   - Click "Pause/Resume" → toggles status
   - Click "Delete" → shows confirmation, then removes

### Flow 3: Create Search from Dashboard

1. User is on /saved-searches
2. User clicks "Create New Search"
3. Modal opens (or user is redirected to browse page)
4. Same flow as Flow 1

### Flow 4: Demo the Alert System

1. User has at least one saved search
2. User clicks "Simulate New Listing" button
3. A new listing is generated/added that matches a saved search
4. Toast: "New listing matches '[Search Name]'!"
5. On dashboard: match count updates, "Last match: just now"

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 768px | Filters in drawer, single-column grid, full-width cards |
| Tablet | 768px - 1024px | Collapsible sidebar, 2-column grid |
| Desktop | > 1024px | Persistent sidebar, 3-column grid |

---

## File Structure

```
/app
  layout.tsx              # Root layout with header
  page.tsx                # Browse page
  /saved-searches
    page.tsx              # Dashboard page
  globals.css             # Global styles + Tailwind

/components
  /ui                     # Generic UI components
    Button.tsx
    Input.tsx
    Select.tsx
    Modal.tsx
    Toast.tsx
    Badge.tsx
  Header.tsx
  FilterSidebar.tsx
  FilterDrawer.tsx        # Mobile filter drawer
  ListingCard.tsx
  ListingGrid.tsx
  SaveSearchButton.tsx
  SaveSearchModal.tsx
  SavedSearchCard.tsx
  EmailPreview.tsx
  SimulateButton.tsx
  EmptyState.tsx

/lib
  types.ts                # TypeScript interfaces
  mockData.ts             # Initial listing data
  constants.ts            # Manufacturers list, states, etc.
  matching.ts             # Filter matching logic
  storage.ts              # LocalStorage helpers
  utils.ts                # Formatting, etc.

/hooks
  useSavedSearches.ts     # CRUD for saved searches
  useListings.ts          # Listings with localStorage
  useFilters.ts           # URL-based filter state
  useToast.ts             # Toast notifications
```

---

## Out of Scope

- Real user authentication
- Real backend / database / API
- Real email sending
- Listing detail pages (links can be non-functional)
- Image upload
- Real Garage API integration
- Payment or checkout flows

---

## Success Criteria

The demo should:

1. **Look professional** - Clean, matches Garage's aesthetic
2. **Work on mobile** - Responsive, touch-friendly
3. **Tell a story** - Can walk someone through the user flow
4. **Show product thinking** - Solves a real gap in their current feature set
5. **Demonstrate engineering basics** - Clean code, TypeScript, proper state management