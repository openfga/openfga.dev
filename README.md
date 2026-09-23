# OpenFGA Documentation

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fopenfga%2Fopenfga.dev.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fopenfga%2Fopenfga.dev?ref=badge_shield)

## About OpenFGA
<!-- markdown-link-check-disable -->
[OpenFGA](https://github.com/openfga/openfga) is an open source Fine-Grained Authorization solution based on Google's Zanzibar. It was created by the Auth0 FGA team and welcomes community contribution. OpenFGA is designed to make it easy for application builders to quickly add fine-grained authorization to their applications. It offers an HTTP API and has SDKs for programming languages including [JavaScript](https://github.com/openfga/js-sdk), [GoLang](https://github.com/openfga/go-sdk) and [.NET](https://github.com/openfga/dotnet-sdk). More SDKs and integrations such as Rego are planned for the future. OpenFGA is designed and optimized for reliability and low latency at a high scale.
<!-- markdown-link-check-enable-->

## About OpenFGA docs

Product documentation and the read-only API reference live in [`docs-site/`](docs-site/README.md) and are published with [Mintlify](https://mintlify.com/). [Docusaurus](https://docusaurus.io/) builds Home, Project, Community, Blog, and website search.

The legacy `docs/content/` corpus and sidebar are retired. Author product documentation in `docs-site/docs/`; do not recreate the old source tree. Compact historical regression fixtures under `tests/fixtures/mintlify/` preserve independently captured migration expectations, not a second published documentation corpus.

Keep this migration content-preserving. Retain the original visible page titles, section headings, navigation labels, grouping, order, article wording, and page boundaries. SEO-only changes must stay in non-visible metadata, not Mintlify's reader-visible `title` field. Reorganization and visible copy improvements belong in separate follow-up changes. See the [migration review checklist](docs-site/README.md#migration-review-checklist) for the reader-interface and content requirements.

Keep the existing SDK repairs and useful setup guidance within the [documented technical exceptions](docs-site/README.md#retained-technical-exceptions). Those exceptions do not authorize other content additions or section reordering.

Shared components under `src/components/Docs/` remain in use by the Blog and the native viewer/code-generation checks. They are not obsolete solely because the product documentation moved.

### Agent-readable documentation

The website and Mintlify publish separate Markdown and LLM resources, linked from the root `/llms.txt`. See the [build scripts](scripts/README.md) for generated website resources and the [native page actions](docs-site/README.md#page-actions) for reader controls.

### Production routing

Cloudflare routes `/docs` and the service API reference to Mintlify while Home, Project, Community, and Blog remain on Docusaurus/GitHub Pages. Routing activation and website publication require owner coordination; see the [deployment runbook](deploy/cloudflare/README.md) for domain settings, DNS, verification, and rollback.

## Getting Started

### Setup and Installation

#### Clone the repo locally

Run `git clone https://github.com/openfga/openfga.dev.git` to clone the repo to your machine.

#### Setup Git LFS (Large File Storage)

Install [Git LFS](https://git-lfs.github.com/), then run these commands from the repository root:

```bash
git lfs install
git lfs pull
```

`git lfs pull` downloads and checks out the LFS media for the current ref. If the objects are already downloaded but the working tree still contains pointers, `git lfs checkout` restores those local objects without downloading them.

The default rules in [`.gitattributes`](.gitattributes) cover SVG, PNG, JPG, JPEG, GIF, MP4, and WebM media. **Assets under `docs-site/` are an intentional exception:** they are committed as ordinary Git blobs, so a Mintlify checkout does not need to resolve LFS objects. See [Mintlify asset storage](docs-site/README.md#asset-storage-and-git-lfs) before copying or adding media. Keep native overrides after global LFS rules when introducing a new format; do not replace the repository's existing LFS policy.

#### Install Dependencies

To run the docs locally you will need to first install dependencies:

```
npm install
```

#### Mintlify repository quality checks

From the repository root, use Node.js 22 with Git, Bash, Python 3, and curl available:

```bash
npm ci
npm run check:mintlify
```

The aggregate checks generated browser artifact freshness and codegen/runtime/semantic regressions; MDX parsing; OpenFGA DSL blocks; documentation/API navigation and historical source inventory; native API samples; production-content parity fixtures; custom components; configuration generation; and split-site resource contracts. Shared viewer-runtime tests run once. Invalid content, stale artifacts, or failed checks exit nonzero without regenerating committed output.

The [Mintlify repository quality workflow](.github/workflows/mintlify-quality.yml) runs on pull requests targeting `main` or `poc/mintlify-native`, pushes to `poc/mintlify-native`, and manual dispatch. It has read-only repository permissions, a 15-minute job timeout, and no path exclusions or deployment steps. Docusaurus build, lint, and audit workflows remain separate; their link checks enforce the split-site boundary.

After changing native sources, run `npm run generate:mintlify-deployment` and commit the updated hidden marker in `docs-site/docs.json`. Checks reject stale markers; production acceptance requires the selected checkout's fingerprint on every hosted docs/API page, not merely a matching route inventory. See the [deployment fingerprint guide](docs-site/README.md#deployment-fingerprint).

This source-only gate does not fetch Git LFS objects (`lfs: false`). LFS-managed media remains as pointers, while the existing [`docs-site/` asset overrides](.gitattributes) keep native assets as ordinary Git blobs. The gate neither checks media contents nor builds or publishes assets. Existing Docusaurus build/preview/deploy workflows retain their LFS-aware checkout; use the Git LFS setup above when rendering the site locally.

Validation is **not network-independent**: dependency installation uses the root lockfile, and API validation fetches the canonical OpenAPI URL on `main` recorded in [`api-samples.json`](docs-site/api-samples.json), checks it against the last-generated SHA-256 digest, and uses a 30-second timeout. Network, digest, or schema failures fail the gate; no cached-spec fallback masks them. The [API updater](docs-site/README.md#automatic-upstream-updates) proposes compatible changes in draft PRs and reports incompatibilities in issues. Mintlify follows upstream `main` independently of these PRs. SDK wire tests execute Node.js and curl programs against loopback fixtures, not a deployed OpenFGA server; other SDK samples have generator regressions, not execution coverage in this gate.

These are repository-owned checks, **not official Mintlify validation or reproducible Mintlify CLI QA**. They do not install or run the Mintlify CLI, compare its native MDX validator, prove browser rendering, or change branch protection. See the [Mintlify authoring guide](docs-site/README.md#validating-authoring-changes) for individual checks and their limits.

#### Running in Development

You can then run 

```
npm run dev
```

This starts the Docusaurus website, not the product docs. For native documentation development, follow the [Mintlify preview instructions](docs-site/README.md). Docs and API links on website previews deliberately use the public root rather than the Docusaurus preview prefix.

Website search indexes Blog, Project, and Community. The local-search plugin excludes the homepage. `@easyops-cn/docusaurus-search-local` is pinned to the unmodified `0.52.2` release: later releases through `0.55.3` call a docs-version hook even with `indexDocs: false`, causing builds to fail when the docs plugin is disabled ([upstream issue](https://github.com/easyops-cn/docusaurus-search-local/issues/571)). No dependency patches or postinstall modifications are required. Upgrade after the upstream regression is fixed, and verify production/preview builds and browser search with `docs: false`; do not re-enable legacy docs to satisfy that hook.

#### Building for Production

To generate a production build

##### NPM
`npm run build` # Docusaurus website files will be in ./build; Mintlify deploys docs-site separately

Ordinary builds do not regenerate configuration content or fetch the latest server release. Run `npm run build:config-page` explicitly to update the native configuration table, or use the nightly configuration-update workflow. Generated updates require review against the independently captured content fixtures.

To launch a server with the build files, run 

```
npm run serve
```

<!-- markdown-link-check-disable -->
You will then be able to browse the website at http://localhost:3000/
<!-- markdown-link-check-enable-->

#### Docker


##### Build

To build in development mode

```
docker build --target development . -t fga-docs-dev
```

To run in development mode

```
docker run --init --rm -p 3000:3000 fga-docs-dev
```

The generated webpages will be available in http://localhost:3000.

##### Production

To build in production mode


```
docker build . -t fga-docs
```

Run

```
docker run --init --rm -p 3000:80 fga-docs
```

## PR Preview
GitHub Action [Deploy PR Preview](https://github.com/marketplace/actions/deploy-pr-preview) allows previewing of proposed changes. The URL for the changes can be previewed via
```
https://openfga.dev/pr-preview/pr-[number]
```

For example, the Project page for PR-589 is available at
```
https://openfga.dev/pr-preview/pr-589/project
```

Use the separate Mintlify deployment preview for product docs and the API reference. Configure Mintlify's monorepo directory as `/docs-site` before enabling that deployment after the rename. Repository cleanup does not configure the external production edge or switch traffic.

The website preview workflow runs when a PR becomes ready for review. Request code and content review with known deployment limitations documented; production configuration and cutover approval are merge gates, not prerequisites to leave draft. See the [review handoff policy](deploy/cloudflare/README.md#review-readiness-and-pr-handoff).

## Contributing
Please review the [Contributing Guidelines](https://github.com/openfga/.github/blob/main/CONTRIBUTING.md) before sending a PR or opening an issue.

## Issue Reporting
If you find a bug or inaccuracy in the documentation content, please report it in this repository's [issues section](https://github.com/openfga/openfga.dev/issues). Please do not report security vulnerabilities on the public GitHub issue tracker. Refer to [the security policy](https://github.com/openfga/.github/blob/main/SECURITY.md) for disclosing security issues.

<!-- markdown-link-check-disable -->
## Author
OpenFGA <contact@openfga.dev> (https://openfga.dev)

## License
Please refer to https://github.com/openfga/rfcs/blob/main/LICENSE for license information.
<!-- markdown-link-check-enable -->
