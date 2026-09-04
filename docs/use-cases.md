---
title: "OpenFGA Use Cases"
description: "Production-ready OpenFGA patterns for AI agents, RAG, MCP servers, multi-tenant SaaS, and microservices authorization."
canonical: "https://openfga.dev/docs/use-cases"
content_type: "documentation"
last_updated: "2026-09-04T10:33:45.000Z"
---

# OpenFGA Use Cases

OpenFGA is a Zanzibar-style relationship engine. The patterns below are the ones that show up most often in production — each links to the modeling guide and, where available, an adopter reference that runs the pattern at scale.

## AI and agent authorization

- **[AI agent authorization](https://openfga.dev/docs/use-cases/ai-agent-authorization.md)** — modeling agents as principals, delegating user permissions, and bounding what an autonomous agent can do.
- **[RAG authorization](https://openfga.dev/docs/use-cases/rag-authorization.md)** — filtering retrieved documents by the user's permissions before they reach the model.
- **[MCP server authorization](https://openfga.dev/docs/use-cases/mcp-server-authorization.md)** — enforcing tool and resource access in a Model Context Protocol server.

## Application authorization

- **[Multi-tenant SaaS](https://openfga.dev/docs/use-cases/multi-tenant-saas.md)** — one OpenFGA store, many tenants, with strict isolation.
- **[Microservices authorization](https://openfga.dev/docs/use-cases/microservices-authorization.md)** — a central authorization service that every microservice consults, instead of each service rolling its own roles table.
