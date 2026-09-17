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
The logo links to the Docusaurus homepage. The native header links to Docs, the
Mintlify API reference, and the Docusaurus-owned Project, Community, and Blog
routes. Docs routes show only the eight documentation groups; API routes show
only the six endpoint groups. Mintlify's native search remains available in the
header.

If startup fails with `Error: Client not built`, delete `~/.mintlify/mint/` and rerun —
the CLI will re-download a fresh pre-built copy.

## Asset storage and Git LFS

The split site deliberately uses two storage paths:

| Content | Storage and checkout |
| --- | --- |
| Docusaurus media, including source documentation assets | Default [Git LFS rules](../.gitattributes). Local rendering requires hydrated media; the existing Docusaurus build, preview, and deployment workflows use LFS-aware checkout. |
| Assets anywhere under `mintlify-native/` | Ordinary Git blobs through the trailing path-specific overrides in `.gitattributes`. Mintlify receives the actual asset bytes without depending on an LFS fetch. |

The repository quality workflow uses `lfs: false` because it checks source, not
media contents or a rendered deployment. Its success does not prove that images
and videos load. See the [root checkout instructions](../README.md#setup-git-lfs-large-file-storage)
when working with LFS-managed source assets.

When adding or copying media:

1. Hydrate any LFS-managed source with `git lfs pull` before copying it. Never
   copy an LFS pointer in place of the image or video.
2. Put the actual bytes under `images/` or the existing documentation asset
   directories, following nearby asset references.
3. Preserve the native overrides after the global LFS patterns. A new media
   format needs a reviewed native override if a global rule would track it;
   fixing a native asset must not migrate unrelated Docusaurus media.

Before committing, stage the asset and any attribute change, then check its
exact repository-relative path. For example, from the repository root:

```bash
git check-attr --cached filter -- mintlify-native/images/img/openfga_logo.svg
```

The native asset should report `filter: unset`. Inspect the staged blob as well,
not only the hydrated working copy (`git show :<asset-path>` for a text asset).
An LFS pointer starts with `version https://git-lfs.github.com/spec/v1`, followed
by an `oid sha256:` and a `size` line; these are metadata, not image bytes.

Changing attributes does not replace an already committed pointer. Retrieve the
original LFS object, copy its real contents into the native asset path, restage
that file, and verify it renders in the preview. Do not remove global LFS rules
or rewrite Git history as a workaround.

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
├── docs/                  # 110 owned pages and retained Community copy
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

Two hidden root anchors partition the native navigation by route without adding
an anchor switcher to the interface. The Docs anchor owns the documentation
groups, and the API Reference anchor owns the endpoint groups. Hiding an anchor
hides only its section selector; its active route sidebar and pages remain
navigable and searchable.

The API anchor consumes the canonical OpenAPI 3.0.3 document generated in
[`openfga/api`](https://github.com/openfga/api/tree/main/docs/openapiv3), pinned to
the immutable merge commit for
[`openfga/api#259`](https://github.com/openfga/api/pull/259). Update that revision
through a reviewed change when adopting a newer API artifact. The navigation
validator verifies the pinned source and additive SDK sample overlay and fails
the build if either drifts. Native temporary redirects keep `/docs` and
`/api-reference` as stable public entries and send them to each section's first
page.

The homepage retains the existing `/docs/modeling` URL, which Docusaurus builds
from the modeling overview's `slug`. Mintlify temporarily redirects that URL
and the other ten published overview URLs to their corresponding `/overview`
pages. Source-backed navigation tests check every migrated page's public slug,
including nested modeling overviews. Keep existing links working during
migration rather than excluding them from validation.

### Native API SDK samples

The API reference uses Mintlify's supported
[OpenAPI overlays](https://www.mintlify.com/docs/api-playground/openapi-setup#transform-your-spec-with-overlays)
and [`x-codeSamples`](https://www.mintlify.com/docs/api-playground/adding-sdk-examples).
The canonical API schema is not copied, forked, or edited here:

1. `api-samples.json` records the immutable source URL, its SHA-256 digest,
   all 24 exact operation identities and request inputs.
   `scripts/api-operation-contract.mjs` defines operation identities and setup
   scopes independently of UI components; `scripts/api-sdk-support.mjs` records
   the audited SDK versions, public source evidence, named methods, and explicit
   unsupported cases.
2. `scripts/api-code-samples.mjs` fetches and verifies that canonical source,
   validates sample inputs against its request schemas, then calls
   `buildApiExample(language, operationId, props)` from `scripts/viewer-runtime.mjs`.
   Existing viewer operations reuse `buildSdkExample`; API-only operations use
   the shared `api-operation-*.mjs` generators and the same complete-program
   composer. There are no artificial viewer components or duplicate SDK strings
   in the overlay pipeline.
3. `openapi/sdk-samples.overlay.json` is generated, committed output.
   `docs.json` explicitly applies it to the canonical URL. Mintlify renders the
   resulting samples in its native right-hand request-code panel (inline on
   smaller screens).

| Operation | Node.js 0.9.7 | Go 0.8.2 | .NET 0.10.4 | Python 0.10.4 | Java 0.10.0 | curl |
| --- | --- | --- | --- | --- | --- | --- |
| Check | `check` | `Check` | `Check` | `check` | `check` | Yes |
| BatchCheck | `batchCheck` | `BatchCheck` | `BatchCheck` | `batch_check` | `batchCheck` | Yes |
| Write | `write` | `Write` | `Write` | `write` | `write` | Yes |
| ListObjects | `listObjects` | `ListObjects` | `ListObjects` | `list_objects` | `listObjects` | Yes |
| ListUsers | `listUsers` | `ListUsers` | `ListUsers` | `list_users` | `listUsers` | Yes |
| CreateStore | `createStore` | `CreateStore` | `CreateStore` | `create_store` | `createStore` | Yes |
| ListStores | `listStores` | `ListStores` | `ListStores` | `list_stores` | `listStores` | Yes |
| GetStore | `getStore` | `GetStore` | `GetStore` | `get_store` | `getStore` | Yes |
| DeleteStore | `deleteStore` | `DeleteStore` | `DeleteStore` | `delete_store` | `deleteStore` | Yes |
| ReadAuthorizationModels | `readAuthorizationModels` | `ReadAuthorizationModels` | `ReadAuthorizationModels` | `read_authorization_models` | `readAuthorizationModels` | Yes |
| ReadAuthorizationModel | `readAuthorizationModel` | `ReadAuthorizationModel` | `ReadAuthorizationModel` | `read_authorization_model` | `readAuthorizationModel` | Yes |
| WriteAuthorizationModel | `writeAuthorizationModel` | `WriteAuthorizationModel` | `WriteAuthorizationModel` | `write_authorization_model` | `writeAuthorizationModel` | Yes |
| Read | `read` | `Read` | `Read` | `read` | `read` | Yes |
| ReadChanges | `readChanges` | `ReadChanges` | `ReadChanges` | `read_changes` | `readChanges` | Yes |
| Expand | `expand` | `Expand` | `Expand` | `expand` | `expand` | Yes |
| ReadAssertions | `readAssertions` | `ReadAssertions` | `ReadAssertions` | `read_assertions` | `readAssertions` | Yes |
| WriteAssertions | `writeAssertions` | `WriteAssertions` | `WriteAssertions` | `write_assertions` | `writeAssertions` | Yes |
| StreamedListObjects | `streamedListObjects` | `StreamedListObjects` | `StreamedListObjects` | `streamed_list_objects` | `streamedListObjects` | Yes |
| GetConfiguration | No | No | No | No | No | Yes |
| Evaluation | No | No | No | No | No | Yes |
| Evaluations | No | No | No | No | No | Yes |
| ActionSearch | No | No | No | No | No | Yes |
| ResourceSearch | No | No | No | No | No | Yes |
| SubjectSearch | No | No | No | No | No | Yes |

These are **90 genuine SDK programs across 18 operations, plus curl for all
24 operations: 114 samples total**, not 24-by-five SDK coverage.
Each method above is a named high-level SDK client method, verified against
immutable public sources:
[Node.js](https://github.com/openfga/js-sdk/blob/ff0a9f54631700f98349662746e0d6b3cae52993/client.ts),
[Go](https://github.com/openfga/go-sdk/blob/76d209a9753a5284db64df848eea41fea2506c6f/client/client.go),
[.NET](https://github.com/openfga/dotnet-sdk/blob/ec8ee04761b41e2400693b911a17463877e500c3/src/OpenFga.Sdk/Client/Client.cs),
[Python](https://github.com/openfga/python-sdk/blob/60a0a73a8481867dd25dadf7e6516fb4aca82a14/openfga_sdk/client/client.py),
[Java](https://github.com/openfga/java-sdk/blob/0c5c5c77c1a25e6d0b0ce684833981a6a74db510/src/main/java/dev/openfga/sdk/api/client/OpenFgaClient.java).
The support registry also records generated low-level API sources, checked for
methods absent from the high-level clients. The six AuthZen endpoints have no
named client **or** generated low-level operation in these versions. Their native
panels explicitly show **HTTP-only curl**, not SDK-labelled generic HTTP clients.
Generic SDK request executors are not counted as operation support.

Streaming uses actual SDK streaming interfaces: a Node async generator, Go
result/error channels, Python async iteration, Java item consumers and a
completion future, and .NET async enumeration. Java uses the client's dedicated
streaming implementation, not the generated API's single-response method.
The reference remains in `simple` read-only mode; no Try it/Send controls,
server URLs, or authentication schemes are added. The samples use
`FGA_API_URL`, `FGA_STORE_ID`, and `FGA_MODEL_ID` as applicable for a self-hosted
server with authentication disabled. ListStores and CreateStore need only
`FGA_API_URL`. Store administration, model listing/writing, tuple reads and
change reads need a store but no model ID. Model reads, assertions and
relationship queries use the configured model ID.
Install the corresponding SDK using the
[installation guide](./docs/getting-started/install-sdk.mdx); authenticated
client setup remains in the
[SDK setup guide](./docs/getting-started/setup-sdk-client.mdx).
The request values are illustrative; use a store/model and relationship data
appropriate to the request. Samples do not assert an invented response.
Paginated examples request the first page. To request another page, supply the
actual returned token as the string `continuationToken`; `pageSize` is an integer
from 1 to 100. ListStores also accepts `name`; ReadChanges accepts `startTime`
as a UTC RFC 3339 string. A ReadChanges token can remain unchanged when there
are no new changes, so these examples do not invent an until-empty polling loop.

The model-write fixture deliberately uses a small schema 1.1 direct-relation
model. Generator input guards cover reviewed example shapes, not every SDK
feature. Conditional assertions require low-level methods in several SDKs,
and Java contextual Expand requires its low-level request model; those optional
features are not claimed by these basic examples. The .NET 0.10.4 assertion
serializer omits a false-valued `expectation` member; the sample uses an explicit
true expectation, and .NET false-assertion wire/server semantics have not been
execution-tested.

Each native sample has `lang`, `label`, and `source`. The viewer language labels
are reused; native API aliases are `node`, `go`, `dotnet`, `python`, `java`,
and `bash`, respectively (Mintlify displays the curl language selector as `cURL`).
`source` is the complete import/setup/request program,
so copying a sample does not require copying a second setup tab.

```bash
npm run generate:mintlify-api-samples
npm run check:mintlify-api-samples
npm run test:mintlify-api-samples
npm run validate:mintlify-api-navigation
```

Generation is deterministic for fixed inputs, **not network-independent**.
Generation, artifact checks, and API navigation validation fetch the pinned
canonical document with a 30-second timeout and verify its digest and shape.
Fetch/HTTP/timeout/parse failures, missing or mismatched operations, existing
canonical samples on a covered operation, invalid overlay targets/fields,
duplicate labels, missing languages, and stale/missing output fail explicitly.
The generated overlay may only add `x-codeSamples` at the 24 exact operation
targets. Stripping just those additions must recover the entire canonical
document, including all 20 paths and 24 operations, unchanged.
The API navigation guard runs this check and the regression tests in the existing
prebuild chain. Unit tests use an explicit fixture generator and fixture schema.
Integration tests compare every committed sample with the shared generator and
execute every emitted Node.js SDK and curl program against a loopback-only HTTP
fixture, checking exact methods, bodies, paths, query parameters, streaming
consumption, and absence of authentication.
These tests are network-independent; they do not contact an OpenFGA deployment
or prove authorization behavior against a real model. They do not execute the
Go, .NET, Python, or Java SDKs. Separate cached-toolchain checks compiled all 18
exact Go programs against 0.8.2 and ran all 18 Python 0.10.4 programs through
real constructors/configuration and async entrypoints with SDK requests mocked
and networking forbidden. Java 0.10.0 and .NET 0.10.4 signatures and model types
were checked against public source; JVM/.NET compilation and execution were
not available. Output equality alone is not an executed SDK test.

To update samples, edit their inputs or the shared SDK generators and regenerate;
never hand-edit the generated overlay. The metadata admits only the reviewed
minimal request inputs; expanding an example requires updating the input guards
and regression tests. To adopt a newer canonical source, review
the upstream artifact first, update the immutable URL in both `api-samples.json`
and `docs.json`, and update its digest and reviewed operation identities/counts
together with the guards and navigation as needed. Regenerate and run the checks
before reviewing the overlay diff. Keep the explicit `overlays` list: Mintlify
fails explicit overlay errors rather than silently skipping an auto-discovered
overlay. No new Mintlify CLI dependency is required by this pipeline.

### Non-production component fixture

[`tests/fixtures/mintlify/viewers.mdx`](../tests/fixtures/mintlify/viewers.mdx)
retains the 16 examples of all eight interactive components **outside the entire
Mintlify content root**. It is test input, not a published page or static asset.
The former internal `/docs/test-viewer` route has no replacement or redirect and
must return the native not-found page.

`npm run test:mintlify-component-usage` checks this fixture with the existing
MDX compiler, component contracts, and canonical DSL guard. It also checks the
complete DSL model's syntax, resolves logical `/snippets/...` imports against
the real Mintlify root, and tests missing files, symlinked paths, invalid props,
broken MDX, and lossy/invalid DSL. The tokenizer parity suite explicitly includes
its two authorization models and one DSL block alongside production examples.
Both `npm run check:mintlify` and `npm run test:mintlify-components` include these
fixture checks.

For an intentional visual preview, create a temporary directory **outside this
repository**, copy `mintlify-native/` there, then copy the external fixture into
that copy's `docs/` directory. Run `mint dev` from that isolated copy on a separate
port, inspect the temporary page, stop the server, and remove only that temporary
copy. Do not copy the fixture into the working content root, add it to `docs.json`,
or commit/deploy the temporary preview. Normal previews must keep the old route
absent.

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
page. The 111 Mintlify MDX files comprise the 110 owned pages plus the retained
Community copy. The separate component fixture is not counted as a published
destination or source-page exemption.

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
non-navigation migration copy. Community remains owned at `/community`. Published
fixture exemptions are no longer supported: adding the old `fixtures` field
fails validation. The external fixture has a fixed, symlink-free test location,
not a production manifest entry. Excluded copies cannot appear anywhere in docs
navigation, including hidden/searchable groups. The retired test-viewer routes
cannot be reassigned to a source, retained as excluded copies, or restored via
navigation, aliases, links, or redirects, including same-origin absolute URLs. Hidden
OpenAPI operation references are checked separately by the API validator, not
mistaken for documentation MDX.

The guard rejects missing or unlisted sources, stale/missing/unassigned
destinations (including MDX outside `docs/` and unexpected `.md` pages other than
the root contributor README), duplicate mappings/navigation,
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
and restores the last exact count if Mintlify's request fails. Cached values show
a visible **last known** label; the link's tooltip and accessible name also state
that the current count is unavailable and include when the value was observed.
The fallback never refreshes its own timestamp. A successful native count replaces
the cached display and removes the last-known label, even if the count decreased.
Expired values are removed after seven days.

The fallback never makes its own GitHub API request; first-time visitors without a
valid cached value retain the native icon-only state when that request fails.
`npm run test:mintlify-navigation` covers fallback labeling, expiry, recovery,
navigation remounts and unavailable browser storage.

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
- Snippets call the shared request generator from inside the exported function.
- Language metadata, SDK initialization, and pure operation generators live in a
  generated standalone browser helper, not cross-snippet or runtime npm imports.

### The window-global pattern

The standalone helpers expose these browser contracts:

| Global              | Library                                               | Set by                      |
| ------------------- | ----------------------------------------------------- | --------------------------- |
| `window.fgaCodegen` | `@openfga/syntax-transformer` (DSL ↔ JSON conversion) | `/fga-codegen.js`           |
| `window.openfgaDsl` | Generated OpenFGA Prism tokenizer                     | `/openfga-dsl-highlight.js` |
| `window.openfgaViewer` | Shared language metadata, SDK setup, operation generators | `/openfga-viewer.js` |

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

Standalone OpenFGA DSL examples must use `OpenFGACodeBlock`; do not use plain
fences or language aliases such as `dsl.openfga`, `openfga`, `fga`, or `dsl`.
Mintlify's native Shiki highlighter does not know the
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
Use `encodeOpenFgaCode` from `scripts/validate-openfga-code-blocks.mjs` for
lossless conversion, including trailing spaces and whitespace-only lines.
Keep existing `AuthzModelSnippetViewer` examples: their DSL view already uses
the same tokenizer and also supports JSON.

`npm run validate:mintlify-code-blocks` parses every Mintlify page as MDX,
rejects legacy OpenFGA language aliases and standalone models/fragments in
plain or unlabelled code nodes and literal JSX code wrappers, verifies that component imports appear
exactly once where needed, and requires each `code` prop to use canonical,
non-lossy template-literal escaping. For plain code, the official syntax parser
must recognize the entire body; enclosing syntax is supplied only to identify
standalone type, relation, condition, schema, and module-extension fragments,
never to change their displayed content. This is syntax classification, not
authorization-model validation. Mixed shell transcripts, YAML store files with
embedded models, JSON, explicitly labelled other languages, and literal examples
inside larger documentation fences remain unchanged. Inline code and JSX
comments are ignored. The root prebuild runs this guard
through `validate:mintlify-navigation`.

After converting examples, run
`npm run validate:mintlify-code-blocks -- --compare-ref <reviewed-base>` to compare
every converted model's bytes and order with the baseline and ensure existing
canonical blocks have not changed. Source-fixture and ancestor checks also
preserve instructional headings, step placement, and expandable examples.
For the retired `docs/test-viewer.mdx`, the comparison follows only the explicit
relocation to `tests/fixtures/mintlify/viewers.mdx` and checks the entire fixture
byte-for-byte, including prose and props. Later baselines also compare that
external fixture exactly once. Any other removed or renamed baseline page with
DSL examples still fails; relocation is not a general missing-page exemption.

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

Put the original page headline in frontmatter `title`, without repeating an H1
in the body. Use `sidebarTitle` when the navigation label differs from the
headline; keep the existing label when changing title metadata.

Preserve published fragment IDs when changing headings or moving them into
components. Mintlify's automatic punctuation and duplicate-heading slugs can
differ from Docusaurus. For H2-H4, use an explicit JSX heading such as
`<h2 id="legacy-heading-1">Original heading</h2>` when needed; Mintlify retains
its native anchor link and table-of-contents entry. Explicit IDs must identify
the correct section, not alias a duplicate heading elsewhere on the page.
Linked native components can also declare an `id`. Do not ignore `#fragment`
links to bypass validation.

For fifth-level headings, use Markdown with an inline target, for example
`##### <span id="legacy-heading" style={{ scrollMarginTop: '7rem' }}>Original heading</span>`.
The span stays inside the semantic heading and clears the sticky header on
fragment navigation. Explicit JSX `<h5>` headings can disappear in the native
renderer and are rejected by the component guard.

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
| `CheckRequestViewer` | `user`, `relation`, `object`: strings | `allowed`: boolean; omit for request-only examples (no response annotation); `contextualTuples`, `context`, `headers`: string record for SDKs/curl; `consistency`; common request props below |
| `BatchCheckRequestViewer` | `checks`: nonempty array of `{user, relation, object, correlation_id, allowed, contextualTuples?, context?}` | Common request props below |
| `WriteRequestViewer` | At least one nonempty `relationshipTuples` or `deleteRelationshipTuples` array | Omitted tuple arrays default to `[]`; `conflictOptions`: `{onDuplicateWrites?: 'error' \| 'ignore', onMissingDeletes?: 'error' \| 'ignore'}`; common request props below |
| `ListObjectsRequestViewer` | `user`, `relation`, `objectType`: strings; `expectedResults`: string array | `contextualTuples`, `context`; common request props below |
| `ListUsersRequestViewer` | `objectType`, `objectId`, `relation`, `userFilterType`: strings; `expectedResults`: `{users: [...]}` | `userFilterRelation`: string; `contextualTuples`, `context`; common request props below |
| `CreateStoreViewer` | None | `storeName`: nonempty string, default `"FGA Demo Store"`; `allowedLanguages` |

Common request props are `authorizationModelId` (string, default example ID
`01HVMMBCMGZNT3SED4Z17ECXCA`), `skipSetup` (boolean, default false), and
`allowedLanguages` (nonempty, duplicate-free array of supported identifiers).
The example model ID must be replaced with the ID returned when writing your
model; it is not a configured production model. Request fragments preserve the
source default for omitted or empty model-ID strings. Complete build-time
samples instead use `FGA_MODEL_ID`, unless an explicit model ID is supplied.

Tuples contain string `user`, `relation`, and `object` fields. Write and contextual
tuples also accept `_description` (an instructional comment, never payload data)
and `condition` with `name` and optional JSON-object `context`. Batch items may
include `_description` too. Delete tuples cannot contain a condition.
Request contexts are JSON objects, including nested values, arrays, booleans,
numbers, and nulls. Query viewers accept `consistency`: `UNSPECIFIED`,
`MINIMIZE_LATENCY`, or `HIGHER_CONSISTENCY`. Read pagination/continuation options
remain with the static Read examples, not these unrelated query operations.
Each ListUsers result has exactly one of
`object: {type, id}`, `wildcard: {type}`, or `userset: {type, id, relation}`.
Model inputs support `schema_version`, `type_definitions`, relations, metadata,
and conditions; a `{type, relations?, metadata?}` fragment is normalized to a
single-type model for DSL conversion without displaying the schema header.

These are **Mintlify authoring props, not ports of every Docusaurus export**.
`showWrite`, `pseudoCodeMode`, and other source-only options are not supported;
the validator reports them instead of letting React silently ignore them.
Source pseudocode-only callers use `allowedLanguages={['rpc']}`. Operation
generation preserves supplied context/condition/filter/consistency fields and
explicit false or empty values; it does not infer a successful response.
Invalid expectation types fail explicitly. Playground cannot execute contextual
tuples, context, custom headers, or consistency options, and CLI does not support
custom headers; those tabs say so instead of silently dropping the option.

### Shared operation generation

`scripts/operation-codegen.mjs` is the browser-safe, pure author source for all
six SDK viewers. `scripts/viewer-runtime.mjs` re-exports it and supplies shared
setup/composition. The standalone `openfga-viewer.js` bundle is generated from
these modules; do not put author-source `.js` files under the Mintlify root,
where they may be auto-injected as browser scripts.

Node tooling can import the same functions directly:

```js
import { buildSdkExample, buildRequestCode } from './scripts/viewer-runtime.mjs';
import { buildOperationRequest, buildOperationCode } from './scripts/operation-codegen.mjs';

const props = { user: 'user:anne', relation: 'reader', object: 'document:planning' };
const request = buildRequestCode('js-sdk', 'CheckRequestViewer', props);
const fullSample = buildSdkExample('js-sdk', 'CheckRequestViewer', props);
const curl = buildOperationCode('check', 'curl', props);
const wireBody = buildOperationRequest('check', props);
```

Operation IDs are `check`, `batchCheck`, `write`, `listObjects`, `listUsers`,
and `createStore`; component names and language IDs are the same as the snippet
contract. Complete samples include Node error-handled async entry points, Go
`main`, Python `async with`/`asyncio.run`, Java `Example.main`, or .NET top-level
statements. They use the environment-based no-auth setup; curl expands
`FGA_MODEL_ID` inside a shell-quoted JSON request. `buildCreateStoreCode` composes
the same generator, not a second set of operation strings.

Pure generators allow response expectations to be omitted, including batch
items and list results. An explicit empty list is an expected empty result,
not omission. Partial batch expectations annotate only the supplied decisions;
denied checks do not imply errors. `_description` is emitted as instructional
comments, never sent to the API. ListUsers wire `contextual_tuples` is an array,
while Check/ListObjects/BatchCheck use a `tuple_keys` wrapper. SDK-specific
wrapping happens only at the corresponding client boundary.

`operation-codegen.test.mjs` compares every existing source operation caller's
literal request, expectations, restrictions, descriptions, and generated bodies,
then exercises rich requests through the installed Node SDK and curl against a
loopback fixture. Python examples are syntax-checked. Static request and tuple
fixture tests compare Read filters/results/timestamps/options, model-writing
payloads and returned IDs, tuple descriptions, and combined YAML. These tests
are not an assertion that every SDK version or authentication mode was executed.

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
Pseudocode and Playground. `allowedLanguages` preserves the author's order.
The first entry is selected initially unless Mintlify restores a supported
native language preference. Short aliases such as `js`, `go`, and `dotnet`
are not authoring identifiers.
Use `csharp`, not `dotnet`, for native .NET fences.

Every setup/request code surface is one native multi-language `CodeGroup`, with
integrated tabs, highlighting and active-code copy controls. Snippets pass each
child's canonical `language` grammar and `filename` tab label; `title` is not a
CodeGroup tab label. Do not add a separate language selector or remount the
group on each selection.

Mintlify synchronizes matching tab labels between setup, request and other
native code groups, and persists its language preference across navigation and
reloads. Native selection callbacks keep the setup accordion hidden for
Pseudocode/Playground. Setup contains only the caller's languages with real SDK
or CLI initialization. Changing theme or opening setup does not reset selection.
Native tabs own keyboard navigation, focus, horizontal scrolling and copy; no
custom tab CSS or DOM synchronization is needed. This uses Mintlify's preference
behavior, not Docusaurus's `groupId="languages"` implementation.

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

Run the repository-owned quality gate from the repository root:

```bash
npm run check:mintlify
```

This includes the individual checks and their regression suites, including
MDX/prose, production-content parity, and custom-component tests.
`npm run test:mintlify-content-parity` runs the `live-*-parity.test.mjs` suites
against captured production contracts and source fixtures without fetching the
live site. These preserve restored prose and links, visible disclosure summaries,
legacy heading targets, and literal examples. They complement, rather than
replace, rendered comparisons and browser interaction checks.
`test:mintlify-components` still runs both
component-usage and viewer-runtime tests; the aggregate uses
`test:mintlify-component-usage` because `check:mintlify-codegen` already runs the
shared viewer-runtime suite. See the [root README](../README.md#mintlify-repository-quality-checks)
for CI triggers, network requirements, and the distinction from Mintlify CLI QA.

The component validator uses `@mdx-js/mdx`'s MDX/ESTree ASTs, not regular
expressions or evaluation of document JavaScript. It checks imports, actual JSX
uses, props and known data shapes, language subsets, and model/result structure.
Native Mintlify components, fenced examples, and comments are not constrained
by the custom-component contract. Expressions that cannot be inspected safely
are reported as deferred checks, not silently claimed as validated. Prefer
literal data for custom viewer props so the validator can check the whole
example. This command is separate from general MDX/prose validation.

After changing the runtime, run `npm run generate:mintlify-codegen` and commit
the generated helper with its source. Use representative real docs and, when
needed, the [isolated fixture preview](#non-production-component-fixture) to
verify first load, on-demand loading, switching languages, setup,
copy, and desktop/mobile Light/Dark/System themes. Node tests alone cannot prove
Mintlify's sandbox behavior or syntax grammar registration.

### Source component inventory and remaining conversions

Source paths below are relative to `src/components/Docs`. A static conversion
is not reusable component parity. All 111 source MDX files have counterparts;
the navigation guard separately checks the 110 sidebar source routes. The
viewer harness remains outside the published tree as an external test fixture.

| Source exports | Mintlify disposition |
| --- | --- |
| `AuthorizationModel/AuthzModelSnippetViewer` | Custom snippet; DSL/JSON and single-type fragments supported. Source `showWrite` and source-default DSL-only presentation are not equivalent. |
| `AuthorizationModel/AuthzModelCodeBlock`, `SyntaxTransformer`, `Dsl` | Converted through the model snippet, `OpenFGACodeBlock`, and existing official syntax-transformer/Prism artifacts; no runtime source-component import. |
| `SnippetViewer/CheckRequestViewer`, `BatchCheckRequestViewer`, `WriteRequestViewer`, `ListObjectsRequestViewer`, `ListUsersRequestViewer` | Five custom snippets with shared pure operation generation; current source callers retain request/expectation fixtures, including formerly static agent examples. RAG batch examples now have explicit correlation IDs in both source and migrated pages. |
| `SnippetViewer/DefaultTabbedViewer`, `SupportedLanguage`, `SdkSetup` | Converted to the canonical language contract, native synchronized CodeGroup tabs and shared no-auth initialization. The separate source pseudocode toggle is not ported. |
| Create-store examples (no dedicated source Docs component) | Custom `CreateStoreViewer`, with shared initialization and canonical language IDs. |
| `SdkSetup/SdkSetupPrerequisite` | Converted to prose: all 43 source occurrences retain deployment, URL/store ID and optional API-token prerequisites. |
| `SnippetViewer/ExecuteApiRequestViewer`, `ExecuteApiRequestStreamingViewer` | Missing reusable viewers; no current source MDX callers. |
| `SnippetViewer/ExpandRequestViewer` | Two static native code groups preserve source-supported SDK/CLI/curl/pseudocode instructions and initialization; surrounding response trees remain. No unused reusable export added. |
| `SnippetViewer/ReadRequestViewer` | Nine static native code groups preserve executable source examples, filters, timestamps, options and results. The migration read-all request is unfiltered and retains all source tuples. |
| `SnippetViewer/ReadChangesRequestViewer` | Four static native-tab examples retain seven languages, page size, type filter and continuation-token combinations. Python options/imports and curl quoting are executable; reusable viewer missing. |
| `SnippetViewer/StreamedListObjectsRequestViewer` | Static native tabs retain the source caller's five SDK languages and streamed results; reusable viewer missing. |
| `SnippetViewer/WriteAuthzModelViewer` | Static seven-language examples retain source model payloads and returned IDs. CLI file prerequisites are explicit; no reusable viewer is claimed. |
| `SnippetViewer/TupleViewer` | Four task-based examples retain ordered descriptions and values, readable tuple layout and one combined copyable YAML block per example. |
| `RelationshipTuples/RelationshipTuplesViewer`, `RelationshipCondition` | All 42 actual source callers retain tuple values, descriptions and JSON designation. Import-only references are not treated as callers. |
| `Column/ColumnLayout`, `CardBox`, `LinkBulletType`, internal `Link` | Tables/Markdown replace layout/link wrappers. Visual props are not ported; some instructional content is abridged. Internal Link has no direct MDX callers. |
| `Overview/CardGrid`, `IntroCard`, `RelatedSection` | Native CardGroup/Card/Note or Markdown; some grouping, titles and outer descriptions are lost. |
| `ProductName`, `ProductNameFormat`, `ProductConcept`, `IntroductionSection`, `UpdateProductNameInLinks` | Literal text/Markdown links; some source links became unlinked text. |
| `Banner`, `Playground`, `DocumentationNotice`, `FeedbackCallout` | No equivalent custom snippets. Banner/feedback have no direct MDX callers; playground/notice rendering is dormant under the current source configuration. |

Tutorial examples must stay inline with their instructional step. Use ordinary
code fences or native CodeGroups for requests and responses, and native
Accordions for expandable prerequisites. Keep original rich summary text visible
outside the Accordion, with its examples or starting model inside. The component
guard rejects raw HTML `details` and `summary`, including nested JSX, because
Mintlify can silently omit their bodies. Literal code examples remain allowed.
`RequestExample` and `ResponseExample` are API-page slots that can drop or
aggregate tutorial content. Reserve those slots for intentional API-reference
usage. Source-fixture tests check example ancestors and per-step placement, not
just whether the expected strings exist in the file.

The two model-design-principles examples and tuple prerequisite disclosures use
native Accordions so their prose and DSL are visible on expansion.
Unrelated layout/link/card wrapper differences
remain as classified above, rather than being counted as completed component
ports. The static SDK setup page retains 18 examples
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
