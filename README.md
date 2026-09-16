# OpenFGA Documentation

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fopenfga%2Fopenfga.dev.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fopenfga%2Fopenfga.dev?ref=badge_shield)

## About OpenFGA
<!-- markdown-link-check-disable -->
[OpenFGA](https://github.com/openfga/openfga) is an open source Fine-Grained Authorization solution based on Google's Zanzibar. It was created by the Auth0 FGA team and welcomes community contribution. OpenFGA is designed to make it easy for application builders to quickly add fine-grained authorization to their applications. It offers an HTTP API and has SDKs for programming languages including [JavaScript](https://github.com/openfga/js-sdk), [GoLang](https://github.com/openfga/go-sdk) and [.NET](https://github.com/openfga/dotnet-sdk). More SDKs and integrations such as Rego are planned for the future. OpenFGA is designed and optimized for reliability and low latency at a high scale.
<!-- markdown-link-check-enable-->

## About OpenFGA docs

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Agent-readable documentation

Production builds publish a curated AI-agent entry point at `/llms.txt`, an exhaustive documentation index at `/docs/llms.txt`, an optional single-file bundle at `/llms-full.txt`, and a clean Markdown representation beside each current documentation URL (for example, `/docs/fga.md`). Documentation pages advertise these resources with `rel="alternate"` and `rel="describedby"` links.

`npm run build` validates that the generated indexes, Markdown pages, FAQ content, and discovery links stay in sync.

## Getting Started

### Setup and Installation

#### Clone the repo locally

Run `git clone https://github.com/openfga/openfga.dev.git` to clone the repo to your machine.

#### Setup Git LFS (Large File Storage)

* Follow the instructions [here](https://git-lfs.github.com/) to install git lfs on your system.
* If you haven't done so yet, run `git lfs install` to set up git lfs for your account.
* Run `git lfs pull`
* Run `git lfs checkout`

Currently `mp4`, `webm` and `svg` files are tracked. If you need to track more media formats, run: `git lfs track "*.extension"`

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

The aggregate checks generated browser artifact freshness and codegen/runtime/semantic regressions; MDX parsing, prose expressions, and their regressions; OpenFGA DSL blocks; documentation/API navigation and source inventory; native API sample overlay freshness and SDK regressions; and custom component usage and regressions. Shared viewer-runtime tests run once. Invalid content, stale artifacts, or failed checks exit nonzero without regenerating committed output.

The [Mintlify repository quality workflow](.github/workflows/mintlify-quality.yml) runs on pull requests targeting `main` or `poc/mintlify-native`, pushes to `poc/mintlify-native`, and manual dispatch. It has read-only repository permissions, a 15-minute job timeout, and no path exclusions or deployment steps. Existing Docusaurus build, lint, and audit workflows remain separate and unchanged.

This source-only gate does not fetch Git LFS objects (`lfs: false`). LFS-managed media remains as pointers, while the existing [`mintlify-native/` asset overrides](.gitattributes) keep native assets as ordinary Git blobs. The gate neither checks media contents nor builds or publishes assets. Existing Docusaurus build/preview/deploy workflows retain their LFS-aware checkout; use the Git LFS setup above when rendering the site locally.

Validation is **not network-independent**: dependency installation uses the root lockfile, and API validation fetches the immutable canonical OpenAPI URL recorded in [`api-samples.json`](mintlify-native/api-samples.json), verifies its SHA-256 digest, and uses a 30-second timeout. Network, digest, or schema failures fail the gate; no cached-spec fallback masks them. SDK wire tests execute Node.js and curl programs against loopback fixtures, not a deployed OpenFGA server; other SDK samples have generator regressions, not execution coverage in this gate.

These are repository-owned checks, **not official Mintlify validation or reproducible Mintlify CLI QA**. They do not install or run the Mintlify CLI, compare its native MDX validator, prove browser rendering, or change branch protection. See the [Mintlify authoring guide](mintlify-native/README.md#validating-authoring-changes) for individual checks and their limits.

#### Running in Development

You can then run 

```
npm run dev
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

#### Building for Production

To generate a production build

##### NPM
`npm run build` # Generated files will be in the ./build directory

To launch a server with the build files, run 

```
npm run serve
```

<!-- markdown-link-check-disable -->
You will then be able to browse the documentation at http://localhost:3000/   
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

For example, previewing changes on PR-589 for changes on docs/modeling/public-access is available via
```
https://openfga.dev/pr-preview/pr-589/docs/modeling/public-access
```

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
