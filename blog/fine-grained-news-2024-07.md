---
title: Fine Grained News - July 2024
description: Fine Grained News
slug: fine-grained-news-2024-07
date: 2024-07-31
authors: hello-caleb
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News


Welcome to the July 2024 edition of Fine Grained News! We are thrilled to bring you the latest updates, features, and community highlights from OpenFGA. This month has included releases, performance improvements, and insights shared through our community meetings and presentations.


We value your feedback and invite you to participate in our [2024 OpenFGA Community Survey](https://www.surveymonkey.com/r/OPENFGA2024). Your insights help us understand your needs better and improve our offerings. Please take a few minutes to complete the survey and let your voice be heard.


## Improvements


**Latest Features**


- We’ve introduced consistency options for query requests. This new, experimental, feature provides more flexibility and control over how queries are executed, enhancing the accuracy and reliability of query results. [Learn more about this update](https://openfga.dev/blog/query-consistency-options-announcement).


- We’re now publishing images to `ghcr.io/openfga/openfga` as an alternative to DockerHub, thanks to the contribution from [@JAORMX](https://github.com/JAORMX). This provides an additional option for accessing and deploying our containers. [Read more](https://github.com/openfga/openfga/pull/1775).


**Performance Improvements**


- We've improved our Check latency up to 20X in some scenarios in OpenFGA [v1.5.7](https://github.com/openfga/openfga/releases/tag/v1.5.7) and [v1.5.6](https://github.com/openfga/openfga/releases/tag/v1.5.6).


If you have any feedback, or want to try a feature early, or are interested to learn more, please reach out!


## Breaking Changes


Several breaking changes related to the storage interface [have been introduced](https://github.com/openfga/openfga/releases/tag/v1.5.7). These changes should not impact your usage of OpenFGA unless you are implementing a custom storage adapter for OpenFGA.


## In Progress


- [Additional Consistency Options for OpenFGA queries](https://github.com/openfga/roadmap/issues/54): We've just shipped the first iteration of this feature, we're working on adding support for it in more SDKs. We’ll also be working on adding a consistency token in the future.


- [Telemetry for SDKs](https://github.com/openfga/roadmap/issues/41): We shipped OpenTelemetry Metrics support for Python and Javascript. We’ll be adding metrics support to the rest of the SDKs and then add support for tracing and logging. If you have feedback regarding our OpenTelemetry support, please do reach out on any of our community channels.


- We’ll keep working on [Performance Improvements](https://github.com/openfga/roadmap/issues/61) for Check, List Objects and List Users APIs.


- We’ll be adding additional [authorization options for OpenFGA](https://github.com/openfga/roadmap/issues/30) to restrict API credentials to performing specific actions in OpenFGA stores.


-  We collaborated with members of the CNCF [TAG-Security team](https://github.com/cncf/tag-security) for a few weeks to get it wrapped up (thanks [Krishna Krishna](https://github.com/krishnakv) and [Eddie](https://github.com/eddie-knight) for your help).


## Community Highlights


- Check out [July’s Community Meeting](https://www.youtube.com/watch?v=GvgeQcQlUuU&t=212s&pp=ygUHT3BlbkZHQQ%3D%3D)! It's a great opportunity to stay updated with the latest developments, ask questions, and engage with the OpenFGA community.


- [Maria Ines Parnisari](https://www.linkedin.com/in/miparnisari/) from the OpenFGA team and [Evan Anderson](https://www.linkedin.com/in/evankanderson/) from Stacklok presented on Implementing a Multi-Tenant, Relationship-Based Authorization Model with OpenFGA at CloudNative SecurityCon North America. If you didn’t attend the conference in June, the presentation recording is now [live](https://www.youtube.com/watch?v=zIJOBLbaZOc).


- This month, [Andres Aguiar](https://www.linkedin.com/in/aaguiar/) and [Damian Schenkelman](https://www.linkedin.com/in/damianschenkelman/) appeared in the [Identerati Office Hours](https://www.youtube.com/watch?v=Ups1FFxK3VE&pp=ygUHT3BlbkZHQQ%3D%3D) livestream for an in-depth exploration of OpenFGA. This video covers advanced topics and provides valuable insights into the capabilities and implementation of OpenFGA. Whether you're a seasoned user or new to OpenFGA, this deep dive is packed with information that will enhance your understanding and usage of the platform.


- Andres Aguiar sat down with Open at Intel host Katherine Druckman during KubeCon Europe to discuss OpenFGA. You can hear that podcast <!-- markdown-link-check-disable -->
[here](https://www.intel.com/content/www/us/en/developer/articles/community/fine-grained-authorization-with-openfga.html).
<!-- markdown-link-check-enable -->


## New Adopters


We’re happy to share that [Bump](https://www.bump-charge.com/) is now an OpenFGA adopter! If you are using OpenFGA in production, please consider adding your company or project to our [list](https://github.com/openfga/community/blob/main/ADOPTERS.md). Your contribution will be greatly appreciated!


## Announcements


Join us for our monthly Community Meetings, held on the second Thursday of every month at 11am Eastern Time (US). Our next meeting is on Thursday, August 8, 2024. These meetings are a fantastic opportunity to stay updated with the latest developments, ask questions, and engage with the OpenFGA community. You can find the link to the meeting invite [here](https://openfga.dev/docs/community#monthly-community-meetings). We look forward to seeing you there!


## Transitioning from Discord to CNCF's Slack


As a reminder, we transitioned out from Discord for OpenFGA and are now using the CNCF [#openfga Slack channel](https://cloud-native.slack.com/archives/C06G1NNH47N). If you are not part of the CNCF Slack workspace, you need to join the [CNCF Slack](https://slack.cncf.io) first.


## See You Next Month!


Fine Grained News is published every month. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our [community channels](https://openfga.dev/community) or at [community@openfga.dev](mailto:community@openfga.dev).

