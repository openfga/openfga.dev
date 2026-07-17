# Migrating OpenFGA Docs from Docusaurus to Mintlify

## Background

The FGA product docs are moving to Mintlify. One response to this is to build
a translation pipeline that automatically syncs changes from the OpenFGA Docusaurus
source into the FGA Mintlify repo — converting component syntax, tab structures,
and MDX conventions at pull time.

That approach is worth naming explicitly because it is the alternative to migration,
not "do nothing." But it has significant downsides:

- The translation layer is brittle: any new component, syntax change, or Docusaurus
  plugin upgrade in the source can silently break it
- It is complex to build and test — the conversion is not purely mechanical,
  it requires understanding component semantics
- It creates a permanent maintenance burden on a pipeline that adds no user value
- It constrains the OpenFGA docs from evolving independently (any change needs
  to be translatable)

This document argues that a clean migration eliminates that pipeline entirely,
and that Mintlify is independently a better platform for openfga.dev — separate
from the FGA alignment question.

---

## Why Mintlify

### 1. Deployment speed

The current site deploys through Layer0 (Edgio). PRs routinely take days to
reflect on the live site. This is not a Docusaurus problem specifically, but it
is the current reality: a docs fix or a new page requires a multi-day wait to
ship.

Mintlify deploys from git on merge — changes are live in minutes. For a project
where community contributors open PRs and the team needs to ship release
announcements alongside feature releases, this is a material improvement.

### 2. Native OpenAPI playground

The current `/api/service` page wraps `swagger-ui-react` in a custom Docusaurus
page. That means managing the `swagger-ui-react` npm dependency, the custom page
wrapper, and the Swagger 2.0 → OAS3 conversion if the API spec format changes.

Mintlify renders an interactive API playground natively from a spec file. During
the spike, wiring this up required pointing `docs.json` at the OAS3 spec and
changing two lines — no separate package, no custom page.

### 3. Lower operational overhead

Docusaurus is a Node.js application with its own build pipeline, plugins, and
dependency tree. The team owns upgrades, compatibility fixes, and deployment
configuration. Mintlify is a managed platform: content lives in git as standard
MDX files, and the platform handles builds, CDN, search indexing, and preview
environments. The team owns the content, not the infrastructure.

### 4. Cleaner reader experience

Based on the working spike (visible locally on the `spike/mintlify-native` branch),
the Mintlify site is a meaningful visual upgrade: tighter typography, better
dark mode, a cleaner sidebar hierarchy, and more polished code block rendering
(inline copy buttons, language labels, consistent styling). The almond theme
matches OpenFGA's brand colors with minimal CSS. These are observable in the
running prototype, not claims from Mintlify's marketing.

### 5. Integrated search, no external service

Mintlify search works out of the box, no API keys or external indexing pipeline.
The current Docusaurus setup requires Algolia, which means managing a separate
application, index configuration, and API keys.

### 6. FGA docs alignment (secondary)

Keeping both repos on the same platform means shared component patterns, shared
conventions, and no context switching for engineers who touch both. This is a
real benefit, but it is secondary — the case for migration stands on its own.

---

## What Makes This Migration Non-Trivial — and How We Solved It

The OpenFGA docs are not a typical docs site. They have eight custom interactive
components that generate multi-language SDK code samples from props. A spike was
run to validate the full migration approach before proposing it.

### Interactive viewer components

Docusaurus bundles TypeScript React components (`CheckRequestViewer`,
`AuthzModelSnippetViewer`, `WriteRequestViewer`, etc.) into its build.

Mintlify uses a "snippets" system: JSX files in a `snippets/` directory that are
available site-wide, with the constraint that they cannot import npm packages or
local files — all logic must be self-contained.

**All eight components have been ported and are working in the spike:**

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

The ported components accept the same props as the Docusaurus originals and
produce identical output. Call sites in MDX do not change.

### DSL syntax highlighting

OpenFGA DSL has a custom Prism grammar registered via `@openfga/frontend-utils`.
Mintlify uses Shiki and has no mechanism for custom grammars.

**Solution:** A standalone tokenizer (`openfga-dsl-highlight.js`, ~100 lines,
zero dependencies) was built by porting the ~10 regex rules from the Prism grammar
and the color values from the `openfga-dark` theme. It is served as a static
file and runs client-side. Syntax highlighting colors match the current
Docusaurus output exactly — verified visually in the spike.

