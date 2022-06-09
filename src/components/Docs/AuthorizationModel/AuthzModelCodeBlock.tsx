import * as React from 'react';
import CodeBlock from '@theme/CodeBlock';
import { loadSyntax, SyntaxFormat } from './SyntaxTransformer';
import { TypeDefinitions } from '@auth0/fga';

type AuthzModelCodeBlockProps = {
  configuration: TypeDefinitions;
  syntaxFormat: SyntaxFormat;
};

const AuthzModelCodeBlock: React.FC<AuthzModelCodeBlockProps> = ({ configuration, syntaxFormat }) => {
  return (
    <CodeBlock className={`language-${syntaxFormat === SyntaxFormat.Api ? 'json' : 'dsl'}`}>
      {loadSyntax(configuration, syntaxFormat)}
    </CodeBlock>
  );
};

export { AuthzModelCodeBlock };
