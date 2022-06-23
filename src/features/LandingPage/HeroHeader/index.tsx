import * as React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './HeroHeader.module.css';

import { HeroPattern } from './HeroPattern';
import { HeroLogo } from './HeroLogo';
import { ButtonLink } from '@components/ButtonLink';
import { StyleGrid } from '../StyleGrid';

const HeroHeader = () => {
  const { siteConfig } = useDocusaurusContext();
  const headingRef = React.useRef(null);

  const scrollHandler = (entries) => {
    const [entry] = entries;

    const logo = document.querySelector('.navbar__logo');
    logo.setAttribute('data-minimal', `${entry.isIntersecting}`);
  };

  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(scrollHandler, options);

    if (headingRef.current) observer.observe(headingRef.current);

    return () => {
      if (headingRef.current) observer.unobserve(headingRef.current);
    };
  }, [scrollHandler]);

  // Provide a way to identify landing/home page in CSS
  document.getElementById('__docusaurus').className = 'docs-landing-page';

  return (
    <header>
      <div className="container__no-padding">
        <StyleGrid />
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.heading} ref={headingRef}>
              {<HeroLogo />}
              <span className={styles.headingSubtitle}>{siteConfig.tagline}</span>
            </h1>
            <p className={styles.headingDescription}>
              OpenFGA is an open-source authorization solution that allows developers to build granular access control
              using an easy-to-read modeling language and friendly APIs.
            </p>

            <div className={styles.buttons}>
              <ButtonLink to="#quick-start" variant="primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.37046 10.4506H0.875325C0.126602 10.4506 -0.275417 9.61053 0.2155 9.07089L8.20846 0.28415C8.76556 -0.328002 9.81555 0.124049 9.70393 0.92644L8.37046 10.4506Z"
                    fill="#272B33"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.62834 5.54883H15.1245C15.8732 5.54883 16.2752 6.38889 15.7843 6.92853L7.79033 15.7162C7.23323 16.3284 6.18324 15.8763 6.29486 15.0739L7.62834 5.54883Z"
                    fill="#272B33"
                  />
                </svg>
                Quick start
              </ButtonLink>
              <ButtonLink href="https://github.com/openfga">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 0C3.58 0 0 3.67055 0 8.20235C0 11.8319 2.29 14.8975 5.47 15.9843C5.87 16.0561 6.02 15.81 6.02 15.5947C6.02 15.3999 6.01 14.754 6.01 14.067C4 14.4464 3.48 13.5646 3.32 13.1033C3.23 12.8674 2.84 12.1395 2.5 11.9447C2.22 11.7909 1.82 11.4115 2.49 11.4013C3.12 11.391 3.57 11.9959 3.72 12.242C4.44 13.4826 5.59 13.134 6.05 12.9187C6.12 12.3855 6.33 12.0267 6.56 11.8216C4.78 11.6166 2.92 10.9091 2.92 7.77173C2.92 6.87972 3.23 6.14151 3.74 5.56735C3.66 5.36229 3.38 4.52155 3.82 3.39372C3.82 3.39372 4.49 3.17841 6.02 4.23446C6.66 4.04991 7.34 3.95763 8.02 3.95763C8.7 3.95763 9.38 4.04991 10.02 4.23446C11.55 3.16816 12.22 3.39372 12.22 3.39372C12.66 4.52155 12.38 5.36229 12.3 5.56735C12.81 6.14151 13.12 6.86947 13.12 7.77173C13.12 10.9194 11.25 11.6166 9.47 11.8216C9.76 12.078 10.01 12.5701 10.01 13.3391C10.01 14.4361 10 15.3179 10 15.5947C10 15.81 10.15 16.0664 10.55 15.9843C12.1381 15.4346 13.5182 14.3881 14.4958 12.9921C15.4735 11.5961 15.9996 9.92095 16 8.20235C16 3.67055 12.42 0 8 0Z"
                    fill="#D3D8DF"
                  />
                </svg>
                Join us on Github
              </ButtonLink>
            </div>
          </div>
          {<HeroPattern className={styles.heroPattern} />}
        </div>
      </div>
    </header>
  );
};

export { HeroHeader };