### Content format differences

Docusaurus MDX uses platform-specific syntax that maps cleanly to Mintlify:

| Docusaurus | Mintlify |
|---|---|
| `<Tabs groupId="languages">/<TabItem value={SupportedLanguage.X}>` | `<Tabs>/<Tab title="Node.js">` |
| `:::note`, `:::warning` admonitions | `<Note>`, `<Warning>` callouts |
| `<RelatedSection>` component | `<CardGroup>/<Card>` |
| `{ProductName}` template variable | literal "OpenFGA" |

These are all mechanical conversions. During the spike, automated workflows
applied them across all 120 pages and the results were audited against the
Docusaurus source for accuracy.

---

## Current State of the Spike

A working Mintlify site exists on the `spike/mintlify-native` branch.
Run `npx mint dev` from the `mintlify-native/` directory to see it locally.

**What is done:**
- 120 pages — the complete OpenFGA docs corpus, ported from source MDX
- All 8 interactive viewer components implemented and wired up
- DSL syntax highlighting working and visually verified
- Native OpenAPI playground (24 endpoints, 6 tag groups)
- Landing page ported with video, carousel, and features grid
- All content audited against Docusaurus source for accuracy
- URL structure deliberately preserved — no redirects required

**What remains:**
- Blog (see below)
- Production deployment and DNS configuration
- GitHub live star count in navbar (minor: one custom snippet)

---

## Migration Approach

The hard work is done. What remains is deployment configuration and a blog decision.

### Phase 1 — Content freeze and final review
- Diff the ported content against the live Docusaurus site to catch changes
  made since the spike was cut
- Review pages visually in `mint dev`

### Phase 2 — Production setup
- Create a Mintlify project, connect the repo
- Configure the custom domain (`openfga.dev`) in Mintlify's dashboard
- URL paths were kept identical to Docusaurus slugs, so no redirects are needed

### Phase 3 — Blog decision and cutover
- Resolve the blog question (see below)
- DNS cutover: point `openfga.dev` at Mintlify

### Ongoing
- New docs pages: write MDX, add to `docs.json` nav — same workflow as today
- New viewer component calls: same props and component names as before
- Docusaurus repo archived after a deprecation window

---

## The Blog Question

The current blog at `openfga.dev/blog` (23 posts: monthly "Fine-Grained News"
newsletters + technical feature announcements) is not covered by Mintlify's
docs feature set. Two options are proposed:

### Option 1 — Keep blog on Docusaurus (recommended to unblock migration)

Don't migrate the blog now. Route `/blog/*` to a minimal Docusaurus deployment
(blog-only build, all docs removed). Route everything else to Mintlify via
CDN rules (Cloudflare Workers or Vercel rewrites).

- Zero migration work for the blog — no content changes, no URL changes
- All existing RSS subscribers, SEO, and external links preserved
- Requires a routing layer to stitch two deployments under `openfga.dev`
- Docusaurus stays in the repo but only serves the blog; it can be migrated
  separately at any point

This option unblocks the docs migration immediately without forcing a blog
decision.

### Option 2 — Move blog to Ghost at `blog.openfga.dev`

Move the blog to Ghost (or Hashnode), served at `blog.openfga.dev`. Set up
301 redirects from `openfga.dev/blog/*` to `blog.openfga.dev/*`.

- RSS, author profiles, tag pages, newsletter subscriptions: all built-in
- Blog content is plain Markdown today — straightforward to import
- Clean separation: docs platform handles docs, blog platform handles blog
- Ghost Pro: ~$25/month, or self-hosted

This is the right long-term home for the blog, but it is independent of the
docs migration and can be done separately.

**Not recommended:** Mintlify's Changelog feature. It has no author attribution
and is designed for release notes, not long-form technical content.

---

## Summary

Mintlify is independently a better platform for openfga.dev: faster deployment,
no build infrastructure to maintain, a cleaner reader experience, and a native
API playground. The FGA docs alignment removes the need for a translation pipeline
and is an additional benefit.

The spike has already done the hard work: all 120 pages are ported and audited,
all 8 viewer components are implemented, and DSL syntax highlighting is working.
What remains is production deployment configuration and a blog decision.
