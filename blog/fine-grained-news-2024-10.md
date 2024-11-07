---
title: Fine Grained News - October 2024
description: Fine Grained News
slug: fine-grained-news-2024-10
date: 2024-10-30
authors: hello-caleb
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News - October 2024

Welcome to the October edition of Fine Grained News! As we approach the end of the year, we're excited to bring you the latest updates, improvements, and community contributions shaping the future of OpenFGA.

As always, if you’re finding the OpenFGA project to be a valuable resource, we would greatly appreciate if you would [star our repo](https://github.com/openfga/openfga) on GitHub to show your support!⭐

## Just Shipped

* **OpenFGA v1.7.0:** In our latest release, we’ve introduced Access Control. This experimental feature allows you to control access to your OpenFGA server, and of course, we built it using OpenFGA! We’ve updated our Docs to show you [how to enable this feature](https://openfga.dev/docs/getting-started/setup-openfga/access-control); please share your feedback in the [GitHub Discussions](https://github.com/orgs/openfga/discussions/382)! 

* This month, we’ve also added documentation of our [OpenFGA release process](https://github.com/openfga/openfga/pull/1923). 

* We’ve [improved performance for checks involving nested tuple-to-userset relations](https://github.com/openfga/openfga/pull/2025). This is commonly used when implementing nested groups. Users can enable this with the experimental flag `enable-check-optimizations`.

* Following last month’s launch of OpenFGA SDK support for telemetry data using OpenTelemetry, we’ve also [updated our Docs](https://openfga.dev/docs/getting-started/configure-telemetry) to guide users through configuration to collect tracing data and metrics.

## In Progress

**Batch Check API Endpoint:** We’re close to releasing a [new feature](https://github.com/orgs/openfga/projects/1/views/1?pane=issue&itemId=28481432&issue=openfga%7Croadmap%7C35) to enable sending multiple check operations in a single network request.

Check out our roadmap to see what’s in the works. Feature requests and ideas can be shared in [GitHub Discussions](https://github.com/orgs/openfga/discussions).

## Community Highlights

* **OpenFGA at Open Source Strategy Forum 2024:** [Kiah Imani](https://www.linkedin.com/in/kiah-tolliver/) presented “Role-Based Access Is So Yesterday: Revolutionizing Authorization with OpenFGA” at the OSSF 2024 earlier this month. The presentation is now [available in Youtube](https://www.youtube.com/watch?v=uHKeE4DAHpE)
![Kiah Imani](../static/img/blog/fgn-2024-10-kiah-imani.jpeg)

* **OpenFGA at KubeCon:** [Andres Aguiar](https://www.linkedin.com/in/aaguiar/) will participate in KubeCon/CloudNativeCon in November! OpenFGA will have a Kiosk in the Project Pavilion. He'll present a [lightning talk on OpenFGA](https://kccncna2024.sched.com/event/1iWA6/openfga-the-cloud-native-way-to-implement-fine-grained-authorization-project-lightning-talk) and participate in [The Policy Engines Showdown](https://kccncna2024.sched.com/event/1i7qp/the-policy-engines-showdown-gabriel-l-manor-permitio-andres-aguiar-okta-omri-gazitt-aserto-anders-eknert-styra-sarah-cecchetti-aws?iframe=no).  
  ![Andres Aguiar](../static/img/blog/fgn-2024-10-andres-aguiar.jpg)

* **OpenFGA in Italy:** [Andrea Chiarelli](https://www.linkedin.com/in/andreachiarelli) will present [Authorize in the Cloud with OpenFGA](https://www.cloudday.it/e/sessione/3533/Autorizzare-nel-cloud-con-OpenFGA) at [Cloud Day 2024](https://www.cloudday.it/e/3486/Cloud-Day-2024) in Milan on November 20, 2024.   
  ![Andrea Chiarelli](../static/img/blog/fgn-2024-10-andrea-chiarelli.jpeg)

* **New Demp Flask App Added:** To complement our OpenFGA examples and guides, we have published an [example app demonstrating the integration of OpenFGA](https://github.com/openfga/flask-demo). This app utilizes several FGA features to provide a multi-user system for folder and text file sharing. Thanks to @[ryanpq](https://github.com/openfga/flask-demo/commits?author=ryanpq) for your contribution!  
  ![Ryan Quinn](../static/img/blog/fgn-2024-10-ryanpq.jpg)

* **Monthly Community Meeting:** Join us for our monthly [Community Meetings](https://github.com/openfga/community/blob/main/community-meetings.md#:~:text=OpenFGA%20Community%20Meetings), held on the second Thursday of every month at [11 AM Eastern Time (US)](https://www.worldtimebuddy.com/?qm=1&lid=12,100,5,6,8&h=5&sln=11-12&hf=1). Our next meeting is on Thursday, November 14, 2024. Our community meetings are a great way to stay updated with the latest developments, ask questions, and engage with the OpenFGA community. If you can’t join the meetings live, our [latest month's video](https://youtu.be/LITUfwqpNIo?si=ze7dhGG46rhatWBN) will always be posted on our [YouTube channel](https://www.youtube.com/@OpenFGA)! 

    As always, we welcome community members to demo their use cases. If you want to demo your implementation of OpenFGA, please contact any of the OpenFGA team on our community channels linked below.

## New Adopters

* This month, we welcome [Gillion](https://www.gilion.com/) and [Flex](https://flex.team/) as OpenFGA adopters! If you or your company have implemented OpenFGA, we would love to hear about it! Please add your name as an adopter by updating the [ADOPTERS.md](https://github.com/openfga/community/blob/main/ADOPTERS.md#companiesprojects-using-openfga-in-production) file and sending us a PR.

* If you or your company provides implementation services for OpenFGA, we invite you to share your information with the community in our [Implementation Services](https://github.com/openfga/community/blob/main/ADOPTERS.md#companies-offering-openfga-implementation-services) section of the ADOPTERS.md file by sending us a PR! However, please note that the OpenFGA project has not evaluated or endorsed the individuals and companies listed, and inclusion does not imply endorsement.

## Announcements

* **Hacktoberfest Highlights:** This Hacktoberfest, we welcomed 13 new contributors making their first commit to OpenFGA! Thanks to the incredible community participation, we saw a 28% increase in pull requests compared to September and a remarkable 260% increase in PRs on the SDK Generator. A huge thanks to this community for your continued participation and contributions! 

* **OpenFGA Community Meeting Updates:** We are adding chapters to our [YouTube channel](https://www.youtube.com/@OpenFGA) videos to simplify content navigation. We’ve begun with the most recent videos and will add chapters as time goes on. We have also begun releasing [demos](https://www.youtube.com/playlist?list=PLUR5l-oTFZqXYaB3W_OEEsUhI4l8iLYNe) as individual videos for easier content consumption. You can catch this month’s demos on [Modular Authorization](https://www.youtube.com/watch?v=ws9BjricJu4) and  [Client-Side Caching](https://www.youtube.com/watch?v=sst9PyvPHSk), with Materialize Integration coming soon!

## See you Next Month

Fine Grained News is published every month. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our [community channels](https://openfga.dev/community) or at [community@openfga.dev](mailto:community@openfga.dev).