import Link from '@docusaurus/Link';
import * as React from 'react';
import sanitizeHtml from 'sanitize-html';
import clsx from 'clsx';
import { Section } from '@components/Section';
import { Auth0Icon, CodeIcon, FastIcon, ModelIcon, OpenIcon } from '@components/icons';

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
    icon: <CodeIcon />,
    title: 'Works with your code',
    content: [
      "SDKs for the most popular languages have already been written, making it easy to integrate and grow alongside your applications. OpenFGA also makes it trivial to contribute new SDKs to support your project's language.",
    ],
  },
  {
    id: 'fast',
    icon: <FastIcon />,
    title: 'Blazing fast',
    content: [
      'OpenFGA is designed to answer authorization check calls in milliseconds, which lets it scale with projects of any size. It works just as well for small startups and hobby programmers building single applications as it does for enterprise companies building platforms on a global scale.',
    ],
  },
  {
    id: 'open',
    icon: <OpenIcon />,
    title: 'Built in the open',
    content: [
      "OpenFGA's <a href='https://github.com/openfga/rfcs/blob/main/README.md' >RFC process</a> and <a href='https://github.com/openfga/.github/blob/main/CONTRIBUTING.md' >governance model</a> invite anyone to become a contributor, and collaboratively develop the project roadmap. Come create the next standard for authorization with us! ",
      '<a target="_blank" href="https://github.com/openfga/.github/blob/main/CONTRIBUTING.md#contribution-process" >Learn how to get involved → </a>',
    ],
  },
  {
    id: 'sponsored',
    icon: <Auth0Icon />,
    title: 'Sponsored by Auth0',
    content: [
      'Originally designed by Auth0 to power their managed fine grained authorization system, Auth0 Fine Grained Authorization, OpenFGA is building upon decades of industry experience and insights from dozens of internal stakeholders and customer organizations of all shapes and sizes.',
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

      <div className={clsx(styles.feature, styles.highlight)}>
        <h3>Get involved</h3>
        <p>
          OpenFGA has an active <Link href="https://discord.gg/8naAwJfWN6">Discord community</Link>, a{' '}
          <Link href="https://github.com/openfga/roadmap">public roadmap</Link>, and is ready for contributions.
          Check out existing <Link href="https://github.com/openfga/rfcs">RFCs</Link> to understand where the project is
          headed, and learn more about how to take part by reading our{' '}
          <Link href="https://github.com/openfga/.github/blob/main/CONTRIBUTING.md">CONTRIBUTING.md</Link>.
        </p>
      </div>
    </div>
  </Section>
);

export { FeaturesSection };
