import type { Metadata } from "next";
import Link from "next/link";
import { places } from "../places-data";

export const metadata: Metadata = {
  title: "Places to go in Tulsa — Nook & Roam",
  description: "Dependable Tulsa-area places for family days that do not need a special event on the calendar.",
};

export default function PlacesPage() {
  return (
    <main className="places-page">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Nook and Roam home">
          nook <em>&amp; roam</em>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/#events">Events</Link>
          <Link href="/places" aria-current="page">Places to go</Link>
        </nav>
      </header>

      <section className="places-page-hero" aria-labelledby="places-page-title">
        <div>
          <p className="eyebrow">For the days without a plan</p>
          <h1 id="places-page-title">Dependable places,<br /><em>ready when you are.</em></h1>
        </div>
        <div className="places-page-intro">
          <p>
            These Tulsa-area favorites work even when a scheduled event does not. Start with the practical fit, then use the official link for current hours, admission, and visitor details.
          </p>
          <Link href="/#events">Browse current events <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="places-directory" aria-label="Tulsa places to go">
        {places.map((place, index) => (
          <article className="place-directory-card" key={place.name}>
            <div className={`place-directory-art place-art-${(index % 3) + 1}`} aria-hidden="true">
              <span>{place.icon}</span>
              <i />
            </div>
            <div className="place-directory-body">
              <p className="place-directory-detail">{place.detail}</p>
              <h2>{place.name}</h2>
              <p>{place.description}</p>
              <div className="place-directory-footer">
                <span>{place.planningNote}</span>
                <a href={place.url} target="_blank" rel="noreferrer">
                  Visit official site <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>

      <footer>
        <Link className="wordmark footer-wordmark" href="/">nook <em>&amp; roam</em></Link>
        <p>Less searching. More going.</p>
        <p className="prototype-note">Tulsa place details can change · Confirm current information on the linked official site.</p>
      </footer>
    </main>
  );
}
