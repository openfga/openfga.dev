# OpenFGA documentation

This directory contains the Mintlify source for 110 product documentation pages and a read-only reference for 24 API operations. The homepage, Project, Community, and Blog stay on Docusaurus.

Target `docs-next` for migration and follow-up pull requests. It is the planned temporary default/production branch; deployment and GitHub Actions configuration remain separate [owner actions](../deploy/cloudflare/README.md#temporary-docs-next-release).

The [hosted Mintlify site](https://fga.mintlify.site/docs/fga) is available. Serving it through `openfga.dev/docs` and `openfga.dev/api/service` requires the separate [split-site deployment](#split-site-deployment). Publishing this directory does not configure that routing.

## In this guide

- [Run locally](#running-locally)
- [Add and edit pages](#authoring-pages)
- [Use interactive examples](#interactive-viewer-components)
- [Maintain API samples](#native-api-sdk-samples)
- [Update generated files](#generated-files)
- [Add media safely](#asset-storage-and-git-lfs)
- [Validate changes](#validating-authoring-changes)
- [Understand migration limits](#migration-contracts-and-known-differences)
- [Understand deployment](#split-site-deployment)

## Running locally

Use Node.js 22 and the repository's lockfile. Git, Bash, Python 3, and curl are also needed for the full quality checks.

```bash
# From the repository root
npm ci

cd docs-site
npx mint dev --port 3333
```

Open `http://localhost:3333/`. It redirects to `/docs/fga`; the API reference starts at `/api/service`.

Use the project's tested Mintlify CLI version when comparing rendering behavior. See the [Mintlify CLI guide](https://www.mintlify.com/docs/cli/index) for installation and startup help. Avoid clearing a shared CLI cache while other previews are running.

All `npm run` commands in this guide run from the repository root. Mintlify CLI commands run from `docs-site/`.

## Where to make changes

| Location                                                  | Purpose                                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------- |
| [`docs/`](./docs/)                                        | Product documentation in MDX                                        |
| [`docs.json`](./docs.json)                                | Navigation, theme, redirects, and the canonical main-branch OpenAPI source |
| [`snippets/`](./snippets/)                                | Eight reusable JSX viewers                                          |
| [`global.css`](./global.css)                              | Shared documentation and API styling                                |
| [`images/`](./images/) and page asset directories         | Native media, stored as ordinary Git files                          |
| [`scripts/`](./scripts/)                                  | Validators, browser-helper source, SDK generators, and tests        |
| [`api-samples.json`](./api-samples.json)                  | Canonical schema identity and reviewed API sample inputs            |
| [`source-pages.json`](./source-pages.json)                | Historical page mappings and registration of new native pages       |
| [`tests/fixtures/mintlify/`](../tests/fixtures/mintlify/) | Independent content expectations and the unpublished viewer fixture |

The root browser bundles and [`openapi/sdk-samples.overlay.json`](./openapi/sdk-samples.overlay.json) are generated files. Edit their source or inputs, then regenerate them.

## Authoring pages

During the migration, keep existing content and navigation unchanged apart from the platform adaptations below. Propose editorial changes, new introductions, renamed categories, and content moves in a separate follow-up.

### Add, rename, or retire a page

1. Add an MDX file under `docs/`, with the page headline in frontmatter `title`.
2. Add its route once under the Docs anchor's `pages` in `docs.json`, in the matching category when applicable, without the `.mdx` extension.
3. Register a new page in `source-pages.json` under `nativePages`:

```json
{
  "destination": "docs/new-page.mdx",
  "reason": "Explain the purpose of the new guide"
}
```

Add independent content or behavioral expectations with the page. Do not generate the expected content from the page being tested.

For a historical page rename, update its `overrides` entry and navigation, and preserve the old URL with a redirect. Do not edit the frozen `sources` list. Retiring a page requires an explicit exclusion and reason; a Docusaurus-owned page also needs its owner, route, and existing `ownerPage`. Community remains at `/community`, not in the native docs tree.

The two hidden navigation anchors separate Docs and API Reference sidebars. They hide the section switcher, not the pages or their search visibility. Keep the existing `/docs`, `/api/service`, and overview entry redirects.

The Docs anchor uses `pages` to mix the four original ungrouped introduction pages with the original categories. Do not add an Overview wrapper or regroup pages to suit the new theme. API Reference uses `groups` for its canonical operations.

### Write MDX that renders reliably

| Situation                           | Use                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| Page headline                       | Frontmatter `title`; do not repeat it as a body H1                            |
| Different sidebar label             | `sidebarTitle`, preserving the existing navigation wording                    |
| Existing SEO description            | Keep `description` as metadata; shared CSS hides it below article titles      |
| Literal placeholders                | Inline code such as `{object types}`, or escaped braces `\{object types\}`    |
| Expandable tutorial content         | Native `Accordion`, with rich introductory text outside it when needed        |
| Tutorial requests and responses     | Ordinary code fences or native `CodeGroup`, next to the relevant step         |
| API-specific request/response slots | `RequestExample` and `ResponseExample` only for intentional API-reference use |

Braces in prose are JavaScript expressions. `{user}` can parse successfully and still fail at runtime if `user` is not bound. Imports and expression bindings must be explicit.

Do not use raw HTML `details` or `summary`: Mintlify can omit their bodies. Keep examples inside the instructional section they explain, rather than collecting them elsewhere just to satisfy a content check.

Keep the original worked-example boundaries. The `openfga-modeling-example` class restores the filled containers and compact list typography used by the modeling guides. Put a blank line around the container's Markdown content so lists render as lists; keep explanatory rules outside the example. Preserve the existing highlight wording, colors, and typography.

### Preserve heading links

Changing a heading can break an existing URL even when its text looks unchanged. Mintlify and Docusaurus differ in punctuation handling and duplicate-heading slugs.

For H2 through H4, use an explicit heading ID when the generated slug would change:

```mdx
<h2 id="legacy-heading">Original heading</h2>
```

For H5, use Markdown with an inline target. Raw JSX `<h5>` can disappear in the native renderer.

```mdx
##### <span id="legacy-heading" style={{ scrollMarginTop: '7rem' }}>Original heading</span>
```

IDs must identify the correct section and remain unique. Tabs also generate IDs from their labels; use an explicit tab ID to avoid a collision:

```mdx
<Tab title="Go" id="go-sdk">
  SDK instructions
</Tab>
```

This keeps `#go` available for the existing CLI installation heading. Do not ignore fragment links or redirect them to a different section to make validation pass.

### Author OpenFGA DSL examples

Use `OpenFGACodeBlock` for standalone DSL examples. Mintlify's native highlighter does not support the OpenFGA grammar.

```mdx
import { OpenFGACodeBlock } from '/snippets/OpenFGACodeBlock.jsx';

<OpenFGACodeBlock code={`model
\x20 schema 1.1

type user`} />
```

Mintlify strips leading indentation inside JSX template literals. Escape the first leading space as `\x20`; also escape literal backticks, `${` sequences, and backslashes. The `encodeOpenFgaCode` helper in [`validate-openfga-code-blocks.mjs`](./scripts/validate-openfga-code-blocks.mjs) preserves whitespace during conversion.

Do not use standalone DSL fences or aliases such as `openfga`, `dsl.openfga`, `fga`, or `dsl`. Keep existing `AuthzModelSnippetViewer` examples when both DSL and JSON views are useful. Shell transcripts, JSON, and YAML with embedded models retain their appropriate native formats.

When converting existing examples, compare their bytes and order against a reviewed baseline:

```bash
npm run validate:mintlify-code-blocks -- --compare-ref <reviewed-base>
```

## Interactive viewer components

Use one unaliased named import for each component:

```mdx
import { CheckRequestViewer } from '/snippets/CheckRequestViewer.jsx';

<CheckRequestViewer
  user="user:anne"
  relation="reader"
  object="document:planning"
  allowed={true}
  allowedLanguages={['js-sdk', 'dotnet-sdk', 'curl']}
/>
```

The export name matches the filename under `/snippets/`. Default imports, namespace imports, aliases, and Docusaurus `@components` imports are not supported. Prefer literal prop values so the validator can inspect the example.

### Component inputs

| Component                  | Required inputs                                                                                     | Component-specific options                                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `OpenFGACodeBlock`         | `code`, using canonical template-literal escaping                                                   | `title`                                                                                                                            |
| `AuthzModelSnippetViewer`  | `configuration`: a model or single type-definition fragment                                         | `syntaxesToShow`: unique `dsl`/`json` entries, default `['dsl', 'json']`; `skipVersion`, default `false`                           |
| `CheckRequestViewer`       | String `user`, `relation`, and `object`                                                             | `allowed`; omit it for a request without a response annotation. Also accepts contextual tuples, context, headers, and consistency. |
| `BatchCheckRequestViewer`  | Nonempty `checks` array with `user`, `relation`, `object`, `correlation_id`, and `allowed` per item | Items can include contextual tuples, context, and descriptions.                                                                    |
| `WriteRequestViewer`       | At least one nonempty `relationshipTuples` or `deleteRelationshipTuples` array                      | `conflictOptions`: `onDuplicateWrites` and/or `onMissingDeletes`, each `error` or `ignore`                                         |
| `ListObjectsRequestViewer` | `user`, `relation`, `objectType`, and string-array `expectedResults`                                | Contextual tuples, context, and consistency                                                                                        |
| `ListUsersRequestViewer`   | `objectType`, `objectId`, `relation`, `userFilterType`, and `expectedResults: {users: [...]}`       | `userFilterRelation`, contextual tuples, context, and consistency                                                                  |
| `CreateStoreViewer`        | None                                                                                                | `storeName`, default `"FGA Demo Store"`; `allowedLanguages`                                                                        |

Request viewers share `authorizationModelId`, `skipSetup` (default `false`), and `allowedLanguages`. CreateStore does not need a model ID. The default example model ID is illustrative; replace it with the ID returned by your model write.

Data conventions:

- Tuples have string `user`, `relation`, and `object` fields. Write and contextual tuples can include a `condition` with a name and optional JSON-object context. Delete tuples cannot include conditions.
- `_description` is an instructional comment, never API payload data.
- Request `context` values are JSON objects; custom `headers` are string records.
- `consistency` is `UNSPECIFIED`, `MINIMIZE_LATENCY`, or `HIGHER_CONSISTENCY`.
- Each ListUsers result has exactly one of `object: {type, id}`, `wildcard: {type}`, or `userset: {type, id, relation}`.
- Preserve explicit `false` and empty results. Do not replace them with assumed success.

These are native authoring contracts, not every option from the old Docusaurus components. Source-only options such as `showWrite` and `pseudoCodeMode` are rejected. Use `allowedLanguages={['rpc']}` for pseudocode-only examples.

### Languages and tabs

[`viewer-contract.mjs`](./scripts/viewer-contract.mjs) defines language identifiers, labels, grammars, and supported combinations.

| Identifier   | Label      | Code grammar |
| ------------ | ---------- | ------------ |
| `js-sdk`     | Node.js    | `javascript` |
| `go-sdk`     | Go         | `go`         |
| `dotnet-sdk` | .NET       | `csharp`     |
| `python-sdk` | Python     | `python`     |
| `java-sdk`   | Java       | `java`       |
| `cli`        | CLI        | `shell`      |
| `curl`       | curl       | `shell`      |
| `rpc`        | Pseudocode | `text`       |
| `playground` | Playground | `text`       |

Check supports all nine languages. BatchCheck omits CLI and Playground; Write, ListObjects, and ListUsers omit Playground; CreateStore omits Pseudocode and Playground.

`allowedLanguages` must be nonempty and duplicate-free. Its order controls the tabs; the first entry is selected unless Mintlify restores a supported language preference. Short names such as `js` or `dotnet` are not authoring identifiers. Use `csharp` for native .NET code fences.

Use a native `CodeGroup` for setup and request code. Its children use `language` for the grammar and `filename` for the tab label, not `title`. Mintlify synchronizes matching labels across groups and handles preference persistence, keyboard navigation, focus, scrolling, and copying. Do not add a separate selector or remount groups on selection.

Playground cannot represent contextual tuples, context, headers, or consistency options. CLI does not support custom headers. Unsupported combinations must remain visible as limitations, not silently lose request fields.

### Running the examples

Install a compatible [SDK or CLI](./docs/getting-started/install-sdk.mdx), start an OpenFGA server, and set `FGA_API_URL`. Store-scoped examples also need `FGA_STORE_ID`; complete samples use `FGA_MODEL_ID` where the operation requires it.

The shared setup uses **no authentication**, for a self-hosted server with authentication disabled. Follow the [SDK setup guide](./docs/getting-started/setup-sdk-client.mdx) for pre-shared keys or client credentials. Never add credentials to documentation.

Tutorial request tabs contain fragments: keep imports at file scope, Go code inside `main`, Java requests inside an exception-handling method, and Python requests inside an async function that closes the client. API-reference samples, described below, contain complete programs.

### Non-production component fixture

[`viewers.mdx`](../tests/fixtures/mintlify/viewers.mdx) exercises all eight viewers outside the Mintlify content root. It is not a page to publish. `/docs/test-viewer` must remain a 404, without a replacement redirect.

For visual testing, copy `docs-site/` to an isolated temporary directory outside the repository, add the fixture to that copy's `docs/` directory, and preview it on a separate port. Stop the preview and remove the temporary copy afterward. Never add the fixture to the working content root or production navigation.

## Native API SDK samples

The API reference reads the canonical OpenAPI 3.0.3 document directly from [`openfga/api`'s `main` branch](https://raw.githubusercontent.com/openfga/api/refs/heads/main/docs/openapiv3/apidocs.openapi.json). Both `docs.json` and `api-samples.json` use this exact URL, not an immutable commit URL.

[`api-samples.json`](./api-samples.json) is not a copy of that schema. It records the canonical URL, the digest used for the last sample generation, operation identities, and reviewed example inputs used by the SDK generators. The hosted schema remains the API source of truth. The digest detects when our generated examples need updating; it does not pin what Mintlify fetches. See the [script guide](./scripts/README.md) for the generation flow and retained tooling.

An explicit [OpenAPI overlay](https://www.mintlify.com/docs/api-playground/openapi-setup#transform-your-spec-with-overlays) adds `x-codeSamples` without changing the canonical operations. The reference stays in `simple`, read-only mode, without Try it or Send controls.

### Coverage

There are **90 SDK samples across 18 operations, plus cURL for all 24 operations**. The six AuthZen operations are HTTP-only in the audited SDK versions; generic HTTP requests are not presented as SDK support.

| Operation               | Node.js 0.9.7             | Go 0.8.2                  | .NET 0.10.4               | Python 0.10.4               | Java 0.10.0               | curl |
| ----------------------- | ------------------------- | ------------------------- | ------------------------- | --------------------------- | ------------------------- | ---- |
| Check                   | `check`                   | `Check`                   | `Check`                   | `check`                     | `check`                   | Yes  |
| BatchCheck              | `batchCheck`              | `BatchCheck`              | `BatchCheck`              | `batch_check`               | `batchCheck`              | Yes  |
| Write                   | `write`                   | `Write`                   | `Write`                   | `write`                     | `write`                   | Yes  |
| ListObjects             | `listObjects`             | `ListObjects`             | `ListObjects`             | `list_objects`              | `listObjects`             | Yes  |
| ListUsers               | `listUsers`               | `ListUsers`               | `ListUsers`               | `list_users`                | `listUsers`               | Yes  |
| CreateStore             | `createStore`             | `CreateStore`             | `CreateStore`             | `create_store`              | `createStore`             | Yes  |
| ListStores              | `listStores`              | `ListStores`              | `ListStores`              | `list_stores`               | `listStores`              | Yes  |
| GetStore                | `getStore`                | `GetStore`                | `GetStore`                | `get_store`                 | `getStore`                | Yes  |
| DeleteStore             | `deleteStore`             | `DeleteStore`             | `DeleteStore`             | `delete_store`              | `deleteStore`             | Yes  |
| ReadAuthorizationModels | `readAuthorizationModels` | `ReadAuthorizationModels` | `ReadAuthorizationModels` | `read_authorization_models` | `readAuthorizationModels` | Yes  |
| ReadAuthorizationModel  | `readAuthorizationModel`  | `ReadAuthorizationModel`  | `ReadAuthorizationModel`  | `read_authorization_model`  | `readAuthorizationModel`  | Yes  |
| WriteAuthorizationModel | `writeAuthorizationModel` | `WriteAuthorizationModel` | `WriteAuthorizationModel` | `write_authorization_model` | `writeAuthorizationModel` | Yes  |
| Read                    | `read`                    | `Read`                    | `Read`                    | `read`                      | `read`                    | Yes  |
| ReadChanges             | `readChanges`             | `ReadChanges`             | `ReadChanges`             | `read_changes`              | `readChanges`             | Yes  |
| Expand                  | `expand`                  | `Expand`                  | `Expand`                  | `expand`                    | `expand`                  | Yes  |
| ReadAssertions          | `readAssertions`          | `ReadAssertions`          | `ReadAssertions`          | `read_assertions`           | `readAssertions`          | Yes  |
| WriteAssertions         | `writeAssertions`         | `WriteAssertions`         | `WriteAssertions`         | `write_assertions`          | `writeAssertions`         | Yes  |
| StreamedListObjects     | `streamedListObjects`     | `StreamedListObjects`     | `StreamedListObjects`     | `streamed_list_objects`     | `streamedListObjects`     | Yes  |
| GetConfiguration        | No                        | No                        | No                        | No                          | No                        | Yes  |
| Evaluation              | No                        | No                        | No                        | No                          | No                        | Yes  |
| Evaluations             | No                        | No                        | No                        | No                          | No                        | Yes  |
| ActionSearch            | No                        | No                        | No                        | No                          | No                        | Yes  |
| ResourceSearch          | No                        | No                        | No                        | No                          | No                        | Yes  |
| SubjectSearch           | No                        | No                        | No                        | No                          | No                        | Yes  |

[`api-sdk-support.mjs`](./scripts/api-sdk-support.mjs) records the versions, named methods, immutable source evidence, and unsupported cases. The documentation matrix is checked against that registry.

### Update a sample

1. Edit the reviewed inputs in `api-samples.json` or the shared generators in `scripts/`. Extend input guards and tests when adding a new request shape.
2. Regenerate the overlay and review its diff:

```bash
npm run generate:mintlify-api-samples
npm run check:mintlify-api-samples
npm run test:mintlify-api-samples
npm run validate:mintlify-api-navigation
```

Do not hand-edit the overlay. It may add only `x-codeSamples` at the 24 exact operation targets; removing those additions must recover the unchanged canonical schema.

The source URL stays on `main` when upstream changes. Refresh the recorded digest and generated artifacts through the updater below, rather than switching to a commit URL or changing a checksum merely to silence a failure. New or changed operations can require reviewed changes to operation contracts, SDK support, generators, navigation, and tests. Keep the explicit overlay configuration so overlay errors fail the build.

Generation is deterministic for the recorded schema bytes but requires network access: it fetches `main` with a 30-second timeout and verifies its digest. Fetch, parsing, schema, and stale-output failures are errors, not reasons to use an unverified fallback.

### Automatic upstream updates

The [API update workflow](../.github/workflows/update-api-samples.yml) runs nightly and by manual dispatch. Compatible upstream changes update the sample metadata, SDK overlay, legacy API route map, and deployment fingerprint in a draft PR. It preserves hand-reviewed sample inputs and independent parity fixtures; it does not auto-merge.

If the schema is incompatible with the current operation contracts or SDK generators, the workflow reports the source URL, old/new digests, operation changes, and validation failure in a deduplicated issue instead of proposing incomplete generated output. Maintainers resolve the incompatibility and rerun the workflow. Network failures fail the workflow without pretending to be a schema incompatibility.

The workflow reuses the existing configuration updater's releaser App and signing secrets for PRs and the workflow token for issues. Scheduled runs start after it lands on the repository's default branch; issue and PR creation require the corresponding repository permissions.

**The PR reviews generated examples, not the upstream schema itself.** Mintlify can fetch a newer `main` schema before the update PR merges. Repository checks deliberately report a digest mismatch until the samples catch up; the workflow cannot make the live upstream URL immutable.

### Sample behavior and limits

Each native sample contains the complete imports, setup, and request. CreateStore and ListStores need only `FGA_API_URL`; other samples declare the store and model variables required by the operation. Examples assume no authentication and do not invent successful responses.

Paginated examples request one page. Supply the returned `continuationToken` for another page; `pageSize` must be an integer from 1 to 100. ReadChanges can return the same token when no changes are available, so do not use an unconditional until-empty loop. StreamedListObjects uses each SDK's streaming interface, not a single-response substitute.

Coverage has limits:

- Repository wire tests execute Node.js and cURL against loopback HTTP fixtures, not a deployed OpenFGA model.
- Separate checks compiled the Go samples and exercised Python setup with mocked requests. Java and .NET were source-reviewed, not compiled or executed.
- Reviewed inputs do not cover every optional SDK feature. Conditional assertions and Java contextual Expand require additional low-level handling in some clients.
- The .NET 0.10.4 serializer omits a false-valued assertion `expectation`. Samples use an explicit true value; false-assertion wire behavior has not been execution-tested.

## Generated files

### Browser helpers

| Generated file             | Browser contract                                                            |
| -------------------------- | --------------------------------------------------------------------------- |
| `fga-codegen.js`           | `window.fgaCodegen`: DSL/JSON conversion from `@openfga/syntax-transformer` |
| `openfga-dsl-highlight.js` | `window.openfgaDsl`: official OpenFGA Prism grammar and dark-theme tokens   |
| `openfga-viewer.js`        | `window.openfgaViewer`: language metadata, setup, and request generation    |

Edit their entry points and shared source under `scripts/`, then regenerate:

```bash
npm run generate:mintlify-codegen
npm run check:mintlify-codegen
```

Commit source and generated output together. The check rebuilds into a temporary directory and rejects stale artifacts. It also runs tokenizer, runtime, SDK setup, and content regressions.

### Architecture

Mintlify snippets cannot import npm packages. Keep constants and helper access inside the exported component function; sibling top-level bindings are not reliably available in the sandbox. Do not import one snippet from another.

Shared logic lives in standalone browser helpers. Snippets must work whether Mintlify preloads those scripts or loads them on demand. Request viewers show loading and failure states; model/DSL viewers use script-load listeners, with plain-text DSL fallback while highlighting is unavailable.

Keep author-source modules under `scripts/` as `.mjs`, not root `.js` files that Mintlify may inject into pages. [`operation-codegen.mjs`](./scripts/operation-codegen.mjs) owns pure request generation; [`viewer-runtime.mjs`](./scripts/viewer-runtime.mjs) composes shared setup and complete programs.

The DSL bundle uses the lockfile-pinned Prism grammar from `@openfga/frontend-utils`. Dark colors come from that package; the light palette lives in `global.css`. Do not add a second tokenizer or edit generated tokens.

Header and runtime maintenance:

- `navbar-layout.js` keeps native header links before search in DOM order, matching the left-aligned desktop layout and keyboard traversal. At narrow widths it preserves keyboard order while CSS exposes the native theme control on the right. Controls stay in their original parents so Mintlify retains their state and menu behavior. Check its selectors when updating the Mintlify theme.
- Shared CSS hides code-block assistant actions by their native ID and chat-payload attribute, including API examples with different wrappers. Keep Copy buttons and language tabs available.
- `github-star-cache.js` restores the last exact native GitHub count for up to seven days when the native request fails. It labels stale values as **last known** and makes no additional API requests.

### Page modification dates

`metadata.timestamp: true` in `docs.json` enables Mintlify's native **Last modified on [date]** display. Pages inherit this setting without manual dates or custom browser scripts. In Git-backed deployments, Mintlify uses the last commit that modified the page's source file; if Git metadata is unavailable, it falls back to the deployment timestamp. A migration or formatting commit can therefore change the displayed date without an editorial review.

Keep `timestamp` and `lastUpdatedDate` out of article frontmatter unless a separately reviewed exception is needed. This reader-facing date is distinct from the deployment source fingerprint. See [Mintlify's timestamp documentation](https://www.mintlify.com/docs/organize/pages#last-modified-timestamp).

### Suggest edits

Enable **Edit suggestions** in the deployment's [Mintlify Add-ons dashboard](https://app.mintlify.com/products/addons). Mintlify documents feedback features as requiring Pro or Enterprise and edit suggestions as requiring a public repository. The current `docs.json` schema does not expose the older `feedback.suggestEdit` or `suggestEditBranch` fields; do not copy those legacy settings into this file.

Use the native control rather than a custom edit-link script. Shared CSS presents feedback links as plain, 16px OpenFGA-colored links with pencil icons, readable focus outlines, and mobile-sized hit areas, matching the website's edit-link treatment. The existing Inter typography is intentional and shared with the OpenFGA website. Native labels, destinations, and interactions remain unchanged.

After enabling it, verify that a documentation page links to its actual `docs-site/docs/...mdx` source in `openfga/openfga.dev`, with the intended repository branch and `/docs-site` deployment directory. Mintlify currently synthesizes nonexistent `docs-site/api/service/...mdx` edit URLs for generated API pages; shared CSS hides only those invalid edit links. **Raise issue** remains available when enabled, and API schema changes belong in `openfga/api`. Verify the controls in both themes and at desktop/mobile widths during hosted acceptance.

### Page actions

The native **Copy page** menu appears in the page header. Its shared `contextual` configuration in `docs.json` enables these actions in order:

1. Copy page as Markdown.
2. Open in ChatGPT.
3. Open in Claude.
4. Copy MCP install command.
5. Connect to Cursor.
6. Connect to VS Code.

These are reader-initiated actions. They do not restore Mintlify's Ask Assistant buttons in the navbar or code blocks, and they do not change article content. Keep the native implementation rather than adding a separate clipboard or external-chat script. Pages inherit the shared menu without frontmatter overrides.

MCP actions connect to Mintlify's hosted OpenFGA documentation service, not an OpenFGA authorization server. Copying an install command does not run it. Mintlify generates these targets from the current origin plus `/mcp`. The split-site proxy therefore forwards exact `/mcp` requests to the hosted service and retains `/docs/mcp` as an alias; it does not capture `/mcp/`, `/mcp/**`, or lookalike paths. Before release, inspect the generated install command and editor links on the deployed site and verify both endpoints with MCP initialization and tool discovery.

The local Mintlify preview renders the menu but does not serve page Markdown or the hosted MCP service. Copy page requires the deployed `.md` endpoint, and localhost URLs are not usable by external chat tools or MCP clients. Verify those actions on the hosted preview and again on the public origin after activation; do not add a custom clipboard implementation to hide this preview limitation.

### Server configuration table

The generator updates only the marked release/table region in [`configuration.mdx`](./docs/getting-started/setup-openfga/configuration.mdx). It preserves the surrounding authored content.

```bash
# Fetch the latest official release
npm run build:config-page

# Regenerate from a reviewed local schema without network access
npm run build:config-page -- --release v1.20.0 --schema /path/to/schema.json
```

Ordinary website builds do not run this generator. Review release changes against the independent content fixtures; never regenerate expected fixtures from the generated table just to make checks pass. The nightly workflow produces draft updates that still require this review.

### Deployment fingerprint

After editing native sources or regenerating their outputs, refresh the hidden deployment marker:

```bash
npm run generate:mintlify-deployment
npm run check:mintlify-deployment
```

Commit the resulting `docs.json` change with the source changes. The marker is the SHA-256 fingerprint of the `docs-site/` source inventory and file contents, excluding its own metadata value. It covers pages, snippets, configuration, runtime assets, media, and authoring sources; it is not a timestamp or a Git commit ID. Ignored local files are excluded, new nonignored files are included, and tracked deletions must be staged before regeneration.

Ordinary checks never refresh the marker: they fail if it is stale. Source reads also reject LFS pointers under `docs-site/` in both the Git index and working tree, so a locally hydrated asset cannot hide a committed pointer. Deployment acceptance recomputes the marker from the selected checkout, then requires the same marker in every advertised docs and API page. A previous hosted deployment with the same route inventory cannot pass. Wait for Mintlify to finish deploying the matching sources rather than bypassing this gate. Commits with identical native sources intentionally share a fingerprint.

The nightly configuration-update workflow refreshes and commits the marker with its generated table; it does not regenerate independent content expectations.

## Asset storage and Git LFS

| Asset location              | Storage                                                    |
| --------------------------- | ---------------------------------------------------------- |
| Docusaurus website and Blog | Git LFS; rendering requires hydrated media                 |
| Anything under `docs-site/` | Ordinary Git blobs; Mintlify must receive the actual bytes |

See the [repository LFS setup](../README.md#setup-git-lfs-large-file-storage) and [`.gitattributes`](../.gitattributes).

Before copying an LFS-managed asset, run `git lfs pull` to retrieve its contents. Put the real image or video under the appropriate native asset directory, then stage it and check its attributes:

```bash
git check-attr --cached filter -- docs-site/images/img/openfga_logo.svg
```

A native asset should report `filter: unset`. Inspect the staged blob, not just the working copy. A file beginning with `version https://git-lfs.github.com/spec/v1` is a pointer, not image data.

After staging asset changes, run `npm run check:mintlify-deployment`; regenerate the fingerprint first if the actual bytes changed. The check reads the staged blobs as well as working files and rejects unresolved pointers.

Keep native overrides after the global LFS patterns. Attribute changes do not repair an already committed pointer: retrieve the original object, restage its bytes, and verify the asset renders. Do not remove global LFS rules or rewrite history to fix a native asset.

Keep inline assets deployable throughout the `docs-next` period. The eventual return to `main` uses a [clean LFS-backed integration](../deploy/cloudflare/README.md#returning-to-main), not a merge of the temporary branch's history or an assumption that skipping one conversion commit removes every inline asset.

## Validating authoring changes

Refresh the deployment fingerprint after source changes, then run the full repository-owned gate before submitting:

```bash
npm run generate:mintlify-deployment
npm run check:mintlify
```

During development, use the checks relevant to the change:

| Change                           | Command                                                   |
| -------------------------------- | --------------------------------------------------------- |
| MDX prose and expressions        | `npm run validate:mintlify-mdx`                           |
| Specific MDX files               | `npm run validate:mintlify-mdx -- docs-site/docs/fga.mdx` |
| Standalone DSL                   | `npm run validate:mintlify-code-blocks`                   |
| Pages, navigation, and redirects | `npm run validate:mintlify-navigation`                    |
| Viewer imports and props         | `npm run validate:mintlify-components`                    |
| Viewer behavior and fixture      | `npm run test:mintlify-components`                        |
| Captured content expectations    | `npm run test:mintlify-content-parity`                    |
| Configuration generator          | `npm run test:config-page`                                |
| Split-site ownership contracts   | `npm run test:site-boundary`                              |

The full gate checks the deployment fingerprint, generated artifacts, MDX, DSL, navigation, API samples, independent content fixtures, component contracts, configuration generation, and site boundaries. API checks fetch the canonical schema from `main` and require its digest to match the generated examples. See the [repository CI guide](../README.md#mintlify-repository-quality-checks) for prerequisites and workflow details.

Know what each result proves:

| Check                   | Proves                                                                 | Does not prove                                                   |
| ----------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| MDX validation          | Syntax and supported expression bindings are valid                     | Imports resolve or all expressions render at runtime             |
| Component validation    | Inspectable imports, props, languages, and data shapes match contracts | Deferred expressions or browser interactions work                |
| Source/content fixtures | Inventory and independently captured semantics are preserved           | Pixel equivalence or correct authorization against a real server |
| SDK wire tests          | Executed Node.js/cURL requests match fixture expectations              | Every SDK, authentication mode, or live model was tested         |
| Source-only CI          | Repository checks passed                                               | LFS assets render or the hosted deployment works                 |

After changing viewers or runtime helpers, inspect representative pages in Mintlify. Check first load, language selection, setup, copying, fragment navigation, and desktop/mobile rendering in light, dark, and system themes. Use the [isolated component fixture](#non-production-component-fixture) when needed.

Repository checks do not run the Mintlify CLI or replace its build validation and hosted acceptance.

## Migration contracts and known differences

### Migration review checklist

Apply these requirements to every migrated page, not only the examples raised in review:

- Preserve the original visible article titles and section headings. Mintlify's frontmatter `title` is reader-visible, not an SEO-only field. SEO title adjustments may use supported non-visible metadata such as `og:title` and `twitter:title`, but must not change the article headline or navigation. Visible copy improvements belong in a separate follow-up PR.
- Keep original sidebar labels, category names, hierarchy, ordering, and overview entries. Use `sidebarTitle` when the original sidebar label differs from the article headline.
- Keep article wording, examples, and sections in their original order and on their original pages. Do not combine migration work with summaries, factual updates, recategorization, or cross-page content moves. Retain only the technical exceptions listed below.
- Preserve frontmatter descriptions for SEO without presenting them as new introductions. The shared article-header rule does not hide native API operation descriptions.
- Keep LLM indexes, bundles, per-page Markdown, and machine discovery available without visible LLM footer links.
- Keep navigation links directly after the OpenFGA logo. Group the GitHub star badge, search, and theme control on the right, with the badge immediately before search. Hide desktop/mobile Ask AI navbar buttons, floating prompts, and code-block assistant buttons. Preserve native search and the responsive menu.
- Keep the approved native Copy page menu and its six [page actions](#page-actions) in the article header. Do not add Ask Assistant or extra providers to that menu. Check copied Markdown and generated MCP/editor targets as part of release acceptance.
- Compare worked examples with the original page. Preserve grouping, list boundaries, highlights, diagrams, and fragment targets in light and dark themes at desktop and mobile widths.

Structural checks cannot prove rendering parity. Include the affected pages in browser review, and record unavoidable platform differences below rather than silently accepting content drift.

### Retained technical exceptions

The migration is not an editorial update. These existing differences are retained because they preserve source content or help readers run the examples correctly:

| Exception                              | Scope and reason                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SDK setup guidance and code repairs    | Keep the environment-variable, authentication, client-scope, and Read/Expand setup instructions already present in Create a Store, Configure Authorization Model, Relationship Queries, and Migrating Relations. For example, creating a store does not require an existing store ID, and Python requests must run inside the client's `async with` block. Preserve the necessary SDK code repairs without changing example inputs, authorization behavior, or expected results. |
| SDK installation requirements          | Keep the pinned versions, matching Go/Java/.NET requirements, and HTTP-only AuthZen guidance on Install SDK Client. These explain the constraints of the working API examples, not a new tutorial.                                                                                                                                                                                                                                                                               |
| Original contextual-tuple descriptions | Keep the three source tuple descriptions beside the examples in Task-Based Authorization. They originated in the old component props and are not new explanatory claims.                                                                                                                                                                                                                                                                                                         |
| Rendering repairs                      | Keep the recorded malformed-Markdown and JSON-quoting repairs. Do not use this exception to rewrite source wording or correct unrelated typos.                                                                                                                                                                                                                                                                                                                                   |
| Published server configuration         | Keep the independently captured production v1.20.0 configuration table instead of reverting it to the older Git-source table. This preserves the earlier production baseline, not a new server-version update.                                                                                                                                                                                                                                                                   |

The exact prose and heading exceptions are page-scoped in `scripts/live-original-parity.test.mjs`. All other article wording, heading order, navigation, and page ownership must match the original baseline. New or expanded exceptions need separate review; general editorial improvements belong in a follow-up PR.

### Independent regression fixtures

`source-pages.json` preserves a frozen inventory of 111 historical sources: 110 native pages and the Docusaurus-owned Community page. Its `docs/content/` paths are provenance, not files required in the current checkout. The legacy corpus and Git history are not needed to run the checks.

The fixtures under [`tests/fixtures/mintlify/`](../tests/fixtures/mintlify/) preserve:

| Fixture                                                   | Expected content                                                                   |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `historical-source-inventory.json`                        | Original paths, public slugs, and source digests                                   |
| `original-content.json`                                   | Original sidebar hierarchy, labels, headlines, and ordered prose for all 110 pages |
| `operation-callers.json`                                  | Operation props, expectations, descriptions, and language restrictions             |
| `tuple-examples.json`                                     | Tuple values, conditions, descriptions, and ordering                               |
| `tutorial-structure.json`                                 | Models, headings, instructional placement, and disclosures                         |
| `static-requests.json`                                    | Static request/response examples, setup defaults, and SDK installation pins        |
| `prerequisite-models.json`                                | Configuration-expression structure and literal semantics                           |
| `live-foundations/`, `live-modeling/`, `live-operations/` | Captured production headlines, prose, links, headings, and examples                |

The original source/component fixtures were extracted from `85bde5e19f7fa0b8687732c33c4f7c3a39fd83e0`, independently of native output. The review baseline in `original-content.json` uses the original `docs/sidebars.js` and `docs/content/` at `2dbd2be1145e5656d340816cd72d20192edcfe23`. Explicit sidebar labels take precedence over frontmatter titles.

`live-original-parity.test.mjs` checks every page against that baseline and rejects title/sidebar rewrites (including body headlines), added, removed, rewritten, reordered, or cross-page prose, and reordered section headings. SEO-only metadata does not waive the visible-title contract. It enforces the exact page-specific technical exceptions above, including the retained setup instructions, instead of allowing arbitrary SDK-related additions. The capture script reads only the pinned original Git revision; ordinary checks use the committed fixture and do not need Git history.

Do not overwrite expectations with current output to silence failures. Intentional changes need a reviewed update to the contract; migration restorations must first match the independent original-source baseline.

### Native behavior is not identical to Docusaurus

The migration preserves instructional content, URLs, examples, and image bytes where contracted. It does not promise identical styling, metadata, or execution of every SDK example.

- Cards, callouts, language tabs, copy controls, and themes use Mintlify's native presentation. Concepts keep rich definitions visible and put supporting examples in disclosures.
- Eleven historical H5 subsections use H4: nine in Modeling Getting Started and two in Organization Context. Their wording and fragment targets remain intact.
- Source FAQ/HowTo JSON-LD was not ported as Docusaurus `Head` content. Review native metadata separately.
- AuthZen's content `#pagination` also appears on a generated footer element. The existing link reaches the content heading, but the duplicate is a platform limitation.
- Accepted SDK fixes can differ from older production snippets. Native fenced-code copying also omits a renderer-added terminal newline.

Read, Expand, ReadChanges, StreamedListObjects, and model-write tutorial examples are static native conversions, not reusable viewers. Unsupported source-only exports and layout props have not been recreated merely to match the old component inventory.

Content acceptance and source retirement do not authorize a production traffic switch.

## Split-site deployment

Mintlify serves product docs under `/docs` and generated API operations under `/api/service/`. Home, Project, Community, and Blog remain on Docusaurus/GitHub Pages. The exact `/api/service` entry preserves old Swagger bookmarks.

Keep `openapi.directory: "api/service"` in `docs.json`. When API schema or navigation changes affect operation URLs, regenerate the compatibility map with `npm run generate:legacy-api-routes`.

DNS, Mintlify domain settings, Cloudflare routing, verification, cutover, and rollback belong in the [deployment runbook](../deploy/cloudflare/README.md). Publishing this directory does not activate public routing; deployment requires coordination with the infrastructure and website owners.
