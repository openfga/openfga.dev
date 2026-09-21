# Native documentation tooling

These files maintain the Mintlify documentation, code examples, and regression checks. They are not a disposable migration converter. Run the commands below from the **repository root**, after `npm ci`.

Most files run locally or in CI. Documentation pages load the generated browser bundles, not the validators or tests in this directory.

## What stays here

| Files | Purpose |
| --- | --- |
| `build-fga-codegen.sh`, `*.entry.*` | Bundle the syntax transformer, official DSL highlighting, and shared viewer runtime into the three generated browser helpers in `docs-site/`. |
| `viewer-*.mjs`, `operation-codegen.mjs` | Define languages, SDK setup, and request examples used by native viewers. |
| `api-operation-*.mjs`, `api-sdk-support.mjs` | Generate operation-specific SDK/cURL requests and track the SDK methods and versions that actually support each operation. Shared with the viewer runtime. |
| `api-code-samples.mjs`, `api-request-validation.mjs` | Fetch and verify the pinned OpenAPI schema, validate example inputs, and generate or check the additive SDK sample overlay. |
| `validate-*.mjs`, `navigation-structure.mjs` | Check MDX, component props, DSL blocks, navigation, API routes, and coverage of the original docs. |
| `*.test.mjs`, `component-fixtures.mjs`, `regression-fixtures.mjs`, `original-content-parity.mjs` | Guard examples, viewer behavior, reader controls, and preservation of original titles, prose, headings, and navigation using independent fixtures. |
| `capture-original-content.mjs` | Reproduce the original-content fixture from its pinned historical Git revision. This is a manual provenance tool, not a normal build step. |

The build, package commands, and tests use these modules. Keep the manual capture tool so reviewers can reproduce the baseline; do not run it to make changed content pass, or regenerate independent expectations from the migrated docs.

## Common commands

| Task | Command |
| --- | --- |
| Run the combined documentation checks | `npm run check:mintlify` |
| Rebuild browser helpers after changing their source | `npm run generate:mintlify-codegen` |
| Check browser helper freshness and regressions | `npm run check:mintlify-codegen` |
| Regenerate API examples after changing inputs or generators | `npm run generate:mintlify-api-samples` |
| Check API overlay freshness | `npm run check:mintlify-api-samples` |
| Refresh the source marker after any `docs-site/` change | `npm run generate:mintlify-deployment` |

API generation and API navigation checks need network access to the pinned schema. Commit changed source, generated output, and the refreshed source marker together. Do not hand-edit generated bundles or the overlay.

## Why keep `api-samples.json`?

[`../api-samples.json`](../api-samples.json) is **not a second OpenAPI schema**. It contains the canonical URL and digest, expected operation identities, and reviewed inputs such as `user:anne` and `document:budget`.

```text
Pinned hosted OpenAPI + api-samples.json + SDK generators
  -> openapi/sdk-samples.overlay.json
docs.json: hosted OpenAPI + generated overlay
  -> Mintlify API reference with SDK/cURL examples
```

The hosted schema defines the API; the overlay adds only `x-codeSamples`. Removing the input file breaks generation and freshness checks. Removing the whole sample pipeline would also give up the curated SDK examples, not merely remove a duplicate schema.

See the [contributor guide](../README.md#native-api-sdk-samples) for coverage and maintenance, and [root scripts](../../scripts/README.md) for website builds and deployment verification.
