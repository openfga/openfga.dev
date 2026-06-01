# SEO Audit — openfga.dev

**Date:** 2026-05-20
**Audit type:** Full site audit
**Auditor scope:** Crawled homepage, `/docs/fga`, `/docs/getting-started`, `/docs/authorization-concepts`, `/docs/modeling/agents`, and `/blog`. Competitor benchmarking via SERP review of authzed.com, cerbos.dev, permit.io, osohq.com, permify.co, workos.com, and pkgpulse.com.

> **Tooling note.** No SEO MCP (Ahrefs, Semrush, Supermetrics) is connected to this session. Search volume, keyword difficulty, and live ranking positions below are **directional estimates** based on SERP behavior, intent classification, and content saturation. Connect Ahrefs or Supermetrics to repopulate the keyword tables with hard data. Likewise, robots.txt and sitemap.xml could not be directly retrieved in this run (provenance restriction on the fetch tool); the recommendations assume Docusaurus' default behavior, which is correct for OpenFGA's stack but should be spot-checked.

---

## Executive Summary

openfga.dev has a **strong technical foundation** — clean Docusaurus build, HTTPS, mobile viewport, canonical tags, OG/Twitter cards, descriptive URLs, and a sane information architecture. The brand has real authority: CNCF Incubation status, Auth0/Okta heritage, marquee adopters (Grafana, Docker, Canonical, Sourcegraph), and a healthy GitHub footprint.

The site is **underperforming relative to that authority** for three reasons:

1. **Most pages ship without a real meta description.** The homepage's is 73 characters and generic ("Relationship-based access control made fast, scalable, and easy to use"); deeper docs pages either inherit weak defaults ("Introduction to FGA") or have none. This costs SERP click-through across the entire long tail of documentation queries.
2. **Competitors own OpenFGA's own branded research traffic.** "OpenFGA alternatives," "OpenFGA vs SpiceDB," and "OpenFGA vs Cerbos" all surface third-party pages (Authzed, Oso, Permify, pkgpulse) — not openfga.dev. There are zero comparison or alternatives pages on the OpenFGA domain.
3. **The blog is a changelog, not a content engine.** ~60% of posts are "Fine-Grained News" monthly digests aimed at existing users. The site has no /learn hub, no glossary, no use-case landing pages, and no customer case studies — even though the project has at least four KubeCon talks and CNCF interviews to draw from.

**Overall assessment:** Strong foundation, significant on-page and content gaps. The top three priorities — fix meta descriptions, build a comparison hub, and lift the agent/RAG/MCP content out of /docs into a dedicated landing surface — are all low-to-moderate effort and directly target traffic competitors are currently capturing.

---

## 1. Keyword Opportunity Table

Opportunity Score reflects the combination of intent fit, competitive saturation, and openfga.dev's existing authority signal. **High = pursue this quarter. Medium = next quarter. Low = nice to have.**

