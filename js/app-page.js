/**
 * /app/: the page a pairing code lands on when the camera opens it instead of Archie Mobile.
 *
 * The whole of the behavior is choosing which of two panels to show, and the reason it is a file
 * rather than four lines inline is the rest of this comment: what it must not do is more important
 * than what it does.
 *
 * **The fragment is a live secret and is never read out.** `app_pair_url` in the Archie repo's
 * `src-tauri/src/phone.rs` puts two things after the `#`: the AES key that opens this person's
 * sealed mailbox, and a ticket that can be spent once for a token. A browser never sends a fragment
 * to a server, which is what lets that code travel as a picture on a screen without passing through
 * anybody's servers. This script keeps that true by looking at the format marker and nothing else:
 * it does not write the fragment into the page, does not put it in a link, does not store it, and
 * does not send it anywhere. Adding any of those would quietly undo the one property the whole
 * mechanism rests on.
 *
 * It also does not try to hand the code to the app. A deep link would need the app installed to do
 * anything at all, and on the phone where it is not installed it fails in whichever way that
 * browser fails, which is a dead end with no sentence on it. Telling somebody to open the app and
 * press Scan works on both phones and needs nothing to be installed to make sense.
 *
 * **Both panels start hidden and this script reveals one**, rather than one being the default that
 * gets swapped. The two audiences want opposite sentences, and with JavaScript off there is no way
 * to tell which one is reading, so neither is shown a page written for the other. The page then
 * says nothing at all, which is the honest amount to say when you cannot tell who is asking, and
 * the nav and footer still offer the way on.
 */

/** The format marker the desktop writes, matching `PREFIX` in the app's `src/relay/pairing.ts`. */
const PAIRING_PREFIX = "a1.";

const fragment = window.location.hash.replace(/^#/, "").trim();
const panel = document.getElementById(fragment.startsWith(PAIRING_PREFIX) ? "app-paired" : "app-plain");
if (panel) panel.classList.remove("acct-hidden");
