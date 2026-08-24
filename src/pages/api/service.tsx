import * as React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const SwaggerUI = React.lazy(() =>
  import('../../components/SwaggerUI/swagger-ui').then((module) => ({ default: module.SwaggerUI })),
);

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
        {() => (
          <React.Suspense fallback={<div>Loading...</div>}>
            <SwaggerUI apiDocsBasePath={apiDocsBasePath} />
          </React.Suspense>
        )}
      </BrowserOnly>
    </Layout>
  );
};

export default ApiService;
