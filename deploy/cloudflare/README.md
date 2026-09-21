# Split-site routing reference

This Worker is an optional reference for serving Mintlify documentation through the existing `openfga.dev` Cloudflare zone. Docusaurus stays on GitHub Pages. The repository includes the implementation, local and dry-run checks, and sitemap builder, but no proxy deployment workflow, named deployment environments, or new repository credential requirements. The existing infrastructure owner manages routing through their established process and can use an equivalent approved proxy instead. **Merging this code does not deploy the Worker or authorize a traffic switch.**

| Responsibility | Owner |
| --- | --- |
| Build and host product docs and API reference | Mintlify, using `/docs-site` |
| Build and publish Home, Project, Community, and Blog | Existing GitHub Pages workflow, unchanged |
| Route public paths to the correct origin | Existing infrastructure owner, using this optional Worker or equivalent approved routing |
| Validate source and routing contracts | Repository checks and owner-run acceptance commands; no repository Cloudflare credentials required |

## Ownership

| Paths                                                            | Destination                                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `/docs/**`, `/api-reference/**`                                  | `https://fga.mintlify.site`, preserving path and query                        |
| `/docs`, `/api-reference`                                        | Redirect to each section's first page                                         |
| `/api`, with optional trailing slash                             | Redirect to `/api-reference`                                                  |
| `/api/service`                                                   | Website compatibility page maps legacy Swagger fragments to native operations |
| `/api/service/`                                                  | Normalize to `/api/service`, preserving the browser's fragment                |
| `/docs/community`                                                | Redirect to the website's `/community`                                        |
| `/mintlify-assets/**`, `/_mintlify/**`, `/_next/**`, `/_llms/**` | Mintlify runtime, services, and generated indexes                             |
| `/images/**`, six exact root scripts/styles                      | Native repository assets listed in `routing.mjs`                              |
| `/docs/llms.txt`, `/docs/llms-full.txt`                          | Mintlify's root index and complete bundle                                     |
| `/mcp`, `/docs/mcp`                                              | Exact aliases to native `/mcp`; support the page menu's generated MCP targets |
| Selected `/docs/.well-known/**` endpoints                        | Corresponding native discovery endpoints, subject to vendor acceptance        |
| Exact `/api/request`                                             | `/_mintlify/api/request`                                                      |
| Everything else                                                  | Existing Docusaurus origin                                                    |

The website keeps `/`, `/project`, `/community`, `/blog/**`, `/search`, `/robots.txt`, all sitemap files, root LLM resources, and its asset directories. Root `/.well-known/**` and certificate-verification routes are not captured. `/docs-other`, `/api-reference-other`, and arbitrary `/api/**` paths are not native routes. The `/mcp` exception is exact: `/mcp/`, `/mcp/**`, `/mcp-other`, and `/mcp.json` remain website-owned.

Do not redirect `/api/service` directly to the new API index. Swagger links carry their operation in a fragment, which the Worker cannot see. Both `#Relationship%20Queries/Check` and `#/Relationship%20Queries/Check` are supported. The small website page reads that fragment and replaces the browser location with the matching native operation, preserving query parameters. Empty, unknown, and malformed fragments fall back to `/api-reference`; a link remains usable without JavaScript. The page is excluded from search, sitemaps, and website LLM bundles, and does not restore Swagger.

If adopting this Worker, use a **Worker Route**, not a Worker Custom Domain or an apex DNS replacement. The owner-managed route must cover `openfga.dev/*` so bare routes with query strings also invoke the Worker. The code then applies segment-aware ownership. Website fallthrough uses the original `fetch(request)` to reach the existing origin.

## Repository redirects

These redirects already exist in [`docs-site/docs.json`](../../docs-site/docs.json); they do not depend on adopting this particular Worker once the request reaches Mintlify:

| Old or entry URL | Destination | Native redirect |
| --- | --- | --- |
| `/docs/community` | `https://openfga.dev/community` | Permanent; the absolute URL also works from the Mintlify preview host |
| `/docs` | `/docs/fga` | Temporary |
| `/api-reference` | `/api-reference/stores/list-all-stores` | Temporary |
| Eleven historical overview URLs, including `/docs/modeling`, `/docs/adopters`, and `/docs/best-practices` | Their corresponding `/overview` pages | Temporary; the complete set is checked against the original source slugs |
| `/api` | `/api-reference` | Permanent on the native host; public edge policy is owner-managed |

The optional Worker mirrors the Community and section-entry redirects and handles their trailing-slash forms. Its local defaults use temporary redirects so validation does not create permanent browser caches.

Native-host redirects have been observed dropping query parameters. The optional Worker preserves queries on its public redirects; verify equivalent behavior in the selected routing before cutover.

The native-host `/` redirect starts readers at `/docs/fga`; it must not redirect the public `openfga.dev/` homepage. Similarly, the generic native `/api/service` redirect is only a fallback on the Mintlify host. Keep the public `/api/service` request on the website compatibility page so its operation fragment is preserved.

