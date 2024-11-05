---
title: Fine Grained News - September 2024
description: Fine Grained News
slug: fine-grained-news-2024-09
date: 2024-09-30
authors: hello-caleb
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News
Welcome to the September edition of Fine Grained News! As we transition into the fall season, we’re excited to bring you the latest updates on the progress of OpenFGA.

## **Just Shipped**

* We shipped [OpenFGA v1.6.1](https://github.com/openfga/openfga/releases/tag/v1.6.1) with performance fixes, bug fixes, and a new SQLite storage adapter contributed by Grafana. Thanks [@DanCech](https://github.com/DanCech)!  
* This month we released OpenTelemetry metrics support for .NET SDK [v0.5.1](https://github.com/openfga/dotnet-sdk/releases), Go SDK [v0.6.1](https://github.com/openfga/go-sdk/releases/tag/v0.6.1), Java SDK [v0.7.1](https://github.com/openfga/java-sdk/releases/tag/v0.7.1), and JavaScript SDK [v0.7.0](https://github.com/openfga/js-sdk/releases/tag/v0.7.0).

## **In Progress**

* **Authorization for OpenFGA**: OpenFGA currently supports global pre-shared keys and OIDC for API authentication, but [we’re exploring more granular authorization options](https://github.com/openfga/roadmap/issues/30), such as store-specific credentials and varying permissions for stores, modules, and types.

Check out our [roadmap](https://github.com/orgs/openfga/projects/1/views/1) to see what’s in the works. Feature requests and ideas can be shared in [GitHub Discussions](https://github.com/orgs/openfga/discussions/categories/ideas).

## **Community Highlights**

* **OpenFGA at Open Source Summit Europe:** [José Carlos Chávez](https://www.linkedin.com/in/jcchavezs/) gave a talk on [RBAC with OpenFGA](https://osseu2024.sched.com/event/1ej2u/fine-grained-policies-rbac-with-openfga-jose-carlos-chavez-okta) at OSS Europe 2024 in Vienna, Austria this month. You can see the presentation deck [here](https://speakerdeck.com/jcchavezs/fine-grained-policies-rbac-with-openfga).  
* **OpenFGA at Open Source Strategy Forum 2024:** [Kiah Imani](https://www.linkedin.com/in/kiah-tolliver/) will present [Role-Based Access Is So Yesterday: Revolutionizing Authorization with OpenFGA](https://sossfusion2024.sched.com/event/1hcQa?iframe=no) at OSSF on Wednesday, October 23, 2024\. In this session, attendees will learn how OpenFGA addresses the limitations of RBAC, enhancing security, performance, and access management across various systems.  
* **OpenFGA at KubeCon:** [Andres Aguíar](https://www.linkedin.com/in/aaguiar/) will participate in KubeCon/CloudNativeCon in November! OpenFGA will have a Kiosk in the Project Pavilion. He'll present a [lightning talk on OpenFGA](https://kccncna2024.sched.com/event/1iWA6/openfga-the-cloud-native-way-to-implement-fine-grained-authorization-project-lightning-talk) and participate in [The Policy Engines Showdown](https://kccncna2024.sched.com/event/1i7qp/the-policy-engines-showdown-gabriel-l-manor-permitio-andres-aguiar-okta-omri-gazitt-aserto-anders-eknert-styra-sarah-cecchetti-aws?iframe=no).  
* We added new authorization model examples for [multi-tenant RBAC](https://github.com/openfga/sample-stores/tree/main/stores/multitenant-rbac) and how to define [ABAC policies using ReBAC](https://github.com/openfga/sample-stores/tree/main/stores/abac-with-rebac).  
* **Guide to Building Auth Systems:** Level Up Coding offers a [comprehensive guide](https://levelup.gitconnected.com/complete-guide-to-building-authorization-systems-using-rbac-rebac-and-abac-0a2ce5311d25) to building authorization systems using RBAC, ReBAC, and ABAC models, covering the differences between these approaches and when to use each.  
* **High Marks for OpenFGA Policy Languages:** Trial Of Bits published a report comparing the security of the [Cedar, OPA, and OpenFGA policy languages](https://github.com/trailofbits/publications/blob/master/reports/Policy_Language_Security_Comparison_and_TM.pdf). OpenFGA was very well evaluated!

## **New Adopters**

* If you or your company have implemented OpenFGA, we would love to hear about it! Please add your name as yourself as an adopter by updating the [Adopters.md](https://github.com/openfga/community/blob/main/ADOPTERS.md#companiesprojects-using-openfga-in-production) file and send us a PR.  
* If you or your company provides implementation services for OpenFGA, we invite you to share your information with the community in our [Implementation Services](https://github.com/openfga/community/blob/main/ADOPTERS.md#companies-offering-openfga-implementation-services) section of the Adopters.md file by sending us a PR! However, please note that the listed individuals and companies have not been evaluated or endorsed by the OpenFGA project, and inclusion on the list does not imply endorsement.

## **Announcements**

* **Hacktoberfest 2024:** [Hacktoberfest](https://hacktoberfest.com) is a month long celebration of open source software which encourages new and experienced developers alike to contribute code to open source projects during the month of October. This makes October a great time to become an OpenFGA contributor! We have labeled a number of issues on GitHub with "Hacktoberfest" and "Good First Issue" labels making it easy to find a way to get involved and have your code included in OpenFGA.  
* **Monthly Community Meeting:** Join us for our monthly Community Meetings, held on the second Thursday of every month at 11 AM Eastern Time (US). Our next meeting is on Thursday, October 10, 2024\. Our community meetings are a great way to stay updated with the latest developments, ask questions, and engage with the OpenFGA community. If you would like to demo your implementation of OpenFGA, please reach out to us on any of our [community channels](https://openfga.dev/community) or at community@openfga.dev. You can find the link to the meeting invite [here](https://openfga.dev/docs/community#monthly-community-meetings). We look forward to seeing you there!

## **See You Next Month!**

Fine Grained News is published every month. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our [community channels](https://openfga.dev/community) or at community@openfga.dev.
