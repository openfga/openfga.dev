import * as React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { SwaggerUI } from '../../components/SwaggerUI/swagger-ui';

const ApiService = () => {
  const { siteConfig } = useDocusaurusContext();
  const apiDocsBasePath = siteConfig.customFields?.apiDocsBasePath as string | undefined;

  return (
    <Layout title="Open FGA API Explorer">
      <SwaggerUI apiDocsBasePath={apiDocsBasePath} />
    </Layout>
  );
};

export default ApiService;