**Redirects do not replace origin routing.** A Mintlify redirect is evaluated only after a request reaches Mintlify. The infrastructure owner must still send the docs/API path families to Mintlify and retain website ownership of `/community` and the Swagger compatibility page.

Community is the only historical product-docs page reassigned to the website in [`source-pages.json`](../../docs-site/source-pages.json). The other migrated docs retain their original public paths or exact overview aliases. Do not add guessed `/docs/project`, `/docs/blog`, or broad catch-all redirects: Project and Blog keep their existing website URLs.

## Local checks

Use Node.js 22 and the repository lockfile:

```bash
npm ci
npm run check:docs-proxy
npm run test:site-boundary
npm run build
```

`check:docs-proxy` runs offline tests and a Wrangler bundle **dry run**. It does not authenticate, upload, or attach a route. The ordinary build creates a root sitemap index plus `sitemap-website.xml` and `sitemap-docs.xml`. Native locations come from this checkout's docs inventory and checksum-verified canonical OpenAPI schema, not a second hand-maintained URL list.

Run the Worker locally without deploying:

```bash
npm run dev:docs-proxy -- --local-protocol https --port 3383
```

The command explicitly runs locally and supplies `WEBSITE_ORIGIN=https://openfga.dev` only for local fallback requests; it does not authenticate or publish a public preview. Use the HTTPS URL printed by Wrangler and trust its local development certificate in your test client. Website requests reach the current public website, not your local Docusaurus build, so new sitemap and compatibility-page checks need separate local-build verification until website publication. Local HTTP works for transport probes, but Mintlify's HTTPS-preferring client navigation should be exercised on HTTPS.

## Infrastructure owner handoff

No new GitHub deployment environments, API-token secret, or account-ID variable are required by this repository. Mintlify continues to build and host the native docs, and the existing GitHub Pages workflow continues to publish the website. Preserving both path families on one hostname still requires routing, which the infrastructure owner configures using their existing access and tooling.

Before adopting this Worker or an equivalent proxy, the owner must:

1. Confirm the existing `openfga.dev` zone and orange-cloud DNS records. Retain the GitHub Pages origin and TLS setup.
2. Inspect Worker Routes, Redirect Rules, Cache Rules, WAF, and rate limits for conflicts. The Worker adds no dynamic edge caching; existing rules must not force-cache HTML, RSC responses, POSTs, streams, or discovery.
3. Select the reviewed routing implementation and an approved HTTPS verification path through their existing process. This does not require a new named staging environment or public workers.dev deployment.
4. Run source-matching native-origin acceptance before activation, retain the results for the reviewed revision, and coordinate the change window and rollback with the website and Mintlify owners.

`npm run verify:docs-origin` recomputes the selected checkout's [native source fingerprint](../../docs-site/README.md#deployment-fingerprint), rejects a stale local marker, and requires the matching marker on every advertised hosted docs and API page. A stale deployment with identical routes is not accepted. The owner must run and retain this check explicitly; there is no repository deployment workflow enforcing it on their behalf.

The checked-in Wrangler configuration has no routes, workers.dev URL, preview URL, or named deployment environments. It is for local checks and bundling, not a ready-to-activate deployment. It defaults legacy API redirects to temporary 307 responses. An owner adopting the Worker can set `PERMANENT_API_REDIRECTS=true` after acceptance to use permanent 308 redirects; both preserve methods and query strings. Do not copy the local `WEBSITE_ORIGIN` override to the public route: public website fallthrough must use the original request to avoid a loop.

## Mintlify owner actions

Keep the project directory `/docs-site` and upstream `https://fga.mintlify.site`. The current implementation assumes the deployment base path is unset because content already has `/docs` and `/api-reference` prefixes. Confirm that two-prefix contract with Mintlify; enabling a global `/docs` base path would change those routes.

Confirm the two-prefix custom-domain arrangement with Mintlify before attaching `openfga.dev` in its dashboard. The repository sets the public canonical base and `seo.indexing: all` because its section selectors use hidden anchors. Verify the resulting deployment rather than assuming the settings fixed generated resources.

Confirm these provider-owned details:

- Public canonicals and social URLs use `https://openfga.dev` with the correct section path.
- The generated documentation index includes every owned docs and API page, directly or through recursive `/_llms/**` indexes. An empty `llms.txt` or sitemap is a deployment failure, not acceptable discovery.
- The forwarded `Origin`, `Host`, and `X-Forwarded-*` contract supports search, assistant sessions, and analytics. The Worker targets Mintlify for Host/Origin and retains the public forwarded host/protocol.
- Advertised MCP, agent cards, agent skills, and API-catalog endpoints exist and use working public URLs. Generated metadata has previously advertised a nonexistent API catalog and a `*.mintlify.me` host. The Worker does not invent replacements for arbitrary vendor hosts or fabricate missing metadata. Resolve these with Mintlify before approving discovery.
- Verification and certificate-renewal paths have an explicit owner. Add a narrow exception only if the provider requires it.

The Worker rewrites native index origins and discovery headers to the public docs resource paths. It does not rewrite HTML, JavaScript, or MCP JSON to hide a misconfigured deployment. Root website resources stay separate.

## Acceptance and cutover

