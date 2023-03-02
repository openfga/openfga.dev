# OpenFGA Documentation

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fopenfga%2Fopenfga.dev.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fopenfga%2Fopenfga.dev?ref=badge_shield)

## About OpenFGA
<!-- markdown-link-check-disable -->
[OpenFGA](https://github.com/openfga/openfga) is an open source Fine-Grained Authorization solution based on Google's Zanzibar. It was created by the Auth0 FGA team and welcomes community contribution. OpenFGA is designed to make it easy for application builders to quickly add fine-grained authorization to their applications. It offers an HTTP API and has SDKs for programming languages including [JavaScript](https://github.com/openfga/js-sdk), [GoLang](https://github.com/openfga/go-sdk) and [.NET](https://github.com/openfga/dotnet-sdk). More SDKs and integrations such as Rego are planned for the future. OpenFGA is designed and optimized for reliability and low latency at a high scale.
<!-- markdown-link-check-enable-->

## About OpenFGA docs

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.


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
