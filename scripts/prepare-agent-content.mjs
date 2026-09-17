import fs from 'node:fs/promises';
import path from 'node:path';
import { addPageMetadata, createAgentIndex, createWebsiteBundle, websiteMarkdownPages } from './agent-content.mjs';

const buildDirectory = path.resolve('build');
const metadata = JSON.parse(await fs.readFile(new URL('../docs-site/api-samples.json', import.meta.url), 'utf8'));
const index = createAgentIndex({ baseUrl: process.env.BASE_URL, openapiUrl: metadata.canonical.url });
const generatedFull = await fs.readFile(path.join(buildDirectory, 'llms-full.txt'), 'utf8');

await Promise.all(websiteMarkdownPages.map(async (file) => {
  const filename = path.join(buildDirectory, file);
  const [markdown, html] = await Promise.all([
    fs.readFile(filename, 'utf8'),
    fs.readFile(filename.replace(/\.md$/, '.html'), 'utf8'),
  ]);
  await fs.writeFile(filename, addPageMetadata(markdown, html, file));
}));
await Promise.all([
  fs.writeFile(path.join(buildDirectory, 'llms.txt'), index),
  fs.writeFile(path.join(buildDirectory, 'llms-full.txt'), createWebsiteBundle(index, generatedFull)),
]);
console.log(`Prepared ${websiteMarkdownPages.length} website Markdown pages and a root index linking to Mintlify documentation.`);
