# OpenFGA Documentation

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fopenfga%2Fopenfga.dev.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fopenfga%2Fopenfga.dev?ref=badge_shield)

## About OpenFGA
<!-- markdown-link-check-disable -->
[OpenFGA](https://github.com/openfga/openfga) is an open source Fine-Grained Authorization solution based on Google's Zanzibar. It was created by the Auth0 FGA team and welcomes community contribution. OpenFGA is designed to make it easy for application builders to quickly add fine-grained authorization to their applications. It offers an HTTP API and has SDKs for programming languages including [JavaScript](https://github.com/openfga/js-sdk), [GoLang](https://github.com/openfga/go-sdk) and [.NET](https://github.com/openfga/dotnet-sdk). More SDKs and integrations such as Rego are planned for the future. OpenFGA is designed and optimized for reliability and low latency at a high scale.
<!-- markdown-link-check-enable-->

## About OpenFGA docs

Product documentation and the read-only API reference live in [`docs-site/`](docs-site/README.md) and are published with [Mintlify](https://mintlify.com/). [Docusaurus](https://docusaurus.io/) builds Home, Project, Community, Blog, and website search.

The legacy `docs/content/` corpus and sidebar are retired. Author product documentation in `docs-site/docs/`; do not recreate the old source tree. Compact historical regression fixtures under `tests/fixtures/mintlify/` preserve independently captured migration expectations, not a second published documentation corpus.

Shared components under `src/components/Docs/` remain in use by the Blog and the native viewer/code-generation checks. They are not obsolete solely because the product documentation moved.

### Agent-readable documentation

The root `/llms.txt` is a curated entry point linking to native docs, FAQ/concepts, the canonical OpenAPI v3 specification, and website resources. Docusaurus generates `/index.md`, `/project.md`, `/community.md`, and a website-only `/llms-full.txt` bundle. Those three pages advertise their Markdown and root index with discovery links.

Mintlify owns the complete product documentation index, bundle, and per-page Markdown. Deployment must map `/docs/llms.txt` and `/docs/llms-full.txt` to its generated resources; the website build does not fabricate them or publish a duplicate docs bundle. See [split-site deployment](docs-site/README.md#split-site-deployment) for routing and sitemap ownership.

`npm run build` validates the website resources and cross-site links against native pages, anchors, redirects, and canonical API operations from the same checkout. External links in native MDX are also extracted for the CI link checker.

### Production routing

The [Cloudflare proxy](deploy/cloudflare/README.md) forwards `/docs` and `/api-reference` to Mintlify while preserving the existing website origin. This repository includes its code, environment configuration, offline checks, and a manual deployment workflow. No ordinary build or PR check deploys it.

The website build generates a composite sitemap index with separate website and native children. Cloudflare activation, Mintlify domain/discovery verification, and the website publication must be coordinated by their owners before removing the old public docs deployment. See the runbook for acceptance and complete rollback requirements.

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

This source-only gate does not fetch Git LFS objects (`lfs: false`). LFS-managed media remains as pointers, while the existing [`docs-site/` asset overrides](.gitattributes) keep native assets as ordinary Git blobs. The gate neither checks media contents nor builds or publishes assets. Existing Docusaurus build/preview/deploy workflows retain their LFS-aware checkout; use the Git LFS setup above when rendering the site locally.

Validation is **not network-independent**: dependency installation uses the root lockfile, and API validation fetches the immutable canonical OpenAPI URL recorded in [`api-samples.json`](docs-site/api-samples.json), verifies its SHA-256 digest, and uses a 30-second timeout. Network, digest, or schema failures fail the gate; no cached-spec fallback masks them. SDK wire tests execute Node.js and curl programs against loopback fixtures, not a deployed OpenFGA server; other SDK samples have generator regressions, not execution coverage in this gate.

These are repository-owned checks, **not official Mintlify validation or reproducible Mintlify CLI QA**. They do not install or run the Mintlify CLI, compare its native MDX validator, prove browser rendering, or change branch protection. See the [Mintlify authoring guide](docs-site/README.md#validating-authoring-changes) for individual checks and their limits.

#### Running in Development

You can then run 

```
npm run dev
```

This starts the Docusaurus website, not the product docs. For native documentation development, follow the [Mintlify preview instructions](docs-site/README.md). Docs and API links on website previews deliberately use the public root rather than the Docusaurus preview prefix.

Website search indexes Blog, Project, and Community. The local-search plugin excludes the homepage. The pinned package currently calls a docs-version hook even with `indexDocs: false`; the two-line patch in `patches/` guards that hook without changing search UI or autocomplete. `npm ci` applies it through `patch-package --error-on-fail`. Reassess the patch when upgrading `@easyops-cn/docusaurus-search-local`; do not re-enable legacy docs to satisfy that hook.

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
