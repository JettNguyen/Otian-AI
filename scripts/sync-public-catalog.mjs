// Snapshot only the publicly queryable store fields used by the website renderer.
// Run after publishing the app catalog, then run gen-catalog-index, gen-marketplace, gen-docs and
// gen-discovery. All four read these snapshots, and the deploy refuses the site while any one is
// stale: on September 30, 2026 a refresh that skipped gen-catalog-index held Archie 0.3.3's
// update files off the site for forty minutes.
import fs from 'node:fs';
import { COLLECTIONS, normalize } from '../js/addon-card.js';

function decode(value) {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decode);
  if ('mapValue' in value) return fields(value.mapValue.fields || {});
  return null;
}
function fields(value) {
  return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, decode(v)]));
}
const items = [];
for (const c of COLLECTIONS) {
  const response = await fetch('https://firestore.googleapis.com/v1/projects/archie-77170/databases/(default)/documents/marketplace/' + c.coll + ':runQuery', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery: {
      from: [{ collectionId: 'items' }],
      where: { fieldFilter: { field: { fieldPath: 'visibility' }, op: 'EQUAL', value: { stringValue: 'public' } } }
    } })
  });
  if (!response.ok) throw new Error(c.coll + ': HTTP ' + response.status);
  const rows = await response.json();
  const docs = rows.filter(row => row.document).map(row => row.document);
  if (!docs.length) throw new Error('Refusing an empty collection: ' + c.coll);
  for (const doc of docs) {
    const data = fields(doc.fields);
    if (data.visibility !== 'public') throw new Error('Non-public document returned');
    items.push(normalize(c.kind, doc.name.split('/').pop(), data));
  }
}
items.sort((a, b) => a.name.localeCompare(b.name));
const target = new URL('../data/public-catalog.json', import.meta.url);
fs.writeFileSync(target, JSON.stringify({ source: 'public Firestore marketplace', items }, null, 2) + '\n');
console.log('Snapshotted ' + items.length + ' public add-ons.');

// The guides, for docs/. The same public documents the Resources page in Archie shows, since the
// catalog's copy wins over the one built into the app, so the docs say what installed apps say.
async function publicDocs(coll) {
  const response = await fetch('https://firestore.googleapis.com/v1/projects/archie-77170/databases/(default)/documents/marketplace/' + coll + ':runQuery', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery: {
      from: [{ collectionId: 'items' }],
      where: { fieldFilter: { field: { fieldPath: 'visibility' }, op: 'EQUAL', value: { stringValue: 'public' } } }
    } })
  });
  if (!response.ok) throw new Error(coll + ': HTTP ' + response.status);
  const docs = (await response.json()).filter(row => row.document).map(row => fields(row.document.fields));
  if (!docs.length) throw new Error('Refusing an empty collection: ' + coll);
  if (docs.some(d => d.visibility !== 'public')) throw new Error('Non-public document returned');
  return docs;
}
const guides = (await publicDocs('resources')).map(g => {
  delete g.install_count; // a counter the store keeps, not part of the guide
  return g;
}).sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync(new URL('../data/public-guides.json', import.meta.url),
  JSON.stringify({ source: 'public Firestore marketplace', guides }, null, 2) + '\n');
console.log('Snapshotted ' + guides.length + ' public guides.');
