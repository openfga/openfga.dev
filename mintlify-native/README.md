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
The logo links to the Docusaurus homepage. Native sidebar anchors keep the API
reference in Mintlify and link Project, Community, and Blog to their Docusaurus
routes. Mintlify's native search remains available in the docs header.

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
├── docs/                  # 111 public docs pages plus the hidden test harness
├── images/                # Mintlify logo assets
├── snippets/              # 8 interactive React components (see below)
├── lib/codegen/
│   └── check-reference.js.txt  # Reference file — see note below
└── scripts/
    ├── build-fga-codegen.sh   # Reproducible build for both browser artifacts
    ├── openfga-dsl-highlight.entry.cjs
    └── openfga-dsl-highlight.test.mjs
```

The API tab consumes the canonical OpenAPI 3.0.3 document generated in
[`openfga/api`](https://github.com/openfga/api/tree/main/docs/openapiv3), pinned to
the immutable merge commit for
[`openfga/api#259`](https://github.com/openfga/api/pull/259). Update that revision
through a reviewed change when adopting a newer API artifact. The navigation
validator supports both local and HTTPS specifications and fails the build if the
canonical operation set drifts.

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
- Codegen logic (the SDK code-sample strings) is inlined verbatim

### The window-global pattern

Two features require large JavaScript libraries that can't be npm-imported at runtime:

| Global              | Library                                               | Set by                      |
| ------------------- | ----------------------------------------------------- | --------------------------- |
| `window.fgaCodegen` | `@openfga/syntax-transformer` (DSL ↔ JSON conversion) | `/fga-codegen.js`           |
| `window.openfgaDsl` | Generated OpenFGA Prism tokenizer                     | `/openfga-dsl-highlight.js` |

Both files are served as static assets by Mintlify. The snippets that need them
self-inject a `<script>` tag via `useEffect` on mount and then poll for the global
with `setInterval` until it's available. This mirrors a pattern already in use in the
Auth0 docs.

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

### Generated browser artifacts

`fga-codegen.js` is a pre-bundled IIFE of the installed
`@openfga/syntax-transformer`, produced by the exact esbuild version in
`package-lock.json`. The size is inherent to the library's dependencies (ANTLR4,
AJV, and yaml). Its crypto shim maps `require("crypto")` to `globalThis.crypto`
(Web Crypto API).

Install the root dependencies and regenerate both committed artifacts after
upgrading either source package or Prism:

```bash
npm ci
npm run generate:mintlify-codegen
```

`npm run check:mintlify-codegen` rebuilds into a temporary directory, fails when
either committed artifact is stale, and runs tokenizer parity, source consistency,
runtime isolation, and migrated-corpus tests. The root build invokes this freshness
check in `prebuild`.

---

## Interactive viewer components

All 8 components accept the same props as their Docusaurus equivalents.
Call sites in MDX do not change between platforms.

| Component                  | Langs | Description                                                  |
| -------------------------- | ----- | ------------------------------------------------------------ |
| `CheckRequestViewer`       | 9     | Multi-language check request with optional setup accordion   |
| `BatchCheckRequestViewer`  | 7     | Batch check (no CLI/Playground — not supported upstream)     |
| `WriteRequestViewer`       | 8     | Write/delete tuples; supports conditions and conflictOptions |
| `ListObjectsRequestViewer` | 8     | List objects with optional contextual tuples                 |
| `ListUsersRequestViewer`   | 8     | List users; supports userFilterRelation for userset filters  |
| `AuthzModelSnippetViewer`  | —     | DSL/JSON tab toggle with syntax highlighting                 |
| `OpenFGACodeBlock`         | —     | DSL code block with openfga-dark syntax highlighting         |
| `CreateStoreViewer`        | 7     | Create store code; takes `storeName` prop                    |

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
   `/openfga-dsl-highlight.js` to the Mintlify origin.
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
