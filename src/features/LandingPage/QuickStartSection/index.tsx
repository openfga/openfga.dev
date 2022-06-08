import Link from '@docusaurus/Link';
import * as React from 'react';
import { Section } from '@components/Section';
import QuickStartImg from '@static/img/Terminal.png';

import styles from './QuickStartSection.module.css';

const copyCurlCommand = () => {
  const cmd = 'curl -O https://openfga.com/docker-compose.yml && docker-compose up -d';

  navigator.clipboard.writeText(cmd);

  document.getElementsByClassName(styles.copyQuickstart)[0].setAttribute('copied', 'true');

  setTimeout(() => {
    document.getElementsByClassName(styles.copyQuickstart)[0].setAttribute('copied', 'false');
  }, 5000);
};

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
          <button className={styles.copyQuickstart} onClick={() => copyCurlCommand()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </Section>
  );
};

export { QuickStartSection };
