---
title: Fine Grained News - August 2024
description: Fine Grained News
slug: fine-grained-news-2024-08
date: 2024-08-30
authors: hello-caleb
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News

Welcome to the August 2024 edition of Fine Grained News! We are excited to bring you the latest updates, features, and community highlights from OpenFGA. 

## Just Shipped!

* **OpenFGA v1.6.0:** The [latest OpenFGA release](https://github.com/openfga/openfga/releases/tag/v1.6.0) enables support for [query consistency options](https://openfga.dev/docs/interacting/consistency) and included additional performance enhancements.

* **Query Consistency Options in SDKs:** All OpenFGA SDKs now support specifying [a query consistency parameter](https://openfga.dev/docs/interacting/consistency) for OpenFGA query endpoints. Make sure to update to the latest versions of the SDKs and OpenFGA to take advantage of this feature.

* **Metrics Telemetry for SDKs:** We already supported OpenTelemetry metrics in the [Python](https://github.com/openfga/python-sdk/) and [Javascript](https://github.com/openfga/js-sdk/) SDKs. We’ve just added support in [the Java SDK](https://github.com/openfga/java-sdk/releases/tag/v0.6.1), and [the GO SDK](https://github.com/openfga/go-sdk/releases/v0.6.0).

## Security Advisory

We recently addressed a security issue, identified as GHSA-3f6g-m4hr-59h8, that was present in OpenFGA v1.5.7 and v1.5.8. This issue has been fixed starting v1.5.9, and we strongly recommend all users update to the latest version to ensure their systems remain secure. For more details, please refer to the [security advisory](https://github.com/openfga/openfga/security/advisories/GHSA-3f6g-m4hr-59h8) on our GitHub page.

## In Progress

* [Support for OpenTelemetry tracing and logging](https://github.com/openfga/roadmap/issues/41)
* [Performance Improvements for OpenFGA queries](https://github.com/openfga/roadmap/issues/61)  
* [Additional OpenFGA API Authorization Options](https://github.com/openfga/roadmap/issues/30)  
* [SQLite Storage Adapter](https://github.com/openfga/roadmap/issues/56), thanks to [Grafana](https://grafana.com/) for the contribution!

Curious about what’s coming next for OpenFGA? Check out our [roadmap](https://github.com/orgs/openfga/projects/1/views/1) to see what’s in store. We also welcome your feature requests and ideas in [GitHub Discussions](https://github.com/orgs/openfga/discussions/categories/ideas).

## Community Highlights

* **CNCF Security TAG:** This month, [Andrés Aguiar](https://www.linkedin.com/in/aaguiar/) presented OpenFGA to the [CNCF Security Technical Advisory Group (TAG)](https://tag-security.cncf.io/), where he discussed the project's current [status](https://github.com/cncf/tag-security/issues/1339) and showcased various use cases. You can see the presentation deck [here](https://docs.google.com/presentation/d/1-TFfvKPi3jJ-jO-bjsHb3Soj_kKcQCf4Y_UvST7z744/edit#slide=id.p). It’s a great way to see how OpenFGA is being utilized and what’s on the horizon for the project.
* **API Security: APISIX + OpenFGA:** Check out this [blog post](https://dev.to/kaankahraman/supercharging-api-security-apisix-with-openfga-45da) by Kaan Kahraman on enhancing API security by integrating [APISIX](https://apisix.apache.org/) with OpenFGA.

### Upcoming Events

* **Join Us at Open Source Summit Europe 2024:** [José Carlos Chávez](https://www.linkedin.com/in/jcchavezs/) will present at Open Source Summit Europe 2024 in Vienna, Austria on September 16, 2024! He will discuss [Fine-Grained Policies: RBAC with OpenFGA](https://osseu2024.sched.com/event/1ej2u/fine-grained-policies-rbac-with-openfga-jose-carlos-chavez-okta). We look forward to seeing you there!  
* **OpenFGA at Open Source Strategy Forum 2024:** [Kiah Imani](https://www.linkedin.com/in/kiah-tolliver/) will present [Role-Based Access Is So Yesterday: Revolutionizing Authorization with OpenFGA](https://sossfusion2024.sched.com/event/1hcQa?iframe=no) at OSSF on Wednesday, October 23, 2024. In this session, attendees will learn how OpenFGA addresses the limitations of RBAC, enhancing security, performance, and access management across various systems.  
* We'll be participating of KubeCon / CloudNativeCon North America! OpenFGA will have a Kiosk in the Project Pavilion, we'll present a [lightning talk on OpenFGA](https://kccncna2024.sched.com/event/1iWA6/openfga-the-cloud-native-way-to-implement-fine-grained-authorization-project-lightning-talk) and participate in [The Policy Engines Showdown](https://kccncna2024.sched.com/event/1i7qp/the-policy-engines-showdown-gabriel-l-manor-permitio-andres-aguiar-okta-omri-gazitt-aserto-anders-eknert-styra-sarah-cecchetti-aws?iframe=no).

### New Adopters

We want to welcome [Patika Global Technology](https://patikaglobal.com/) as an OpenFGA adopter! If you're using OpenFGA in production, we encourage you to add your company or project to our [Adopters list](https://github.com/openfga/community/blob/main/ADOPTERS.md) by opening a PR. Please include a short description of your use case in your submission. If you’ve previously added your company or project to the adopter's list, we would appreciate you updating it to include a short description. Your contributions help the community, and we greatly appreciate your support!

### OpenFGA Service Providers

We’ve added a new section within the Adopters list for those offering OpenFGA [implementation services](https://github.com/openfga/community/blob/main/ADOPTERS.md#companies-offering-openfga-implementation-services). If your organization wants help adopting OpenFGA, this resource can connect you with professionals specializing in our technology. If your company provides implementation services for OpenFGA, we invite you to add your details by sending us a PR!  Please note that the listed companies have not been individually evaluated or endorsed by the OpenFGA project, and inclusion on the list does not imply endorsement.

### Announcements

* **OpenFGA Joins Docker-Sponsored Open Source Program:** We’re excited to share that OpenFGA has been accepted into the Docker-Sponsored Open Source Program! This partnership allows us to distribute [our container image](https://hub.docker.com/r/openfga/openfga) more efficiently and securely, ensuring that our community can easily access and trust the latest versions of OpenFGA on Docker Hub with higher rate limits.
* **2024 Community Survey Participation:** A huge thank you to everyone who participated in the 2024 Community Survey! Your insights are invaluable in helping us shape the future of OpenFGA. We truly appreciate the time and thought you put into sharing your experiences and suggestions. Remember, we always welcome feedback across our [community channels](https://openfga.dev/community)—your input is what drives us forward.  
* **Monthly Community Meeting:** Join us for our monthly Community Meetings, held on the second Thursday of every month at 11 AM Eastern Time (US). Our next meeting is on Thursday, September 12, 2024. These meetings are a fantastic opportunity to stay updated with the latest developments, ask questions, and engage with the OpenFGA community. You can find the link to the meeting invite [here](https://openfga.dev/docs/community\#monthly-community-meetings). We look forward to seeing you there!

## See You Next Month!

Fine Grained News is published every month. Although we have transitioned from Discord to the CNCF Slack channel, we want to continue to hear from you\! Whether you have questions or feedback or just want to connect with others using OpenFGA, our community channels are the best place to do so. You can reach us at:

* **CNCF Slack:** Join the conversation in the [#openfga](https://cloud-native.slack.com/archives/C06G1NNH47N) channel. Please note: If you are not currently part of the CNCF Slack channel, you will need to click [here](https://slack.cncf.io/) to join the channel first.  
* **GitHub Discussions:** Share your feedback, ask questions, and engage with the community on [GitHub Discussions](https://github.com/orgs/openfga/discussions).  
* **Twitter:** Follow us [@openfga](https://twitter.com/openfga) for updates and news.

Visit our [community page](https://openfga.dev/docs/community) for more details and to join these channels. We look forward to your contributions and conversations!  
