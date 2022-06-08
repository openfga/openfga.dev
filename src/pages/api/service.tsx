import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { SwaggerUI } from '../../components/SwaggerUI/swagger-ui';

interface ApiStoreProps {
  apiDocsBasePath?: string;
}

export class ApiService extends React.Component<ApiStoreProps, any> {
  render() {
    return (
      <Layout title="Open FGA API Explorer">
        <SwaggerUI apiDocsBasePath={this.props.apiDocsBasePath} />
      </Layout>
    );
  }
}

// eslint-disable-next-line react/display-name
export default () => {
  const { siteConfig } = useDocusaurusContext();
  const apiDocsBasePath = siteConfig.customFields?.apiDocsBasePath as string | undefined;

  return (
    <Layout title="Open FGA API Explorer">
      <SwaggerUI apiDocsBasePath={apiDocsBasePath} />
    </Layout>
  );
};
