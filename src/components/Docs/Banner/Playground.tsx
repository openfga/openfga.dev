import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Banner } from './Banner';

interface PlaygroundConfig {
  intro?: boolean;
  example?: string;
  preset?: 'slack' | 'drive' | 'github' | 'iot' | 'playground' | 'entitlements';
  store?: string;
  title?: string;
}

export function Playground({ example, intro, preset, store, title }: PlaygroundConfig) {
  const { siteConfig } = useDocusaurusContext();
  const storeExtension = store ? `samples/${store}` : ``;
  const playgroundName = siteConfig.customFields.playgroundName;
  const descriptionText =
    (intro ? `Get started ` : example ? `Explore the ${example} sample ` : `Try this guide out `) +
    `on the ${playgroundName}`;
  return siteConfig.customFields.playgroundURL ? (
    <Banner
      title={title ? title : 'The Playground'}
      preset={preset ? preset : 'playground'}
      description={`${descriptionText}`}
      link={`${siteConfig.customFields.playgroundURL}${storeExtension}`}
    />
  ) : (
    <></>
  );
}
