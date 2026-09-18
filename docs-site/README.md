# OpenFGA documentation

This directory contains the Mintlify source for 110 product documentation pages and 24 read-only API operations. The homepage, Project, Community, and Blog stay on Docusaurus.

The [hosted Mintlify site](https://fga.mintlify.site/docs/fga) is available. Serving it through `openfga.dev/docs` and `openfga.dev/api-reference` requires the separate [split-site deployment](#split-site-deployment). Publishing this directory does not configure that routing.

## In this guide

- [Run locally](#running-locally)
- [Add and edit pages](#authoring-pages)
- [Use interactive examples](#interactive-viewer-components)
- [Maintain API samples](#native-api-sdk-samples)
- [Update generated files](#generated-files)
- [Add media safely](#asset-storage-and-git-lfs)
- [Validate changes](#validating-authoring-changes)
- [Understand migration limits](#migration-contracts-and-known-differences)
- [Configure deployment](#split-site-deployment)

## Running locally

Use Node.js 22 and the repository's lockfile. Git, Bash, Python 3, and curl are also needed for the full quality checks.

```bash
# From the repository root
npm ci

cd docs-site
npx mint dev --port 3333
```

Open `http://localhost:3333/`. It redirects to `/docs/fga`; the API reference starts at `/api-reference`.

Use the project's tested Mintlify CLI version when comparing rendering behavior. See the [Mintlify CLI guide](https://www.mintlify.com/docs/cli/index) for installation and startup help. Avoid clearing a shared CLI cache while other previews are running.

All `npm run` commands in this guide run from the repository root. Mintlify CLI commands run from `docs-site/`.

## Where to make changes

| Location                                                  | Purpose                                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------- |
| [`docs/`](./docs/)                                        | Product documentation in MDX                                        |
| [`docs.json`](./docs.json)                                | Navigation, theme, redirects, and the pinned OpenAPI source         |
| [`snippets/`](./snippets/)                                | Eight reusable JSX viewers                                          |
| [`global.css`](./global.css)                              | Shared documentation and API styling                                |
| [`images/`](./images/) and page asset directories         | Native media, stored as ordinary Git files                          |
| [`scripts/`](./scripts/)                                  | Validators, browser-helper source, SDK generators, and tests        |
| [`api-samples.json`](./api-samples.json)                  | Canonical schema identity and reviewed API sample inputs            |
| [`source-pages.json`](./source-pages.json)                | Historical page mappings and registration of new native pages       |
| [`tests/fixtures/mintlify/`](../tests/fixtures/mintlify/) | Independent content expectations and the unpublished viewer fixture |

The root browser bundles and [`openapi/sdk-samples.overlay.json`](./openapi/sdk-samples.overlay.json) are generated files. Edit their source or inputs, then regenerate them.

## Authoring pages

### Add, rename, or retire a page

1. Add an MDX file under `docs/`, with the page headline in frontmatter `title`.
2. Add its route once to a documentation group in `docs.json`, without the `.mdx` extension.
3. Register a new page in `source-pages.json` under `nativePages`:

```json
{
  "destination": "docs/new-page.mdx",
  "reason": "Explain the purpose of the new guide"
}
```

Add independent content or behavioral expectations with the page. Do not generate the expected content from the page being tested.

For a historical page rename, update its `overrides` entry and navigation, and preserve the old URL with a redirect. Do not edit the frozen `sources` list. Retiring a page requires an explicit exclusion and reason; a Docusaurus-owned page also needs its owner, route, and existing `ownerPage`. Community remains at `/community`, not in the native docs tree.

The two hidden navigation anchors separate Docs and API Reference sidebars. They hide the section switcher, not the pages or their search visibility. Keep the existing `/docs`, `/api-reference`, and overview entry redirects.

### Write MDX that renders reliably

| Situation                           | Use                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| Page headline                       | Frontmatter `title`; do not repeat it as a body H1                            |
| Different sidebar label             | `sidebarTitle`, preserving the existing navigation wording                    |
| Literal placeholders                | Inline code such as `{object types}`, or escaped braces `\{object types\}`    |
| Expandable tutorial content         | Native `Accordion`, with rich introductory text outside it when needed        |
| Tutorial requests and responses     | Ordinary code fences or native `CodeGroup`, next to the relevant step         |
| API-specific request/response slots | `RequestExample` and `ResponseExample` only for intentional API-reference use |

Braces in prose are JavaScript expressions. `{user}` can parse successfully and still fail at runtime if `user` is not bound. Imports and expression bindings must be explicit.

Do not use raw HTML `details` or `summary`: Mintlify can omit their bodies. Keep examples inside the instructional section they explain, rather than collecting them elsewhere just to satisfy a content check.

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

The API reference reads the canonical OpenAPI 3.0.3 document from [`openfga/api`](https://github.com/openfga/api/tree/main/docs/openapiv3), pinned to the immutable revision from [openfga/api#259](https://github.com/openfga/api/pull/259).

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

To adopt a new schema revision, review the upstream artifact, then update the immutable URL in both `api-samples.json` and `docs.json`, its SHA-256 digest, and the operation contracts. Keep the explicit overlay configuration so overlay errors fail the build.

Generation is deterministic but requires network access: it fetches the pinned schema with a 30-second timeout and verifies its digest. Fetch, parsing, schema, and stale-output failures are errors, not reasons to use an unverified fallback.

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

Shared logic lives in standalone browser helpers. Snippets must work whether Mintlify preloads those scripts or loads them on demand. Request viewers show loading and failure states; model/DSL viewers use their existing polling loaders.

Keep author-source modules under `scripts/` as `.mjs`, not root `.js` files that Mintlify may inject into pages. [`operation-codegen.mjs`](./scripts/operation-codegen.mjs) owns pure request generation; [`viewer-runtime.mjs`](./scripts/viewer-runtime.mjs) composes shared setup and complete programs.

The DSL bundle uses the lockfile-pinned Prism grammar from `@openfga/frontend-utils`. Dark colors come from that package; the light palette lives in `global.css`. Do not add a second tokenizer or edit generated tokens.

Two maintenance details:

- `github-star-cache.js` restores the last exact native GitHub count for up to seven days when the native request fails. It labels stale values as **last known** and makes no additional API requests.
- `lib/codegen/check-reference.js.txt` is a reference extraction, not runtime code. Keep its `.txt` suffix so Mintlify does not execute it.

### Server configuration table

The generator updates only the marked release/table region in [`configuration.mdx`](./docs/getting-started/setup-openfga/configuration.mdx). It preserves the surrounding authored content.

```bash
# Fetch the latest official release
npm run build:config-page

# Regenerate from a reviewed local schema without network access
npm run build:config-page -- --release v1.20.0 --schema /path/to/schema.json
```

Ordinary website builds do not run this generator. Review release changes against the independent content fixtures; never regenerate expected fixtures from the generated table just to make checks pass. The nightly workflow produces draft updates that still require this review.

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

Keep native overrides after the global LFS patterns. Attribute changes do not repair an already committed pointer: retrieve the original object, restage its bytes, and verify the asset renders. Do not remove global LFS rules or rewrite history to fix a native asset.

## Validating authoring changes

Run the full repository-owned gate before submitting a change:

```bash
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

The full gate checks generated artifacts, MDX, DSL, navigation, API samples, independent content fixtures, component contracts, configuration generation, and site boundaries. API checks fetch the pinned canonical schema. See the [repository CI guide](../README.md#mintlify-repository-quality-checks) for prerequisites and workflow details.

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

### Independent regression fixtures

`source-pages.json` preserves a frozen inventory of 111 historical sources: 110 native pages and the Docusaurus-owned Community page. Its `docs/content/` paths are provenance, not files required in the current checkout. The legacy corpus and Git history are not needed to run the checks.

The fixtures under [`tests/fixtures/mintlify/`](../tests/fixtures/mintlify/) preserve:

| Fixture                                                   | Expected content                                                            |
| --------------------------------------------------------- | --------------------------------------------------------------------------- |
| `historical-source-inventory.json`                        | Original paths, public slugs, and source digests                            |
| `operation-callers.json`                                  | Operation props, expectations, descriptions, and language restrictions      |
| `tuple-examples.json`                                     | Tuple values, conditions, descriptions, and ordering                        |
| `tutorial-structure.json`                                 | Models, headings, instructional placement, and disclosures                  |
| `static-requests.json`                                    | Static request/response examples, setup defaults, and SDK installation pins |
| `prerequisite-models.json`                                | Configuration-expression structure and literal semantics                    |
| `live-foundations/`, `live-modeling/`, `live-operations/` | Captured production headlines, prose, links, headings, and examples         |

The historical fixtures were extracted from `85bde5e19f7fa0b8687732c33c4f7c3a39fd83e0`, independently of native output. Do not overwrite them with current output to silence failures. Intentional changes need a reviewed update to the contract.

### Native behavior is not identical to Docusaurus

The migration preserves instructional content, URLs, examples, and image bytes where contracted. It does not promise identical styling, metadata, or execution of every SDK example.

- Cards, callouts, language tabs, copy controls, and themes use Mintlify's native presentation. Concepts keep rich definitions visible and put supporting examples in disclosures.
- Eleven historical H5 subsections use H4: nine in Modeling Getting Started and two in Organization Context. Their wording and fragment targets remain intact.
- Source FAQ/HowTo JSON-LD was not ported as Docusaurus `Head` content. Review native metadata separately.
- AuthZen's content `#pagination` also appears on a generated footer element. The existing link reaches the content heading, but the duplicate is a platform limitation.
- Accepted SDK fixes can differ from older production snippets. Native fenced-code copying also omits a renderer-added terminal newline.

Read, Expand, ReadChanges, StreamedListObjects, and model-write tutorial examples are static native conversions, not reusable viewers. Unsupported source-only exports and layout props have not been recreated merely to match the old component inventory.

The [migration proposal](../MINTLIFY-MIGRATION-PROPOSAL.md) provides background. Content acceptance and source retirement do not authorize a production traffic switch.

## Split-site deployment

### Route ownership

The Mintlify origin `https://fga.mintlify.site/` redirects temporarily to `/docs/fga`. The public `https://openfga.dev/` must continue serving the Docusaurus homepage.

| Public route                                                | Owner                             |
| ----------------------------------------------------------- | --------------------------------- |
| `/`, `/project`, `/community`, `/blog/**`                   | Docusaurus                        |
| `/docs`, `/docs/**`                                         | Mintlify                          |
| `/api-reference`, `/api-reference/**`                       | Mintlify                          |
| Exact `/api` and `/api/service`, including trailing slashes | Edge redirect to `/api-reference` |

Docusaurus also owns `/search`, `/robots.txt`, `/sitemap.xml`, `/search-index.json`, root LLM indexes, and `/assets/**`, `/img/**`, `/css/**`, and `/icons/**`. Paths not explicitly assigned to Mintlify or a redirect fall through to the website.

Website search covers Blog, Project, and Community; its search plugin excludes the homepage. Product-docs search belongs to Mintlify.

### Use the existing Cloudflare edge

The [deployment workflow](../.github/workflows/deploy.yml) publishes the website to GitHub Pages. Cloudflare already fronts that origin. Use a [Cloudflare Worker Route](https://developers.cloudflare.com/workers/configuration/routing/routes/) on the existing proxied zone, retaining GitHub Pages as the website origin.

Proxy Mintlify requests to `https://fga.mintlify.site`, never back to `https://openfga.dev`. A Worker Route can use `fetch(request)` for website fallthrough. Do not replace apex DNS with Mintlify or introduce a new website hosting platform just for this split.

Worker invocation patterns must cover query-bearing entries such as `/docs?source=nav`. Inside the Worker, match complete path segments: `/docs-other` and `/api-reference-other` are not native routes.

### Configure Mintlify

| Setting               | Required value or review                                                                |
| --------------------- | --------------------------------------------------------------------------------------- |
| Repository directory  | `/docs-site`                                                                            |
| Upstream origin       | `https://fga.mintlify.site`                                                             |
| Deployment base path  | Leave unset; source paths already include `docs/`, while API pages use `api-reference/` |
| Public canonical host | `https://openfga.dev`, with the correct path for each section                           |

Confirm the custom-domain setup with Mintlify before changing it. Its [subpath guide](https://www.mintlify.com/docs/deploy/docs-subpath) describes one deployment base path, while this site has two sibling prefixes. Adding a global `/docs` base path can change both URL families.

Also confirm `Origin` forwarding, domain-verification ownership, and generated search, assistant, MCP, and discovery endpoints. The generic proxy and Cloudflare examples differ on some of these details.

### Forward support requests, not just pages

The [Mintlify Cloudflare guide](https://www.mintlify.com/docs/deploy/cloudflare) requires runtime and service routes alongside the page prefixes.

| Request                                                                     | Edge behavior                                                                                                                          |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `/docs`, `/docs/**`, `/api-reference`, `/api-reference/**`                  | Preserve the path and query when proxying to Mintlify.                                                                                 |
| `/mintlify-assets/**`, `/_mintlify/**`                                      | Forward Mintlify runtime assets and service requests.                                                                                  |
| Images, custom scripts, OpenAPI assets, and additional `/_next/**` requests | Allow only verified, nonconflicting paths emitted by the hosted site; check status and MIME type.                                      |
| Exact `/api/request`, if emitted                                            | Rewrite to `/_mintlify/api/request`, as in the [Vercel recipe](https://www.mintlify.com/docs/deploy/vercel). Do not capture `/api/**`. |
| MCP and agent discovery                                                     | Allow confirmed endpoint paths, not all `/.well-known/**`.                                                                             |
| Certificate/domain challenges                                               | Preserve the existing owner unless a specific Mintlify verification path is approved.                                                  |

Repository assets include `/images/**`, `/fga-codegen.js`, `/openfga-dsl-highlight.js`, and `/openfga-viewer.js`; hosted loaders may use different URLs. Do not route all JavaScript or image requests to Mintlify.

The proxy must preserve methods, queries, bodies, response streams, content types, security headers, and `Vary`. Use the Mintlify upstream for outbound Host/TLS, retain public `X-Forwarded-Host` and HTTPS information, and derive client-IP headers from trusted ingress.

Do not automatically follow upstream redirects, buffer assistant streams, or apply an HTML cache policy to POST requests, dynamic responses, discovery files, or verification challenges. Check `Location` for loops and unintended Mintlify-host URLs. Confirm the required `Origin` behavior before release.

### Resolve discovery and sitemap ownership

Native docs should expose `/docs/llms.txt` and `/docs/llms-full.txt`. Root `/llms.txt` and `/llms-full.txt` remain website-owned; the root full bundle contains Home, Project, and Community content only.

Rewriting only the two native index files is insufficient. Follow the [reverse-proxy requirements](https://www.mintlify.com/docs/deploy/reverse-proxy) and verify recursive `/_llms/**` links, per-page Markdown, `Link` and `X-Llms-Txt` headers, MCP discovery, and `.well-known` aliases. A docs page must not advertise the website-only full bundle as its documentation corpus.

The native footer already links to the intended public resource URLs, but this repository does not provision those mappings.

Publish a composite root `/sitemap.xml` covering website, `/docs/**`, and `/api-reference/**` routes without duplicates. Keep the website's root `/robots.txt` authoritative; `/docs/robots.txt` does not govern the whole hostname.

### Activate with a rollback path

1. Obtain Cloudflare Worker/zone access and Mintlify domain-settings access. Confirm the two-prefix, header, and discovery contracts.
2. Save the current edge configuration and the last complete Docusaurus deployment, including its old docs output.
3. Stage the proxy. Check both page prefixes, entry URLs, query strings, redirects, negative prefix matches, website fallthrough, assets, viewers, search, enabled assistant streaming, analytics POST, and discovery. Native origin-root redirects can drop query parameters; check this explicitly.
4. Verify canonical URLs, sitemap coverage, robots ownership, certificate verification/renewal, and cache freshness. Public `/` must not redirect to the docs.
5. Coordinate Worker activation with the website deployment that removes legacy docs. Enable permanent legacy API redirects after staging acceptance and owner approval.
6. If routing or rendering regresses, restore both the saved edge configuration and the complete prior website deployment, then invalidate affected caches.

**Removing Worker routes alone is not a rollback:** the new Docusaurus build no longer contains the old docs.

This section is a deployment contract, not an installed Worker. Production edge configuration and Cloudflare credentials are not stored here. Keep the migration PR draft until the owners approve the cutover.
