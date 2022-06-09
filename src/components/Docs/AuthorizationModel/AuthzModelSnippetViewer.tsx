import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import React from 'react';
import { TypeDefinitions } from '@auth0/fga';
import { SyntaxFormat } from './SyntaxTransformer';
import { AuthzModelCodeBlock } from './AuthzModelCodeBlock';

type AuthzModelSnippetViewerProps = {
  // Namespace configuration in api syntax
  configuration: TypeDefinitions;
  // optional description
  description?: string;
  onlyShow?: SyntaxFormat;
};

const AuthzModelSnippetViewer: React.FC<AuthzModelSnippetViewerProps> = ({ configuration, onlyShow }) => {
  if (onlyShow) {
    return <AuthzModelCodeBlock configuration={configuration} syntaxFormat={onlyShow} />;
  }

  return (
    <Tabs groupId="dsl">
      <TabItem value="dsl" label="DSL">
        <AuthzModelCodeBlock configuration={configuration} syntaxFormat={SyntaxFormat.Friendly2} />
      </TabItem>
      <TabItem value="json" label="JSON">
        <AuthzModelCodeBlock configuration={configuration} syntaxFormat={SyntaxFormat.Api} />
      </TabItem>
    </Tabs>
  );
};

export { AuthzModelSnippetViewer };
