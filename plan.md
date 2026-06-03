# Implementation Plan - Algerian Marketplace Frontend (Phase 5: Product Detail & API Integration)

Extend the existing marketplace with high-fidelity product detail views and specialized individual item fetching logic, simulating a production-grade backend with Redis caching.

## Scope Summary
- **Backend Simulation**: Implement `GET /api/v1/listings/:id` with Redis-first caching strategy.
- **Frontend Detail Screen**: Create a web-optimized version of the requested "AliProductScreen" with interactive variant selection.
- **Rich Data Schema**: Update `Listing` schema to support ratings, reviews, sold counts, and variant options (colors/sizes).
- **Navigation**: Implement a view state in `App.tsx` to toggle between Feed and Product Detail.

## Affected Areas
- `src/lib/schema.ts`: Extend schema for rich product attributes.
- `src/lib/mock-api.ts`: Add individual listing fetching and cache population.
- `src/components/AliProductScreen.tsx`: New component (Web/Tailwind version of the mobile UI).
- `src/App.tsx`: Add routing logic for individual products.

## Ordered Phases

### Phase 1: Schema & Mock API Enhancement
- Update `Listing` interface in `src/lib/schema.ts` with `oldPrice`, `rating`, `reviewsCount`, `soldCount`, `colors`, and `sizes`.
- Update `INITIAL_LISTINGS` in `src/lib/mock-api.ts` with rich data.
- Implement `mockApi.getListingById(id)`:
    - Check "Redis" (session Map) first.
    - If miss, check "Postgres" (LocalStorage).
    - If hit in DB, save back to "Redis" for 1 hour simulation.

### Phase 2: Product Detail UI Implementation (Web Translation)
- Build `AliProductScreen` using Tailwind CSS (Mobile-First).
- Maintain the visual identity from the user's RN request (Emerald Green, Midnight Black, Titanium Gold accents).
- Implement interactive state for color and size selection.
- Add "Trust Badges" for Algerian delivery (58 Wilayas) and Payment on Delivery.

### Phase 3: Integration & Navigation
- Update `App.tsx` to handle a `selectedListingId` state.
- Connect `ListingCard` click event to navigate to the detail view.
- Ensure the detail view fetches fresh data on mount.

### Phase 4: Polish & Performance Indicators
- Add skeleton loaders for the product detail view.
- Include "Cache Hit" vs "Database Pull" visual cues for the single item fetch.
- Final validation against the user's design requirements.
