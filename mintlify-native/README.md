# OpenFGA Docs — Mintlify Port (POC)

This directory contains a complete port of [openfga.dev](https://openfga.dev) from
Docusaurus to [Mintlify](https://mintlify.com). It is a proof-of-concept on the
`poc/mintlify-native` branch of the `openfga/openfga.dev` repo.

The migration proposal is in [`MINTLIFY-MIGRATION-PROPOSAL.md`](../MINTLIFY-MIGRATION-PROPOSAL.md)
at the repo root.

---

## Running locally

```bash
cd mintlify-native/
npx mint dev --port 3333
```

Then open `http://localhost:3333`.

If startup fails with `Error: Client not built`, delete `~/.mintlify/mint/` and rerun —
the CLI will re-download a fresh pre-built copy.

---

## What's in here

```
mintlify-native/
├── docs.json              # Mintlify nav and theme config
├── index.mdx              # Home page (mode: "custom")
├── home.css               # CSS for home page (keyframes, media queries)
├── openfga-dsl-highlight.js   # Standalone DSL syntax highlighter (window global)
├── fga-codegen.js         # Pre-bundled @openfga/syntax-transformer (window global)
├── api/
│   └── openfga-openapi3.json  # OAS3 spec (converted from upstream Swagger 2.0)
├── docs/                  # 120 MDX pages, full OpenFGA docs corpus
├── images/                # SVG logos and icons
├── snippets/              # 9 interactive React components (see below)
├── lib/codegen/
│   └── check.js           # Reference file — see note below
├── scripts/
│   └── build-fga-codegen.sh   # Reproducible build for fga-codegen.js
└── pattern.mp4/.webm/.png     # Hero section videos
    terminal.mp4/.webm/.png    # Quick start section videos
```

### docs/test-viewer.mdx

A component validation page (not in the sidebar nav) that renders all 9 interactive
viewers with test data. Useful for quickly verifying components work after changes.
Access at `/docs/test-viewer` on a running dev server.

### lib/codegen/check.js

**Not a runtime file.** A readable reference extraction of the `CheckRequestViewer`
codegen logic (ported from the Docusaurus source). When the upstream
`src/components/Docs/SnippetViewer/CheckRequestViewer.tsx` changes, diff against
this file to understand what needs updating in `snippets/CheckRequestViewer.jsx`.

---

## Architecture

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

| Global | Library | Set by |
|---|---|---|
| `window.fgaCodegen` | `@openfga/syntax-transformer` (DSL ↔ JSON conversion) | `/fga-codegen.js` |
| `window.openfgaDsl` | Custom tokenizer | `/openfga-dsl-highlight.js` |

Both files are served as static assets by Mintlify. The snippets that need them
self-inject a `<script>` tag via `useEffect` on mount and then poll for the global
with `setInterval` until it's available. This mirrors a pattern already in use in the
Auth0 docs.

Mintlify does not support a `docs.json` field for custom scripts — the only mechanism
is to drop a `.js` file in the content tree and have snippets load it on demand.

### DSL syntax highlighting

OpenFGA DSL uses a custom Prism grammar registered via `@openfga/frontend-utils`.
Mintlify uses Shiki and has no mechanism for registering custom grammars.

`openfga-dsl-highlight.js` (~100 lines, zero dependencies) ports the ~10 regex rules
from the Prism grammar and the color values from the `openfga-dark` theme into a
standalone tokenizer. Colors match the current Docusaurus output exactly.

### fga-codegen.js

A 474KB pre-bundled IIFE of `@openfga/syntax-transformer@0.2.1`, produced by esbuild.
The size is inherent to the library's dependencies (ANTLR4 113KB, AJV 206KB, yaml 273KB).
`@openfga/sdk` is only 3KB in the bundle; the crypto shim maps `require("crypto")`
to `globalThis.crypto` (Web Crypto API).

To rebuild after upgrading `@openfga/syntax-transformer`:

```bash
bash mintlify-native/scripts/build-fga-codegen.sh
```

---

## Interactive viewer components

All 9 components accept the same props as their Docusaurus equivalents.
Call sites in MDX do not change between platforms.

| Component | Langs | Description |
|---|---|---|
| `CheckRequestViewer` | 9 | Multi-language check request with optional setup accordion |
| `BatchCheckRequestViewer` | 7 | Batch check (no CLI/Playground — not supported upstream) |
| `WriteRequestViewer` | 8 | Write/delete tuples; supports conditions and conflictOptions |
| `ListObjectsRequestViewer` | 8 | List objects with optional contextual tuples |
| `ListUsersRequestViewer` | 8 | List users; supports userFilterRelation for userset filters |
| `AuthzModelSnippetViewer` | — | DSL/JSON tab toggle with syntax highlighting |
| `OpenFGACodeBlock` | — | DSL code block with openfga-dark syntax highlighting |
| `CreateStoreViewer` | 7 | Create store code; takes `storeName` prop |
| `HomePage` | — | Landing page (hero, adopters carousel, features, resources) |

---

## Deploying to Mintlify

Mintlify supports deploying from a subdirectory via **monorepo mode**:

1. In the Mintlify dashboard → Git Settings → enable **"docs.json is in a subdirectory"**
2. Set the path to `/mintlify-native` (no trailing slash)
3. Connect to GitHub — deploys on push; the live URL has no subdirectory component

No `docs.json` changes are needed.

---

## Known limitations / production TODO

### Blog not migrated

The 23-post blog at `openfga.dev/blog` is not part of this port. Two options:

- **Keep blog on Docusaurus**: Route `/blog/*` to a Docusaurus-only deployment via CDN
  rules; route everything else to Mintlify. Zero content migration, all existing URLs
  preserved.
- **Move to Ghost**: Serve at `blog.openfga.dev` with 301 redirects from
  `openfga.dev/blog/*`. Better long-term authoring experience.

### Video files committed to git

`pattern.mp4/.webm` and `terminal.mp4/.webm` are committed (< 1MB each). The current
Docusaurus site also commits these videos and serves them from GitHub Pages static
hosting — no CDN is in use today on either platform.

Mintlify automatically delivers committed static files via its CDN, so this is
actually an improvement over the current setup. However, Mintlify's own guidance
recommends embedding videos via YouTube or Loom instead of committing binary files,
for page load performance. For a production launch, replacing these with embedded
video players would be the right call.

### GitHub live star count

The navbar's `type: "github"` link shows a static config, not a live count. The
current Docusaurus site fetches the GitHub API client-side to show a live count;
replicating this in Mintlify requires a custom snippet that calls the GitHub API.

### Lottie animations replaced with static SVGs

The original landing page uses Lottie-animated icons for four of the six feature
cards. Mintlify snippets can't import the Lottie npm package, so these are replaced
with simple inline SVGs. The feature cards work correctly; the icons don't animate.
