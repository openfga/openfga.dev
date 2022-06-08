import React from 'react';
import { CardBox } from '../CardBox';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '../CardBox/CardBox.module.css';

export interface IntroCardProps {
  title: string;
  description?: string;
  listItems?: string[];
}

export function IntroCard({ title, description, listItems }: IntroCardProps): JSX.Element {
  const baseClassName = 'documentation-card-box';
  const { siteConfig } = useDocusaurusContext();
  const updatedTitle = title.replace('{ProductName}', siteConfig.customFields.productName as string);
  const updatedDescription = description.replace('{ProductName}', siteConfig.customFields.productName as string);

  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <CardBox
        title={updatedTitle}
        description={
          <div style={{ marginTop: '0.75rem' }}>
            <p className={styles[baseClassName + '-description']}>{updatedDescription}</p>
            {listItems && (
              <ul style={{ marginTop: '2rem' }}>
                {listItems.map((item, i) => (
                  <li key={`list-description-${i}`}>
                    {item.replace('{ProductName}', siteConfig.customFields.productName as string)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        }
        links={[]}
      />
    </div>
  );
}
