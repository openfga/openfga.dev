import * as React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const ApiService = () => {
  const { siteConfig } = useDocusaurusContext();
  const apiDocsBasePath = siteConfig.customFields?.apiDocsBasePath as string | undefined;

  // Provide a way to identify API page in CSS
  if (ExecutionEnvironment.canUseDOM) {
    document.getElementById('__docusaurus').className = 'docs-api-page';
  }

  return (
    <Layout title="Open FGA API Explorer">
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { SwaggerUI } = require('../../components/SwaggerUI/swagger-ui');
          return <SwaggerUI apiDocsBasePath={apiDocsBasePath} />;
        }}
      </BrowserOnly>
    </Layout>
  );
};

export default ApiService;
