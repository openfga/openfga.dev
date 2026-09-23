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
| `/docs/**`, `/api/service/**` (except the trailing-slash entry) | `https://fga.mintlify.site`, preserving path and query                        |
| `/docs`                                                       | Redirect to `/docs/fga`                                                       |
| `/api`, with optional trailing slash                             | Redirect to `/api/service`                                                  |
| `/api/service`                                                   | Website compatibility page maps legacy Swagger fragments to native operations |
| `/api/service/`                                                  | Normalize to `/api/service`, preserving the browser's fragment                |
| `/api-reference`, `/api-reference/**`                             | Redirect earlier preview links to corresponding `/api/service` paths         |
| `/docs/community`                                                | Redirect to the website's `/community`                                        |
| `/mintlify-assets/**`, `/_mintlify/**`, `/_next/**`, `/_llms/**` | Mintlify runtime, services, and generated indexes                             |
| `/images/**`, six exact root scripts/styles                      | Native repository assets listed in `routing.mjs`                              |
| `/docs/llms.txt`, `/docs/llms-full.txt`                          | Mintlify's root index and complete bundle                                     |
| `/mcp`, `/docs/mcp`                                              | Exact aliases to native `/mcp`; support the page menu's generated MCP targets |
| Selected `/docs/.well-known/**` endpoints                        | Corresponding native discovery endpoints, subject to vendor acceptance        |
| Exact `/api/request`                                             | `/_mintlify/api/request`                                                      |
| Everything else                                                  | Existing Docusaurus origin                                                    |

The website keeps `/`, `/project`, `/community`, `/blog/**`, `/search`, `/robots.txt`, all sitemap files, root LLM resources, and its asset directories. Root `/.well-known/**` and certificate-verification routes are not captured. `/docs-other`, `/api/service-other`, `/api-reference-other`, and sibling `/api/**` paths such as `/api/authzen` and `/api/management` are not native routes. The `/mcp` exception is exact: `/mcp/`, `/mcp/**`, `/mcp-other`, and `/mcp.json` remain website-owned.

Do not edge-redirect `/api/service` directly to the first operation. Swagger links carry their operation in a fragment, which the Worker cannot see. Both `#Relationship%20Queries/Check` and `#/Relationship%20Queries/Check` are supported. The small website page reads that fragment and replaces the browser location with the matching native operation under `/api/service/`, preserving query parameters. Empty, unknown, and malformed fragments go directly to `/api/service/stores/list-all-stores`, avoiding a self-redirect; a link remains usable without JavaScript. The page is excluded from search, sitemaps, and website LLM bundles, and does not restore Swagger.

If adopting this Worker, use a **Worker Route**, not a Worker Custom Domain or an apex DNS replacement. The owner-managed route must cover `openfga.dev/*` so bare routes with query strings also invoke the Worker. The code then applies segment-aware ownership. Website fallthrough uses the original `fetch(request)` to reach the existing origin.

## Repository redirects

These redirects already exist in [`docs-site/docs.json`](../../docs-site/docs.json); they do not depend on adopting this particular Worker once the request reaches Mintlify:

| Old or entry URL | Destination | Native redirect |
| --- | --- | --- |
| `/docs/community` | `https://openfga.dev/community` | Permanent; the absolute URL also works from the Mintlify preview host |
| `/docs` | `/docs/fga` | Temporary |
| `/api/service` | `/api/service/stores/list-all-stores` | Temporary |
| Eleven historical overview URLs, including `/docs/modeling`, `/docs/adopters`, and `/docs/best-practices` | Their corresponding `/overview` pages | Temporary; the complete set is checked against the original source slugs |
| `/api` | `/api/service` | Permanent on the native host; public edge policy is owner-managed |
| `/api-reference`, `/api-reference/:path*` | `/api/service`, `/api/service/:path*` | Permanent native aliases for the earlier preview paths |

The optional Worker mirrors the Community, docs-entry, and earlier API-preview redirects and handles trailing-slash entries. The public service entry remains website-owned for fragment handling. Edge redirects initially use temporary responses with `Cache-Control: no-store`.

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

