import * as React from 'react';
import CodeBlock from '@theme/CodeBlock';
import { tools } from '@openfga/frontend-utils';
import { loadSyntax, SyntaxFormat } from './SyntaxTransformer';
import { AuthorizationModel } from '@openfga/sdk';

type AuthzModelCodeBlockProps = {
  configuration: AuthorizationModel;
  syntaxFormat: SyntaxFormat;
  skipVersion?: boolean;
};

const AuthzModelCodeBlock: React.FC<AuthzModelCodeBlockProps> = ({ configuration, syntaxFormat, skipVersion }) => {
  return (
    <CodeBlock
      className={`language-${syntaxFormat === SyntaxFormat.Json ? 'json' : tools.PrismExtensions.LANGUAGE_NAME}`}
    >
      {loadSyntax(configuration, syntaxFormat, skipVersion)}
    </CodeBlock>
  );
};

export { AuthzModelCodeBlock };
