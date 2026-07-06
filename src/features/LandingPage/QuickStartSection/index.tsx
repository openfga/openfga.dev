import Link from '@docusaurus/Link';
import * as React from 'react';
import { Section } from '@components/Section';
import { AdoptersCarousel } from '@components/AdoptersCarousel';

import terminalMp4 from './terminal.mp4';
import terminalWebm from './terminal.webm';
import terminalImg from './terminal.png';

import styles from './QuickStartSection.module.css';

const QuickStartSection = () => {
  const buttonRef = React.useRef(null);

  const processHTMLSnippet = (snippet: string) => {
    // Change &amp to &
    const translateAmpersands = snippet.replace(/&amp;/g, '&');
    // Remove <br /> and \
    const translateLineBreaks = translateAmpersands.replace(/<br>|\\/g, '');

    return translateLineBreaks;
  };

  const changeSVGState = () => {
    buttonRef.current?.setAttribute('data-copied', 'true');

    setTimeout(() => {
      buttonRef.current?.setAttribute('data-copied', 'false');
    }, 5000);
  };

  const copyCurlCommand = () => {
    const htmlCommand = document.getElementById('dockerSnippet').innerHTML;
    const plainCommand = processHTMLSnippet(htmlCommand);

    navigator.clipboard.writeText(plainCommand);

    changeSVGState();
  };

  return (
    <Section className={styles.section} id="quick-start">
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className="section_heading">Quick Start</h2>
          <p className={styles.highlight}>Trying OpenFGA is as easy as...</p>
          <p>Run the following snippet in a terminal in an environment with Docker installed:</p>
          <div className={styles.copyCodeBlock}>
            <pre id="dockerSnippet" className={styles.dockerSnippet}>
              docker pull openfga/openfga && \<br />
              docker run -p 8080:8080 -p 8081:8081 \<br />
              -p 3000:3000 openfga/openfga run
            </pre>
            <button
              ref={buttonRef}
              className={styles.copyQuickstart}
              data-copied="false"
              onClick={() => copyCurlCommand()}
            >
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
                <title>Copy quick start command to clipboard</title>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
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
        <div className={styles.terminalContainer}>
          <video width="646" preload="auto" autoPlay muted loop className={styles.terminalImg} poster={terminalImg}>
            <source src={terminalWebm} type="video/webm" />
            <source src={terminalMp4} type="video/mp4" />
          </video>
        </div>
      </div>
      <AdoptersCarousel />
    </Section>
  );
};

export { QuickStartSection };
