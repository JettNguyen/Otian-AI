import assert from 'node:assert/strict';
import { decideAccess } from '../js/access.js';
const cases = [
  ['Business', { license: 'plan_business', subscription_status: 'active' }, true],
  ['lifetime', { license: 'bought' }, true],
  ['payment retry', { license: 'plan', subscription_status: 'past_due' }, true],
  ['retired tester', { license: 'none', access_tier: 'client' }, false],
  ['unbounded grant', { license: 'granted', license_until: null }, true],
  ['unbounded legacy grant', { licence: 'granted' }, true],
  ['expired grant', { license: 'granted', license_until: 999 }, false],
  ['future grant', { license: 'granted', license_until: 1001 }, true],
  ['canceled plan', { license: 'plan_business', subscription_status: 'canceled' }, false],
  ['legacy Business', { access_tiers: ['business'], subscription_status: 'trialing' }, true],
  ['no account', {}, false],
];
for (const [name, data, allowed] of cases) assert.equal(decideAccess(data, 1000).allowed, allowed, name);
console.log('Account access: ' + cases.length + ' license, migration and expiry cases passed.');
