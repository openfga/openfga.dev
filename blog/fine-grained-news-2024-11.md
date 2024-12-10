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

🌟 **We just hit 3,000 stars on the OpenFGA repo!** 🌟 Because of this great community, we've just this incredible milestone! Thank you so much for all the support you've shown this project. Let's keep the momentum going! If you haven't yet, we'd greatly appreciate you [starring the repo](https://github.com/openfga/openfga) to help push us toward 4,000 stars and grow our amazing community! 

![Celebrating OpenFGA reaching 3,000 GitHub stars](../static/img/blog/fgn-2024-11-stars.png)

## Just Shipped

**Batch Check API:**  We've launched Batch Check API in OpenFGA v1.8.0. Batching authorization checks together in a single request will significantly reduce roundtrip network latency. In addition, v.1.8.0 also added support for Contextual Tuples in the `Expand` API, and included other performance improvements. [Read more in the Changelog...](https://github.com/openfga/openfga/compare/v1.7.0...v1.8.0)

## **Coming Up**

**SDK Updates:** We will be updating the SDKs next to take advantage of the new BatchCheck, starting  with Python and JavaScript. If you want to see an SDK prioritized, let us know!
**SDK Updates:** We will be updating the SDKs next to take advantage of the new BatchCheck, starting  with Python and JavaScript. If you want to see an SDK prioritized, let us know!

Check out our roadmap to see what we're working on. Feature requests and ideas can be shared in [GitHub Discussions](https://github.com/orgs/openfga/discussions).

## **Community Highlights**

### **OpenFGA at KubeCon**
In November, [Andres Aguiar](https://www.linkedin.com/in/andresaguiar/) represented OpenFGA at KubeCon/CloudNativeCon. OpenFGA had a kiosk in the Project Pavilion, where Andres delivered a lightning talk and participated in *The Policy Engines Showdown* with other authorization solution providers. [Watch the panel discussion...](https://www.youtube.com/watch?v=AVA32aYObRE)

![Andres Aguiar at OpenFGA's KubeCon booth](../static/img/blog/fgn-2024-11-kubecon1.jpg)
![Andres Aguiar participating in The Policy Engines Showdown](../static/img/blog/fgn-2024-11-kubecon2.jpg)

*Andres Aguiar representing OpenFGA at KubeCon*

### **OpenFGA in Italy**
[Andrea Chiarelli](https://www.linkedin.com/in/andreachiarelli/) presented *Authorize in the Cloud with OpenFGA* at Cloud Day 2024 in Milan.

![Andrea Chiarelli presenting OpenFGA in Milan](../static/img/blog/fgn-2024-11-andrea-chiarelli1.png)
![Andrea Chiarelli during his talk at Cloud Day 2024](../static/img/blog/fgn-2024-11-andrea-chiarelli2.png)

*Andrea Chiarelli presenting at Cloud Day 2024*

### **OpenFGA Offsite**
The OpenFGA team gathered for a productive offsite in Chicago, Illinois.

![OpenFGA team group photo in Chicago](../static/img/blog/fgn-2024-11-chicago-offsite-team-photo.png)

*The OpenFGA team in Chicago*

---

### **New Modeling Demos Available!**
Learn how to model fine-grained authorization in OpenFGA's domain-specific language step-by-step with our [new demo video series](https://www.youtube.com/playlist?list=PLUR5l-oTFZqWaDdhEOVt_IfPOIbKo1Ypt)! Starting with the basics and gradually adding complexity, this playlist is your guide to mastering OpenFGA modeling.

---

### **Monthly Community Meeting**

Join our vibin-depth monthly community discussions every second Thursday at [11 AM Eastern Time (US)](https://www.worldtimebuddy.com/?qm=1&lid=12,100,5,8&h=5&sln=11-12&hf=1). Check out our [meeting details](https://github.com/openfga/community/blob/main/community-meetings.md#:~:text=OpenFGA%20Community%20Meetings) for more information.

November's highlights included:
- [Sebastian Döll](https://www.linkedin.com/in/katallaxie/) from ZEISS showcasing their Terraform/OpenFGA integration
- [Justin Cohen](https://www.linkedin.com/in/justincoh/) demonstrating the new Batch Check functionality

**Join us Thursday, December 12, 2024** for our next meeting. Can't make it? Catch up on our [latest recording](https://youtu.be/4MGF4rTzhbA?si=iGcoZTw8T99E0LKs) or browse previous sessions on our [YouTube channel](https://www.youtube.com/@OpenFGA).

### **Blogs and Videos for AuthZ Fans:**  
  * **Granting TTL based permissions in OpenFGA:** Implement TTL-based permissions in OpenFGA for time-limited access control. [Read more on Medium...](https://medium.com/@shruti1810/granting-ttl-based-permissions-in-openfga-2ed2073931c3)

- **Overcoming Security Challenges in Protecting Shared Generative AI Environments:** Explore solutions for ensuring secure, scalable, and efficient multi-tenancy in generative AI environments. [Read more on Medium...](https://towardsdatascience.com/overcoming-security-challenges-in-protecting-shared-generative-ai-environments-1ffb27da1bde)

- **Fine-Grained Authorization for Backstage using OpenFGA:** Learn how OpenFGA enables dynamic fine-grained authorization in Backstage through ReBAC models and seamless policy updates. [See the webinar on YouTube...](https://www.youtube.com/watch?v=wWFbLPvwOyQ)

## **New Adopters**

- Are you using OpenFGA in production? Join our growing community of adopters! Add your company to our [ADOPTERS.md](https://github.com/openfga/community/blob/main/ADOPTERS.md#companiesprojects-using-openfga-in-production) file with a quick PR.

- Do you offer OpenFGA implementation services? Get listed in our [Implementation Services](https://github.com/openfga/community/blob/main/ADOPTERS.md#companies-offering-openfga-implementation-services) directory. Note: Listings are community-contributed and not officially endorsed by the OpenFGA project.

## **Announcements**

### OpenFGA Rankked #5 in CNCF Project Contributions!**
Thanks to our amazing community, OpenFGA soared to become the 5th most active CNCF project during Hacktoberfest in October! Your contributions made this possible, and hope to continue the engagement!

Ready to join our community of contributors? We have opportunities for every skill level:
- Start with our [Good First Issues](https://github.com/openfga/openfga/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) for beginner-friendly tasks.
- Take on more complex challenges in our [Issue queue](https://github.com/openfga/openfga/issues).
- Follow our [Contribution Guide](https://github.com/openfga/.github/blob/main/CONTRIBUTING.md) to get started.


![CNCF projects ranked by commits during Hacktoberfest](../static/img/blog/fgn-2024-11-open-fga-ranks-5th.jpeg)

*CNCF Projects Ranked by Commits during Hacktoberfest*

---

### **Follow OpenFGA on LinkedIn**
Connect with a growing community of fine-grained authorization enthusiasts and expand your professional network by following our new [LinkedIn](http://linkedin.com/company/openfga) page!

![OpenFGA's LinkedIn page](../static/img/blog/fgn-2024-11-linkedin.png)

## **See You Next Month:**

Fine Grained News is published every month. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our [community channels](https://openfga.dev/community) or at [community@openfga.dev](mailto:community@openfga.dev).