1. Confirm the existing `openfga.dev` zone and orange-cloud DNS records. Retain the GitHub Pages origin and TLS setup. Ensure HTTP requests redirect to HTTPS before reaching this Worker; production requests must use `https://openfga.dev`. Retain any existing `www` redirect rather than attaching this hostname-specific Worker to another host.
2. Inspect Worker Routes, Redirect Rules, Cache Rules, WAF, and rate limits for conflicts. The Worker adds no dynamic edge caching; existing rules must not force-cache HTML, RSC responses, POSTs, streams, or discovery.
3. Select the reviewed routing implementation and an approved HTTPS verification path through their existing process. This does not require a new named staging environment or public workers.dev deployment.
4. Run source-matching native-origin acceptance before activation, retain the results for the reviewed revision, and coordinate the change window and rollback with the website and Mintlify owners.

`npm run verify:docs-origin` recomputes the selected checkout's [native source fingerprint](../../docs-site/README.md#deployment-fingerprint), rejects a stale local marker, and requires the matching marker on every advertised hosted docs and API page. A stale deployment with identical routes is not accepted. The owner must run and retain this check explicitly; there is no repository deployment workflow enforcing it on their behalf.

### Production Worker settings

The checked-in [`wrangler.json`](./wrangler.json) is an undeployed reference for local checks and bundling, not a production deployment configuration. The infrastructure owner supplies the live route through their established process:

| Setting | Production value |
| --- | --- |
| Worker name | `openfga-docs-proxy`; confirm that an existing Worker with this name belongs to this deployment before updating it |
| Entry point | `deploy/cloudflare/worker.mjs`, bundled with its `routing.mjs` import |
| Compatibility date | `2026-09-18`, matching the reviewed reference configuration |
| Zone and route | Zone `openfga.dev`, **Worker Route** `openfga.dev/*`; not a Worker Custom Domain |
| Native upstream | `https://fga.mintlify.site`, defined in `routing.mjs` |
| `PERMANENT_API_REDIRECTS` | String `"false"` initially |
| `WEBSITE_ORIGIN` | Absent; this override is only for local verification |
| `workers_dev` / `preview_urls` | Both `false` |
| Additional bindings, runtime secrets, or cron triggers | None |

No new framework, Cloudflare Pages application, database, seed data, or starter script is required. Deploy the repository's modules with Wrangler through the owner's authenticated tooling; do not paste `worker.mjs` alone into a single-file editor or substitute the generic Mintlify example.

The dashboard route lives under **Workers & Pages > Worker > Settings > Domains & Routes > Add > Route**. Record the live route in the infrastructure owner's deployment source of truth. Keep the repository reference's `routes: []` and lack of named environments unchanged; future production deployments must preserve the approved live route rather than reapply that empty list. A bundle dry run does not publish code or attach traffic.

The route executes the Worker for all `openfga.dev` requests, including website fallthrough. Confirm account capacity, request limits, error monitoring, and rollback access for total website traffic, not only docs traffic. Preserving the website origin does not make it independent of Worker availability.

Do not copy the local `WEBSITE_ORIGIN` override to production: website fallthrough must use the original request to avoid a loop. After redirect acceptance, the owner can set `PERMANENT_API_REDIRECTS=true` to change only the legacy `/api` redirect from temporary 307 to permanent 308; both preserve methods and query strings.

### Security headers and edge rules

Preserve the native origin's `Content-Security-Policy`, `Content-Security-Policy-Report-Only`, and any `Report-To` or `Reporting-Endpoints` headers. The Worker already copies these headers without replacing their values. Keep the Docusaurus website policy separate; do not apply a website-wide CSP override to native pages, scripts, workers, or assets. No blanket response-header replacement is required.

If an existing Cloudflare rule overwrites native policies, narrow that rule using the ownership map above. A separately approved stricter native policy should be evaluated in report-only mode before enforcement, with allowances based on the resources actually used. Adding another enforced CSP does not loosen the original policy; browsers enforce both.