| Keyword | Est. Difficulty | Opportunity | Current Ranking (est.) | Intent | Recommended Content Type |
|---|---|---|---|---|---|
| openfga | Easy | High | #1 (branded) | Navigational | Already owned — protect via FAQ/Organization schema |
| fine-grained authorization | Hard | High | Page 1, mid | Informational | Pillar page at /fine-grained-authorization (not buried in /docs) |
| openfga alternatives | Easy | High | **Not ranking** | Commercial | /alternatives comparison hub (currently owned by Oso, Authzed, Permify) |
| openfga vs spicedb | Easy | High | **Not ranking** | Commercial | Dedicated /compare/openfga-vs-spicedb page |
| openfga vs cerbos | Easy | High | **Not ranking** | Commercial | Dedicated /compare/openfga-vs-cerbos page |
| openfga vs permit | Easy | High | **Not ranking** | Commercial | Dedicated /compare/openfga-vs-permit page |
| openfga vs oso | Easy | Medium | **Not ranking** | Commercial | /compare/openfga-vs-oso |
| openfga vs auth0 fga | Easy | High | Page 2 (docs.fga.dev owns it) | Commercial | Reclaim with definitive doc on openfga.dev |
| zanzibar authorization | Moderate | High | Page 1 (Authzed dominates) | Informational | Pillar guide + Zanzibar Academy cross-link |
| relationship-based access control | Moderate | High | Page 1 | Informational | Strengthen the /docs/authorization-concepts page; create marketing-tier version |
| rebac | Moderate | High | Page 1 | Informational | Same as above |
| rbac vs rebac | Easy | High | **Not ranking on page 1** | Informational | Comparison article (currently owned by Okta blog, Aserto) |
| abac vs rebac | Easy | Medium | **Not ranking** | Informational | Comparison article |
| authorization for ai agents | Moderate | **Very High** | Page 1 (via /docs/modeling/agents) | Informational/Commercial | Promote /docs/modeling/agents into a top-nav landing page |
| rag authorization | Easy | **Very High** | Page 1 | Commercial | Dedicated /use-cases/rag-authorization page |
| mcp server authorization | Easy | **Very High** | Page 1 | Commercial | /use-cases/mcp-authorization |
| agent authorization | Moderate | High | Mid page 1 | Commercial | /use-cases/agent-authorization |
| how to implement authorization in microservices | Moderate | Medium | Not on page 1 | Informational | Long-form tutorial + framework integration recipes |
| openfga tutorial | Easy | High | Page 1 (docs own it) | Navigational | Repackage Getting Started as a step-by-step "tutorial" |
| openfga docker | Easy | High | Page 1 | Navigational | Strengthen the Docker setup page with FAQ schema |
| openfga kubernetes helm | Easy | Medium | Page 1 | Navigational | Strengthen Helm Charts page |
| openfga grafana case study | Easy | Medium | **Not ranking** | Commercial | Customer story (talk exists at KubeCon EU 2025) |
| openfga docker case study | Easy | Medium | **Not ranking** | Commercial | Customer story |
| what is google zanzibar | Easy | High | Page 1 (WorkOS, Authzed own it) | Informational | Definitive guide on openfga.dev/learn/zanzibar |
| open source authorization service | Moderate | Medium | Page 2 | Commercial | New use-case landing page |
| cncf authorization | Easy | Medium | Page 1 (branded credibility) | Informational | Surface CNCF status more prominently in homepage hero |

**Quick read:** the bolded "Not ranking" rows are the easiest wins. They're commercial-intent, brand-relative, and openfga.dev has the authority to win them — there's just no page to point a SERP at.

---

## 2. On-Page Issues Table

