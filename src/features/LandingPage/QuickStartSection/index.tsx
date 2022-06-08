import Link from '@docusaurus/Link';
import * as React from 'react';
import { Section } from '@components/Section';
import QuickStartImg from '@static/img/Terminal.png';

import styles from './QuickStartSection.module.css';

const QuickStartSection = () => {
  return (
    <Section className={styles.section} id="quick-start">
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className="section_heading">Quick Start</h2>
          <p className={styles.highlight}>Trying OpenFGA is as easy as...</p>
          <p>Run the curl command on the right to a terminal running on a machine with Docker installed.</p>
          <p>
            OpenFGA will be running at localhost:8080 on your machine. Learn about other options and next steps in the
            project <Link href="https://github.com/openfga/openfga">README.md</Link> or{' '}
            <Link to="intro/authorization-and-openfga">Getting Started</Link> guides.
          </p>
          <p>
            Learn how to use sample authorization models and create your own with the project’s extensive{' '}
            <Link to="intro/authorization-and-openfga">documentation</Link>.
          </p>
        </div>
        <div className={styles.graphic}>
          <img src={QuickStartImg} alt="Terminal showing how awesome OpenFGA is." />
        </div>
      </div>
    </Section>
  );
};

export { QuickStartSection };
