# Repository maintenance scripts

These 20 `.mjs` files (13 implementations/helpers and 7 test files) support the
continuing split site: GitHub Pages hosts the Docusaurus website, while Mintlify
hosts product docs and the API reference. They are not disposable migration
imports; removing them would remove build output, regression checks, or owner tooling.

Run commands from the repository root with Node.js 22 after `npm ci`.
Native authoring/codegen tooling lives separately in
[`docs-site/`](../docs-site/README.md).

## Ordinary builds and CI

`npm run build` checks generated-source freshness before building Docusaurus,
then prepares and validates website resources. Build, preview, and GitHub Pages
workflows use it. `npm run check:mintlify`, run by the
[quality workflow](../.github/workflows/mintlify-quality.yml), includes the root
regression suites, freshness checks, and optional proxy bundle dry run.

| Files | Role and root commands |
| --- | --- |
| `prepare-agent-content.mjs`, `agent-content.mjs`, `validate-agent-content.mjs` | Prepare/check the curated root LLM index, website-only bundle, and Home/Project/Community Markdown: `npm run build:agent-content`, `npm run check:agent-content`. |
| `clean-agent-markdown.mjs` | Docusaurus config imports this Markdown-export plugin to remove framework markup; it runs within the website build, not as a standalone command. |
| `prepare-site-sitemap.mjs`, `site-sitemap.mjs` | Build a sitemap index with separate website/native children from the actual page inventory and pinned API schema: `npm run build:site-sitemap`. |
| `validate-site-boundary.mjs`, `site-boundary.mjs` | Check cross-site links/anchors, redirects, search, sitemaps, and retired-route ownership; export native external links for CI's Lychee check: `npm run check:site-boundary`. |

These commands require preceding build outputs; normally run the complete `npm run build`.
Generated files under `build/` include
`index.md`, `project.md`, `community.md`, `llms.txt`, `llms-full.txt`, and the three
`sitemap*.xml` files. `.link-check/native-external-links.md` is also generated.
Do not hand-edit these outputs. Mintlify owns the full product-docs Markdown/bundle.

## Explicit updates to committed generated content

| File | When to run; generated output |
| --- | --- |
| `generate-legacy-api-routes.mjs` | After pinned API schema/navigation changes, run `npm run generate:legacy-api-routes`; commit `src/data/legacy-api-routes.json`, used by `/api/service` to preserve old Swagger fragments. `npm run check:legacy-api-routes` rejects stale output. |
| `native-deployment-fingerprint.mjs` | After native-source changes, run `npm run generate:mintlify-deployment`; commit the hidden source marker in `docs-site/docs.json`. `npm run check:mintlify-deployment` rejects stale markers. The digest covers tracked and unignored files under `docs-site/`, excluding the marker itself. |
| `update-config-page.mjs` | Run `npm run build:config-page` to fetch the latest official server release/schema and replace only the marked version/table region of `docs-site/docs/getting-started/setup-openfga/configuration.mdx`, preserving authored content. |

Ordinary builds check freshness; they do not regenerate those committed outputs
or fetch the latest server release. The [nightly updater](../.github/workflows/update-docs.yml)
creates/updates **draft PRs** for configuration changes and refreshes the fingerprint.
Manual configuration updates also need a fingerprint refresh. Review release changes
against independent parity fixtures; never regenerate those fixtures from this output.
API-dependent checks fetch the digest-pinned schema, so builds are not fully offline.

## Regression tests

All seven `*.test.mjs` files remain wired into package commands:
- `npm run test:site-boundary`: agent content, site boundary, sitemap, and legacy API routes.
- `npm run test:config-page`: configuration generation, including preservation/error cases.
- `npm run test:docs-proxy`: deployment verification and fingerprints, plus Worker tests.

## Owner-run live acceptance (not deployment)

`verify-docs-deployment.mjs` uses `deployment-verification.mjs` and the fingerprint
helper for read-only HTTP checks of hosted revision, routes, runtime, discovery,
and proxy/website separation. Run `npm run verify:docs-origin` for the native host,
or `npm run verify:docs-proxy -- --origin https://APPROVED-VERIFICATION-HOST`.
These are explicit owner-run checks, not automatic CI deployment or traffic switches.
`npm run check:docs-proxy` only tests and bundles the optional Worker in a dry run.
No new Cloudflare secrets, environments, or deployment workflow are required.
Follow the [routing/acceptance runbook](../deploy/cloudflare/README.md), including
browser checks and coordinated publication; passing repository tests is not cutover approval.
