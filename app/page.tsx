"use client";

import { FormEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import { places } from "./places-data";

type EventItem = {
  id: number;
  title: string;
  venue: string;
  dateLabel: string;
  dayGroups: Array<"today" | "weekend" | "weekday">;
  time: string;
  cost: string;
  isFree: boolean;
  setting: "Indoor" | "Outdoor";
  registration: "Drop-in" | "Registration required" | "Advance ticket";
  registrationNote?: string;
  registrationUrl?: string;
  sourceUrl: string;
  stroller: boolean;
  ageLabel: string;
  ageMin: number;
  ageMax: number;
  latitude: number;
  longitude: number;
  note: string;
  art: string;
  badge: string;
};

type LocationOrigin = {
  latitude: number;
  longitude: number;
  label: string;
  shortLabel: string;
  source: "zip" | "device";
};

type ZipLookupResponse = {
  places?: Array<{
    latitude?: string;
    longitude?: string;
    "place name"?: string;
    "state abbreviation"?: string;
  }>;
};

type DatePreset = "upcoming" | "weekend" | "today" | "weekday";

const venueLocations = {
  gatheringPlace: { latitude: 36.1196044, longitude: -95.9855622 },
  trinityBaptist: { latitude: 36.1048455, longitude: -96.0118967 },
  philbrook: { latitude: 36.1237809, longitude: -95.9701736 },
  zarrowLibrary: { latitude: 36.089791, longitude: -96.0165672 },
  guthrieGreen: { latitude: 36.1593932, longitude: -95.9921556 },
};

const defaultOrigin: LocationOrigin = {
  latitude: 36.1539,
  longitude: -95.9954,
  label: "74103 · Tulsa, OK",
  shortLabel: "74103",
  source: "zip",
};

function distanceInMiles(origin: LocationOrigin, destination: EventItem) {
  const earthRadiusMiles = 3958.8;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latitudeDifference = toRadians(destination.latitude - origin.latitude);
  const longitudeDifference = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(longitudeDifference / 2) ** 2;

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function estimatedDriveMinutes(distanceMiles: number) {
  return Math.max(5, Math.round(distanceMiles * 2.4 + 4));
}

function formatDistance(distanceMiles: number) {
  return distanceMiles < 0.95 ? "Under 1 mi" : `${distanceMiles.toFixed(1)} mi`;
}

const events: EventItem[] = [
  {
    id: 1,
    title: "Route 66 Festival: Tales of the Mother Road",
    venue: "Gathering Place",
    dateLabel: "SAT, JUL 18",
    dayGroups: ["today", "weekend"],
    time: "9:00 AM–7:00 PM",
    cost: "Free",
    isFree: true,
    setting: "Outdoor",
    registration: "Registration required",
    registrationNote: "Gathering Place asks families to claim a free festival ticket before arriving.",
    registrationUrl: "https://www.eventbrite.com/e/gathering-place-presents-route-66-festival-tales-of-the-mother-road-tickets-1989843081221",
    sourceUrl: "https://www.gatheringplace.org/default.aspx?p=218982",
    stroller: true,
    ageLabel: "All ages",
    ageMin: 0,
    ageMax: 18,
    ...venueLocations.gatheringPlace,
    note: "A come-and-go Tulsa celebration with morning youth programs, storytimes, activities, performances, food, and a vendor market.",
    art: "art-garden",
    badge: "Registration link ready",
  },
  {
    id: 2,
    title: "Summer Serenade",
    venue: "Trinity Baptist Church",
    dateLabel: "SAT, JUL 18",
    dayGroups: ["today", "weekend"],
    time: "11:00 AM–3:00 PM",
    cost: "Free",
    isFree: true,
    setting: "Indoor",
    registration: "Drop-in",
    sourceUrl: "https://www.tamta.org/summer-serenade",
    stroller: true,
    ageLabel: "All ages",
    ageMin: 0,
    ageMax: 18,
    ...venueLocations.trinityBaptist,
    note: "A relaxed, all-ages student music showcase with used sheet music to browse; admission is free and donations are encouraged.",
    art: "art-music",
    badge: "Easy drop-in",
  },
  {
    id: 7,
    title: "Oklahoma! + The Dustbowl Radio Hour Preview",
    venue: "Philbrook Museum of Art",
    dateLabel: "SAT, JUL 18",
    dayGroups: ["today", "weekend"],
    time: "12:30–1:30 PM",
    cost: "Included with admission",
    isFree: false,
    setting: "Indoor",
    registration: "Advance ticket",
    registrationNote: "Reserve timed general admission for Saturday. Auditorium seating for the preview is first come, first served.",
    registrationUrl: "https://my.philbrook.org/36669/36686",
    sourceUrl: "https://www.philbrook.org/events/preview-of-tpac-produces-rodgers-hammerstein-s-oklahoma-ft-the-dustbowl-radio-hour-a-new-musical-37122",
    stroller: true,
    ageLabel: "All ages",
    ageMin: 0,
    ageMax: 18,
    ...venueLocations.philbrook,
    note: "A one-hour indoor music preview from the casts of Oklahoma! and The Dustbowl Radio Hour, with time to explore Philbrook before or after.",
    art: "art-music",
    badge: "Indoor music pick",
  },
  {
    id: 3,
    title: "Philbrook Dog Days",
    venue: "Philbrook Museum of Art",
    dateLabel: "SUN, JUL 19",
    dayGroups: ["weekend"],
    time: "9:00 AM–5:00 PM",
    cost: "Included with admission",
    isFree: false,
    setting: "Outdoor",
    registration: "Advance ticket",
    registrationNote: "Choose a timed general-admission entry before your garden visit. Members and children 2 and under are free.",
    registrationUrl: "https://my.philbrook.org/36669/36687",
    sourceUrl: "https://www.philbrook.org/events/philbrook-dog-days-36862",
    stroller: true,
    ageLabel: "All ages",
    ageMin: 0,
    ageMax: 18,
    ...venueLocations.philbrook,
    note: "A flexible garden stroll for families who want to bring a well-behaved, leashed dog; the dog-friendly portion stays outdoors.",
    art: "art-garden",
    badge: "Registration link ready",
  },
  {
    id: 4,
    title: "Little Garden Explorers",
    venue: "Philbrook Museum of Art",
    dateLabel: "WED, JUL 22",
    dayGroups: ["weekday"],
    time: "9:30–11:30 AM",
    cost: "Included with admission",
    isFree: false,
    setting: "Outdoor",
    registration: "Advance ticket",
    registrationNote: "Choose a timed general-admission entry before arriving. Members and children 2 and under are free.",
    registrationUrl: "https://my.philbrook.org/36669/36688",
    sourceUrl: "https://www.philbrook.org/events/little-garden-explorers-36770",
    stroller: true,
    ageLabel: "Best for ages 0–4",
    ageMin: 0,
    ageMax: 4,
    ...venueLocations.philbrook,
    note: "Come-and-go sensory garden play designed for children under 5, with digging, splashing, building, and room to explore at their pace.",
    art: "art-coral",
    badge: "Registration link ready",
  },
  {
    id: 5,
    title: "Build A Reader Storytime: Family",
    venue: "Zarrow Regional Library",
    dateLabel: "WED, JUL 22",
    dayGroups: ["weekday"],
    time: "10:30–11:00 AM",
    cost: "Free",
    isFree: true,
    setting: "Indoor",
    registration: "Drop-in",
    sourceUrl: "https://events.tulsalibrary.org/event/16227317",
    stroller: true,
    ageLabel: "Best for ages 0–5",
    ageMin: 0,
    ageMax: 5,
    ...venueLocations.zarrowLibrary,
    note: "A short family storytime with simple songs and books for little ones plus interactive stories and activities for older preschoolers.",
    art: "art-library",
    badge: "Rainy-day ready",
  },
  {
    id: 8,
    title: "Camp Guthrie: Story Stones",
    venue: "Guthrie Green",
    dateLabel: "WED, JUL 22",
    dayGroups: ["weekday"],
    time: "10:00–11:00 AM",
    cost: "Free",
    isFree: true,
    setting: "Outdoor",
    registration: "Registration required",
    registrationNote: "Reserve a free spot through Guthrie Green's event form. Children must stay with an adult.",
    registrationUrl: "https://guthriegreeneventscalendar.eventcalendarapp.com/camp-guthrie-reading",
    sourceUrl: "https://www.guthriegreen.com/camp-guthrie",
    stroller: true,
    ageLabel: "Best for ages 4–12",
    ageMin: 4,
    ageMax: 12,
    ...venueLocations.guthrieGreen,
    note: "A free literacy session where kids paint characters, objects, or scenes on smooth stones and use them to build a story.",
    art: "art-coral",
    badge: "Free registration",
  },
  {
    id: 6,
    title: "Storytime at Philbrook",
    venue: "Philbrook Museum of Art",
    dateLabel: "THU, JUL 23",
    dayGroups: ["weekday"],
    time: "10:00–10:30 AM",
    cost: "Included with admission",
    isFree: false,
    setting: "Outdoor",
    registration: "Advance ticket",
    registrationNote: "Choose a timed general-admission entry before arriving. The program may move indoors if the weather changes.",
    registrationUrl: "https://my.philbrook.org/36669/36689",
    sourceUrl: "https://www.philbrook.org/events/storytime-at-philbrook-36795",
    stroller: true,
    ageLabel: "Best for ages 0–10",
    ageMin: 0,
    ageMax: 10,
    ...venueLocations.philbrook,
    note: "A compact weekly storytime geared toward kids 10 and under, with the museum and gardens available for a longer outing afterward.",
    art: "art-library",
    badge: "Registration link ready",
  },
  {
    id: 9,
    title: "Fish Feeding at Philbrook",
    venue: "Philbrook Museum of Art",
    dateLabel: "THU, JUL 23",
    dayGroups: ["weekday"],
    time: "10:30–10:45 AM",
    cost: "Included with admission",
    isFree: false,
    setting: "Outdoor",
    registration: "Advance ticket",
    registrationNote: "Choose timed general admission for Thursday. The outdoor feeding may be canceled for inclement weather.",
    registrationUrl: "https://my.philbrook.org/36669/36689",
    sourceUrl: "https://www.philbrook.org/events/fish-feeding-36817",
    stroller: true,
    ageLabel: "All ages",
    ageMin: 0,
    ageMax: 18,
    ...venueLocations.philbrook,
    note: "A quick look at Philbrook's koi during feeding time that pairs naturally with Storytime, the gardens, or a museum visit.",
    art: "art-garden",
    badge: "Quick add-on",
  },
];

const eventPreviewLimit = 6;

const ageOptions = [
  { value: "all", label: "All ages", min: 0, max: 18 },
  { value: "baby", label: "Baby & toddler", min: 0, max: 3 },
  { value: "little", label: "Ages 2–6", min: 2, max: 6 },
  { value: "big", label: "Ages 7–12", min: 7, max: 12 },
  { value: "teen", label: "Teens", min: 13, max: 18 },
];

export default function Home() {
  const [zipInput, setZipInput] = useState("74103");
  const [origin, setOrigin] = useState<LocationOrigin>(defaultOrigin);
  const [radiusMiles, setRadiusMiles] = useState(5);
  const [locationError, setLocationError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>("upcoming");
  const [age, setAge] = useState("little");
  const [maxDriveMinutes, setMaxDriveMinutes] = useState(30);
  const [freeOnly, setFreeOnly] = useState(false);
  const [indoorOnly, setIndoorOnly] = useState(false);
  const [strollerOnly, setStrollerOnly] = useState(false);
  const [dropInOnly, setDropInOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("nook-and-roam-favorites-v2");
    if (!saved) return;
    const loadSaved = window.setTimeout(() => {
      try {
        setFavorites(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem("nook-and-roam-favorites-v2");
      }
    }, 0);
    return () => window.clearTimeout(loadSaved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("nook-and-roam-favorites-v2", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (!selectedEvent) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedEvent(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedEvent]);

  const filteredEvents = useMemo(() => {
    const selectedAge = ageOptions.find((option) => option.value === age) ?? ageOptions[0];
    return events.filter((event) => {
      const overlapsAge = event.ageMin <= selectedAge.max && event.ageMax >= selectedAge.min;
      const distanceMiles = distanceInMiles(origin, event);
      return (
        (datePreset === "upcoming" || event.dayGroups.includes(datePreset)) &&
        distanceMiles <= radiusMiles &&
        estimatedDriveMinutes(distanceMiles) <= maxDriveMinutes &&
        overlapsAge &&
        (!freeOnly || event.isFree) &&
        (!indoorOnly || event.setting === "Indoor") &&
        (!strollerOnly || event.stroller) &&
        (!dropInOnly || event.registration === "Drop-in") &&
        (!showSaved || favorites.includes(event.id))
      );
    });
  }, [age, datePreset, dropInOnly, favorites, freeOnly, indoorOnly, maxDriveMinutes, origin, radiusMiles, showSaved, strollerOnly]);

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, eventPreviewLimit);

  async function submitLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = zipInput.trim();
    if (!/^\d{5}$/.test(normalized)) {
      setLocationError("Enter a five-digit ZIP code.");
      return;
    }
    setIsLocating(true);
    setLocationError("Looking up the approximate center of that ZIP…");
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${normalized}`);
      if (!response.ok) throw new Error("ZIP not found");
      const data = (await response.json()) as ZipLookupResponse;
      const place = data.places?.[0];
      const latitude = Number(place?.latitude);
      const longitude = Number(place?.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error("ZIP has no coordinates");

      const placeName = place?.["place name"] ?? "nearby";
      const state = place?.["state abbreviation"];
      setOrigin({
        latitude,
        longitude,
        label: `${normalized} · ${placeName}${state ? `, ${state}` : ""}`,
        shortLabel: normalized,
        source: "zip",
      });
      setLocationError("ZIP updated. Distances use the approximate center of that ZIP area.");
      setShowAll(false);
    } catch {
      setLocationError("We couldn't find that ZIP code. Check it and try again.");
    } finally {
      setIsLocating(false);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError("Location is not available here. Try a ZIP code instead.");
      return;
    }
    setIsLocating(true);
    setLocationError("Waiting for your browser's location permission…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: "Your current location",
          shortLabel: "your location",
          source: "device",
        });
        setLocationError("Location found. Distance calculations stay in this browser tab.");
        setIsLocating(false);
        setShowAll(false);
      },
      () => {
        setLocationError("We couldn't access your location. A ZIP code works just as well.");
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 6000 },
    );
  }

  function useTulsaDemoArea() {
    setOrigin(defaultOrigin);
    setZipInput("74103");
    setRadiusMiles(5);
    setLocationError("Tulsa demo area restored.");
    setShowAll(false);
  }

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favorite) => favorite !== id) : [...current, id],
    );
  }

  function closeModal(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) setSelectedEvent(null);
  }

  function resetEventView() {
    setDatePreset("upcoming");
    setAge("little");
    setMaxDriveMinutes(30);
    setFreeOnly(false);
    setIndoorOnly(false);
    setStrollerOnly(false);
    setDropInOnly(false);
    setShowFilters(false);
    setShowAll(false);
    setShowSaved(false);
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Nook and Roam home" onClick={resetEventView}>
          nook <em>&amp; roam</em>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#events" onClick={resetEventView}>Events</a>
          <a href="/places">Places to go</a>
          <button className="saved-button" type="button" aria-pressed={showSaved} onClick={() => setShowSaved((value) => !value)}>
            <span aria-hidden="true">♡</span> Saved {favorites.length > 0 && `(${favorites.length})`}
          </button>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Good plans, without the research spiral</p>
          <h1>
            Your weekend,<br />
            <em>sorted.</em>
          </h1>
        </div>
        <div className="hero-aside">
          <span className="sun-dot" aria-hidden="true" />
          <p>
            A thoughtful short list of nearby things to do—with the family details you actually need.
          </p>
        </div>
      </section>

      <section className="finder" aria-labelledby="finder-title">
        <div className="location-field">
          <button className="location-target" type="button" onClick={useCurrentLocation} aria-label="Use my current location" disabled={isLocating}>
            <span aria-hidden="true">⌾</span>
          </button>
          <div>
            <span className="field-label" id="finder-title">Starting near</span>
            <strong>{origin.label}</strong>
          </div>
        </div>
        <form onSubmit={submitLocation} className="zip-form">
          <label className="zip-control" htmlFor="zip">
            <span className="field-label">Change ZIP</span>
            <input
              id="zip"
              inputMode="numeric"
              maxLength={5}
              value={zipInput}
              onChange={(event) => setZipInput(event.target.value)}
              placeholder="ZIP code"
            />
          </label>
          <label className="radius-control" htmlFor="radius">
            <span className="field-label">Search radius</span>
            <select
              id="radius"
              value={radiusMiles}
              onChange={(event) => {
                setRadiusMiles(Number(event.target.value));
                setShowAll(false);
              }}
            >
              <option value={5}>Within 5 miles</option>
              <option value={10}>Within 10 miles</option>
              <option value={20}>Within 20 miles</option>
            </select>
          </label>
          <span className="drive-limit">Straight-line distance is calculated to the venue; drive time is an estimate, not live traffic.</span>
          <button className="primary-button" type="submit" disabled={isLocating}>
            {isLocating ? "Updating…" : "Update area"}
          </button>
        </form>
      </section>
      {locationError && <p className="location-message" role="status">{locationError}</p>}
      <p className="location-privacy">
        <strong>Private by default.</strong> Device coordinates are used only in this browser tab and are never saved. ZIP lookups send only the ZIP—not an exact address—to a postal-code service.
      </p>

      <section className="filter-section" aria-label="Event filters">
        <div className="quick-filters">
          <label className="filter-select">
            <span className="filter-control-label">When</span>
            <select
              aria-label="When"
              value={datePreset}
              onChange={(event) => {
                setDatePreset(event.target.value as DatePreset);
                setShowAll(false);
              }}
            >
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="weekend">This weekend</option>
              <option value="weekday">During the week</option>
            </select>
          </label>
          <label className="filter-select">
            <span className="filter-control-label">Age</span>
            <select
              aria-label="Age group"
              value={age}
              onChange={(event) => {
                setAge(event.target.value);
                setShowAll(false);
              }}
            >
              {ageOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="filter-select drive-filter">
            <span className="filter-control-label">Estimated drive</span>
            <select
              aria-label="Estimated drive time"
              value={maxDriveMinutes}
              onChange={(event) => {
                setMaxDriveMinutes(Number(event.target.value));
                setShowAll(false);
              }}
            >
              <option value={10}>Up to 10 minutes</option>
              <option value={15}>Up to 15 minutes</option>
              <option value={30}>Up to 30 minutes</option>
            </select>
          </label>
          <button className="all-filters" type="button" onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters}>
            {showFilters ? "Fewer filters" : "More filters"}
          </button>
        </div>
        {showFilters && (
          <div className="advanced-filters">
            <span className="advanced-label">Fine-tune</span>
            <label><input type="checkbox" checked={freeOnly} onChange={(event) => setFreeOnly(event.target.checked)} /> Free only</label>
            <label><input type="checkbox" checked={indoorOnly} onChange={(event) => setIndoorOnly(event.target.checked)} /> Indoor only</label>
            <label><input type="checkbox" checked={strollerOnly} onChange={(event) => setStrollerOnly(event.target.checked)} /> Stroller friendly</label>
            <label><input type="checkbox" checked={dropInOnly} onChange={(event) => setDropInOnly(event.target.checked)} /> No registration needed</label>
            <button type="button" onClick={() => {
              setFreeOnly(false);
              setIndoorOnly(false);
              setStrollerOnly(false);
              setDropInOnly(false);
            }}>Clear extras</button>
          </div>
        )}
      </section>

      <section className="events-section" id="events" aria-labelledby="events-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Curated for your filters</p>
            <h2 id="events-title">A few good ideas for your family</h2>
          </div>
          <div className="results-meta">
            <span>{filteredEvents.length} {filteredEvents.length === 1 ? "match" : "matches"} within {radiusMiles} miles · {events.length} Tulsa examples</span>
            {showSaved && <button type="button" onClick={() => setShowSaved(false)}>Show all events</button>}
          </div>
        </div>

        {displayedEvents.length > 0 ? (
          <div className="event-grid">
            {displayedEvents.map((event) => {
              const isFavorite = favorites.includes(event.id);
              const distanceMiles = distanceInMiles(origin, event);
              const driveTime = estimatedDriveMinutes(distanceMiles);
              return (
                <article className="event-card" key={event.id}>
                  <div className={`event-art ${event.art}`} aria-hidden="true">
                    <span className="event-badge">{event.badge}</span>
                    <button
                      className="heart-button"
                      type="button"
                      aria-label={isFavorite ? `Remove ${event.title} from saved events` : `Save ${event.title}`}
                      aria-pressed={isFavorite}
                      onClick={() => toggleFavorite(event.id)}
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>
                    <span className="shape shape-one" />
                    <span className="shape shape-two" />
                  </div>
                  <div className="event-body">
                    <p className="event-date">{event.dateLabel} · {event.time}</p>
                    <h3>{event.title}</h3>
                    <p className="venue">{event.venue}</p>
                    <div className="detail-grid" aria-label="Event details">
                      <span>{event.cost}</span>
                      <span>{event.setting}</span>
                      <span>{event.registration}</span>
                      <span>{event.stroller ? "Stroller friendly" : "Not stroller friendly"}</span>
                      <span className="age-detail">{event.ageLabel}</span>
                    </div>
                    {event.registrationUrl && (
                      <a
                        className="card-registration"
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>{event.registration}</span>
                        {event.registration === "Advance ticket" ? "Open tickets" : "Open the form"} <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    <div className="card-footer">
                      <span>{formatDistance(distanceMiles)} from {origin.shortLabel}</span>
                      <strong>≈ {driveTime} min drive</strong>
                      <button type="button" onClick={() => setSelectedEvent(event)} aria-label={`See details for ${event.title}`}>See the plan <span aria-hidden="true">→</span></button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">☼</span>
            <h3>No Tulsa matches within {radiusMiles} miles.</h3>
            <p>Expand the radius, remove a filter, or return to the Tulsa demo area. The prototype currently contains Tulsa listings only.</p>
            <div className="empty-actions">
              {radiusMiles < 20 && (
                <button type="button" onClick={() => setRadiusMiles(radiusMiles === 5 ? 10 : 20)}>
                  Search within {radiusMiles === 5 ? 10 : 20} miles
                </button>
              )}
              <button type="button" onClick={useTulsaDemoArea}>Use Tulsa demo area</button>
            </div>
          </div>
        )}

        {!showAll && filteredEvents.length > eventPreviewLimit && (
          <button className="show-more" type="button" onClick={() => setShowAll(true)}>
            Show {filteredEvents.length - eventPreviewLimit} more ideas
          </button>
        )}
      </section>

      <section className="places-section" id="places" aria-labelledby="places-title">
        <div className="places-intro">
          <p className="eyebrow">For spontaneous days</p>
          <h2 id="places-title">Nothing feels right?<br /><em>Try a place instead.</em></h2>
          <p className="places-intro-copy">Dependable family favorites that do not need a special event on the calendar.</p>
          <a className="places-directory-link" href="/places">Browse every place <span aria-hidden="true">→</span></a>
        </div>
        <div className="places-list">
          {places.slice(0, 4).map((place) => (
            <a className="place-card" href={place.url} target="_blank" rel="noreferrer" key={place.name} aria-label={`Visit the official ${place.name} site`}>
              <span className="place-icon" aria-hidden="true">{place.icon}</span>
              <div><h3>{place.name}</h3><p>{place.detail}</p></div>
              <span className="place-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <footer>
        <a className="wordmark footer-wordmark" href="#top">nook <em>&amp; roam</em></a>
        <p>Less searching. More going.</p>
        <p className="prototype-note">OpenAI Build Week prototype · Tulsa examples link to official organizer pages; verify details before leaving.</p>
      </footer>

      {selectedEvent && (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeModal}>
          <section className="event-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" type="button" onClick={() => setSelectedEvent(null)} aria-label="Close event details">×</button>
            <p className="event-date">{selectedEvent.dateLabel} · {selectedEvent.time}</p>
            <h2 id="modal-title">{selectedEvent.title}</h2>
            <p className="modal-venue">{selectedEvent.venue}</p>
            <div className="fit-note">
              <span>Why it fits</span>
              <p>{selectedEvent.note}</p>
            </div>
            <dl>
              <div><dt>Cost</dt><dd>{selectedEvent.cost}</dd></div>
              <div><dt>Setting</dt><dd>{selectedEvent.setting}</dd></div>
              <div>
                <dt>Planning</dt>
                <dd>
                  {selectedEvent.registration}
                  {selectedEvent.registrationNote && <small>{selectedEvent.registrationNote}</small>}
                </dd>
              </div>
              <div><dt>Age fit</dt><dd>{selectedEvent.ageLabel}</dd></div>
              <div><dt>Getting around</dt><dd>{selectedEvent.stroller ? "Stroller friendly" : "Not stroller friendly"}</dd></div>
              <div>
                <dt>From your area</dt>
                <dd>
                  {formatDistance(distanceInMiles(origin, selectedEvent))} · ≈ {estimatedDriveMinutes(distanceInMiles(origin, selectedEvent))} min drive
                  <small>Estimated from distance; live traffic and road conditions are not included.</small>
                </dd>
              </div>
            </dl>
            <div className="modal-actions">
              {selectedEvent.registrationUrl && (
                <a
                  className="primary-button"
                  href={selectedEvent.registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedEvent.registration === "Advance ticket" ? "Go to tickets" : "Go to registration"} <span aria-hidden="true">↗</span>
                </a>
              )}
              <button className="secondary-button" type="button" onClick={() => toggleFavorite(selectedEvent.id)}>
                {favorites.includes(selectedEvent.id) ? "Saved to your list" : "Save this idea"}
              </button>
            </div>
            <div className="source-row">
              <span>
                {selectedEvent.registrationUrl
                  ? selectedEvent.registration === "Advance ticket"
                    ? "Tickets are selected on the organizer's site."
                    : "Registration happens on the organizer's site."
                  : "No advance registration is listed for this event."}
              </span>
              <a href={selectedEvent.sourceUrl} target="_blank" rel="noreferrer">
                View official source <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
