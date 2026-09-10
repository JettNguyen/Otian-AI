// service-api.js: one way to call the Render service from a page.
//
// Every route on archie-4f35.onrender.com takes a JSON POST and answers JSON, and the service runs
// on a free tier that sleeps after inactivity, so every caller needs the same two things: a bound
// on how long one attempt may hang, and a failure it can tell apart from a refusal. This is that
// and nothing else. It knows no route names and no identity, so a page that needs an ID token adds
// one itself (see serviceApi() in account/index.html, which wraps this).
//
// The first request after a sleep can take up to about a minute to wake the service. Callers are
// expected to bound the first attempt tightly, say so on screen, and give a second attempt the room
// the wake-up actually needs, rather than reporting a failure the reader cannot act on.

export const SERVICE_ORIGIN = "https://archie-4f35.onrender.com";

/**
 * POST `body` as JSON and return the parsed answer.
 *
 * Throws an Error carrying `kind`, which is the part callers branch on:
 *   kind "network"  the service could not be reached, or the attempt outran `timeoutMs`
 *   kind "http"     the service answered and refused; `status` is its code, and `message` is what
 *                   it said, so a caller can tell "this route is not deployed" (404), "this is
 *                   switched off" (503) and "this went wrong" apart from each other.
 */
export async function postJson(path, body, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  let r;
  try {
    r = await fetch(SERVICE_ORIGIN + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
      signal: ctrl.signal,
    });
  } catch (err) {
    const e = new Error(err && err.name === "AbortError" ? "timed out reaching the service" : "couldn't reach the service");
    e.kind = "network";
    throw e;
  } finally {
    clearTimeout(timer);
  }
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(data.error || ("HTTP " + r.status));
    e.kind = "http";
    e.status = r.status;
    throw e;
  }
  return data;
}
