// Does this account have access to Archie, and under what.
//
// **This mirrors `decide_access` in the Archie repo (`crates/archie-core/src/auth.rs`), which is
// the authority.** The app and this site read the same Firestore document, so any place they
// disagree is a page telling somebody the opposite of what the software will do when they open it.
// They did disagree, in three ways, and all three were live:
//
//   1. **`licence` was ignored entirely.** Once a document carries one it is read ALONE; the tier
//      fields are a fallback for documents the backfill has not reached (see docs/TIER-MIGRATION.md
//      in the app repo). Reading only the tier produced the error in both directions: a retired
//      tester (`licence: "none"`, `access_tier: "client"`) was told their plan was active and then
//      walled by the download, and a comped user (`licence: "granted"`, `access_tier: "none"`) was
//      told to start a plan they did not need.
//   2. **Only the scalar `access_tier` was read**, never the `access_tiers` array that replaced it.
//      The scalar is itself the older fallback.
//   3. **Only `"active"` counted as a live subscription.** Stripe also reports `trialing`, and
//      `past_due` while it retries a card that bounced. The app admits all three.
//
// The migration doc has no step for this site, which is how the three drifted. Keeping the logic
// in one module rather than pasted into each page is the cheap half of not letting it happen again.

/** Stripe statuses the app treats as a live subscription. Kept in step with
 *  `SUBSCRIPTION_GRANTS_ACCESS`. `past_due` counts: a renewal that bounced on a Saturday is Stripe
 *  retrying, not a decision to leave, and locking someone out first is the worse way to be wrong. */
export const SUBSCRIPTION_GRANTS_ACCESS = ["active", "trialing", "past_due"];

/** The single licence word a legacy tier set stands for, in the app's priority order. */
function legacyLicence(tiers) {
  if (tiers.includes("admin")) return "staff";
  if (tiers.includes("lifetime")) return "bought";
  if (tiers.includes("subscriber")) return "plan";
  if (tiers.includes("client")) return "granted";
  return "none";
}

/**
 * Decide from a raw `users/{uid}` document.
 *
 * Returns `{ allowed, licence, tiers }`. `licence` is always one of the new words
 * (`staff` / `bought` / `granted` / `plan` / `none`), translated from the old tiers when the
 * document predates the split, so a caller never has to know which vocabulary it got. `tiers` is
 * handed back for the few places that still gate on the old words, such as the billing section
 * that only a `client` sees.
 *
 * `now` is injectable so a test can pin an expiry rather than wait for one.
 */
export function decideAccess(d, now = Date.now()) {
  const data = d || {};
  const status = data.subscription_status || "";
  const tiers =
    Array.isArray(data.access_tiers) && data.access_tiers.length > 0
      ? data.access_tiers
      : [data.access_tier || "none"];
  const licence = data.licence || "";

  if (!licence) {
    const has = (t) => tiers.includes(t);
    const allowed =
      has("admin") ||
      has("lifetime") ||
      has("client") ||
      (has("subscriber") && SUBSCRIPTION_GRANTS_ACCESS.includes(status));
    return { allowed, licence: legacyLicence(tiers), tiers };
  }

  // A granted licence may carry an end date in epoch milliseconds. Absent, null or unparseable all
  // mean "until somebody retires it by hand", which is what every converted account got: inventing
  // an expiry would revoke access on a schedule nobody agreed to.
  const end = Number(data.licence_until);
  const live = !Number.isFinite(end) || now < end;
  const allowed =
    licence === "staff" || licence === "bought"
      ? true
      : licence === "granted"
        ? live
        : licence === "plan"
          ? SUBSCRIPTION_GRANTS_ACCESS.includes(status)
          : false;
  return { allowed, licence, tiers };
}
