# Split-site routing

This Worker serves Mintlify documentation through the existing `openfga.dev` Cloudflare zone. Docusaurus stays on GitHub Pages. The repository includes the implementation, dry-run checks, sitemap builder, and a manual deployment workflow. **Merging this code does not deploy the Worker or authorize a production cutover.**

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
| `/images/**`, five exact root scripts/styles                     | Native repository assets listed in `routing.mjs`                              |
| `/docs/llms.txt`, `/docs/llms-full.txt`                          | Mintlify's root index and complete bundle                                     |
| `/docs/mcp`, selected `/docs/.well-known/**` endpoints           | Corresponding native MCP/discovery endpoints, subject to vendor acceptance    |
| Exact `/api/request`                                             | `/_mintlify/api/request`                                                      |
| Everything else                                                  | Existing Docusaurus origin                                                    |

The website keeps `/`, `/project`, `/community`, `/blog/**`, `/search`, `/robots.txt`, all sitemap files, root LLM resources, and its asset directories. Root `/.well-known/**` and certificate-verification routes are not captured. `/docs-other`, `/api-reference-other`, and arbitrary `/api/**` paths are not native routes.

Do not redirect `/api/service` directly to the new API index. Swagger links carry their operation in a fragment, which the Worker cannot see. Both `#Relationship%20Queries/Check` and `#/Relationship%20Queries/Check` are supported. The small website page reads that fragment and replaces the browser location with the matching native operation, preserving query parameters. Empty, unknown, and malformed fragments fall back to `/api-reference`; a link remains usable without JavaScript. The page is excluded from search, sitemaps, and website LLM bundles, and does not restore Swagger.

Use a **Worker Route**, not a Worker Custom Domain or an apex DNS replacement. The named production configuration uses `openfga.dev/*` so bare routes with query strings also invoke the Worker. The code then applies segment-aware ownership. Website fallthrough uses the original `fetch(request)` to reach the existing origin.

## Local checks

Use Node.js 22 and the repository lockfile:

```bash
npm ci
npm run check:docs-proxy
npm run test:site-boundary
npm run build
```

`check:docs-proxy` runs offline tests and a Wrangler production **dry run**. It does not authenticate, upload, or attach a route. The ordinary build creates a root sitemap index plus `sitemap-website.xml` and `sitemap-docs.xml`. Native locations come from this checkout's docs inventory and pinned canonical OpenAPI schema, not a second hand-maintained URL list.

Run the Worker locally without deploying:

```bash
npm run dev:docs-proxy -- --local --local-protocol https --port 3383
```

Use the HTTPS URL printed by Wrangler and trust its local development certificate in your test client. The staging environment forwards website requests to the current public website; it does not serve your local Docusaurus build. Consequently, its sitemap check cannot pass until the new website sitemap is published. Local HTTP works for transport probes, but Mintlify's HTTPS-preferring client navigation should be exercised on HTTPS.

## Account setup

The Cloudflare owner must:

1. Confirm the existing `openfga.dev` zone and orange-cloud DNS records. Retain the GitHub Pages origin and TLS setup.
2. Inspect Worker Routes, Redirect Rules, Cache Rules, WAF, and rate limits for conflicts. The Worker adds no dynamic edge caching; existing rules must not force-cache HTML, RSC responses, POSTs, streams, or discovery.
3. Create protected GitHub environments `docs-proxy-staging` and `docs-proxy-production`. Require reviewer approval for production and restrict its permitted deployment branches.
4. Set environment secret `CLOUDFLARE_API_TOKEN` and environment variable `CLOUDFLARE_ACCOUNT_ID`. Scope the token to the intended account's Workers Scripts and zone's Workers Routes permissions, plus only the read permissions Wrangler requires. Never commit credentials.
5. Confirm the staging workers.dev URL is acceptable. It is intentionally public and contains only public documentation. Use an approved Access-protected staging hostname instead if organizational policy requires one.

The [manual workflow](../../.github/workflows/docs-proxy.yml) has no push, schedule, or pull-request trigger. Select the reviewed revision and `staging` first. Production additionally requires the exact confirmation `ACTIVATE OPENFGA DOCS ROUTING` and runs the native-origin acceptance command before deployment. Environment protection must be configured by an administrator; a YAML environment name alone does not create an approval policy.

For authorized operators, the equivalent CLI commands are:

```bash
npm run deploy:docs-proxy:staging
# Run only during the approved cutover:
npm run deploy:docs-proxy:production
```

The base Wrangler configuration has no routes, workers.dev URL, or preview URL. Only the explicitly selected production environment can attach the public route. Production uses permanent 308 legacy API redirects; staging uses 307. Both preserve methods and query strings.

## Mintlify owner actions

Keep the project directory `/docs-site`, upstream `https://fga.mintlify.site`, and deployment base path unset. Content already has `/docs` and `/api-reference` prefixes. Enabling a global `/docs` base path would change those routes.

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
npm run verify:docs-proxy -- --origin https://APPROVED-STAGING-HOST
```

These commands make read-only HTTP requests and report nonzero failures for wrong canonical hosts, missing runtime assets, incomplete recursive docs indexes, bundle failures, lost redirect queries, website capture, a missing compatibility page, and incomplete composite sitemap output. They fetch the digest-pinned OpenAPI schema and check all 24 advertised API operation URLs, not just List stores. They do not prove browser interactions, Cloudflare route precedence, permissions, or complete MCP compatibility.

Staging uses the currently published website, so record the expected composite-sitemap and new compatibility-page failures until the coordinated website publication. Validate the compatibility page against the local website build before activation and rerun the public checks after publication. Do not waive other failures on that basis. Verify generated agent metadata and every URL it advertises manually.

In an HTTPS browser, check docs and API navigation, direct deep links, per-page Markdown, images, custom viewers, search results, enabled assistant streaming, and analytics POSTs. Follow legacy Swagger fragments for Check, BatchCheck, and AuthZEN, including encoded tag names and the trailing-slash variant. Check response MIME types, upstream error propagation, theme changes, and reloads. Test website Home, Project, Community, Blog, search, root LLM resources, and negative prefix matches. Root `openfga.dev/` must not redirect to docs.

Before the change window, save:

- The previous Worker version, routes, and applicable edge rules.
- The last complete GitHub Pages deployment containing legacy docs, including its commit/artifact and a tested restoration procedure.
- Staging evidence, accepted provider settings, the reviewed deployment commit, and the owners performing activation and rollback.

The [website deployment workflow](../../.github/workflows/deploy.yml) runs on main pushes, manual dispatch, and a schedule. Coordinate merge and publication with the edge owner. Activate the accepted proxy before the website build removes legacy docs, then publish the website sitemap and rerun the proxy acceptance command against `https://openfga.dev`.

Do not merge and leave the new website deployed while waiting for someone to configure routing.

## Rollback

Restore the saved complete website deployment and edge configuration, then purge affected caches and verify the old docs and website URLs. Restore the website content before removing native routing where possible. A Worker version rollback must also account for routes and rules changed outside that version.

**Removing the Worker route alone does not restore the retired Docusaurus docs.** Pause or revert the website deployment source as agreed with its owner so a scheduled publish cannot overwrite the restored artifact.

## References

- [Mintlify Cloudflare deployment](https://www.mintlify.com/docs/deploy/cloudflare)
- [Mintlify reverse-proxy requirements](https://www.mintlify.com/docs/deploy/reverse-proxy)
- [Mintlify subpath hosting](https://www.mintlify.com/docs/deploy/docs-subpath)
- [Cloudflare Worker Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)
