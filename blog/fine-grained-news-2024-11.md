---
title: Fine Grained News - November 2024
description: Fine Grained News
slug: fine-grained-news-2024-11
date: 2024-11-30
authors: hello-caleb
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News - November 2024

Welcome to the November edition of Fine Grained News! As we enter the final stretch of 2024, there are exciting developments in the OpenFGA to share.

🌟 We just hit 3,000 stars on the OpenFGA repo! A huge thank you to our incredible community for your support in building OpenFGA. Let's keep the momentum going! If you haven't yet, we'd greatly appreciate you [starring the repo](https://github.com/openfga/openfga) and pushing us toward 4,000 and growing our community! 🌟
  <p align="center">
  <img src="../static/img/blog/fgn-2024-11-stars.png" alt="OpenFGA 3000 stars" />
</p>

## Just Shipped

**Batch Check API:**  We've launched Batch Check API in OpenFGA v1.8.0. Batching authorization checks together in a single request will significantly reduce roundtrip network latency. In addition, v.1.8.0 also added support for Contextual Tuples in the `Expand` API, and included other performance improvements. [Read more in the Changelog...](https://github.com/openfga/openfga/compare/v1.7.0...v1.8.0)

## Coming Up

**SDK Updates:** We will be updating the SDKs next to take advantage of the new BatchCheck, starting  with Python and JavaScript. If you want to see an SDK prioritized, let us know!

Check out our roadmap to see what we're working on. Feature requests and ideas can be shared in [GitHub Discussions](https://github.com/orgs/openfga/discussions).

## Community Highlights

