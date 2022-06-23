import * as React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import { SwaggerUI } from '../../components/SwaggerUI/swagger-ui';

const ApiService = () => {
  const { siteConfig } = useDocusaurusContext();
  const apiDocsBasePath = siteConfig.customFields?.apiDocsBasePath as string | undefined;

  // Provide a way to identify API page in CSS
  if (ExecutionEnvironment.canUseDOM) {
    document.getElementById('__docusaurus').className = 'docs-api-page';
  }

  return (
    <Layout title="Open FGA API Explorer">
      <SwaggerUI apiDocsBasePath={apiDocsBasePath} />
    </Layout>
  );
};

export default ApiService;
