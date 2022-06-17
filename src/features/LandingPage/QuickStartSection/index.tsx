import Link from '@docusaurus/Link';
import * as React from 'react';
import { Section } from '@components/Section';

import terminalMp4 from './terminal.mp4';
import terminalWebm from './terminal.webm';
import terminalImg from './terminal.png';

import styles from './QuickStartSection.module.css';

const QuickStartSection = () => {
  return (
    <Section className={styles.section} id="quick-start">
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className="section_heading">Quick Start</h2>
          <p className={styles.highlight}>Trying OpenFGA is as easy as...</p>
          <p>Run the curl command on the right in a terminal that is running on a machine with Docker installed.</p>
          <p>
            OpenFGA will be running at localhost:8080 on your machine. Learn about other options and next steps in the
            project <Link href="https://github.com/openfga/openfga">README.md</Link> or{' '}
            <Link to="./docs/getting-started">Getting Started</Link> guides.
          </p>
          <p>
            Learn how to use sample authorization models and create your own with the project&rsquo;s extensive{' '}
            <Link to="./docs/modeling">documentation</Link>.
          </p>
        </div>
        <div className={styles.graphic}>
          <video width="646" preload="auto" autoPlay muted loop className={styles.terminalImg} poster={terminalImg}>
            <source src={terminalWebm} type="video/webm" />
            <source src={terminalMp4} type="video/mp4" />
          </video>
        </div>
      </div>
    </Section>
  );
};

export { QuickStartSection };
