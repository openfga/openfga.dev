---
title: Modular Models
description: Modular Models 
slug: modular-models-announcement
date: 2024-03-29
authors: eharris
tags: [openfga,features]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Release Candidate for Modular Models

Modular models aims to improve the model authoring experience when multiple teams are maintaining a model, such as:

- A model can grow large and difficult to understand
- As more teams begin to contribute to a model, the ownership boundaries may not be clear and code review processes might not scale

With modular models, a single model can be separated across multiple files allow grouping of types and conditions into modules. This means that a model can be organized more easily in terms of team or organizational structure. Used in conjunction with features such as [GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), [GitLab](https://docs.gitlab.com/ee/user/project/codeowners/) or [Gitea's](https://docs.gitea.com/usage/code-owners) code owners. code owners, it should become easier to ensure the owners of an portion of your model are correctly assigned to review it.

## How to use it?

Modular models is currently shipped as an experimental feature while we gather feedback, in order for you to try it out.

* Update to the [v0.3.0 release](https://github.com/openfga/cli/releases/tag/v0.3.0) of the CLI
  * With the CLI you will be able to write your modular model and test it against a store file you have, but you will not be able to write your model to any OpenFGA server that does not enable this feature.
* Update to [v0.2.20](https://github.com/openfga/vscode-ext/releases/tag/v0.2.20) of the VS Code Extension
* Download [v1.5.1](https://github.com/openfga/openfga/releases/tag/v1.5.1) of OpenFGA
  * As this is currently experimental, you will need to start OpenFGA with `openfga run --experimental enable-modular-models`.
* Check out the modular models sample store in the [sample-stores repo](https://github.com/openfga/sample-stores/tree/main/stores/modular)
* Review the [documentation for this feature](https://openfga.dev/docs/modeling/modular-models)

## What's next?

We intend to move this feature out of RC within the next few weeks, so as we gather feedback we'll deal with any issues that arise and look to improve upon any areas of the developer experience as needed.

Looking beyond the near term, modular models allows us to implement [additional API authorization options for OpenFGA](https://github.com/openfga/roadmap/issues/30).

## Reach out!

We want to learn how you use this feature and how we can improve it! 

Please reach out through our [community channels](https://openfga.dev/community) with any questions or feedback.
