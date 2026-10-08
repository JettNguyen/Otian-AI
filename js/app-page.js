/**
 * /app/: the page a code from Archie on the computer lands on when a phone's camera opens it
 * instead of Archie Mobile.
 *
 * Two codes land here. The pairing code carries a key after the `#`; the code for getting the app
 * (`app_download_url` in the Archie repo's `src-tauri/src/phone.rs`, from 0.3.7) carries nothing.
 * The script shows one of two panels, and on a phone it also sends the reader to where the app
 * comes from: an iPhone to the App Store, an Android phone to the APK (2026-10-07, the day Apple
 * approved the iPhone app, at Jett's ask). What it must not do is more important than what it
 * does, and that is the rest of this comment.
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
 * **It takes the fragment out of the address bar once the panel is chosen**, with replaceState, so
 * the key does not sit in this tab's history or in a tab list the browser syncs to the reader's
 * other devices. Nothing is lost by it: the app takes the code from the computer's screen, never
 * from here. The store addresses carry no fragment, and a browser never puts one in a Referer, so
 * leaving for the store sends nothing either.
 *
 * It also does not try to hand the code to the app. A deep link would need the app installed to do
 * anything at all, and on the phone where it is not installed it fails in whichever way that
 * browser fails, which is a dead end with no sentence on it. The store works both ways: on an
 * iPhone that already has the app, the App Store's button says Open.
 *
 * **Both panels start hidden and this script reveals one**, rather than one being the default that
 * gets swapped. The two audiences want opposite sentences, and with JavaScript off there is no way
 * to tell which one is reading, so neither is shown a page written for the other. The page then
 * says nothing at all, which is the honest amount to say when you cannot tell who is asking, and
 * the nav and footer still offer the way on.
 */

/** The format marker the desktop writes, matching `PREFIX` in the app's `src/relay/pairing.ts`. */
const PAIRING_PREFIX = "a1.";

/** Where each phone gets the app. The same two addresses as archie/install/ and archie/mobile/. */
const STORE = {
  ios: "https://apps.apple.com/app/archie-mobile/id6810899666",
  android: "https://github.com/JettNguyen/archie-releases/releases/latest/download/Archie-latest.apk",
};

/** Which phone this is, or "" for anything else. An iPad counts as an iPhone here, because the
 *  App Store offers it the iPhone app; iPadOS asks for desktop pages and calls itself a Mac, and a
 *  touch screen is what gives it away. */
function phoneKind() {
  const ua = navigator.userAgent || "";
  if (/iPhone|iPod|iPad/.test(ua)) return "ios";
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  if (/Android/.test(ua)) return "android";
  return "";
}

const fragment = window.location.hash.replace(/^#/, "").trim();
const paired = fragment.startsWith(PAIRING_PREFIX);
const panel = document.getElementById(paired ? "app-paired" : "app-plain");
if (panel) panel.classList.remove("acct-hidden");
if (paired) history.replaceState(null, "", window.location.pathname + window.location.search);

const kind = phoneKind();
const get = kind ? document.querySelector('.app-get[data-os="' + kind + '"]') : null;
if (panel && get) {
  panel.appendChild(get);
  get.classList.remove("acct-hidden");
  const other = panel.querySelector(".app-get-other");
  if (other) other.hidden = true;
}

/* Off to the store once per tab, so coming back to this page, or reloading it, leaves the reader
   here with the button rather than sending them away again. Storage can throw (a private window, or
   blocked site data); then the reader is simply sent each time, which is the lesser fault. */
if (kind) {
  let sent = false;
  try {
    sent = sessionStorage.getItem("archie-app-store-sent") === "1";
    sessionStorage.setItem("archie-app-store-sent", "1");
  } catch (e) { /* see above */ }
  if (!sent) window.location.replace(STORE[kind]);
}
