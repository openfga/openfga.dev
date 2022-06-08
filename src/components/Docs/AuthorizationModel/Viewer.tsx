import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import React from 'react';
import { TypeDefinitions } from '@auth0/fga';

import { loadSyntax, SyntaxFormat } from './SyntaxTransformer';

interface AuthzModelSnippetViewerOpts {
  // Namespace configuration in api syntax
  configuration: TypeDefinitions;
  // optional description
  description?: string;
  onlyShow?: SyntaxFormat;
}

function AuthorizationModelCodeBlock({
  configuration,
  syntaxFormat,
}: {
  configuration: TypeDefinitions;
  syntaxFormat: SyntaxFormat;
}) {
  return (
    <CodeBlock className={`language-${syntaxFormat === SyntaxFormat.Api ? 'json' : 'dsl'}`}>
      {loadSyntax(configuration, syntaxFormat)}
    </CodeBlock>
  );
}

export function AuthzModelSnippetViewer(opts: AuthzModelSnippetViewerOpts): JSX.Element {
  const { configuration, onlyShow } = opts;
  return (
    <>
      {!onlyShow ? (
        <Tabs groupId="dsl">
          <TabItem value="dsl" label="DSL">
            <AuthorizationModelCodeBlock configuration={configuration} syntaxFormat={SyntaxFormat.Friendly2} />
          </TabItem>
          <TabItem value="json" label="JSON">
            <AuthorizationModelCodeBlock configuration={configuration} syntaxFormat={SyntaxFormat.Api} />
          </TabItem>
        </Tabs>
      ) : (
        <AuthorizationModelCodeBlock configuration={configuration} syntaxFormat={onlyShow} />
      )}
    </>
  );
}
