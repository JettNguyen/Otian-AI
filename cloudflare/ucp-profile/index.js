// Shopify reads this page on every price search Archie makes (`AGENT_PROFILE` in the Archie repo's
// `crates/archie-net/src/shopify.rs`), and UCP requires its Cache-Control to say `public` with a
// `max-age` of at least 60. GitHub Pages sends `max-age=600` alone and cannot be told otherwise, so
// Shopify refused every search with "Invalid cache control" until this went in front of the page
// on October 28, 2026. It passes the page through as it is and sets that one header.
//
// Expires and Age go too. GitHub's cache serves the page with an Age of up to ten minutes and an
// Expires that far along, so a checker reading either saw a page with seconds to live, and searches
// kept failing at random after the header was right. Max-age overrides both, so dropping them
// changes nothing for anybody else.
export default {
  async fetch(request) {
    const page = await fetch(request);
    const served = new Response(page.body, page);
    if (page.ok) {
      served.headers.set("Cache-Control", "public, max-age=600");
      served.headers.delete("Expires");
      served.headers.delete("Age");
    }
    return served;
  },
};
