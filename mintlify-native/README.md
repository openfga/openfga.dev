# OpenFGA Docs — Mintlify Port (POC)

This directory contains the documentation and API-reference portion of
[openfga.dev](https://openfga.dev) ported from Docusaurus to
[Mintlify](https://mintlify.com). The homepage, Project page, Community page, and
blog remain on Docusaurus. It is a proof-of-concept on the
`poc/mintlify-native` branch of the `openfga/openfga.dev` repo.

The migration proposal is in [`MINTLIFY-MIGRATION-PROPOSAL.md`](../MINTLIFY-MIGRATION-PROPOSAL.md)
at the repo root.

---

## Running locally

```bash
cd mintlify-native/
npx mint dev --port 3333
```

Then open `http://localhost:3333/docs` or `http://localhost:3333/api-reference`.
The logo links to the Docusaurus homepage. The native header links to the Mintlify
API reference and the Docusaurus-owned Project, Community, and Blog routes, while
the sidebar starts directly with documentation groups. Mintlify's native search
remains available in the docs header.

If startup fails with `Error: Client not built`, delete `~/.mintlify/mint/` and rerun —
the CLI will re-download a fresh pre-built copy.

---

## What's in here

```
mintlify-native/
├── docs.json              # Mintlify nav and theme config
├── global.css             # Shared docs/API theme fixes
├── github-star-cache.js   # Cache-only fallback for Mintlify's native GitHub star count
├── openfga-dsl-highlight.js   # Generated standalone DSL tokenizer (window global)
├── fga-codegen.js         # Generated @openfga/syntax-transformer bundle (window global)
├── openfga-viewer.js      # Generated shared language and SDK setup helpers
├── docs/                  # 110 owned pages, retained Community copy, and test harness
├── images/                # Mintlify logo assets
├── snippets/              # 8 interactive React components (see below)
├── lib/codegen/
│   └── check-reference.js.txt  # Reference file — see note below
└── scripts/
    ├── build-fga-codegen.sh   # Reproducible build for all browser artifacts
    ├── openfga-dsl-highlight.entry.cjs
    ├── openfga-dsl-highlight.test.mjs
    ├── validate-openfga-code-blocks.mjs
    ├── viewer-contract.mjs   # Language identifiers, labels, grammars and order
    ├── viewer-runtime.mjs    # Shared SDK initialization and create-store code
    └── validate-component-usage.mjs
```

The hidden, searchable API navigation group consumes the canonical OpenAPI 3.0.3 document generated in
[`openfga/api`](https://github.com/openfga/api/tree/main/docs/openapiv3), pinned to
the immutable merge commit for
[`openfga/api#259`](https://github.com/openfga/api/pull/259). Update that revision
through a reviewed change when adopting a newer API artifact. The navigation
validator supports both local and HTTPS specifications and fails the build if the
canonical operation set drifts. Mintlify's native `hidden` and `searchable`
properties keep the generated API pages out of the docs sidebar while retaining
direct routes, search, sitemap, assistant, and LLM index coverage. A native
temporary redirect keeps `/api-reference` as the stable public entry and sends it
to the first generated operation.

### docs/test-viewer.mdx

A component validation page (not in the sidebar nav) that renders all 8 interactive
viewers with test data. Useful for quickly verifying components work after changes.
Access at `/docs/test-viewer` on a running dev server.

### lib/codegen/check-reference.js.txt

**Not a runtime file.** A readable reference extraction of the `CheckRequestViewer`
codegen logic (ported from the Docusaurus source). The `.txt` suffix prevents
Mintlify from executing this non-runtime reference as a browser script. When the upstream
`src/components/Docs/SnippetViewer/CheckRequestViewer.tsx` changes, diff against
this file to understand what needs updating in `snippets/CheckRequestViewer.jsx`.

---

## Architecture

### Source page coverage

[`source-pages.json`](./source-pages.json) is the reviewed page inventory, not a
content migration engine. `sources` lists every exact path relative to
`docs/content/`; its default destination is `mintlify-native/docs/<source>`.
The five `overrides` preserve the routes for `intro` -> `fga`,
`getting-started/overview` -> `getting-started`, `docker-setup` -> `docker`,
`kubernetes-setup` -> `kubernetes`, and `modeling/testing-models` -> `modeling/testing`.
Destination paths are relative to `mintlify-native/` and include `.mdx`.

```bash
npm run validate:mintlify-source-parity
npm run test:mintlify-source-parity
git fetch origin main
npm run validate:mintlify-source-parity -- --compare-ref origin/main
```

The navigation validator invokes source coverage, and the navigation chain runs
its mutation tests; both therefore run in the root prebuild. Counts come from
the manifest and filesystem, not a hardcoded page total. The initial inventory is
111 source pages: 110 Mintlify-owned pages and one Docusaurus-owned Community
page. The 112 Mintlify MDX files also include the retained Community copy and the
fixture-only `docs/test-viewer.mdx`.

When adding a source page, add its exact path to `sources`, author its Mintlify
counterpart, and add the destination route to visible docs navigation. Add an
override only for a different destination path. For deliberate removal or
renaming, reconcile the source, manifest, destination, and navigation together;
never regenerate the inventory just to silence a failure. A mapping removed
while its source remains, a source removed while its entry remains, and a stale
destination all fail validation. A comparison against a fetched reference also
detects coordinated source/manifest deletions or additions relative to that ref.

Exclusions apply to one exact source and require a reason. An assignment to
Docusaurus additionally records its `owner`, public `route`, and existing
`ownerPage` under `src/pages/`. `retainedPage` explicitly accounts for an optional
non-navigation migration copy. Fixtures likewise require an exact destination
and reason and must exist. Community remains owned at `/community`; retain the
test viewer during component work. Neither excluded copies nor fixtures may
appear anywhere in docs navigation, including hidden/searchable groups. Hidden
OpenAPI operation references are checked separately by the API validator, not
mistaken for documentation MDX.

The guard rejects missing or unlisted sources, stale/missing/unassigned
destinations (including MDX outside `docs/`), duplicate mappings/navigation,
conflicting ownership, malformed paths, globs, traversal, and symlinks. Paths
use lowercase letters, digits, hyphens, underscores, and `/` separators.

**Coverage is not semantic content parity.** The optional `--compare-ref` fails
on a source inventory mismatch and reports byte-level source differences
informationally, without fetching or changing either branch. It does not compare
source prose or components to their Mintlify equivalents, record a "reviewed"
hash, or certify freshness. At introduction, comparison against main commit
`7002ddae8df201ada3d32e3073a82c41ac459b16` found the same 111 source paths but
16 locally changed source files containing API-reference link rewrites. Matching
paths do not establish that migrated prose, examples, or component behavior are
up to date; those need separate review.

### GitHub star-count fallback

Mintlify fetches the repository's exact GitHub star count for its native navbar
control. `github-star-cache.js` stores successful native values for seven days
and restores the last exact count if Mintlify's request is rate-limited. It never
makes its own GitHub API request; first-time visitors without a valid cached value
retain the native icon-only state when that request fails.

### Why Mintlify snippets look the way they do

Mintlify's "snippets" system (JSX files in `snippets/`) has two constraints that
shape all the code in this directory:

1. **No npm imports** — snippets cannot `import` packages. All logic must be
   self-contained.
2. **Only the exported binding is reliably scoped** — sibling top-level `const`
   declarations in the same file are not visible to Mintlify's runtime. Everything
   must be defined inside the exported function body.

These constraints explain patterns you'll see in every snippet file:

- No `import` statements
- All constants defined inside `export const MyComponent = (...) => { const X = ... }`
- Operation-specific request generators stay inside each exported function.
- Reused language metadata and SDK initialization live in a generated standalone
  browser helper, not cross-snippet or runtime npm imports.

### The window-global pattern

The standalone helpers expose these browser contracts:

| Global              | Library                                               | Set by                      |
| ------------------- | ----------------------------------------------------- | --------------------------- |
| `window.fgaCodegen` | `@openfga/syntax-transformer` (DSL ↔ JSON conversion) | `/fga-codegen.js`           |
| `window.openfgaDsl` | Generated OpenFGA Prism tokenizer                     | `/openfga-dsl-highlight.js` |
| `window.openfgaViewer` | Shared language metadata, SDK setup, create-store generator | `/openfga-viewer.js` |

These files are served as static assets by Mintlify. Snippets check for the
global on mount, then load the asset if needed. The request viewers listen for
load/error events, display an explicit loading state, and report a failed or
timed-out helper load as an alert. Model/DSL viewers retain their existing polling
loaders. Mintlify may also load root JavaScript files automatically; consumers
must work both with a preloaded global and with on-demand loading.

Mintlify does not support a `docs.json` field for custom scripts — the only mechanism
is to drop a `.js` file in the content tree and have snippets load it on demand.

### DSL syntax highlighting

OpenFGA DSL uses a custom Prism grammar registered via `@openfga/frontend-utils`.
Mintlify uses Shiki and has no mechanism for registering custom grammars.

`openfga-dsl-highlight.js` is generated from the Prism grammar and `openfga-dark`
theme exported by the lockfile-pinned `@openfga/frontend-utils` package. It
bundles official Prism core so grammar features retain Prism's behavior without a
project-specific tokenizer implementation. The generated runtime is standalone,
keeps Prism in manual mode, restores any existing Prism global, and has no runtime
npm imports or dynamic code evaluation. Custom DSL viewers use the exact exported
colors in dark mode and a centralized WCAG AA light palette from `global.css`;
theme changes apply through CSS without re-tokenizing the model.

#### Authoring DSL code blocks

OpenFGA DSL examples must use `OpenFGACodeBlock`; do not use fenced blocks with
the `dsl.openfga` language. Mintlify's native Shiki highlighter does not know the
custom OpenFGA grammar, while the component uses the generated official Prism
tokenizer:

```mdx
import { OpenFGACodeBlock } from '/snippets/OpenFGACodeBlock.jsx';

<OpenFGACodeBlock code={`model
\x20 schema 1.1

type user`} />
```

Mintlify strips literal indentation at the start of lines inside JSX template
literals. Escape the first leading space as `\x20`, as shown above, so the
rendered model retains its indentation. Escape any literal backticks, `${`
sequences, and backslashes as JavaScript template-literal content.

`npm run validate:mintlify-code-blocks` parses every Mintlify page as MDX,
rejects actual `dsl.openfga` code nodes, verifies that component imports appear
exactly once where needed, and requires each `code` prop to use canonical,
non-lossy template-literal escaping. Literal examples inside larger code fences,
inline code, and JSX comments are ignored. The root prebuild runs this guard
through `validate:mintlify-navigation`.

### Authoring MDX prose and expressions

Run `npm run validate:mintlify-mdx` from the repository root. The navigation
validation command (and therefore `prebuild`) runs it before the component and
navigation guards. It checks **every `.mdx` file under `mintlify-native`**,
including non-doc pages and MDX snippets. Run its regression tests with
`npm run test:mintlify-mdx`. To check specific files or directories, append them
after `--`. Symbolic links in the content tree are rejected rather than skipped.

Curly braces in prose are JavaScript expressions, not placeholder delimiters:
`{object types}` is invalid syntax, while `{user}` parses but fails at runtime
unless `user` is bound. Write literal placeholders as inline code, for example
`` `{object types}` ``, or escape both braces: `\{object types\}`.
Escaped braces, character entities, inline/fenced code, and JSX comments are
not checked as expressions. Leading YAML frontmatter delimited by `---` and
closed by `---` or `...` is metadata, not MDX; its YAML values/schema are not
validated by this guard.

The guard compiles the complete MDX body without executing it and uses lexical
scope analysis to reject unbound names throughout text/flow expressions,
including nested JavaScript/JSX. Imports, named exported declarations,
expression-local bindings, ECMAScript 2024 built-ins, and the MDX content
function's `props` and `arguments` are supported. A named default layout export
does not bind its name in prose; declare/import it separately if needed. Property
names are not variable references; computed keys and template interpolations
are. All references must be statically bound, even in `typeof` or dead branches;
ambient runtime names need explicit validator support rather than lint-disable
comments in a page.

Diagnostics use `file:line:column` and distinguish MDX syntax failures from
`unbound-prose` errors. Generated-JavaScript syntax errors use the page's start
position and separately identify the generated line, not a claimed source line.
This is **not a runtime-renderability proof**: imports are not resolved, values
and initialization order are not evaluated, and names in ESM initializers or
standalone MDX element attributes are not checked for binding. Component
names/props belong to their own contracts. Valid JavaScript can still throw or
return a value React cannot render. Unsupported parser/scope-analysis syntax
fails explicitly.

### Generated browser artifacts

`fga-codegen.js` is a pre-bundled IIFE of the installed
`@openfga/syntax-transformer`, produced by the exact esbuild version in
`package-lock.json`. The size is inherent to the library's dependencies (ANTLR4,
AJV, and yaml). Its crypto shim maps `require("crypto")` to `globalThis.crypto`
(Web Crypto API).

Install the root dependencies and regenerate the committed artifacts after
upgrading either source package or Prism:

```bash
npm ci
npm run generate:mintlify-codegen
```

`npm run check:mintlify-codegen` rebuilds into a temporary directory, fails when
any committed artifact is stale, and runs tokenizer parity, source consistency,
runtime isolation, shared SDK setup, and migrated-corpus tests. The root build invokes this freshness
check in `prebuild`.

---

## Interactive viewer components

### Import and prop contract

Use exactly one unaliased named import for each component used on a page:

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

The eight supported paths are `/snippets/AuthzModelSnippetViewer.jsx`,
`/snippets/OpenFGACodeBlock.jsx`, `/snippets/CheckRequestViewer.jsx`,
`/snippets/BatchCheckRequestViewer.jsx`, `/snippets/CreateStoreViewer.jsx`,
`/snippets/WriteRequestViewer.jsx`, `/snippets/ListObjectsRequestViewer.jsx`, and
`/snippets/ListUsersRequestViewer.jsx`. The exported name matches the filename.
Do not use default/namespace imports, aliases, Docusaurus `@components` imports,
or import other snippets from inside a snippet.

| Component | Required props | Optional props and defaults |
| --- | --- | --- |
| `OpenFGACodeBlock` | `code`: string, canonically escaped template literal (see above) | `title`: string |
| `AuthzModelSnippetViewer` | `configuration`: model JSON or a single type-definition fragment | `syntaxesToShow`: nonempty unique array of `dsl`/`json`, default `['dsl', 'json']`; `skipVersion`: boolean, default false |
| `CheckRequestViewer` | `user`, `relation`, `object`: strings | `allowed`: boolean; omit for request-only examples (no response annotation); `contextualTuples`, `context`, `headers`: string record for curl; common request props below |
| `BatchCheckRequestViewer` | `checks`: nonempty array of `{user, relation, object, correlation_id, allowed, contextualTuples?, context?}` | Common request props below |
| `WriteRequestViewer` | At least one nonempty `relationshipTuples` or `deleteRelationshipTuples` array | Omitted tuple arrays default to `[]`; `conflictOptions`: `{onDuplicateWrites?: 'error' \| 'ignore', onMissingDeletes?: 'error' \| 'ignore'}`; common request props below |
| `ListObjectsRequestViewer` | `user`, `relation`, `objectType`: strings; `expectedResults`: string array | `contextualTuples`, `context`; common request props below |
| `ListUsersRequestViewer` | `objectType`, `objectId`, `relation`, `userFilterType`: strings; `expectedResults`: `{users: [...]}` | `userFilterRelation`: string; `contextualTuples`, `context`; common request props below |
| `CreateStoreViewer` | None | `storeName`: nonempty string, default `"FGA Demo Store"`; `allowedLanguages` |

Common request props are `authorizationModelId` (string, default example ID
`01HVMMBCMGZNT3SED4Z17ECXCA`), `skipSetup` (boolean, default false), and
`allowedLanguages` (nonempty, duplicate-free array of supported identifiers).
The example model ID must be replaced with the ID returned when writing your
model; it is not a configured production model. The existing Check generator
uses a nullish default; other request generators use the default for empty
model-ID strings too.

Tuples contain string `user`, `relation`, and `object` fields. Write tuples also
accept `_description` (a comment, not payload data) and `condition` with `name`
and optional JSON-object `context`. Delete tuples cannot contain a condition.
Request contexts are JSON objects, including nested values, arrays, booleans,
and numbers. Each ListUsers result has exactly one of
`object: {type, id}`, `wildcard: {type}`, or `userset: {type, id, relation}`.
Model inputs support `schema_version`, `type_definitions`, relations, metadata,
and conditions; a `{type, relations?, metadata?}` fragment is normalized to a
single-type model for DSL conversion without displaying the schema header.

These are **Mintlify authoring props, not a claim of Docusaurus parity**.
`showWrite`, `pseudoCodeMode`, and other source-only options are not supported;
the validator reports them instead of letting React silently ignore them.
Operation-specific generators have not been replaced in this task. In
particular, some language branches still omit context/condition/filter options
or serialize context values differently; accepting a prop is not proof that
every SDK branch has equivalent output. Review generated requests when adding
an example with new option combinations.

### Languages and selection

`scripts/viewer-contract.mjs` is the authoritative metadata source, used by the
browser helper and the component validator.

| Identifier | Label | Native syntax grammar |
| --- | --- | --- |
| `js-sdk` | Node.js | `javascript` |
| `go-sdk` | Go | `go` |
| `dotnet-sdk` | .NET | `csharp` |
| `python-sdk` | Python | `python` |
| `java-sdk` | Java | `java` |
| `cli` | CLI | `shell` |
| `curl` | curl | `shell` |
| `rpc` | Pseudocode | `text` (intentionally unhighlighted) |
| `playground` | Playground | `text` (intentionally unhighlighted) |

Default tabs follow that order. Check supports all nine; BatchCheck omits CLI
and Playground; Write/ListObjects/ListUsers omit Playground; CreateStore omits
Pseudocode and Playground. `allowedLanguages` preserves the author's order and
selects its first entry initially, as in the source filtering helper. Short
aliases such as `js`, `go`, and `dotnet` are not authoring identifiers.
Use `csharp`, not `dotnet`, for native .NET fences.

Each request viewer keeps its own selected language. Setup always matches the
selected request language; Pseudocode/Playground have no setup accordion.
Changing theme or opening setup does not reset selection. Native CodeGroup
rendering/copy controls remain in use and are keyed by language to refresh both
the code and the registered grammar when switching. This does not implement
Docusaurus's cross-viewer `groupId="languages"` preference synchronization.

### SDK prerequisites

Install the SDK or CLI using `/docs/getting-started/install-sdk`, deploy your
OpenFGA server, and set `FGA_API_URL` to that server's URL. Request examples also
need `FGA_STORE_ID`; `FGA_MODEL_ID` configures an optional client-level model ID
that a per-request `authorizationModelId` overrides. All SDK setup tabs now use
the same environment-variable names, including Java.

CreateStore does not need a store or model ID. Initialization is shared with
request viewers, but excludes those fields. These snippets intentionally use
**no authentication**, appropriate to a self-hosted server with authentication
disabled. For pre-shared keys or client credentials, follow
`/docs/getting-started/setup-sdk-client`; do not invent a hosted API URL or paste
credentials into docs. The setup page retains its separate authentication-mode
examples and is not generated from these no-auth helpers.

Request code is a fragment: keep imports at file scope, Go statements inside
`main`, Java statements inside a method that handles exceptions, and Python
requests in an async function with the client closed afterward (prefer
`async with OpenFgaClient(configuration)`). CreateStore includes Go/Python entry
points. Install compatible SDK versions before using newer optional features
such as batch check and conflict options.

### Validating authoring changes

```bash
npm run test:mintlify-components
npm run validate:mintlify-components
npm run check:mintlify-codegen
npm run validate:mintlify-navigation
```

The component validator uses `@mdx-js/mdx`'s MDX/ESTree ASTs, not regular
expressions or evaluation of document JavaScript. It checks imports, actual JSX
uses, props and known data shapes, language subsets, and model/result structure.
Native Mintlify components, fenced examples, and comments are not constrained
by the custom-component contract. Expressions that cannot be inspected safely
are reported as deferred checks, not silently claimed as validated. Prefer
literal data for custom viewer props so the validator can check the whole
example. This command is separate from general MDX/prose validation.

After changing the runtime, run `npm run generate:mintlify-codegen` and commit
the generated helper with its source. Use `/docs/test-viewer` plus representative
real docs to verify first load, on-demand loading, switching languages, setup,
copy, and desktop/mobile Light/Dark/System themes. Node tests alone cannot prove
Mintlify's sandbox behavior or syntax grammar registration.

### Source component inventory and remaining conversions

Source paths below are relative to `src/components/Docs`. A static conversion
is not reusable component parity. All 111 source MDX files have counterparts;
the navigation guard separately checks the 110 sidebar source routes. The
hidden viewer harness is additional and remains available.

| Source exports | Mintlify disposition |
| --- | --- |
| `AuthorizationModel/AuthzModelSnippetViewer` | Custom snippet; DSL/JSON and single-type fragments supported. Source `showWrite` and source-default DSL-only presentation are not equivalent. |
| `AuthorizationModel/AuthzModelCodeBlock`, `SyntaxTransformer`, `Dsl` | Converted through the model snippet, `OpenFGACodeBlock`, and existing official syntax-transformer/Prism artifacts; no runtime source-component import. |
| `SnippetViewer/CheckRequestViewer`, `BatchCheckRequestViewer`, `WriteRequestViewer`, `ListObjectsRequestViewer`, `ListUsersRequestViewer` | Five custom snippets with shared language/setup infrastructure; operation-specific option/codegen parity remains incomplete. |
| `SnippetViewer/DefaultTabbedViewer`, `SupportedLanguage`, `SdkSetup` | Converted to the canonical language contract, per-viewer controls, native CodeGroup and shared no-auth initialization. Pseudocode toggle and cross-viewer preference sync are not ported. |
| Create-store examples (no dedicated source Docs component) | Custom `CreateStoreViewer`, with shared initialization and canonical language IDs. |
| `SdkSetup/SdkSetupPrerequisite` | Converted to prose: all 43 source occurrences retain deployment, URL/store ID and optional API-token prerequisites. |
| `SnippetViewer/ExecuteApiRequestViewer`, `ExecuteApiRequestStreamingViewer` | Missing reusable viewers; no current source MDX callers. |
| `SnippetViewer/ExpandRequestViewer` | Lossy JSON conversion in `docs/interacting/relationship-queries`: SDK/CLI/curl/pseudocode and initialization are absent; surrounding response trees remain. |
| `SnippetViewer/ReadRequestViewer` | Mixed static conversion. Relationship queries lose executable examples/timestamps. In `docs/modeling/migrating/migrating-relations`, a source read-all example incorrectly became an Anne-only query and lost other results. |
| `SnippetViewer/ReadChangesRequestViewer` | Four static native-tab examples retain seven languages, page size, type filter and continuation-token combinations; reusable viewer missing. |
| `SnippetViewer/StreamedListObjectsRequestViewer` | Static native tabs retain the source caller's five SDK languages and streamed results; reusable viewer missing. |
| `SnippetViewer/WriteAuthzModelViewer` | Static seven-language tabs. Configure-model retains payload/returned-ID examples; conditions has returned-ID drift and an unexplained CLI `model.fga` input. |
| `SnippetViewer/TupleViewer` | Task-based authorization retains tuple/condition values as prose, but loses two-column structure and combined YAML copy output. |
| `RelationshipTuples/RelationshipTuplesViewer`, `RelationshipCondition` | Static JSON/fences; some `_description` annotations and JSON language designations are lost. |
| `Column/ColumnLayout`, `CardBox`, `LinkBulletType`, internal `Link` | Tables/Markdown replace layout/link wrappers. Visual props are not ported; some instructional content is abridged. Internal Link has no direct MDX callers. |
| `Overview/CardGrid`, `IntroCard`, `RelatedSection` | Native CardGroup/Card/Note or Markdown; some grouping, titles and outer descriptions are lost. |
| `ProductName`, `ProductNameFormat`, `ProductConcept`, `IntroductionSection`, `UpdateProductNameInLinks` | Literal text/Markdown links; some source links became unlinked text. |
| `Banner`, `Playground`, `DocumentationNotice`, `FeedbackCallout` | No equivalent custom snippets. Banner/feedback have no direct MDX callers; playground/notice rendering is dormant under the current source configuration. |

The next parity work should address read-all semantics, missing Read/Expand
instructions, model-writing outputs, tuple structure/copy, and omitted
instructional content/links. The static SDK setup page retains 18 examples
(three authentication modes across six languages); that is content coverage,
not proof of synchronized tabs or SDK execution.

---

## Split-site deployment

The public site uses path-based ownership:

| Public route                              | Origin                                                         |
| ----------------------------------------- | -------------------------------------------------------------- |
| `/`, `/project`, `/community`, `/blog/**` | Docusaurus                                                     |
| `/docs`, `/docs/**`                       | Mintlify, including `/docs/llms.txt` and `/docs/llms-full.txt` |
| `/api-reference`, `/api-reference/**`     | Mintlify                                                       |
| `/api`, `/api/service`                    | Permanent redirect to `/api-reference`                         |

Docusaurus also owns `/search`, `/robots.txt`, `/sitemap.xml`,
`/search-index.json`, `/llms.txt`, `/llms-full.txt`, `/assets/**`, `/img/**`,
`/css/**`, and `/icons/**`. Every route not explicitly assigned to Mintlify or
an edge redirect falls back to Docusaurus.

Configure Mintlify monorepo mode with `/mintlify-native` as the docs directory.
Register `openfga.dev` as Mintlify's custom domain so canonical and discovery
metadata use the public host, but keep the generated `*.mintlify.site` hostname as
the proxy target. Do not add a Mintlify base path: the content paths already
include `docs/`, while generated API pages use `api-reference/`. The footer uses
canonical `openfga.dev/docs/*` URLs because local preview does not emulate the
split-site edge rewrites.

Configure edge rules in this order:

1. Permanently redirect the exact `/api` and `/api/service` paths to
   `/api-reference`.
2. Proxy `/docs/llms.txt` and `/docs/llms-full.txt` to Mintlify's generated
   `/llms.txt` and `/llms-full.txt` resources respectively. Proxy Mintlify's
   `/_llms/**` paths as well if generated indexes link to chunked resources.
3. Proxy `/docs`, `/docs/**`, `/api-reference`, `/api-reference/**`,
   `/_mintlify/**`, `/mintlify-assets/**`, `/_next/**`, `/images/**`,
   `/fga-codegen.js`, and
   `/openfga-dsl-highlight.js`, and `/openfga-viewer.js` to the Mintlify origin.
4. Send all remaining paths to Docusaurus.

Forward all HTTP methods, preserve `X-Forwarded-For`, `X-Forwarded-Proto`,
`X-Real-IP`, `X-Forwarded-Host`, and `User-Agent`, set `Origin` and the upstream
`Host` to the Mintlify subdomain, and do not forward `openfga.dev` as the upstream
`Host`. Route both `/.well-known/vercel/**` and
`/.well-known/acme-challenge/**` to Mintlify while configuring and verifying the
custom domain.

Root `/llms.txt` and `/llms-full.txt` remain Docusaurus-owned.
`/docs/llms.txt`, `/docs/llms-full.txt`, and Mintlify's per-page `/docs/*.md`
exports are covered by the `/docs/**` proxy rule. Docusaurus continues to build
its legacy API page because the agent-content validator consumes that artifact,
but the edge redirect prevents the public `/api/service` route from serving it.

The public `/sitemap.xml` must be a composite of the Docusaurus and Mintlify
sitemaps. Docusaurus excludes `/api/service`; the composite must include all
Mintlify `/api-reference/**` routes without duplicating shared `/docs/**` URLs.

The repository does not contain the production edge configuration, so that routing
must be provisioned in the hosting/CDN platform before cutover.
