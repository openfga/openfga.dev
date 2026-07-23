# Migrating OpenFGA Docs from Docusaurus to Mintlify

## Overview

The FGA product docs are moving to Mintlify. This raises a question for the OpenFGA OSS docs at openfga.dev: should they move too, or stay on Docusaurus?

This document describes both options, compares them, and presents findings from a spike that was run to validate the migration path.

---

## The Two Options

### Option 1 — Keep OpenFGA on Docusaurus, migrate FGA docs to Mintlify independently

OpenFGA.dev stays on Docusaurus. The FGA product docs move to Mintlify independently. Because the two sites share a significant amount of content and the same custom interactive components, this option is not simply "do nothing." It requires:

1. **Build Mintlify-native viewer components** for the FGA Mintlify repo — CheckRequestViewer, WriteRequestViewer, ListObjectsRequestViewer, and all others need to work under Mintlify's constraints (no npm imports at runtime, logic inlined)
2. **Bundle `fga-codegen.js`** — the syntax-transformer bundle that powers model DSL/JSON display and syntax highlighting in Mintlify
3. **Build a content sync pipeline** that takes OpenFGA Docusaurus source MDX and converts it to Mintlify-compatible MDX: tab syntax, admonitions, component call sites, etc. This pipeline runs whenever the OpenFGA docs are updated upstream
4. **Ongoing pipeline maintenance** — any change to OpenFGA's component structure, new Docusaurus plugins, or MDX syntax changes can break the pipeline and require manual intervention

In short: this option requires doing most of the Mintlify component work regardless, plus building and maintaining a sync pipeline indefinitely.

### Option 2 — Migrate OpenFGA to Mintlify

OpenFGA.dev moves to Mintlify. Both sites share the same platform, component conventions, and authoring workflow. The Mintlify component work (viewer components, bundled JS) is done once and benefits both sites. Overlapping pages remain a clean git merge; no translation pipeline required.

A spike was run on this option — see below.

---

## Comparison

| | Option 1: Keep OpenFGA on Docusaurus | Option 2: Migrate OpenFGA to Mintlify |
|---|---|---|
| **Deployment speed** | ❌ PRs take days to go live (currently Layer0/Edgio; GitHub Pages is an alternative but a separate decision) | ✅ Minutes — Mintlify deploys on merge |
| **Mintlify component work** | ❌ Still required — FGA docs use the same components | ✅ Done once; both sites benefit |
| **Content sync** | ❌ Requires building and maintaining a translation pipeline | ✅ Clean git merge for overlapping pages |
| **Operational overhead** | ❌ Own Docusaurus build pipeline + sync pipeline | ✅ Managed platform — Mintlify handles builds and CDN |
| **Migration effort** | ⚠️ Ongoing pipeline maintenance indefinitely | ⚠️ One-time upfront (largely completed by spike) |
| **Blog** | ✅ Native Docusaurus blog feature | ❌ Requires a separate solution |
| **API documentation** | ❌ swagger-ui-react npm dependency + custom page | ✅ Native OpenAPI playground |
| **Search** | ❌ Requires Algolia setup and API keys | ✅ Built-in, no external service |
| **Cost** | ✅ Free (current: Layer0; or GitHub Pages) | ✅ Free (Mintlify OSS program) |
| **Reader experience** | Current | ✅ Meaningfully improved (validated in spike) |
| **DSL syntax highlighting** | ✅ Custom Prism grammar via @openfga/frontend-utils | ✅ Validated; can be generated from same package (see below) |

---

## About the Spike

To validate Option 2, a spike was run on the `poc/mintlify-native` branch of `github.com/openfga/openfga.dev`. The full site was ported to Mintlify and all technical unknowns were resolved.

**What the spike proved:**
- The complete docs corpus (120 pages) can be ported accurately from Docusaurus source
- All 9 interactive viewer components can be re-implemented under Mintlify's constraints
- DSL syntax highlighting works and can be kept in sync with the upstream Prism grammar (see below)
- The API playground works natively from the existing spec file
- The landing page can be ported using Mintlify's `mode: "custom"` page type
- Deployment works from a subdirectory via Mintlify's monorepo mode

The rest of this document covers the findings in detail.

---

## Why Mintlify (Supporting Option 2)

### 1. Deployment speed

The current site deploys through Layer0 (Edgio). PRs routinely take days to reflect on the live site. A docs fix or a new page requires a multi-day wait to ship. (Moving to GitHub Pages would address this independently, but that is a separate decision from the platform choice.)

Mintlify deploys from git on merge — changes are live in minutes.

### 2. Native OpenAPI playground

The current `/api/service` page wraps `swagger-ui-react` in a custom Docusaurus page. Mintlify renders an interactive API playground natively from a spec file. During the spike, wiring this up required pointing `docs.json` at the OAS3 spec and changing two lines — no separate package, no custom page.

### 3. Lower operational overhead

