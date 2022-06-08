import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import { ColumnLayout } from '../Column';
import Notifications from '../../../../static/img/Notifications.svg';
import Pattern from '../../../../static/img/Pattern.svg';
import styles from './Callout.module.css';

interface FeedbackCalloutProps {
  title?: string;
  description?: string;
  link?: { to: string; label: string; id?: string };
}

interface FeedbackDefaultConfig {
  defaultTitle: string;
  defaultText: string;
  defaultButtonText: string;
  defaultLink: string;
}

export function FeedbackCallout(props: FeedbackCalloutProps) {
  const { siteConfig } = useDocusaurusContext();
  const { title, description, link } = props;
  const { defaultTitle, defaultText, defaultButtonText, defaultLink } = siteConfig.customFields
    .feedback as FeedbackDefaultConfig;
  const baseClassName = 'documentation-feedback';
  return (
    <ColumnLayout cols={2}>
      <div>
        <h3 className={styles[baseClassName + '-title']}>{title || defaultTitle}</h3>
        <div className={styles[baseClassName + '-text']}>{description || defaultText}</div>

        <Link id={link && link.id} className={styles[baseClassName + '-link']} to={(link && link.to) || defaultLink}>
          <button className={styles[baseClassName + '-button']}>
            {(link && link.label) || defaultButtonText}

            <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d={`M7.49513 10.9525L12.8961 5.55152L7.49513 0.150565L6.45314 1.18676L10.0711
                4.79897H0.982726V6.30406H10.0711L6.45314 9.92206L7.49513 10.9525Z`}
                fill="white"
              />
            </svg>
          </button>
        </Link>
      </div>
      <div className={styles[baseClassName + '-img']}>
        <Notifications />
      </div>
      <Pattern className={styles[baseClassName + '-pattern']} />
    </ColumnLayout>
  );
}
