# Native documentation tooling

These files maintain the Mintlify documentation, code examples, and regression checks. They are not a disposable migration converter. Run the commands below from the **repository root**, after `npm ci`.

Most files run locally or in CI. Documentation pages load the generated browser bundles, not the validators or tests in this directory.

## What stays here

| Files | Purpose |
| --- | --- |
| `build-fga-codegen.sh`, `*.entry.*` | Bundle the syntax transformer, official DSL highlighting, and shared viewer runtime into the three generated browser helpers in `docs-site/`. |
| `viewer-*.mjs`, `operation-codegen.mjs` | Define languages, SDK setup, and request examples used by native viewers. |
| `api-operation-*.mjs`, `api-sdk-support.mjs` | Generate operation-specific SDK/cURL requests and track the SDK methods and versions that actually support each operation. Shared with the viewer runtime. |
| `api-code-samples.mjs`, `api-request-validation.mjs` | Fetch the canonical OpenAPI schema from `main`, verify sample freshness, validate example inputs, and generate or check the additive SDK sample overlay. |
| `validate-*.mjs`, `navigation-structure.mjs` | Check MDX, component props, DSL blocks, navigation, API routes, and coverage of the original docs. |
| `*.test.mjs`, `component-fixtures.mjs`, `regression-fixtures.mjs` | Guard examples, viewer behavior, reader controls, rendering structure, heading anchors, and historical URL coverage. They don't freeze article content. |

The build, package commands, and tests use these modules.

## Source paths and hosted routes

Article paths are relative to `docs-site/`: use `fga.mdx` or `modeling/overview.mdx`, not a nested `docs/` directory. Navigation uses those paths without `.mdx`. Keep the generated OpenAPI directory as `api/service`; Mintlify's configured `/docs` mount produces `/docs/api/service/...`.

Repository tools that need public URLs use [`native-routes.mjs`](../../scripts/native-routes.mjs) to add the mount once. Do not prepend `/docs` in source mappings, native navigation, or API generator inputs.

Historical `docs/content/` paths in `historical-source-inventory.json` remain provenance for URL coverage; they are not files required in the current checkout.

## Common commands

| Task | Command |
| --- | --- |
| Run the combined documentation checks | `npm run check:mintlify` |
| Rebuild browser helpers after changing their source | `npm run generate:mintlify-codegen` |
| Check browser helper freshness and regressions | `npm run check:mintlify-codegen` |
| Regenerate API examples after changing inputs or generators | `npm run generate:mintlify-api-samples` |
| Check API overlay freshness | `npm run check:mintlify-api-samples` |
| Check native sources for Git LFS pointers | `npm run check:mintlify-sources` |
| Refresh the deployment marker before verifying a deployment (maintainers) | `npm run generate:mintlify-deployment` |

API generation and API navigation checks fetch `main` and require its digest to match the last sample generation. Commit changed source and generated output together; content changes don't need a refreshed deployment marker. Do not hand-edit generated bundles or the overlay.

## Why keep `api-samples.json`?

[`../api-samples.json`](../api-samples.json) is **not a second OpenAPI schema**. It contains the canonical `main` URL, last-generated schema digest, expected operation identities, and reviewed inputs such as `user:anne` and `document:budget`.

```text
Hosted OpenAPI from main + api-samples.json + SDK generators
  -> openapi/sdk-samples.overlay.json
docs.json: hosted OpenAPI + generated overlay
  -> Mintlify API reference with SDK/cURL examples
```

The hosted schema defines the API; the overlay adds only `x-codeSamples`. Removing the input file breaks generation and freshness checks. The [updater](../README.md#automatic-upstream-updates) proposes compatible changes in draft PRs and reports incompatibilities in issues. It does not gate Mintlify's access to newer upstream schemas.

See the [contributor guide](../README.md#native-api-sdk-samples) for coverage and maintenance, and [root scripts](../../scripts/README.md) for website builds and deployment verification.
