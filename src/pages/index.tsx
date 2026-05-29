import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { QuickStartSection, FeaturesSection, ResourcesSection, HeroHeader } from '@features/LandingPage';

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://openfga.dev/#software',
      name: 'OpenFGA',
      url: 'https://openfga.dev',
      applicationCategory: 'SecurityApplication',
      applicationSubCategory: 'Authorization Service',
      operatingSystem: 'Linux, macOS, Windows',
      owner: { '@id': 'https://www.cncf.io/#organization' },
      releaseNotes: 'https://github.com/openfga/openfga/blob/main/CHANGELOG.md',
      isAccessibleForFree: true,
      softwareHelp: {
        '@type': 'WebPage',
        name: 'OpenFGA Discussions',
        discussionUrl: 'https://github.com/orgs/openfga/discussions',
      },
      keywords:
        'open source, security, permissions, authorization, rbac, entitlements, abac, fga, pbac, fine grained access control, zanzibar, fine grained authorization, rebac, openfga',
      description:
        'OpenFGA is an open-source, CNCF-incubating fine-grained authorization engine inspired by Google Zanzibar.',
      license: 'https://www.apache.org/licenses/LICENSE-2.0',
      subjectOf: { '@id': 'https://openfga.dev/#source-code' },
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': 'https://openfga.dev/#source-code',
      name: 'OpenFGA source code',
      codeRepository: 'https://github.com/openfga/openfga',
      programmingLanguage: ['Go', 'JavaScript', 'Java', '.NET', 'Python'],
      license: 'https://www.apache.org/licenses/LICENSE-2.0',
      targetProduct: { '@id': 'https://openfga.dev/#software' },
    },
  ],
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
        <script type="application/ld+json">{JSON.stringify(softwareJsonLd)}</script>
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