The existing `/_mintlify/**` route includes the provider's `/_mintlify/api/csp-report` endpoint. Preserve its POST requests and exclude them from forced caching. Keep WAF protections enabled and use narrow exceptions only for demonstrated failures. Do not disable the domain's HTTPS redirects or Cloudflare proxy merely to complete a whole-domain Mintlify setup flow.

## Mintlify owner actions

Keep the project directory `/docs-site` and upstream `https://fga.mintlify.site`. Configure the public hostname as `openfga.dev` with no deployment-wide base path because content already has `/docs` and `/api/service` prefixes. In the dashboard's combined domain/path field, enter `openfga.dev`, not `openfga.dev/docs`. The latter mounts the entire deployment under another `/docs`, producing `/docs/docs/...` and `/docs/api/service/...`. Keep the repository directory and content paths unchanged.

The dashboard's generated Cloudflare example may appear only when a subpath is entered. That example is not required to deploy the repository's split-site Worker, and its docs-only routing is not a substitute for this implementation. Saving a custom domain configures Mintlify's deployment; public traffic still follows the existing DNS and Cloudflare routing.

**Do not add the dashboard's apex `@` CNAME to `cname.mintlify.builders`.** That is the whole-domain hosting path, not this split-site design. Retain the existing proxied GitHub Pages origin, use a Worker Route rather than a Worker Custom Domain, and leave non-native requests on the original website request. The native `/` redirect cannot capture the public homepage through this Worker because public `/` is website-owned.

Treat DNS routing and provider verification separately. The Worker connects to the TLS-protected `fga.mintlify.site` origin while visitors use the existing Cloudflare HTTPS endpoint for `openfga.dev`. The dashboard's `_cf-custom-hostname` and `_acme-challenge` TXT records concern domain ownership and certificate authorization, not URL-path routing. Confirm which records and renewal arrangements Mintlify requires for this proxied setup with the infrastructure owner; use the complete provider-issued values and preserve existing verification records. Native pages rendering successfully does not prove that verification can be omitted. If the dashboard requires an apex-origin replacement to complete setup, resolve the proxy-verification flow with Mintlify rather than repointing the website or disabling its Cloudflare proxy.

The API Reference anchor explicitly sets `openapi.directory` to `api/service`; this is a generated-page directory, not the dashboard base path. Retain it when switching the connected production branch to `main` after approval. There are no API-server or OpenAPI-specification changes associated with this URL decision.

The repository sets the public canonical base and `seo.indexing: all` because its section selectors use hidden anchors. After a domain/base-path change finishes rebuilding, verify `/docs/fga`, `/api/service/stores/list-all-stores`, and the complete discovery inventory on `fga.mintlify.site` before activating routing. The index must retain `/docs/...` for articles and `/api/service/...` for operations; merely removing an extra prefix from API links is insufficient. Do not substitute `fga.mintlify.app`, change the source routes to fit an incorrect index, or weaken acceptance to hide inconsistent provider output.

Confirm these provider-owned details before production activation; requesting confirmation is not approval:

- The root-based deployment supports both `/docs/**` and `/api/service/**` behind the selective proxy without replacing the GitHub Pages origin.
- Public canonicals and social URLs use `https://openfga.dev` with the correct section path.
- The generated documentation index includes every owned docs and API page, directly or through recursive `/_llms/**` indexes. An empty `llms.txt` or sitemap is a deployment failure, not acceptable discovery.
- The forwarded `Origin`, `Host`, and `X-Forwarded-*` contract supports search, assistant sessions, and analytics. The Worker targets Mintlify for Host/Origin and retains the public forwarded host/protocol.
- Advertised MCP, agent cards, agent skills, and API-catalog endpoints exist and use working public URLs. Generated metadata has previously advertised a nonexistent API catalog and a `*.mintlify.me` host. The Worker does not invent replacements for arbitrary vendor hosts or fabricate missing metadata. Resolve these with Mintlify before approving discovery.
- Verification and certificate-renewal paths have an explicit owner. Add a narrow exception only if the provider requires it.

The Worker rewrites native index origins and discovery headers to the public docs resource paths. It does not rewrite HTML, JavaScript, or MCP JSON to hide a misconfigured deployment. Root website resources stay separate.

