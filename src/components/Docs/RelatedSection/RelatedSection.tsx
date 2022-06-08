import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { CardBox } from '../CardBox';
import { ColumnLayout } from '../Column';
import styles from './RelatedSection.module.css';

// type used for related link
interface relatedLink {
  title: string;
  description: string;
  link: string;
  id?: string;
}

interface RelatedSectionProps {
  description: string;
  relatedLinks: relatedLink[];
}

function displayRelatedLink(link: relatedLink): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const linkText = link.link.replace('{ProductConcept}', siteConfig.customFields.conceptLink as string);
  const titleText = link.title.replace('{ProductName}', siteConfig.customFields.productName as string);
  const descriptionText = link.description.replace('{ProductName}', siteConfig.customFields.productName as string);
  return (
    <CardBox key={linkText} title={titleText} description={descriptionText} links={[{ label: 'More', to: linkText }]} />
  );
}

export function RelatedSection(props: RelatedSectionProps) {
  const { siteConfig } = useDocusaurusContext();
  const { description, relatedLinks } = props;
  const baseClassName = 'documentation-related-section';
  const descriptionText = description.replace('{ProductName}', siteConfig.customFields.productName as string);

  return (
    <div className={styles[baseClassName]}>
      <div className={styles[baseClassName + '-description']}>
        <span>{descriptionText}</span>
      </div>
      <ColumnLayout cols={3}>{relatedLinks?.map((link) => displayRelatedLink(link))}</ColumnLayout>
    </div>
  );
}
