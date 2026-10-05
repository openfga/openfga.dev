import { readFileSync } from 'node:fs';

export const historicalRevision = '85bde5e19f7fa0b8687732c33c4f7c3a39fd83e0';
export const historicalInventoryPath = 'tests/fixtures/mintlify/historical-source-inventory.json';

// Upstream aa6248ff1d0c85361e9b4cb58a6756f22863704b changes only this heading's text.
// Verify the frozen digest against 18c8ff991, then apply that exact upstream edit; keep fixtures and the legacy ID.
export const parentChildHeadingCorrection = {
  source: 'modeling/parent-child.mdx',
  id: '01-update-the-athorization-model-to-allow-a-parent-relationship-between-folder-and-document',
  before: '01. Update the Athorization Model to allow a parent relationship between folder and document',
  after: '01. Update the Authorization Model to allow a parent relationship between folder and document',
  previousBodyProseSha256: '67e7c633202b2dcb874538bcc50352aacfb4e7cc911724e2b99482ea14669e1e',
  bodyProseSha256: '4995cda26049fa2e1ca18952f83b3e728d8d2c58544712617ea72acc56056d1f',
};

// Adapt only source locations and internal URL prefixes; frozen content and digests remain unchanged.
export function relocateNativeFixture(value, key = '') {
  if (typeof value === 'string') {
    if (['destination', 'native', 'path'].includes(key)) return value.replace(/^docs\//, '');
    return value.replace(/^\/docs\//, '/');
  }
  if (Array.isArray(value)) return value.map((item) => relocateNativeFixture(item, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([field, item]) => [field, relocateNativeFixture(item, field)]));
  }
  return value;
}

export function readRegressionFixture(name) {
  const fixture = JSON.parse(readFileSync(new URL(`../../tests/fixtures/mintlify/${name}.json`, import.meta.url), 'utf8'));
  if (fixture.provenance?.revision !== historicalRevision) {
    throw new Error(`${name}: expected independent legacy fixture from ${historicalRevision}`);
  }
  return fixture;
}
