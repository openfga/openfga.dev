import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface RootProps {
  children: React.ReactNode;
}

export default function Root({ children }: RootProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const { contentSecurityPolicy } = siteConfig.customFields;
  return (
    <div className="CustomizedRoot">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy as string} />
      </Head>
      {children}
    </div>
  );
}