* **OpenFGA at KubeCon:** In November, [Andres Aguiar](https://www.linkedin.com/in/andresaguiar/) represented OpenFGA at KubeCon/CloudNativeCon. OpenFGA had a kiosk in the Project Pavilion. Andres delivered a lightning talk on OpenFGA and participated in *The Policy Engines Showdown*, with other authorization solution providers. [See the panel discussion video...](https://www.youtube.com/watch?v=AVA32aYObRE)
<p align="center">
  <img src="../static/img/blog/fgn-2024-11-kubecon1.jpg" alt="Andres Aguiar at OpenFGA's KubeCon booth" />
</p>
 <p align="center">
  <img src="../static/img/blog/fgn-2024-11-kubecon2.jpg" alt="Andres Aguiar at OpenFGA's KubeCon booth" />
</p>
<p align="center">
  <em>Andres Aguiar Representing OpenFGA at KubeCon in Salt Lake City</em>
</p>

* **OpenFGA in Italy:** [Andrea Chiarelli](https://www.linkedin.com/in/andreachiarelli/) presented *Authorize in the Cloud with OpenFGA* at November's Cloud Day 2024 in Milan. 
<p align="center">
  <img src="../static/img/blog/fgn-2024-11-andrea-chiarelli1.png" alt="Andrea Chiarelli at Cloud Day 2024" />
</p>
<p align="center">
  <img src="../static/img/blog/fgn-2024-11-andrea-chiarelli2.png" alt="Andrea Chiarelli at Cloud Day 2024" />
  <em>Andrea Chiarelli at Cloud Day 2024</em>
</p>

* **API World:** Our [Tyler Nix](https://www.linkedin.com/in/tylernix/) presented *Leveraging Modern Authorization Models to Scale Your Applications* at API World this month. Which was introduction to modern authorization models and key principles to address the fine-grained authorization challenges.
<p align="center">
  <img src="../static/img/blog/fgn-2024-11-tyler-nix.jpeg" alt="Tyler Nix" />
</p>
<p align="center">
  <em>Tyler Nix</em>
</p>

* **OpenFGA Offsite:**  [Placeholder text. Add details here]<!--Placeholder. Add team photo(s)and community members photos-->
<div style="text-align: center;">
  <img src="../static/img/blog/fgn-2024-11-chicago-offsite1.jpg" alt="OpenFGA team offsite in Chicago, Illinois" style="display: inline-block; margin: 0 10px;" />
  <img src="../static/img/blog/fgn-2024-11-chicago-offsite2.jpg" alt="OpenFGA team offsite in Chicago, Illinois" style="display: inline-block; margin: 0 10px;" />
  <img src="../static/img/blog/fgn-2024-11-chicago-offsite3.jpg" alt="OpenFGA team offsite in Chicago, Illinois" style="display: inline-block; margin: 0 10px;" />
</div>
<p style="text-align: center; font-style: italic;">
  The team that brings you OpenFGA meeting in Chicago, Illinois!
</p>

* **New Modeling Demos Available!:** Learn how to model fine-grained authorization  in OpenFGA's domain-specific language step-by-step with our [new demo video series](https://www.youtube.com/playlist?list=PLUR5l-oTFZqWaDdhEOVt_IfPOIbKo1Ypt)! Starting with the basics and gradually adding complexity, this playlist is your guide to mastering OpenFGA modeling.

* **Monthly Community Meeting:** Join us for our monthly [Community Meetings](https://github.com/openfga/community/blob/main/community-meetings.md#:~:text=OpenFGA%20Community%20Meetings), held on the second Thursday of every month at [11 AM Eastern Time (US)](https://www.worldtimebuddy.com/?qm=1&lid=12,100,5,6,8&h=5&sln=11-12&hf=1). 

  November's Community Meeting featured demos by [Sebastian Doll](https://www.linkedin.com/in/katallaxie/) of ZEISS who shared their Terraform/OpenFGA integration and [Justin Cohen](https://www.linkedin.com/in/justincoh/) showing a demo of Batch Check  

Our next meeting is on Thursday, December 12, 2024. If you can’t join the meetings live, our [latest month's video](https://youtu.be/4MGF4rTzhbA?si=iGcoZTw8T99E0LKs) will always be posted on our [YouTube channel](https://www.youtube.com/@OpenFGA)! 

* **Blogs and Videos for Auth Fans:**  
  * **Granting TTL based permissions in OpenFGA:** Implement TTL-based permissions in OpenFGA for time-limited access control. [Read more on Medium...](https://medium.com/@shruti1810/granting-ttl-based-permissions-in-openfga-2ed2073931c3)

  * **Overcoming Security Challenges in Protecting Shared Generative AI Environments:** Explore solutions for ensuring secure, scalable, and efficient multi-tenancy in generative AI environments. [Read more on Medium...](https://towardsdatascience.com/overcoming-security-challenges-in-protecting-shared-generative-ai-environments-1ffb27da1bde)

* **Fine-Grained Authorization for Backstage using OpenFGA:** Learn how OpenFGA enables dynamic fine-grained authorization in Backstage through ReBAC models and seamless policy updates. [See the webinar on YouTube...](https://www.youtube.com/watch?v=wWFbLPvwOyQ)


## New Adopters

* If you or your company have implemented OpenFGA, we would love to hear about it! Please add your name as an adopter by updating the [ADOPTERS.md](https://github.com/openfga/community/blob/main/ADOPTERS.md#companiesprojects-using-openfga-in-production) file and sending us a PR.

* If you or your company provides implementation services for OpenFGA, we'd love to share this with the community in our [Implementation Services](https://github.com/openfga/community/blob/main/ADOPTERS.md#companies-offering-openfga-implementation-services) section of the ADOPTERS.md file. Please note that the OpenFGA project has not evaluated or endorsed the individuals and companies listed, and inclusion does not imply endorsement.

## Announcements

* **OpenFGA: Hits 5th Most Active by Contributions!:** A huge thank you to our community for your incredible participation in the project's Issues during Hacktoberfest! Your efforts made OpenFGA the 5th most active CNCF project last month. 
  Let’s keep up the momentum into December and beyond! We welcome contributions of all skill levels! Start with our [Good First Issues](https://github.com/openfga/openfga/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) for beginner-friendly tasks, or explore the full [Issue queue](https://github.com/openfga/openfga/issues) for more advanced challenges. 

  Check out our [Contribution Guide](https://github.com/openfga/.github/blob/main/CONTRIBUTING.md) to learn how to get started. Our other repositories also have Issue queues waiting for your expertise. 
<p align="center">
  <img src="../static/img/blog/fgn-2024-11-open-fga-ranks-5th.jpeg" alt="CNCF projects during October, Ranked by Commits" />
  </p>
  <p align="center">
  <em>CNCF Projects during October, Ranked by Commits</em>
</p>

* **Follow OpenFGA on LinkedIn:** Connect with a growing community of of those interested in fine-grained authorization and expand your professional network by following our new [LinkedIn](http://linkedin.com/company/openfga) page!
<p align="center">
  <img src="../static/img/blog/fgn-2024-11-linkedin.png" alt="OpenFGA's LinkedIn page" />
</p>

## See you Next Month

Fine Grained News is published every month. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our [community channels](https://openfga.dev/community) or at [community@openfga.dev](mailto:community@openfga.dev).