import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Nook & Roam experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Nook &amp; Roam — Your weekend, sorted<\/title>/i);
  assert.match(html, /Your weekend,/);
  assert.match(html, />Events</);
  assert.match(html, /href="\/places">Places to go/);
  assert.match(html, /A few good ideas for your family/);
  assert.match(html, /Route 66 Festival: Tales of the Mother Road/);
  assert.match(html, /74103 · Tulsa/);
  assert.match(html, /Change ZIP/);
  assert.match(html, /Update area/);
  assert.match(html, /Philbrook Dog Days/);
  assert.match(html, /Oklahoma! \+ The Dustbowl Radio Hour Preview/);
  assert.match(html, /9(?:<!--.*?-->|\s)*matches(?:<!--.*?-->|\s)*·(?:<!--.*?-->|\s)*9(?:<!--.*?-->|\s)*Tulsa examples/);
  assert.match(html, /Show(?:<!--.*?-->|\s)*3(?:<!--.*?-->|\s)*more ideas/);
  assert.match(html, /Registration required/);
  assert.match(html, /Open the form/);
  assert.match(html, /Nothing feels right/);
  assert.match(html, /Tulsa examples link to official organizer pages/);
  assert.match(html, /aria-pressed="false"[^>]*><span aria-hidden="true">♡<\/span> Saved/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders the dedicated Tulsa places directory", async () => {
  const response = await render("/places");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Places to go in Tulsa — Nook &amp; Roam/);
  assert.match(html, /Dependable places,/);
  assert.match(html, /Gathering Place/);
  assert.match(html, /Discovery Lab/);
  assert.match(html, /Tulsa Zoo/);
  assert.match(html, /Visit official site/);
  assert.match(html, /https:\/\/www\.discoverylab\.org\/visit/);
});