Docusaurus is a Node.js application with its own build pipeline, plugins, and dependency tree. Mintlify is a managed platform: content lives in git as standard MDX files, and the platform handles builds, CDN, search indexing, and preview environments.

### 4. Cleaner reader experience

Based on the working spike (visible on `poc/mintlify-native`), the Mintlify site is a meaningful visual upgrade: tighter typography, better dark mode, a cleaner sidebar hierarchy, and more polished code block rendering. These are observable in the running prototype, not claims from Mintlify's marketing.

### 5. Integrated search

Mintlify search works out of the box — no Algolia application, API keys, or indexing pipeline to maintain.

### 6. FGA docs alignment (secondary)

Keeping both repos on the same platform means no context switching for engineers who touch both, and no translation overhead for overlapping content. This is a real benefit, but it is secondary — the case for migration stands without it.

---

## What Makes This Migration Non-Trivial — and How We Solved It

The OpenFGA docs are not a typical docs site. They have nine custom interactive components that generate multi-language SDK code samples from props. A spike was run to validate the full migration approach.

### Interactive viewer components

Mintlify uses a "snippets" system: JSX files in a `snippets/` directory that are available site-wide, with the constraint that they cannot import npm packages or local files — all logic must be self-contained.

**All nine components have been ported and are working in the spike:**

| Component | What it does |
|---|---|
| `CheckRequestViewer` | Multi-language check request code (9 languages) |
| `BatchCheckRequestViewer` | Multi-language batch check code (7 languages) |
| `WriteRequestViewer` | Multi-language write/delete tuple code (8 languages) |
| `ListObjectsRequestViewer` | Multi-language list objects code (8 languages) |
| `ListUsersRequestViewer` | Multi-language list users code (8 languages) |
| `AuthzModelSnippetViewer` | DSL/JSON model display with syntax highlighting |
| `OpenFGACodeBlock` | DSL code blocks with syntax highlighting |
| `CreateStoreViewer` | Multi-language create store code (7 languages) |
| `HomePage` | Landing page (hero, adopters carousel, features, resources) |

The ported components accept the same props as the Docusaurus originals. Call sites in MDX do not change.

### DSL syntax highlighting — keeping in sync with the Prism grammar

OpenFGA DSL has a custom Prism grammar registered via `@openfga/frontend-utils`. Mintlify uses Shiki and has no mechanism for custom grammars.

A natural concern is that a hand-ported tokenizer would drift from the upstream Prism grammar over time. This can be avoided: `@openfga/frontend-utils` exports both the grammar rules (`dist/tools/prism/language-definition.js`) and the `openfga-dark` color theme (`dist/theme/supported-themes/openfga-dark.js`) as importable JS objects. The tokenizer for Mintlify can be **generated from these package exports at build time** — the same `build-fga-codegen.sh` script that bundles `@openfga/syntax-transformer` can also bundle the tokenizer built from the live grammar rules. When `@openfga/frontend-utils` updates its grammar, rebuilding the bundle picks up the changes automatically. No manual porting, no drift.

### Content format differences

Docusaurus MDX uses platform-specific syntax that maps cleanly to Mintlify:

| Docusaurus | Mintlify |
|---|---|
| `<Tabs groupId="languages">/<TabItem value={SupportedLanguage.X}>` | `<Tabs>/<Tab title="Node.js">` |
| `:::note`, `:::warning` admonitions | `<Note>`, `<Warning>` callouts |
| `<RelatedSection>` component | `<CardGroup>/<Card>` |
| `{ProductName}` template variable | literal "OpenFGA" |

These are all mechanical conversions applied across all 120 pages in the spike.

### Static asset handling — Git LFS

This is a significant gotcha for any repo that uses Git LFS, confirmed through deployment testing.

**Mintlify's deployment reads files via the GitHub API, which returns LFS pointers instead of actual content.** All static assets must be stored as regular git blobs. The `openfga.dev` repo tracks all binary files with LFS globally (`*.svg`, `*.png`, `*.mp4`, `*.webm`), so the `mintlify-native/` subdirectory needs `.gitattributes` override rules. Two implementation details matter:

1. **Override rules must appear *after* global LFS rules** in `.gitattributes` — later rules win, so any override placed before the global `*.mp4 filter=lfs` line will be overridden back.
2. **Git LFS hooks intercept `git add`** even when the filter attribute is unset. You must bypass them explicitly: `git -c filter.lfs.clean=cat add <files>`.

**Videos** must be committed as regular git blobs, placed in a `videos/` subdirectory, and referenced using the `src` attribute directly on the `<video>` element — not via `<source>` children. Confirmed with Mintlify support:

```html
<video autoPlay muted loop playsInline src="/videos/pattern.mp4" />
```

**CSS and JS files are auto-included** by Mintlify on every page — place any `.css` or `.js` file in the content directory and it's automatically injected site-wide, no `docs.json` entry needed. Note: these files are injected at deploy time and are not URL-addressable (a browser fetch of `/home.css` returns 404). Do not try to load them manually via `<link>` or `<script>` tags.

