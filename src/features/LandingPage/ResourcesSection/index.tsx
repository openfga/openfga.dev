import * as React from 'react';
import { Section } from '@components/Section';
import { Listing } from './Listing';
// For now, don't list the updates
// import { Updates } from './Update';

import styles from './ResourcesSection.module.css';

type ResourcesSectionProps = {
  darkTheme?: boolean;
};

const ResourcesSection: React.FC<ResourcesSectionProps> = ({ darkTheme = 'dark' }) => {
  const colorProps = {
    color: darkTheme ? '#eaecee' : '#272B33',
  };

  return (
    <Section id="resources">
      <div data-theme={darkTheme ? 'dark' : 'light'} className={styles.container}>
        <Listing colorProps={colorProps} />
      </div>
    </Section>
  );
};

export { ResourcesSection };
