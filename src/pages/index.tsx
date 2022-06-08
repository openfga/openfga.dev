import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { QuickStartSection, FeaturesSection, ResourcesSection, HeroHeader } from '@features/LandingPage';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <HeroHeader />
      <main>
        <QuickStartSection />
        <FeaturesSection />
        <ResourcesSection />
      </main>
    </Layout>
  );
}
