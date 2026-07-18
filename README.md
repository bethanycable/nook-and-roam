# Nook & Roam

Nook & Roam is a warm, location-aware discovery experience for parents and families who are tired of checking venue calendars, social feeds, search results, and recommendation threads just to plan one afternoon.

The prototype turns scattered event information into a concise shortlist that answers the practical questions first: Is it free? Indoors or outdoors? Do we need to register? Is it stroller friendly? Which ages will enjoy it? How long is the drive from our general area? When registration is required, the event card and detail view link directly to the organizer's registration form.

## Built with

- **React 19 and TypeScript** for the interface and interaction model.
- **Next.js 16**, compiled through **Vinext and Vite** for a Cloudflare Workers-compatible deployment.
- **CSS** for the responsive visual system, with no component-library dependency.
- Browser **Geolocation**, a postal-code centroid lookup, and **localStorage** for optional nearby discovery and device-local saved events.
- **No application backend in the submission prototype.** The production path is a JavaScript/TypeScript API, a relational database, and scheduled source-ingestion jobs; D1 and Drizzle ORM are already available in the project for that next step.

## What the prototype does

- Filters sourced Tulsa-area examples by a real 5, 10, or 20-mile radius from a ZIP centroid or an opt-in browser location.
- Filters by timing, age group, cost, indoor setting, stroller access, and registration requirements.
- Distinguishes drop-in events from registration-required events and provides direct registration links.
- Shows straight-line distance to each venue and a clearly labeled drive-time estimate from the selected area.
- Saves promising ideas on the device for later.
- Explains why each event may fit a family instead of repeating promotional copy.
- Falls back to dependable places to visit when no scheduled event feels right.
- Provides a dedicated places directory with links to each venue’s official visitor page.
- Links every Tulsa example to an official organizer page and labels the prototype boundary honestly.

## Product principles

1. **Practical before promotional.** Logistics should be visible before a parent opens a detail view.
2. **A short list beats an endless feed.** The interface starts with six strong matches and lets the family reveal the rest.
3. **Location can be useful without being invasive.** Device coordinates stay in the active browser tab; ZIP lookup sends only a postal code and uses its approximate center.
4. **No-match is still a useful result.** Evergreen places provide a graceful fallback.

## How Codex and GPT-5.6 were used

Codex was used throughout the core build to translate a parent-centered problem into the product scope, normalize the event information model, design the responsive interaction system, implement filtering and location behavior, and validate the production build. GPT-5.6 supported the reasoning that separates essential family logistics from noisy source descriptions and shaped the concise “why it fits” summaries.

In a live-data version, GPT-5.6 would enrich and normalize sourced event records into a consistent schema while preserving the original source URL, direct registration URL, retrieval time, and confidence for human review. It would never invent a missing accessibility, price, or registration fact; unknown information would remain visibly unknown.

## Live-data roadmap

The hackathon prototype uses a small, manually verified set of Tulsa-area listings so the core decision experience can be tested safely. Details can change, so the interface retains an official source link for every event. The production ingestion path is:

1. Pull from official municipal, library, park district, museum, venue, and community calendars.
2. Store the source URL and retrieval time with every record.
3. Deduplicate listings by venue, time, title similarity, and source priority.
4. Use GPT-5.6 to extract and normalize price, setting, registration, accessibility, and age guidance.
5. Flag low-confidence or conflicting fields for review instead of guessing.
6. Store normalized events, venues, sources, and registration links in a relational database.
7. Rank results by family preferences, distance, timing, and information completeness.

## How location works in this prototype

- Every sample venue has a latitude and longitude so radius filtering uses real geographic distance rather than changing a label.
- The default Tulsa ZIP, 74103, starts from its approximate geographic center. Other U.S. ZIP codes are resolved through [Zippopotam.us](https://docs.zippopotam.us/docs/getting-started/); only the ZIP code is sent for that lookup.
- “Use my location” runs only after a user clicks it and grants browser permission. The returned coordinates remain in page memory and are not saved to localStorage or sent to the application server.
- Venue distance uses the Haversine formula. Drive time is a transparent city-driving estimate derived from that distance; it is not a route, live traffic result, or promise of arrival time.
- A production version would replace the drive-time estimate with a routing provider while keeping the ZIP fallback and permission-first location choice.

## Deliberate prototype boundaries

- Event discovery currently uses a small demo dataset rather than an unrestricted web crawler.
- The event dataset currently covers Tulsa only. A location outside the pilot area will correctly return no nearby Tulsa matches instead of presenting distant events as local.
- Drive times are approximate and do not include a live road route, traffic, construction, or current conditions.
- Saved events stay on the current device. Production accounts would store user-owned saves and preferences in a database so they work across devices.
- The production ingestion system should prioritize official APIs, feeds, and organizer calendars; respect source terms and crawl limits; retain provenance; and send ambiguous records to review.
- Public sign-in and durable saved events are planned after the submission build so the hackathon demo remains focused on the core family decision experience.

## License

Nook & Roam is available under the [MIT License](LICENSE). It permits reuse and modification while preserving the copyright notice and provides the project owner with a standard limitation of liability.

## Run locally

Requires Node.js 22.13 or later.

```bash
npm install
npm run dev
```

Build and validate:

```bash
npm test
```
