import * as React from 'react';
import sanitizeHtml from 'sanitize-html';
import { Section } from '@components/Section';

import {
  CodeAnimatedIcon,
  CommunityAnimatedIcon,
  FastAnimatedIcon,
  ModelIcon,
  OpenAnimatedIcon,
} from '@components/icons';

import CNCFIcon from '@site/static/img/cncf-icon-white.svg';

import styles from './FeaturesSection.module.css';
import { StyleGrid } from '../StyleGrid';

const features = [
  {
    id: 'model',
    icon: <ModelIcon />,
    title: 'Model any authorization system',
    content: [
      "OpenFGA takes the best ideas from Google's Zanzibar paper for Relationship-Based Access Control, and also solves problems for Role-based Access Control and Attribute-Based Access Control use cases. The modeling language is powerful enough for engineers, but friendly enough for other stakeholders on your team as well.",
    ],
  },
  {
    id: 'code',
    icon: <CodeAnimatedIcon />,
    title: 'Works with your code',
    content: [
      "SDKs for the most popular languages have already been written, making it easy to integrate and grow alongside your applications. OpenFGA also makes it trivial to contribute new SDKs to support your project's language.",
    ],
  },
  {
    id: 'fast',
    icon: <FastAnimatedIcon />,
    title: 'Blazing fast',
    content: [
      'OpenFGA is designed to answer authorization check calls in milliseconds, which lets it scale with projects of any size. It works just as well for small startups and hobby programmers building single applications as it does for enterprise companies building platforms on a global scale.',
    ],
  },
  {
    id: 'open',
    icon: <OpenAnimatedIcon />,
    title: 'Built in the open',
    content: [
      "Transparency and peer review are important for building secure, stable, and sustainable software. OpenFGA's <a href='https://github.com/openfga/rfcs/blob/main/README.md'  target='_blank'>RFC process</a> and <a href='https://github.com/openfga/.github/blob/main/CONTRIBUTING.md' target='_blank'>governance model</a> invite anyone to become a contributor, and collaboratively develop the <a href='https://github.com/orgs/openfga/projects/1' target='_blank'>public roadmap</a>. Come create the next standard for authorization with us!",
    ],
  },
  {
    id: 'sponsored',
    icon: <CNCFIcon />,
    title: 'CNCF Sandbox Project',
    content: ["We are a <a href='https://www.cncf.io/'>Cloud Native Computing Foundation</a> sandbox project."],
  },
  {
    id: 'contribute',
    icon: <CommunityAnimatedIcon />,
    title: 'Get Involved',
    content: [
      "Join OpenFGA's active <a href='https://openfga.dev/community' target='_blank'>Slack and GitHub community</a>, check out existing <a href='https://github.com/openfga/rfcs' target='_blank'>RFCs</a> to understand where the project is headed, and learn more about how to take part by reading our <a href='https://github.com/openfga/.github/blob/main/CONTRIBUTING.md' target='_blank'>CONTRIBUTING.md</a>.",
      '<a target="_blank" href="https://github.com/openfga/.github/blob/main/CONTRIBUTING.md#contribution-process" >Learn how to get involved → </a>',
    ],
  },
];

const FeaturesSection = () => (
  <Section className={styles.section} id="features">
    <StyleGrid />
    <h2 className="section_heading">Features</h2>
    <div className={styles.grid}>
      {features.map(({ id, icon, title, content }) => (
        <div key={id} className={styles.feature}>
          <div className={styles.icon}>{icon}</div>
          <h3>{title}</h3>
          {content.map((c, idx) => (
            <p key={idx} dangerouslySetInnerHTML={{ __html: sanitizeHtml(c) }}></p>
          ))}
        </div>
      ))}
    </div>
  </Section>
);

export { FeaturesSection };
