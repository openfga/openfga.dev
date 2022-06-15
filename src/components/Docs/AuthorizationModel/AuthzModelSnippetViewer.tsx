import React from 'react';

import { TypeDefinitions } from '@openfga/sdk';
import Link from '@docusaurus/Link';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';

import { SyntaxFormat, WriteAuthzModelViewer } from '@components/Docs';
import { AuthzModelCodeBlock } from './AuthzModelCodeBlock';

type AuthzModelSnippetViewerProps = {
  // Authorization Model in api syntax
  configuration: TypeDefinitions;
  // optional description
  description?: string;
  onlyShow?: SyntaxFormat;
  showWrite?: boolean;
};

const AuthzModelSnippetViewer: React.FC<AuthzModelSnippetViewerProps> = ({ configuration, onlyShow, showWrite }) => {
  if (onlyShow) {
    return <AuthzModelCodeBlock configuration={configuration} syntaxFormat={onlyShow} />;
  }

  return (
    <>
      <Tabs groupId="dsl">
        <TabItem value="dsl" label="DSL">
          <AuthzModelCodeBlock configuration={configuration} syntaxFormat={SyntaxFormat.Friendly2} />
        </TabItem>
        <TabItem value="json" label="JSON">
          <AuthzModelCodeBlock configuration={configuration} syntaxFormat={SyntaxFormat.Api} />
        </TabItem>
      </Tabs>
      {showWrite ? (
        <details>
          <summary>Write the Authorization Model</summary>

          <Admonition type="note">
            <div>The OpenFGA API only accepts an authorization model in the API&#39;s JSON syntax.</div>
            <div>
              To convert between the API Syntax and the friendly DSL, you can use the{' '}
              <Link href={'https://github.com/openfga/syntax-transformer/'}>syntax transformer</Link> or{' '}
              <Link href={'https://play.fga.dev'}>Auth0 FGA&#39;s Playground</Link>.
            </div>
          </Admonition>

          <WriteAuthzModelViewer authorizationModel={configuration} skipSetup={true} />
        </details>
      ) : undefined}
    </>
  );
};

export { AuthzModelSnippetViewer };