## Acceptance and cutover

Before activation, run from the reviewed checkout:

```bash
npm run verify:docs-origin
```

The native and proxy acceptance commands make read-only HTTP requests and report nonzero failures for missing or mismatched source fingerprints, wrong canonical hosts, missing runtime assets, incomplete recursive docs indexes, bundle failures, lost redirect queries, website capture, a missing compatibility page, and incomplete composite sitemap output. They fetch OpenAPI from `main`, verify the last-generated schema digest, and check all 24 advertised API operation URLs, not just List stores. An upstream digest change requires an accepted sample update before release verification can pass. Every advertised docs and API page must carry the fingerprint of this checkout; mixed cached revisions fail too. If the hosted marker does not match, wait for the matching deployment and repeat acceptance; do not bypass the gate or substitute a hosted marker into local configuration. This source marker is not an attestation of provider internals, browser interactions, Cloudflare route precedence, permissions, or complete MCP compatibility. Mintlify can fetch newer upstream schemas independently of this repository's source marker.

If the infrastructure owner provides an approved HTTPS verification proxy, check it with `npm run verify:docs-proxy -- --origin <approved-origin>` before activation. This does not authorize a public preview deployment or use of the local `WEBSITE_ORIGIN` override in production. A proxy that uses the currently published website cannot serve the new composite sitemap or compatibility page until coordinated website publication. Record those expected failures, validate the compatibility page against the local website build before activation, and rerun public checks after publication. Do not waive other failures on that basis. Verify generated agent metadata and every URL it advertises manually.

In an HTTPS browser, check docs and API navigation, direct deep links, per-page Markdown, images, custom viewers, search results, enabled assistant streaming, and analytics POSTs. Follow legacy Swagger fragments for Check, BatchCheck, and AuthZEN, including encoded tag names and the trailing-slash variant. Check response MIME types, upstream error propagation, theme changes, and reloads. Test website Home, Project, Community, Blog, search, root LLM resources, and negative prefix matches. Root `openfga.dev/` must not redirect to docs.