| Page | Issue | Severity | Recommended Fix |
|---|---|---|---|
| `/` (homepage) | Meta description is generic and only 73 chars — wastes the 150–160 char budget | High | Rewrite: "OpenFGA is a CNCF Incubating open-source fine-grained authorization (FGA) engine inspired by Google Zanzibar. Sub-millisecond ReBAC checks at scale, adopted by Grafana, Docker, and Canonical." (208 chars — trim to ~155) |
| `/` | H1 begins with "OpenFGA Logo" — an alt-text leak rendered inline before the actual heading | Medium | Move the logo `<img>` outside the H1 or use an empty alt; H1 should read "Relationship-based access control made fast, scalable, and easy to use." (and ideally include "fine-grained authorization" — the primary keyword) |
| `/` | No JSON-LD structured data (Organization, SoftwareApplication, SoftwareSourceCode) | High | Add JSON-LD via `@stackql/docusaurus-plugin-structured-data` or hand-rolled `themeConfig.metadata`. Include `applicationCategory: SecurityApplication`, `operatingSystem: Linux/macOS/Windows`, GitHub repo URL, CNCF affiliation, list of `programmingLanguage` SDKs |
| `/` | `meta-keywords` tag present but ignored by Google; not harmful but signals neglect | Low | Remove or repurpose |
| `/` | Adopter logo wall is duplicated in the rendered DOM (likely a marquee/scroll loop) — doubles the image weight | Low | Confirm in DevTools; if duplicated, ensure only one set is in the DOM and the loop is CSS-driven |
| `/docs/fga` | Meta description = "Introduction to FGA" (19 chars, no value prop) | Critical | "OpenFGA is an open-source fine-grained authorization (FGA) system for developers. Build relationship-based, role-based, and attribute-based access control with sub-millisecond checks." |
| `/docs/getting-started` | No visible meta description | High | Add 150-char description with "OpenFGA tutorial" / "quickstart" terms |
| `/docs/authorization-concepts` | Title "Authorization Concepts | OpenFGA" misses primary intent; page actually answers "What is fine-grained authorization?", "What is ReBAC?", "What is Zanzibar?" | Critical | Retitle "Fine-Grained Authorization, ReBAC, ABAC & Zanzibar Explained | OpenFGA" (~70 chars; tight, but matches the searches the content actually serves) |
| `/docs/authorization-concepts` | Each H2 ("What is RBAC?", "What is ABAC?", etc.) is FAQ-schema bait but no schema is emitted | High | Add FAQ JSON-LD wrapping each Q&A — this is the page most likely to win a People Also Ask placement |
| `/docs/authorization-concepts` | External Wikipedia links don't have `rel="noopener"` or `rel="external"` (assumed; verify) | Low | Audit and add |
| `/docs/modeling/agents` | Title "Authorization for Agents | OpenFGA" — strong, but the page is buried four clicks deep | High | Promote to top-nav as "AI Agents" or "Use Cases > AI Agents". This is OpenFGA's most timely traffic surface and competitors haven't claimed it yet |
| `/docs/modeling/agents/rag-authorization` | No meta description visible; high-intent keyword "RAG authorization" | High | Add meta description and HowTo schema. Currently competing posts on auth0.com and couchbase.com get the link — own the canonical |
| `/docs/modeling/agents/mcp-authorization` | Same as above | High | Same fix |
| `/blog` | All blog posts use a flat `/blog/{slug}` URL — no categorization | Medium | Add tag-based URL or category structure (e.g., `/blog/announcements/...`, `/blog/tutorials/...`) for topical authority signaling |
| `/blog/*` (Fine-Grained News monthly digests) | These are not search-targeted — they're newsletters republished as blog posts. They dilute topical relevance and consume crawl budget for the `/blog/` namespace | Medium | Keep them but `noindex` the monthly digests, OR move them to `/news/` and let `/blog/` host long-form, keyword-targeted posts |
| Sitewide | No `<link rel="alternate" hreflang>` despite Spanish-language community content being announced (Carla Urrea's content) | Low | If localized content is roadmapped, scaffold hreflang now |
| Sitewide | No breadcrumb structured data | Medium | Add BreadcrumbList JSON-LD via Docusaurus plugin — major SERP appearance win |
| Sitewide | OG image (`/img/og-rich-embed.png`) is identical on every page — fine, but a per-page OG image would lift CTR from social/LLM previews | Low | Auto-generate per-page OG images from title text |

---

## 3. Content Gap Recommendations

Each gap is sorted by priority. Format and effort are explicit so the team can slot them into a sprint.

### 3.1 Comparison hub — `/compare/`
- **Topic:** "OpenFGA vs SpiceDB," "OpenFGA vs Cerbos," "OpenFGA vs Permit," "OpenFGA vs Oso," "OpenFGA vs Keto"
- **Why it matters:** Every one of these queries currently shows third-party pages (Authzed, Oso, pkgpulse, sph.sh) in the top results. Buyers researching OpenFGA are reading competitor takes on OpenFGA without OpenFGA in the room.
- **Format:** Long-form comparison landing pages, ~1500–2500 words each, with a comparison table, "When to choose X" sections, and a fair statement of competitor strengths (Google rewards balance)
- **Priority:** High
- **Effort:** Substantial (5 pages × 0.5–1 day each)

### 3.2 Alternatives page — `/alternatives/`
- **Topic:** "OpenFGA alternatives" — an honest hub linking out to SpiceDB, Cerbos, Permit, Oso, Topaz, Permify, with framing on when each is the better fit
- **Why it matters:** The top organic result for this query is osohq.com/learn/openfga-alternatives. OpenFGA should own the question
- **Format:** Single landing page, ~1500 words
- **Priority:** High
- **Effort:** Moderate (half day)

### 3.3 Use-case landing pages — `/use-cases/`
Promote the strongest /docs/modeling content out of docs and into a marketing-tier hierarchy:
- `/use-cases/ai-agent-authorization` — already drafted in docs, surface it
- `/use-cases/rag-authorization` — search demand is climbing
- `/use-cases/mcp-server-authorization` — almost no competitors own this yet
- `/use-cases/multi-tenant-saas` — what most adopters actually use FGA for
- `/use-cases/microservices-authorization` — captures a broader topical cluster
- **Priority:** High (the agent/RAG/MCP three especially)
- **Effort:** Moderate per page — content largely exists; reposition and add SEO-tier titles and meta

### 3.4 Customer case studies — `/customers/`
- **Topic:** "How Grafana migrated to OpenFGA," "How Docker uses OpenFGA for org/team management," "How Agicap modeled cloud-native authorization with OpenFGA," "How Canonical adopted OpenFGA"
- **Why it matters:** All four have public KubeCon talks; the content is half-written. Case studies build link-worthy assets and rank for branded combinations ("openfga grafana", "openfga docker")
- **Format:** 800–1200 word case study pages with the talk video embedded
- **Priority:** High
- **Effort:** Quick win per case study (2–3 hours each — most of the content is in the talks and CNCF interviews)

### 3.5 Glossary / Learn hub — `/learn/`
Mirror what Authzed does well: a definitional knowledge base of authorization concepts, each page owning a single "what is X?" query.
- `/learn/zanzibar` (currently owned by Authzed and WorkOS)
- `/learn/rebac`
- `/learn/rbac-vs-rebac`
- `/learn/abac-vs-rebac`
- `/learn/fine-grained-authorization`
- `/learn/authorization-as-a-service`
- `/learn/policy-engine`
- **Priority:** Medium
- **Effort:** Substantial (8–10 pages — but each is a high-authority asset)

### 3.6 Recurring content cadence
- **Topic:** The "Fine-Grained News" monthly digests are great for community but search-invisible. Replace half the slots with topic deep-dives (e.g., "Why Conditional Tuples beat policy-based filters for ABAC use cases")
- **Priority:** Medium
- **Effort:** Ongoing — shift editorial allocation rather than add to it

### 3.7 Content freshness audit
The 2023 posts ("Conditional Relationship Tuples for OpenFGA," "KubeCon NA 2023") have not been updated. If they're still useful, refresh dates; if they're superseded, redirect to current docs.
- **Priority:** Low
- **Effort:** Quick win (1–2 hours)

---

## 4. Technical SEO Checklist

| Check | Status | Details |
|---|---|---|
| HTTPS | Pass | Site is HTTPS-only |
| Canonical tags | Pass | Present on inspected pages, point to self |
| Mobile viewport | Pass | `width=device-width,initial-scale=1` present |
| Open Graph metadata | Pass | OG title, description, image, URL all present |
| Twitter Card | Pass | `summary_large_image` set |
| Robots meta | Warning | Not directly inspected (tool provenance limit) — Docusaurus default is indexable. Verify nothing is silently `noindex` |
| `robots.txt` | Warning | Could not be retrieved in this run. Spot-check it points to the sitemap |
| `sitemap.xml` | Warning | Docusaurus auto-generates one — verify it's at `/sitemap.xml` and submitted to Google Search Console and Bing Webmaster Tools |
| Structured data (Organization/SoftwareApplication) | **Fail** | No JSON-LD detected in HTML |
| Structured data (FAQ) | **Fail** | Authorization Concepts page is FAQ-shaped but no schema |
| Structured data (HowTo) | **Fail** | Getting Started is HowTo-shaped but no schema |
| Structured data (Breadcrumb) | **Fail** | No BreadcrumbList JSON-LD |
| Per-page meta descriptions | **Fail** | Most docs pages have weak or absent descriptions |
| H1 hygiene | Warning | Homepage H1 begins with "OpenFGA Logo" alt-text leak |
| URL structure | Pass | Clean, readable, keyword-bearing, no parameters |
| Internal linking | Pass | Strong in-doc cross-linking; sidebar nav is comprehensive |
| Image alt text | Pass (mostly) | Adopter logos have alt text equal to the company name — fine. Verify decorative images use `alt=""` |
| Page weight / Core Web Vitals | Warning | Adopter logo wall and `.webm` video on homepage warrant a Lighthouse pass; not measured in this run |
| HTTP→HTTPS redirects | Pass (assumed) | Standard Docusaurus + GitHub Pages / Netlify behavior |
| 404 handling | Not verified | Verify a useful 404 page exists |
| `noindex` of low-value pages | Warning | Tag archive pages and the monthly "Fine-Grained News" digests may be diluting topical signal — consider `noindex` |
| External link hygiene | Not verified | Check `rel="noopener"` on outbound links |

---

## 5. Competitor SEO Comparison

| Dimension | OpenFGA (openfga.dev) | SpiceDB (authzed.com) | Cerbos (cerbos.dev) | Permit (permit.io) | Winner |
|---|---|---|---|---|---|
| Branded comparison content | None | "OpenFGA Alternatives", "SpiceDB vs Auth0 FGA" | "OPA Alternative", multiple comparison posts | "Permit alternatives", "OPA vs OpenFGA vs Cedar" | **Cerbos / Permit** |
| Learn/glossary hub | Concepts page in docs only | Dedicated /learn/ hub with deep-dives on Zanzibar, ReBAC, hotspot caching | Strong, blog-driven | Strong, blog-driven | **Authzed** |
| Blog cadence | ~12 posts/year (mostly internal news) | Multiple deep-dives per quarter | 50+ posts, frequently SEO-targeted | High volume, SEO-targeted | **Cerbos / Permit** |
| Comparison/alternatives pages | 0 | Multiple | Multiple | Multiple | **Tied (everyone but OpenFGA)** |
| Use-case landing pages | Buried in /docs/modeling | Several | Industry-specific (insurance, fintech) | AI access control landing page | **Permit** |
| AI agent / RAG / MCP content | Strong (in docs) | Sparse | Some | Strong | **OpenFGA + Permit (tied)** |
| Customer case studies | 0 dedicated pages (logo wall only) | Several | Several | Several | **Authzed / Cerbos / Permit** |
| Schema.org structured data | None | Some | Some | Yes | **Permit** |
| Brand authority signals | CNCF Incubation, Linux Foundation | VC-backed company | Series A | Series A | **OpenFGA** (uniquely neutral / foundation-hosted) |
| Backlink-worthy assets | Zanzibar Academy, KubeCon talks | Multiple original posts | Original research | Original research | **Tied** |

**Read on the competitive set:** OpenFGA wins on credibility (CNCF, Linux Foundation, Auth0/Okta heritage, adoption logos) and ties on AI-agent content depth, but **loses every SEO matchup that requires marketing-tier pages** — comparison, alternatives, customer stories, learn hub. The fix isn't more authority. It's giving the existing authority somewhere to point.

---

## 6. Prioritized Action Plan

### Quick Wins (do this week)

| Action | Expected Impact | Effort | Dependencies |
|---|---|---|---|
| Rewrite homepage meta description to include "fine-grained authorization" + adopter proof + CNCF | High (CTR lift across all branded SERPs) | 15 min | None |
| Write 150-char meta descriptions for `/docs/fga`, `/docs/getting-started`, `/docs/authorization-concepts`, `/docs/modeling/agents`, `/docs/modeling/agents/rag-authorization`, `/docs/modeling/agents/mcp-authorization` | High | 1 hour | None |
| Retitle `/docs/authorization-concepts` to "Fine-Grained Authorization, ReBAC, ABAC & Zanzibar Explained" | High | 5 min | None |
| Fix the "OpenFGA Logo" H1 alt-text leak on homepage | Medium | 10 min | Inspect `docs/content/home` template |
| Add `noindex` to monthly "Fine-Grained News" digest posts (keep them visible, just don't index) | Medium | 30 min | None |
| Verify `robots.txt` points to `sitemap.xml` and submit sitemap in GSC + Bing Webmaster | Medium | 30 min | GSC access |
| Add `rel="noopener"` to outbound blog/footer links if missing | Low | 30 min | Theme audit |

**Quick-wins total effort: under half a day. Expected impact: meaningful SERP CTR lift within 2–4 weeks of recrawl.**

### Strategic Investments (this quarter)

| Action | Expected Impact | Effort | Dependencies |
|---|---|---|---|
| Install `@stackql/docusaurus-plugin-structured-data` and emit Organization, SoftwareApplication, WebSite, BreadcrumbList JSON-LD | High | 0.5 day | Plugin install + config |
| Add FAQ JSON-LD to `/docs/authorization-concepts` (PAA capture) | High | 2 hours | Structured data plugin |
| Add HowTo JSON-LD to the Getting Started step sequence | Medium | 3 hours | Structured data plugin |
| Build `/compare/` hub with 5 OpenFGA-vs-X pages (SpiceDB, Cerbos, Permit, Oso, Keto) | **Very High** — reclaims branded research traffic | 5 days | Content writer + product review |
| Build `/alternatives/` hub page | High | 1 day | Same as above |
| Build `/use-cases/` hub: AI Agent Auth, RAG Auth, MCP Auth, Multi-tenant SaaS, Microservices | High | 4 days | Content can be derived from existing /docs/modeling |
| Lift "AI Agents" into the top-nav (Home / Docs / Use Cases / API / Blog) | High | 1 hour design + 1 day exec | Site IA decision |
| Write 4 customer case studies (Grafana, Docker, Agicap, Canonical) from existing KubeCon material | High — link-worthy assets and branded combo queries | 1 day each | Customer review for messaging accuracy |
| Build `/learn/` glossary hub: Zanzibar, ReBAC, RBAC-vs-ReBAC, ABAC-vs-ReBAC, FGA, Policy Engines | Medium-High | 1.5 days per page × 6 pages | Content writer |
| Restructure blog tagging: `/blog/announcements/`, `/blog/tutorials/`, `/blog/news/` | Medium | 0.5 day | Docusaurus config + redirects |
| Generate per-page OG images (e.g., `og-image-generator` Docusaurus plugin) | Low-Medium | 0.5 day | Plugin install |
| Connect Ahrefs or Semrush via MCP to track ranking deltas | Foundational | 30 min | MCP connector |

---

## Closing assessment

Given OpenFGA's domain authority signals (CNCF, Linux Foundation, Grafana/Docker/Canonical adoption, 5,000+ stars, six consecutive KubeCons), the SEO ceiling is significantly higher than current output. The single highest-leverage moves are (1) ship meta descriptions and structured data — engineering-trivial, immediate CTR lift; (2) build the comparison hub — reclaims branded research traffic competitors currently own; (3) surface the AI-agent / RAG / MCP content out of `/docs/modeling/` and into marketing-tier landing pages — own a wave that's still cresting.

---

## Sources

Primary site pages crawled:
- [openfga.dev (homepage)](https://openfga.dev/)
- [Introduction to FGA](https://openfga.dev/docs/fga)
- [Getting Started](https://openfga.dev/docs/getting-started)
- [Authorization Concepts](https://openfga.dev/docs/authorization-concepts)
- [Authorization for Agents](https://openfga.dev/docs/modeling/agents)
- [OpenFGA Blog index](https://openfga.dev/blog)
- [OpenFGA Accepted into CNCF Incubation](https://openfga.dev/blog/incubation-announcement)

Competitor and market intelligence:
- [Alternatives to OpenFGA (Authzed)](https://authzed.com/learn/openfga-alternatives)
- [OpenFGA Alternatives (Oso)](https://www.osohq.com/learn/openfga-alternatives)
- [Cerbos homepage](https://www.cerbos.dev/)
- [SpiceDB | Authzed](https://authzed.com/spicedb)
- [What is Fine Grained Authorization (FGA)? — Permit.io](https://www.permit.io/blog/what-is-fine-grained-authorization-fga)
- [OpenFGA vs Permify vs SpiceDB (2026) — PkgPulse](https://www.pkgpulse.com/guides/openfga-vs-permify-vs-spicedb-zanzibar-authorization-2026)
- [Top 5 Google Zanzibar open-source implementations — WorkOS](https://workos.com/blog/top-5-google-zanzibar-open-source-implementations-in-2024)
- [Policy Engine Showdown - OPA vs. OpenFGA vs. Cedar — Permit.io](https://www.permit.io/blog/policy-engine-showdown-opa-vs-openfga-vs-cedar)
- [Authorization in 2025: A Practical Comparison of Modern Solutions](https://medium.com/@giorgioprof/authorization-in-2025-a-practical-comparison-of-modern-solutions-a55fe9bf8069)
- [Fine-Grained Authorization Explained — Descope](https://www.descope.com/learn/post/fine-grained-authorization)
- [OPA vs Cedar vs Zanzibar: 2025 Policy Engine Guide — Oso](https://www.osohq.com/learn/opa-vs-cedar-vs-zanzibar)

Tooling references:
- [Docusaurus structured data plugin (stackql)](https://github.com/stackql/docusaurus-plugin-structured-data)
- [OpenFGA website repo](https://github.com/openfga/openfga.dev)