Before activation, run:

```bash
npm run verify:docs-origin
npm run verify:docs-proxy -- --origin https://APPROVED-VERIFICATION-HOST
```

These commands make read-only HTTP requests and report nonzero failures for missing or mismatched source fingerprints, wrong canonical hosts, missing runtime assets, incomplete recursive docs indexes, bundle failures, lost redirect queries, website capture, a missing compatibility page, and incomplete composite sitemap output. They fetch OpenAPI from `main`, verify the last-generated schema digest, and check all 24 advertised API operation URLs, not just List stores. An upstream digest change requires an accepted sample update before release verification can pass. Every advertised docs and API page must carry the fingerprint of this checkout; mixed cached revisions fail too. If the hosted marker does not match, wait for the matching deployment and repeat acceptance; do not bypass the gate or substitute a hosted marker into local configuration. This source marker is not an attestation of provider internals, browser interactions, Cloudflare route precedence, permissions, or complete MCP compatibility. Mintlify can fetch newer upstream schemas independently of this repository's source marker.

A verification proxy that uses the currently published website cannot serve the new composite sitemap or compatibility page until coordinated website publication. Record those expected failures, validate the compatibility page against the local website build before activation, and rerun public checks after publication. Do not waive other failures on that basis. Verify generated agent metadata and every URL it advertises manually.

In an HTTPS browser, check docs and API navigation, direct deep links, per-page Markdown, images, custom viewers, search results, enabled assistant streaming, and analytics POSTs. Follow legacy Swagger fragments for Check, BatchCheck, and AuthZEN, including encoded tag names and the trailing-slash variant. Check response MIME types, upstream error propagation, theme changes, and reloads. Test website Home, Project, Community, Blog, search, root LLM resources, and negative prefix matches. Root `openfga.dev/` must not redirect to docs.

For reader-interface acceptance, check the [migration review checklist](../../docs-site/README.md#migration-review-checklist). LLM resources must remain machine-discoverable without visible footer links. Check that desktop links follow the logo, while the GitHub star badge, search, and theme controls form the right-hand group with the badge immediately before search. Keyboard traversal must follow the same order. Exercise native search, theme selection, and the responsive menu. Separate Ask AI navbar buttons, floating prompts, and code-block assistant buttons are intentionally hidden. API descriptions must remain visible while article SEO descriptions stay metadata-only.

Check the native page-header menu on documentation and API pages: Copy page, Open in ChatGPT, Open in Claude, Copy MCP install command, Connect to Cursor, and Connect to VS Code. Confirm that Copy page produces the current page's Markdown and inspect external-chat URLs without submitting a conversation. Inspect the copied MCP command and decoded editor links without running an installer; all must identify the same reachable OpenFGA documentation MCP service. Native actions generate `/mcp` on the current origin, so the proxy forwards this exact endpoint and retains `/docs/mcp` as an alias. Confirm MCP `initialize` and `tools/list` POSTs succeed on both paths, without invoking tools or installing an integration. A preview-host handshake alone does not accept production-generated menu URLs. Check that `/mcp/`, `/mcp/other`, and `/mcp-other` still reach the website; do not widen the exception into a prefix.

Content acceptance requires the original visible titles, section headings, wording, section order, navigation, and page boundaries, subject only to the [documented technical exceptions](../../docs-site/README.md#retained-technical-exceptions). SEO-only adjustments must not change visible titles or sidebar labels. Retain the useful SDK setup guidance and code repairs; do not waive unrelated editorial changes as part of release approval.

Before the change window, save:

- The previous Worker version, routes, and applicable edge rules.
- The last complete GitHub Pages deployment containing legacy docs, including its commit/artifact and a tested restoration procedure.
- Verification evidence, accepted provider settings, the reviewed deployment commit, and the owners performing activation and rollback.

The unchanged [website deployment workflow](../../.github/workflows/deploy.yml) runs on main pushes, manual dispatch, and a schedule. Coordinate merge and publication with the edge owner. Activate the accepted routing before the website build removes legacy docs, or arrange an explicit publication hold with its owner. Then publish the website sitemap and rerun proxy acceptance against `https://openfga.dev`.

Do not merge and leave the new website deployed while waiting for someone to configure routing.

Code/content review can begin before these deployment gates are complete. Document unresolved gates in the PR handoff; they block merge and activation, not the request for review.

## Rollback

Restore the saved complete website deployment and edge configuration, then purge affected caches and verify the old docs and website URLs. Restore the website content before removing native routing where possible. A Worker version rollback must also account for routes and rules changed outside that version.

**Removing the Worker route alone does not restore the retired Docusaurus docs.** Pause or revert the website deployment source as agreed with its owner so a scheduled publish cannot overwrite the restored artifact.

## References

- [Mintlify Cloudflare deployment](https://www.mintlify.com/docs/deploy/cloudflare)
- [Mintlify reverse-proxy requirements](https://www.mintlify.com/docs/deploy/reverse-proxy)
- [Mintlify subpath hosting](https://www.mintlify.com/docs/deploy/docs-subpath)
- [Cloudflare Worker Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)
