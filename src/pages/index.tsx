import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { QuickStartSection, FeaturesSection, ResourcesSection, HeroHeader } from '@features/LandingPage';

const softwareApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'OpenFGA',
  url: 'https://openfga.dev',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Linux, macOS, Windows',
  description:
    'OpenFGA is an open-source, CNCF-incubating fine-grained authorization engine inspired by Google Zanzibar.',
  programmingLanguage: ['Go', 'JavaScript', 'Java', '.NET', 'Python'],
  codeRepository: 'https://github.com/openfga/openfga',
  license: 'https://www.apache.org/licenses/LICENSE-2.0',
};

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const title = siteConfig.customFields.landingPageTitle;
  return (
    <Layout
      title={`${title}`}
      description="OpenFGA is a CNCF Incubating open-source fine-grained authorization engine inspired by Google Zanzibar. Used by Grafana, Docker, and Canonical."
    >
      <Head>
        <script type="application/ld+json">{JSON.stringify(softwareApplicationJsonLd)}</script>
      </Head>
      <HeroHeader />
      <main>
        <QuickStartSection />
        <FeaturesSection />
        <ResourcesSection />
      </main>
    </Layout>
  );
}
