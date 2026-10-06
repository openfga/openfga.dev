---
title: "Fine-Grained Authorization"
description: "OpenFGA is a CNCF Incubating open-source fine-grained authorization engine inspired by Google Zanzibar. Used by Grafana, Docker, and Canonical."
canonical: "https://openfga.dev/"
content_type: "page"
---

## Quick Start

Trying OpenFGA is as easy as...

Run the following snippet in a terminal in an environment with Docker installed:

```
docker pull openfga/openfga && \
docker run -p 8080:8080 -p 8081:8081 \
-p 3000:3000 openfga/openfga run
```

OpenFGA will be running at localhost:8080 on your machine. Learn about other options and next steps in the project [README.md](https://github.com/openfga/openfga) or [Getting Started](https://openfga.dev/docs/getting-started) guides.

Learn how to use sample authorization models and create your own with the project’s extensive [documentation](https://openfga.dev/docs/modeling).

[![](/assets/images/terminal-beeca3a53258f5076350c9fe9924d782.png)](/assets/medias/terminal-6773f514460e24a9550af5e15596b3ee.webm)

Adopted by teams at

![Agicap logo - OpenFGA Adopter](/img/adopters/agicap.svg)

![Appscode logo - OpenFGA Adopter](/img/adopters/appscode.svg)

![Auth0 logo - OpenFGA Adopter](/img/adopters/auth0.svg)

![Canonical logo - OpenFGA Adopter](/img/adopters/canonical.svg)

![Distyl logo - OpenFGA Adopter](/img/adopters/distyl.svg)

![Docker logo - OpenFGA Adopter](/img/adopters/docker.svg)

![EarthScope logo - OpenFGA Adopter](/img/adopters/earthscope.svg)

![Eternal logo - OpenFGA Adopter](/img/adopters/eternal.svg)

![Flex logo - OpenFGA Adopter](/img/adopters/flex.svg)

![Grafana logo - OpenFGA Adopter](/img/adopters/grafana.svg)

![Headspace logo - OpenFGA Adopter](/img/adopters/headspace.svg)

![Linux Foundation logo - OpenFGA Adopter](/img/adopters/linuxfoundation.svg)

![Okta logo - OpenFGA Adopter](/img/adopters/okta.svg)

![OpenObserve logo - OpenFGA Adopter](/img/adopters/openobserve.svg)

![PlatformMesh logo - OpenFGA Adopter](/img/adopters/platformmesh.svg)

![ReadAI logo - OpenFGA Adopter](/img/adopters/readai.svg)

![SigNoz logo - OpenFGA Adopter](/img/adopters/signoz.svg)

![Skyral logo - OpenFGA Adopter](/img/adopters/skyral.svg)

![Sourcegraph logo - OpenFGA Adopter](/img/adopters/sourcegraph.svg)

![Supabase logo - OpenFGA Adopter](/img/adopters/supabase.svg)

![Zuplo logo - OpenFGA Adopter](/img/adopters/zuplo.svg)

![](/img/adopters/agicap.svg)

![](/img/adopters/appscode.svg)

![](/img/adopters/auth0.svg)

![](/img/adopters/canonical.svg)

![](/img/adopters/distyl.svg)

![](/img/adopters/docker.svg)

![](/img/adopters/earthscope.svg)

![](/img/adopters/eternal.svg)

![](/img/adopters/flex.svg)

![](/img/adopters/grafana.svg)

![](/img/adopters/headspace.svg)

![](/img/adopters/linuxfoundation.svg)

![](/img/adopters/okta.svg)

![](/img/adopters/openobserve.svg)

![](/img/adopters/platformmesh.svg)

![](/img/adopters/readai.svg)

![](/img/adopters/signoz.svg)

![](/img/adopters/skyral.svg)

![](/img/adopters/sourcegraph.svg)

![](/img/adopters/supabase.svg)

![](/img/adopters/zuplo.svg)

## Features

### Model any authorization system

OpenFGA takes the best ideas from Google's Zanzibar paper for Relationship-Based Access Control, and also solves problems for Role-based Access Control and Attribute-Based Access Control use cases. The modeling language is powerful enough for engineers, but friendly enough for other stakeholders on your team as well.

### Works with your code

SDKs for the most popular languages have already been written, making it easy to integrate and grow alongside your applications. OpenFGA also makes it trivial to contribute new SDKs to support your project's language.

### Blazing fast

OpenFGA is designed to answer authorization check calls in milliseconds, which lets it scale with projects of any size. It works just as well for small startups and hobby programmers building single applications as it does for enterprise companies building platforms on a global scale.

### Built in the open

Transparency and peer review are important for building secure, stable, and sustainable software. OpenFGA's [RFC process](https://github.com/openfga/rfcs/blob/main/README.md) and [governance model](https://github.com/openfga/.github/blob/main/CONTRIBUTING.md) invite anyone to become a contributor, and collaboratively develop the [public roadmap](https://github.com/orgs/openfga/projects/1). Come create the next standard for authorization with us!

### CNCF Incubation Project

We are a [Cloud Native Computing Foundation](https://www.cncf.io/) incubating project.

### Get Involved

Join OpenFGA's active [Slack and GitHub community](https://openfga.dev/community), check out existing [RFCs](https://github.com/openfga/rfcs) to understand where the project is headed, and learn more about how to take part by reading our [CONTRIBUTING.md](https://github.com/openfga/.github/blob/main/CONTRIBUTING.md).

[Learn how to get involved →](https://github.com/openfga/.github/blob/main/CONTRIBUTING.md#contribution-process)

## Since you're here, you might be interested in some ReBAC resources:

- [Zanzibar Academy →](https://zanzibar.academy/)
- [Auth0 FGA Playground →](https://play.fga.dev/)
- [Podcast - Authorization in Software →](https://podcastindex.org/podcast/4368675)
