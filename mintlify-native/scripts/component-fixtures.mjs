import { lstatSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const previousComponentFixturePath = 'mintlify-native/docs/test-viewer.mdx';
export const componentFixturePath = 'tests/fixtures/mintlify/viewers.mdx';
export const retiredFixturePages = ['docs/test-viewer.mdx', 'test-viewer.mdx'];

export function readComponentFixture(repoRoot = repositoryRoot) {
  const parts = componentFixturePath.split('/');
  for (let index = 1; index <= parts.length; index += 1) {
    const path = parts.slice(0, index).join('/');
    const stat = lstatSync(join(repoRoot, path));
    if (index < parts.length ? !stat.isDirectory() : !stat.isFile()) {
      throw new Error(`${path}: expected a regular fixture path outside mintlify-native, not a symlink`);
    }
  }
  return {
    file: join(repoRoot, componentFixturePath),
    source: readFileSync(join(repoRoot, componentFixturePath), 'utf8'),
  };
}
