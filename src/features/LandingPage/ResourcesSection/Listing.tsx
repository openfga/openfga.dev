import * as React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import * as icons from '@components/icons';
import styles from './ResourcesSection.module.css';
import { ColorProps } from './CommonProp';

type Resource = {
  text: string;
  href: string;
  icon: string;
};

const Listing = ({ colorProps }: { colorProps: ColorProps }) => {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  const resources = customFields.resources as Resource[] | undefined;

  return (
    <div className={styles.mainArea}>
      <h2 className={styles.heading}>Since you&#39;re here, you might be interested in some ReBAC resources:</h2>
      <ul className={styles.links}>
        {resources &&
          resources.map(({ text, href, icon }) => {
            const Icon = icons[icon];
            return (
              <li key={`${text}:${href}`}>
                {Icon && <Icon {...colorProps} />}
                <Link href={href}>{text}</Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export { Listing };
