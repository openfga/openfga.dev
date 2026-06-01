# SEO Audit Content Sources Log

Working log of where content for new pages was sourced. Maintained for review/citation.

## Customer case studies (`docs/content/customers/`)

All five case studies are paraphrased from CNCF TOC adopter interviews published in
the cncf/toc repository under `projects/openfga/`. Originals were copied locally to
`/tmp/openfga-research/` for offline use.

| Page | Source file | Upstream |
| --- | --- | --- |
| customers/agicap.mdx | /tmp/openfga-research/agicap.md | https://github.com/cncf/toc/tree/main/projects/openfga |
| customers/docker.mdx | /tmp/openfga-research/docker.md | https://github.com/cncf/toc/tree/main/projects/openfga |
| customers/grafana.mdx | /tmp/openfga-research/grafana.md | https://github.com/cncf/toc/tree/main/projects/openfga |
| customers/read-ai.mdx | /tmp/openfga-research/readai.md | https://github.com/cncf/toc/tree/main/projects/openfga |
| customers/zuplo.mdx | /tmp/openfga-research/zuplo.md | https://github.com/cncf/toc/tree/main/projects/openfga |

Quantitative facts (RPS, tuple counts, dates, versions) come directly from those
interviews. Where the interview attributes a quote to an interviewee, the case
study summarises rather than quoting verbatim to keep the narrative
project-neutral.

The Grafana interview specifically called out the lack of public adopter stories
as a barrier, which motivated this entire `/customers/` section.

## Competitor comparison pages (`docs/content/compare/`)

Pages will be authored from the following public sources. Comparisons stick to
publicly documented features (license, model, storage, deployment, language,
governance) — no benchmark numbers we can't reproduce.

| Competitor | Public sources fetched 2026-05-20 |
| --- | --- |
| SpiceDB | https://authzed.com/spicedb (architecture, storage backends, schema language, K8s operator, 6.7k+ stars) |
| Cerbos | https://www.cerbos.dev/ (PDP/PEP/Hub/Synapse architecture, YAML policies, RBAC/ABAC/PBAC/ReBAC, stateless, sub-ms decisions) |
| Permit.io | https://www.permit.io/product (RBAC/ABAC/ReBAC, MCP Gateway, Elements, SOC2/HIPAA/GDPR; hosted product, control plane around OPA) |
| Oso | https://www.osohq.com/ (Polar DSL, Oso Cloud SaaS, 1M+ RPS / <10ms p90 claims, Rust, 30+ AZs) |
| Ory Keto | https://www.ory.com/keto/ (Zanzibar implementation, OPL TypeScript-flavored DSL, Apache 2.0 + Enterprise + Ory Network, Postgres/MySQL/Cockroach) |
| OPA | https://www.openpolicyagent.org/docs/latest/ (CNCF graduated, Rego, general-purpose policy engine, k8s admission/Envoy/Terraform use cases) |

WebSearch was unavailable for this model (claude-opus-4-7), so each competitor's
own primary site was fetched directly via WebFetch on 2026-05-20. No third-party
"vs" articles were used. Where a competitor's site did not state a fact (e.g.
Permit.io deployment model, Oso licensing), the comparison page says so rather
than guessing.

OpenFGA-side facts come from this repo's docs (modeling, best-practices, community
pages) and the public OpenFGA GitHub. Where a competitor changed licensing or
direction, that is noted with the date observed (2026-05) so future readers can
sanity-check.

## Use-case pages (`docs/content/use-cases/`) — DONE 2026-05-20

Pages: overview, ai-agent-authorization, rag-authorization,
mcp-server-authorization, multi-tenant-saas, microservices-authorization.
Registered as a sidebar category linked to overview.

Authored from existing repo content only:
- `docs/content/modeling/agents/*` for agent / RAG / MCP material.
- `docs/content/modeling/advanced/{gdrive,github,slack}.mdx` for
  multi-tenant SaaS examples.
