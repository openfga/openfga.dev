import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { QuickStartSection, FeaturesSection, ResourcesSection, HeroHeader } from '@features/LandingPage';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const title = siteConfig.customFields.landingPageTitle;
  return (
    <Layout title={`${title}`} description={`${siteConfig.tagline}`}>
      <HeroHeader />
      <main>
        <QuickStartSection />
        <FeaturesSection />
        <ResourcesSection />
      </main>
    </Layout>
  );
}
