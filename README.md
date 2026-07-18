# Nook & Roam

Nook & Roam is a warm, location-aware discovery experience for parents and families who are tired of checking venue calendars, social feeds, search results, and recommendation threads just to plan one afternoon.

The prototype turns scattered event information into a concise shortlist that answers the practical questions first: Is it free? Indoors or outdoors? Do we need to register? Is it stroller friendly? Which ages will enjoy it? How long is the drive from our general area? When registration is required, the event card and detail view link directly to the organizer's registration form.

## What the prototype does

- Demonstrates location-aware event cards with sourced Tulsa-area examples, a ZIP code, or a browser-provided general location.
- Filters by timing, age group, cost, indoor setting, stroller access, and registration requirements.
- Distinguishes drop-in events from registration-required events and provides direct registration links.
- Estimates drive time from the selected general area.
- Saves promising ideas on the device for later.
- Explains why each event may fit a family instead of repeating promotional copy.
- Falls back to dependable places to visit when no scheduled event feels right.
- Links every Tulsa example to an official organizer page and labels the prototype boundary honestly.

## Product principles

1. **Practical before promotional.** Logistics should be visible before a parent opens a detail view.
2. **A short list beats an endless feed.** The interface starts with three strong matches.
3. **Location can be useful without being invasive.** The prototype keeps exact coordinates on-device and accepts a generalized ZIP code.
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

## Deliberate prototype boundaries

- Event discovery currently uses a small demo dataset rather than an unrestricted web crawler.
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
