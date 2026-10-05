# OpenFGA Documentation

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fopenfga%2Fopenfga.dev.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fopenfga%2Fopenfga.dev?ref=badge_shield)

## About OpenFGA

[OpenFGA](https://github.com/openfga/openfga) is an open source fine-grained authorization solution based on Google's Zanzibar. This repository contains the website and documentation for [openfga.dev](https://openfga.dev).

## About OpenFGA docs

| Content | Source | Publishing |
| --- | --- | --- |
| Product documentation | [`docs-site/`](docs-site/README.md) | Mintlify at `/docs/...` |
| Read-only API reference | [`docs-site/docs.json`](docs-site/docs.json) and the upstream OpenAPI schema | Mintlify at `/docs/api/service/...` |
| Home, Project, Community, and Blog | `src/`, `blog/`, and `static/` | Docusaurus on GitHub Pages |

The Mintlify URLs above describe the planned `/docs` deployment. Legacy `/api/service` URLs and Swagger bookmarks remain supported through the website compatibility page and redirects.

See the [Mintlify contributor guide](docs-site/README.md) for authoring, API samples, media, and migration requirements. The [maintenance scripts guide](scripts/README.md) covers generated files, sitemaps, LLM resources, and upstream updates.

## Getting Started

Use Node.js 22. Git, Bash, Python 3, and curl are also required for the repository quality checks.

```bash
git clone https://github.com/openfga/openfga.dev.git
cd openfga.dev
npm ci
```

### Setup Git LFS (Large File Storage)

Install [Git LFS](https://git-lfs.github.com/) and hydrate website/Blog media before rendering the website:

```bash
git lfs install
git lfs pull
```

If objects are already downloaded but files still contain pointers, run `git lfs checkout`. Assets under `docs-site/` intentionally use ordinary Git files; see the [asset-storage policy](docs-site/README.md#asset-storage-and-git-lfs).

### Product docs and API preview

Run the Mintlify CLI from `docs-site/`:

```bash
cd docs-site
npx mint dev --port 3333
```

Open `http://localhost:3333/`. Local pages use source-root paths such as `/fga` and `/api/service`; Mintlify adds `/docs` on the configured hosted deployment.

### Website and Blog preview

From the repository root:

```bash
npm run dev
```

Open `http://localhost:3000/`. This runs Docusaurus, not the Mintlify docs. Website previews link to docs/API pages at their public URLs.

### Mintlify repository quality checks

After editing native sources, run from the repository root:

```bash
npm run generate:mintlify-deployment
npm run check:mintlify
```

Commit the updated fingerprint in `docs-site/docs.json` with native-source changes. API checks require network access and reject an upstream schema that differs from the recorded digest.

The [quality workflow](.github/workflows/mintlify-quality.yml) runs repository checks, not Mintlify CLI or hosted acceptance. See [validation details and limits](docs-site/README.md#validating-authoring-changes).

## Building and deployment

Build and serve the Docusaurus website from the repository root:

```bash
npm run build
npm run serve
```

Output goes to `build/`; Mintlify deploys `docs-site/` separately. GitHub Pages continues publishing `gh-pages`. Hosting Mintlify at `/docs` does not require changing the repository's default branch.

The planned public setup uses Mintlify's dashboard-provided Cloudflare Worker; this repository does not maintain a Worker. Deployment settings, workflow changes, and public cutover remain owner-managed. Follow the [deployment guide](docs-site/README.md#split-site-deployment) before publishing the migrated website.

## PR Preview

Website previews use:

```text
https://openfga.dev/pr-preview/pr-[number]/
```

Use the separate Mintlify deployment preview for product docs and the API reference; they are not included in the Docusaurus preview.

## Contributing

Please review the [Contributing Guidelines](https://github.com/openfga/.github/blob/main/CONTRIBUTING.md) before sending a PR or opening an issue.

Migration pull requests target `docs-next`. Preserve existing article content and navigation during migration; propose editorial changes separately. See the [migration review checklist](docs-site/README.md#migration-review-checklist).

## Issue Reporting

If you find a bug or inaccuracy in the documentation content, please report it in this repository's [issues section](https://github.com/openfga/openfga.dev/issues). Please do not report security vulnerabilities on the public GitHub issue tracker. Refer to [the security policy](https://github.com/openfga/.github/blob/main/SECURITY.md) for disclosing security issues.

<!-- markdown-link-check-disable -->
## Author
OpenFGA <contact@openfga.dev> (https://openfga.dev)

## License
Please refer to https://github.com/openfga/rfcs/blob/main/LICENSE for license information.
<!-- markdown-link-check-enable -->
