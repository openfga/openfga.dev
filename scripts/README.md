# Repository maintenance scripts

These 24 `.mjs` files (15 implementations/helpers and 9 test files) support the
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
| `prepare-site-sitemap.mjs`, `site-sitemap.mjs` | Build a sitemap index with separate website/native children from the actual page inventory and digest-checked live API schema: `npm run build:site-sitemap`. |
| `validate-site-boundary.mjs`, `site-boundary.mjs` | Check cross-site links/anchors, redirects, search, sitemaps, and retired-route ownership; export native external links for CI's Lychee check: `npm run check:site-boundary`. |

These commands require preceding build outputs; normally run the complete `npm run build`.
Generated files under `build/` include
`index.md`, `project.md`, `community.md`, `llms.txt`, `llms-full.txt`, and the three
`sitemap*.xml` files. `.link-check/native-external-links.md` is also generated.
Do not hand-edit these outputs. Mintlify owns the full product-docs Markdown/bundle.

The API inventory uses the explicit `openapi.directory: "api/service"` from
`docs-site/docs.json`. Generated operation links, sitemap entries, and legacy
Swagger destinations must agree on `/api/service/...`. The exact `/api/service`
entry remains a website fragment-compatibility page; empty/invalid fragments
lead directly to List stores, not back to that entry. `/api-reference/...`
redirects preserve earlier preview links, while sibling namespaces such as
`/api/authzen` and `/api/management` remain outside this routing.

## Explicit updates to committed generated content

| File | When to run; generated output |
| --- | --- |
| `generate-legacy-api-routes.mjs` | After reviewed API schema/navigation changes, run `npm run generate:legacy-api-routes`; commit `src/data/legacy-api-routes.json`, used by `/api/service` to preserve old Swagger fragments. `npm run check:legacy-api-routes` rejects stale output. |
| `native-deployment-fingerprint.mjs` | After native-source changes, run `npm run generate:mintlify-deployment`; commit the hidden source marker in `docs-site/docs.json`. `npm run check:mintlify-deployment` rejects stale markers. The digest covers tracked and unignored files under `docs-site/`, excluding the marker itself. |
| `update-config-page.mjs` | Run `npm run build:config-page` to fetch the latest official server release/schema and replace only the marked version/table region of `docs-site/docs/getting-started/setup-openfga/configuration.mdx`, preserving authored content. |
| `update-api-samples.mjs`, `report-api-samples.mjs` | Run `npm run update:api-samples -- --report .api-samples-report.json` to fetch the exact live API URL once, validate unchanged reviewed sample inputs, and prepare compatible metadata/overlay/legacy-map/fingerprint updates. Reports must stay outside `docs-site/`; remove local reports after review. Reporting to GitHub is a separate, explicitly invoked command. |

Ordinary builds check freshness; they do not regenerate those committed outputs
or fetch the latest server release. The [nightly updater](../.github/workflows/update-docs.yml)
creates/updates **draft PRs** for configuration changes and refreshes the fingerprint.
Manual configuration updates also need a fingerprint refresh. Review release changes
against independent parity fixtures; never regenerate those fixtures from this output.
API-dependent checks fetch the live schema and verify its last-generated digest,
so builds are not fully offline and deliberately fail if upstream has moved.

### API sample updater

The exact source is
`https://raw.githubusercontent.com/openfga/api/refs/heads/main/docs/openapiv3/apidocs.openapi.json`.
The stored SHA-256 identifies the last successfully generated snapshot, not an
immutable hosting revision. The updater never derives sample inputs from defaults,
changes SDK support decisions, or regenerates independent fixtures.

The [API workflow](../.github/workflows/update-api-samples.yml) runs nightly at
05:30 UTC and through `workflow_dispatch`, always starting from the explicit
repository default branch. It uses the reserved branch
`docs/update-openfga-api-samples` and serializes runs without cancellation:

- **`updated` (exit 0):** validate and serialize everything before writing the
  metadata, SDK overlay, changed legacy map, and source fingerprint. Offline
  regression checks must pass before creating/updating a **draft PR**. Identical
  candidate trees already on the reserved branch are not committed again.
- **`unchanged` (exit 0):** no writes, PR, or issue.
- **`incompatible` (exit 2):** no artifact writes or PR. Create an issue, or reuse
  an existing open **or closed** issue carrying the exact fetched-digest marker.
  Repeated runs add neither issues nor comments, and the workflow remains failed
  after reporting. Review the issue and update the hand-reviewed contract with
  independent evidence before rerunning.
- **`error` (exit 1):** transport, timeout, HTTP, local-input, or filesystem failure.
  Fail clearly without misreporting it as an upstream incompatibility issue.

The workflow also checks artifact regressions before and after a compatible
candidate update. If only the candidate fails, it restores all four generated
files, records a `generated-validation` incompatibility with the test output,
and follows the same issue-only, failed-run path instead of proposing a broken draft.

JSON reports contain `status`, `sourceUrl`, `oldSha256`, `newSha256`,
`previousShape`, `proposedShape`, operation `added`/`removed`/`changed` inventories,
legacy `routes` changes, `comparisonScope`, `diagnostic` (`phase`/`message`),
and `changedFiles`. The workflow includes this report in its run summary; PRs and
issues include the relevant details and run link. Operation comparisons use
reviewed identities/methods/paths, while legacy comparisons use tags/routes.
The previous full OpenAPI document is not stored, so this is **not a complete
historical request/response-schema diff**; request compatibility is checked
against the reviewed inputs and current validators instead.

Use `npm run report:api-samples -- --report .api-samples-report.json --body .api-samples-pr.md`
to render a report locally without GitHub writes (remove both files afterward).
`npm run report:api-samples -- --report PATH --issue` performs issue reporting and
requires `GITHUB_REPOSITORY` and `GH_TOKEN`; it accepts only incompatible reports.
CI places reports under `RUNNER_TEMP`, never under fingerprinted native sources.

No new secrets are needed. The existing releaser App credentials
(`RELEASER_APP_CLIENT_ID`, `RELEASER_APP_PRIVATE_KEY`) need contents/PR access,
and existing `GPG_PRIVATE_KEY`/`GPG_PASSPHRASE` sign branch commits. The built-in
`GITHUB_TOKEN` uses `issues: write`; repository Issues and that permission must be
enabled. The workflow must be present on the default branch for scheduled runs.
It never approves or auto-merges PRs, and never force-pushes outside its reserved branch.

## Regression tests

All nine `*.test.mjs` files remain wired into package commands:
- `npm run test:site-boundary`: agent content, site boundary, sitemap, and legacy API routes.
- `npm run test:config-page`: configuration generation, including preservation/error cases.
- `npm run test:update-api-samples`: offline source updates, no-change/incompatibility/transport handling, no partial incompatible writes, issue deduplication, and workflow gates.
- `npm run test:docs-proxy`: deployment verification, fingerprints, native Git-index/working-tree LFS-pointer rejection, and Worker tests.

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
