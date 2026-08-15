# Blog/Articles Workflow

## How it works

Articles are authored and published directly by Jett/Jack: no submission form, review queue, or backend. To add an article:

1. Open `assets/articles.json`.
2. Add a new object to the array with: `title`, `summary`, `author`, `date` (YYYY-MM-DD), `readTime`, `category`, `tags` (array), `url`.
3. Commit and push. The blog page (`blog/index.html`, rendered by `js/blog.js`) fetches this file directly and renders it client-side: no build step, no database.

## Article object shape

```json
{
  "title": "string",
  "summary": "string",
  "author": "string",
  "date": "YYYY-MM-DD",
  "readTime": "string, e.g. \"4 min read\"",
  "category": "one of the four below",
  "tags": ["string"],
  "url": "post-folder-slug/"
}
```

An entry missing any of those fields is silently dropped from the page (`normalizeArticles` in `js/blog.js`), so a typo'd key means the post never appears.

## Categories: use these four, do not invent a fifth

The category filter pills on `blog/index.html` are generated from whatever values appear in the
array, so every new value adds a pill. Four is the set:

- **Field Notes**: first-person accounts of something an agent actually did, well or badly
- **How Agents Fail**: the failure modes, from stopping early to overreaching to sounding certain
- **Running AI Locally**: why the machine it runs on matters
- **Trusting an Agent**: deciding what to hand over and how much to check

If a post genuinely doesn't fit, change this list deliberately and re-sort the existing posts.
A one-post category reads as a mistake. Until 2026-08-15 every post was filed under a single
category, "Team Stories", so the pill row rendered as "All" next to one other pill and filtered
nothing. The filter is only worth its space when the categories actually divide the posts.

The first object in the array is treated as featured in the UI; the rest render as cards in array order (there's no automatic date sorting, so put new articles at the top). Search and category filtering work client-side over whatever is in the array.