For reader-interface acceptance, check the [migration review checklist](../../docs-site/README.md#migration-review-checklist). LLM resources must remain machine-discoverable without visible footer links. Check that desktop links follow the logo, while the GitHub star badge, search, and theme controls form the right-hand group with the badge immediately before search. Keyboard traversal must follow the same order. Exercise native search, theme selection, and the responsive menu. Separate Ask AI navbar buttons, floating prompts, and code-block assistant buttons are intentionally hidden. API descriptions must remain visible while article SEO descriptions stay metadata-only.

Check the native page-header menu on documentation and API pages: Copy page, Open in ChatGPT, Open in Claude, Copy MCP install command, Connect to Cursor, and Connect to VS Code. Confirm that Copy page produces the current page's Markdown and inspect external-chat URLs without submitting a conversation. Inspect the copied MCP command and decoded editor links without running an installer; all must identify the same reachable OpenFGA documentation MCP service. Native actions generate `/mcp` on the current origin, so the proxy forwards this exact endpoint and retains `/docs/mcp` as an alias. Confirm MCP `initialize` and `tools/list` POSTs succeed on both paths, without invoking tools or installing an integration. A preview-host handshake alone does not accept production-generated menu URLs. Check that `/mcp/`, `/mcp/other`, and `/mcp-other` still reach the website; do not widen the exception into a prefix.

Content acceptance requires the original visible titles, section headings, wording, section order, navigation, and page boundaries, subject only to the [documented technical exceptions](../../docs-site/README.md#retained-technical-exceptions). SEO-only adjustments must not change visible titles or sidebar labels. Retain the useful SDK setup guidance and code repairs; do not waive unrelated editorial changes as part of release approval.

Before the change window, save:

- The previous Worker version, routes, and applicable edge rules.
- The last complete GitHub Pages deployment containing legacy docs, including its commit/artifact and a tested restoration procedure.
- Verification evidence, accepted provider settings, the reviewed deployment commit, and the owners performing activation and rollback.

### Production release sequence

The unchanged [website deployment workflow](../../.github/workflows/deploy.yml) runs on main pushes, manual dispatch, and a schedule. The migration PR removes the old docs and Swagger source, so its website build no longer publishes them. Use an owner-approved publication hold for this sequence; the PR does not add an automated deployment gate.

1. **Clear pre-merge gates.** Obtain required reviews, provider confirmation, successful source-matching native acceptance, and owner agreement on activation and rollback. A successful Mintlify build alone does not accept discovery or the proxy configuration.
2. **Hold website publishing.** Save the rollback material above and prevent push, scheduled, and manual publishing during the window. Confirm no existing or queued deployment can publish while the hold is active.
3. **Merge and deploy Mintlify.** Keep the website hold active. Merge the reviewed revision, switch the connected Mintlify production branch to `main`, and wait for its deployment. Keep the repository directory, domain, and route prefixes unchanged.
4. **Accept the merged native deployment.** From the merged checkout, run `npm run verify:docs-origin` again. Stop if source markers, docs/API pages, discovery, or required provider endpoints fail.
5. **Activate the reviewed Worker.** Publish the bundled modules and attach the approved production Worker Route. Check docs and API operation pages, website fallthrough, HTTPS handling, and edge errors while the old website is still published. If these fail, restore the previous edge configuration and keep website publishing held.
6. **Publish the website.** Release the hold and dispatch the GitHub Pages deployment for the agreed `main` revision. Confirm that the new compatibility page and composite sitemap are published, then run the public acceptance command below and complete the browser checks above. A failure after website publication requires the coordinated rollback below, not just removing the Worker route.
7. **Monitor the release.** Check Worker errors, upstream failures, and request limits. Retain the rollback artifacts and leave `PERMANENT_API_REDIRECTS=false` until redirect acceptance is complete.

After website publication, run from the released checkout:

```bash
npm run verify:docs-proxy -- --origin https://openfga.dev
```

Do not merge and leave the new website deployed while waiting for someone to configure routing. No separate manual deletion of legacy docs or PR revert is part of normal cutover.

Code/content review can begin before these deployment gates are complete. Document unresolved gates in the PR handoff; they block merge and activation, not the request for review.

### Review readiness and PR handoff

Ready for review requests code and content feedback; it does not authorize merge, website publication, or a traffic switch. Record the reviewed revision, relevant check results, docs/API preview links, content-preservation exceptions, and unresolved release blockers in the PR description. If hosted pages do not match that revision, state the limitation rather than presenting the preview as accepted.

Request docs, frontend, and DX review, and coordinate deployment with the existing infrastructure and Mintlify owners. The website preview workflow handles `ready_for_review` while retaining its non-draft and same-repository restrictions. Keep the PR draft while implementation is incomplete, and change its state only when a maintainer chooses to request review. Do not merge until required reviews, source-matching acceptance, and a coordinated cutover/rollback plan are complete.

## Rollback

Restore the saved complete website deployment and edge configuration, then purge affected caches and verify the old docs and website URLs. Restore the website content before removing native routing where possible. A Worker version rollback must also account for routes and rules changed outside that version.

**Removing the Worker route alone does not restore the retired Docusaurus docs.** Pause or revert the website deployment source as agreed with its owner so a scheduled publish cannot overwrite the restored artifact.

If the migration has merged, an approved revert on `main` restores the legacy source for future builds; restore the corresponding Mintlify configuration and Cloudflare routing as part of that same recovery. A source revert alone is not an immediate deployment rollback: verify that the restored complete website is actually published.

## References

- [Mintlify Cloudflare deployment](https://www.mintlify.com/docs/deploy/cloudflare)
- [Mintlify reverse-proxy requirements](https://www.mintlify.com/docs/deploy/reverse-proxy)
- [Mintlify subpath hosting](https://www.mintlify.com/docs/deploy/docs-subpath)
- [Mintlify custom-domain verification](https://www.mintlify.com/docs/customize/custom-domain)
- [Mintlify CSP guidance](https://www.mintlify.com/docs/deploy/csp-configuration)
- [Cloudflare Worker Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)
