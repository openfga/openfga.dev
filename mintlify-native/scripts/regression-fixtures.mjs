import { readFileSync } from 'node:fs';

export const historicalRevision = '85bde5e19f7fa0b8687732c33c4f7c3a39fd83e0';
export const historicalInventoryPath = 'tests/fixtures/mintlify/historical-source-inventory.json';

export function readRegressionFixture(name) {
  const fixture = JSON.parse(readFileSync(new URL(`../../tests/fixtures/mintlify/${name}.json`, import.meta.url), 'utf8'));
  if (fixture.provenance?.revision !== historicalRevision) {
    throw new Error(`${name}: expected independent legacy fixture from ${historicalRevision}`);
  }
  return fixture;
}
