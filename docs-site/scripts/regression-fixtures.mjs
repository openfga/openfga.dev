import { readFileSync } from 'node:fs';

export const historicalRevision = '85bde5e19f7fa0b8687732c33c4f7c3a39fd83e0';
export const historicalInventoryPath = 'tests/fixtures/mintlify/historical-source-inventory.json';

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
