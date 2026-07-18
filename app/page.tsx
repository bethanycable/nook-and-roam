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
  driveMinutes: number;
  note: string;
  art: string;
  badge: string;
};

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
    driveMinutes: 8,
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
    driveMinutes: 10,
    note: "A relaxed, all-ages student music showcase with used sheet music to browse; admission is free and donations are encouraged.",
    art: "art-music",
    badge: "Easy drop-in",
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
    driveMinutes: 11,
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
    driveMinutes: 11,
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
    driveMinutes: 12,
    note: "A short family storytime with simple songs and books for little ones plus interactive stories and activities for older preschoolers.",
    art: "art-library",
    badge: "Rainy-day ready",
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
    driveMinutes: 11,
    note: "A compact weekly storytime geared toward kids 10 and under, with the museum and gardens available for a longer outing afterward.",
    art: "art-library",
    badge: "Registration link ready",
  },
];

const ageOptions = [
  { value: "all", label: "All ages", min: 0, max: 18 },
  { value: "baby", label: "Baby & toddler", min: 0, max: 3 },
  { value: "little", label: "Ages 2–6", min: 2, max: 6 },
  { value: "big", label: "Ages 7–12", min: 7, max: 12 },
  { value: "teen", label: "Teens", min: 13, max: 18 },
];

export default function Home() {
  const [zipInput, setZipInput] = useState("74103");
  const [locationLabel, setLocationLabel] = useState("74103 · Tulsa");
  const [locationError, setLocationError] = useState("");
  const [driveOffset, setDriveOffset] = useState(0);
  const [datePreset, setDatePreset] = useState<"weekend" | "today" | "weekday">("weekend");
  const [age, setAge] = useState("little");
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
      return (
        event.dayGroups.includes(datePreset) &&
        overlapsAge &&
        (!freeOnly || event.isFree) &&
        (!indoorOnly || event.setting === "Indoor") &&
        (!strollerOnly || event.stroller) &&
        (!dropInOnly || event.registration === "Drop-in") &&
        (!showSaved || favorites.includes(event.id))
      );
    });
  }, [age, datePreset, dropInOnly, favorites, freeOnly, indoorOnly, showSaved, strollerOnly]);

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 3);

  function submitLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = zipInput.trim();
    if (!/^\d{5}$/.test(normalized)) {
      setLocationError("Enter a five-digit ZIP code.");
      return;
    }
    setLocationError("");
    setLocationLabel(`${normalized} · nearby`);
    setDriveOffset((Number(normalized.at(-1)) % 5) - 2);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError("Location is not available here. Try a ZIP code instead.");
      return;
    }
    setLocationError("Finding your general area…");
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationLabel("Your current area");
        setLocationError("Location found. Exact coordinates stay on this device in this prototype.");
        setDriveOffset(2);
      },
      () => setLocationError("We couldn't access your location. A ZIP code works just as well."),
      { enableHighAccuracy: false, timeout: 6000 },
    );
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
    setDatePreset("weekend");
    setAge("little");
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
          <button className="location-target" type="button" onClick={useCurrentLocation} aria-label="Use my current location">
            <span aria-hidden="true">⌾</span>
          </button>
          <div>
            <span className="field-label" id="finder-title">Starting near</span>
            <strong>{locationLabel}</strong>
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
          <span className="drive-limit">Showing ideas within about a 30-minute drive.</span>
          <button className="primary-button" type="submit">Update area</button>
        </form>
      </section>
      {locationError && <p className="location-message" role="status">{locationError}</p>}

      <section className="filter-section" aria-label="Event filters">
        <div className="quick-filters">
          {([
            ["weekend", "This weekend"],
            ["today", "Today"],
            ["weekday", "During the week"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              className="filter-chip date-chip"
              data-active={datePreset === value}
              aria-pressed={datePreset === value}
              type="button"
              onClick={() => {
                setDatePreset(value);
                setShowAll(false);
              }}
            >
              {label}
            </button>
          ))}
          <label className="filter-select">
            <span className="sr-only">Choose an age group</span>
            <select value={age} onChange={(event) => setAge(event.target.value)}>
              {ageOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <button className="filter-chip" data-active={freeOnly} aria-pressed={freeOnly} type="button" onClick={() => setFreeOnly((value) => !value)}>Free</button>
          <button className="filter-chip" data-active={indoorOnly} aria-pressed={indoorOnly} type="button" onClick={() => setIndoorOnly((value) => !value)}>Indoor</button>
          <button className="all-filters" type="button" onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters}>
            {showFilters ? "Fewer filters" : "All filters"}
          </button>
        </div>
        {showFilters && (
          <div className="advanced-filters">
            <label><input type="checkbox" checked={strollerOnly} onChange={(event) => setStrollerOnly(event.target.checked)} /> Stroller friendly</label>
            <label><input type="checkbox" checked={dropInOnly} onChange={(event) => setDropInOnly(event.target.checked)} /> No registration needed</label>
            <button type="button" onClick={() => {
              setFreeOnly(false);
              setIndoorOnly(false);
              setStrollerOnly(false);
              setDropInOnly(false);
              setAge("all");
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
            <span>{filteredEvents.length} {filteredEvents.length === 1 ? "match" : "matches"} · Tulsa examples</span>
            {showSaved && <button type="button" onClick={() => setShowSaved(false)}>Show all events</button>}
          </div>
        </div>

        {displayedEvents.length > 0 ? (
          <div className="event-grid">
            {displayedEvents.map((event) => {
              const isFavorite = favorites.includes(event.id);
              const driveTime = Math.max(5, event.driveMinutes + driveOffset);
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
                      <span>From {locationLabel.split(" · ")[0]}</span>
                      <strong>{driveTime} min drive</strong>
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
            <h3>No perfect matches yet.</h3>
            <p>Try removing a filter—or skip the schedule and choose a reliable place below.</p>
            <button type="button" onClick={() => {
              setFreeOnly(false);
              setIndoorOnly(false);
              setStrollerOnly(false);
              setDropInOnly(false);
              setAge("all");
              setShowSaved(false);
            }}>Show me more options</button>
          </div>
        )}

        {!showAll && filteredEvents.length > 3 && (
          <button className="show-more" type="button" onClick={() => setShowAll(true)}>
            Show {filteredEvents.length - 3} more ideas
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
              <div><dt>From your area</dt><dd>{Math.max(5, selectedEvent.driveMinutes + driveOffset)} min drive</dd></div>
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