- `docs/content/customers/{agicap,grafana,read-ai}.mdx` for verifiable
  production numbers (Read AI: 5,200 RPS, 5.3B+ tuples, 20ms p99).
- `docs/content/best-practices/` for adoption-patterns and source-of-truth
  guidance.

## Learn / glossary pages (`docs/content/learn/`) — DONE 2026-05-20

Pages: overview, zanzibar, rebac, rbac-vs-rebac, abac-vs-rebac,
fine-grained-authorization, policy-engine. Registered as a sidebar category
linked to overview.

Authored from existing `docs/content/authorization-concepts.mdx`,
`docs/content/configuration-language.mdx`, and the public Zanzibar paper
(https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/)
for canonical definitions. Cross-linked to compare/* and modeling/conditions.

## SEO infra (`static/robots.txt`) — DONE 2026-05-20

Added `static/robots.txt` pointing to `https://openfga.dev/sitemap.xml` (the
file Docusaurus auto-generates at build). Homepage structured data
(Organization with CNCF/Linux Foundation parent chain, WebSite with
SearchAction, BreadcrumbList) was already wired via
`@stackql/docusaurus-plugin-structured-data` in `docusaurus.config.js` —
verified, no change needed.

## Alternatives hub (`docs/content/alternatives/overview.mdx`) — DONE 2026-05-20

Single landing page at slug `/alternatives` per audit section 3.2 (the top
organic result for "openfga alternatives" is currently osohq.com — OpenFGA
should own the question). ~1500 words, honest framing of when each
alternative is the better fit.

Authored from existing `/compare/*` pages (already sourced from competitor
primary sites — see Competitor comparison pages section above) plus two
engines not in `/compare/`:

| Engine | Public source fetched 2026-05-20 |
| --- | --- |
| Topaz | https://www.topaz.sh/ (Aserto's open-source authorizer; Zanzibar + Rego hybrid) |
| Permify | https://permify.co/ (open-source Zanzibar engine; Postgres; managed cloud) |

Registered in `docs/sidebars.js` as a top-level doc entry just above the
existing Compare category.

## Homepage H1 SEO fix (`src/features/LandingPage/HeroHeader/index.tsx`) — DONE 2026-05-20

The landing-page H1 contained only an `aria-hidden="true"` SVG logo and the
tagline subtitle, leaving crawlers and screen readers without the brand name
in the page's primary heading. Added a visually-hidden `<span>OpenFGA</span>`
inside the H1 (inline style, no new CSS module changes, no new dependencies)
so the H1 now reads "OpenFGA — \{tagline\}" semantically while remaining
visually unchanged. Addresses the audit's on-page H1 alt-text leak finding.

## Industry pages (`docs/content/industries/`) — 2026-05-21

Hub plus three flagship industry pages (healthcare, banking, e-commerce) authored
from the READMEs and `model.fga` / `store.fga.yaml` files in the
[openfga/sample-stores](https://github.com/openfga/sample-stores#industry-examples)
repository. Each page describes the resource/relation shape, what the model gets
right vs. role-only systems, a mapping table from industry requirements to
OpenFGA features, and common extensions adopters add on top of the base sample.

| Page | Source |
| --- | --- |
| industries/healthcare.mdx | openfga/sample-stores/stores/healthcare |
| industries/banking.mdx | openfga/sample-stores/stores/banking |
| industries/ecommerce.mdx | openfga/sample-stores/stores/ecommerce |

The hub (`industries/overview.mdx`) cross-links to the broader 23+ industry
samples in the sample-stores repo for verticals not yet given a dedicated page,
and to the domain-neutral pattern pages under `/docs/use-cases`. Registered in
`docs/sidebars.js` as a new "Industries" category sibling to Use Cases.

No factual claims are made beyond what the sample-store READMEs and model files
support. Compliance posture for healthcare is explicitly framed as "OpenFGA is
not a HIPAA product" with a link to the production-deployment guide rather than
implying any certification.

Extended 2026-05-21 with three more verticals authored from the same source
(sample-stores READMEs):

| Page | Source |
| --- | --- |
| industries/human-resources.mdx | openfga/sample-stores/stores/human-resources |
| industries/crm.mdx | openfga/sample-stores/stores/crm |
| industries/lms.mdx | openfga/sample-stores/stores/lms |

Same shape as the flagship trio. Registered in `docs/sidebars.js` under the
existing Industries category.

## Customer case studies — round 2 (2026-05-21)

Three additional case studies authored from conference-talk transcripts
provided by the user at `/Users/andres.aguiar/gh/openfga.dev/seo-tmp/`:

| Page | Source transcript | Speaker |
| --- | --- | --- |
| customers/headspace.mdx | seo-tmp/headspace.txt | Jeremy, principal engineer, Headspace |
| customers/openlane.mdx | seo-tmp/openlane.txt | Sarah Funkhouser, co-founder, OpenLane |
| customers/vitrolife.mdx | seo-tmp/simon.txt | Simon, consultant, Vitrolife Group |

Same `/customers/*` template as the original five. Quantitative claims
(Headspace's 90M lives, 105M downloads, 6M Ebb messages, 10–15 s → 10–15 ms
latency; OpenLane's ~8 s ListObjects worst case and 100/1000 overfetch caps;
Vitrolife's hourly + differential sync) come directly from the transcripts.
Quotes are paraphrased rather than verbatim. Registered in `docs/sidebars.js`
under the existing Customers category at sidebar_position 6/7/8.

## Internal linking from `/docs/fga` (2026-05-21)

Extended the Related Sections block on `docs/content/intro.mdx` (slug `/fga`,
the canonical intro page) with cards pointing into the new hubs: Customers,
Use Cases, Industries, Learn Authorization, and Compare. This is the
highest-traffic landing page in the docs, so cross-linking it into the
audit-built hubs propagates topical-authority signal to those clusters.

Also added Headspace / OpenLane / Vitrolife rows to the Featured case
studies table on `customers/overview.mdx` so the table mirrors the round-2
sidebar additions.

## Auth0 FGA / Okta FGA mentions on compare/* and alternatives (2026-05-21)

Comparison pages previously implied OpenFGA had no first-party hosted offering.
Updated to mention **Auth0 FGA / Okta FGA** — managed OpenFGA from Auth0/Okta,
the original creators who donated the project to the CNCF — across:

- `compare/spicedb.mdx` (Hosted offering row)
- `compare/keto.mdx` (Hosted offering row)
- `compare/oso.mdx` (Delivery row)
- `compare/permit.mdx` (Primary delivery row)
- `compare/overview.mdx` (Self-hostable bullet + closing prose)
- `alternatives/overview.mdx` (self-hosting bullet)

## YouTube talk source links on case studies (2026-05-21)

User supplied the canonical YouTube URLs for the four conference-talk-based
case studies. Linked them on the Source paragraph of each page:

| Page | YouTube |
| --- | --- |
| customers/headspace.mdx | https://www.youtube.com/watch?v=xCu39aG7B1A |
| customers/openlane.mdx | https://www.youtube.com/watch?v=ZdlftEKQ0UA |
| customers/vitrolife.mdx | https://www.youtube.com/watch?v=nwu5SiiMpM8 |
| customers/agicap.mdx | https://www.youtube.com/watch?v=XBHqGFfe-K4 (added alongside existing CNCF TOC interview citation) |

## Notes on YouTube transcript attempt

User pointed at https://www.youtube.com/watch?v=ZdlftEKQ0UA&list=PLUR5l-oTFZqVEUCHUwcBzkEs-1kioF813
as a source. `youtube-transcript-api 1.0.3` failed (XML parse / French-only
auto-captions on multiple videos in the playlist) and `yt-dlp` was not
installed. Pivoted to the CNCF adopter interviews instead — same factual ground,
fully textual, less risk of misquoting.