### Code block theming

Mintlify's `styling.codeblocks` defaults to `"system"`, which follows OS preference. With `appearance.strict: true` (force dark mode), code blocks in API playground descriptions were still rendering light because they use Shiki's dual-theme variables. Two fixes are needed:

1. Set `"styling": { "codeblocks": "dark" }` in `docs.json`
2. Add a CSS rule to activate Shiki's `--shiki-dark` variables under the `.dark` root class (inline styles from Shiki's dual-theme mode take precedence over class-based selectors without `!important`)

### MDX JSX expression escaping

Curly braces `{}` in MDX are parsed as JavaScript expressions. Text like `{object types}` (with a space) is invalid JavaScript and causes an acorn parse error during the Mintlify build, resulting in a 404 for that page — not an obvious error. Template-style placeholders in prose must be escaped: `\{object types\}`. Scan all ported MDX files for unescaped `{multi word}` patterns before deploying.

---

## Current State of the Spike

A working Mintlify site exists on the `poc/mintlify-native` branch of `github.com/openfga/openfga.dev`. Run `npx mint dev` from the `mintlify-native/` directory to see it locally.

**What is done:**
- 120 pages — the complete OpenFGA docs corpus, ported from source MDX
- All 9 interactive viewer components implemented and wired up
- DSL syntax highlighting working and visually verified
- Native OpenAPI playground (24 endpoints, 6 tag groups)
- Landing page ported with video, carousel, and features grid
- All content audited against Docusaurus source for accuracy
- URL structure deliberately preserved — no redirects required

**What remains:**
- Blog (see below)
- Production deployment and DNS configuration
- GitHub live star count in navbar (minor: one custom snippet)
- Regenerate tokenizer from `@openfga/frontend-utils` package exports (currently hand-ported; straightforward build script change)

---

## Migration Approach (if Option 2 is chosen)

The hard work is done. What remains is deployment configuration and a blog decision.

### Phase 1 — Content freeze and final review
- Diff the ported content against the live Docusaurus site to catch any changes made since the spike
- Review pages visually in `mint dev`

### Phase 2 — Production setup
- Create a Mintlify project, connect the repo
- Configure the custom domain (`openfga.dev`) in Mintlify's dashboard
- Enable monorepo mode, set root directory to `/mintlify-native`
- URL paths were kept identical to Docusaurus slugs — no redirects needed

### Phase 3 — Blog decision and cutover
- Resolve the blog question (see below)
- DNS cutover: point `openfga.dev` at Mintlify

### Ongoing
- New docs pages: write MDX, add to `docs.json` nav — same workflow as today
- New viewer component calls: same props and component names as before
- Docusaurus repo archived after a deprecation window

---

## The Blog Question

The current blog at `openfga.dev/blog` (23 posts: monthly "Fine-Grained News" newsletters + technical feature announcements) is not covered by Mintlify's docs feature set. Three options:

### Option 1 — Keep blog on Docusaurus (recommended to unblock migration)

Route `/blog/*` to a Docusaurus-only deployment (blog-only build) via CDN rules. Route everything else to Mintlify.

- Zero migration work — no content changes, no URL changes
- All existing RSS subscribers, SEO, and external links preserved
- Requires a routing layer to stitch two deployments under `openfga.dev`
- Blog can be migrated separately at any future point

### Option 2 — GitHub Pages with Jekyll

Replace Docusaurus with Jekyll on GitHub Pages. Jekyll is GitHub's native static site generator — no npm build pipeline, just Markdown files and a `_config.yml`.

- Free; stays entirely within the GitHub ecosystem
- RSS, author attribution, and tags supported via standard Jekyll plugins
- Content migration is straightforward (posts are already plain Markdown)
- Less polished authoring experience than Ghost/Hashnode
- Less overhead than maintaining a Docusaurus install just for a blog

### Option 3 — Ghost at `blog.openfga.dev`

Move the blog to Ghost, served at `blog.openfga.dev`. Set up 301 redirects from `openfga.dev/blog/*`.

- RSS, author profiles, tag pages, newsletter subscriptions: all built-in
- Clean separation: docs platform handles docs, blog platform handles blog
- Ghost Pro: ~$25/month, or self-hosted

**Not recommended:** Mintlify's Changelog feature has no author attribution and is designed for release notes, not long-form technical content.

---

## Summary

Option 1 is more complex than it first appears: the Mintlify component work (viewer components, bundled JS, tokenizer) is required regardless, and the additional cost is building and maintaining a content sync pipeline indefinitely.

Option 2 does that component work once, benefits both sites, and eliminates the pipeline. The spike has validated the full migration path: the interactive components work, DSL highlighting works and can be kept automatically in sync with the upstream grammar, the full content corpus is ported, and the reader experience is meaningfully better.

The blog is orthogonal to the docs migration decision and can be resolved independently.
