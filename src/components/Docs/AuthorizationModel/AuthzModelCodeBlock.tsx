import * as React from 'react';
import CodeBlock from '@theme/CodeBlock';
import { syntaxHighlighters } from '@openfga/syntax-transformer';
import { loadSyntax, SyntaxFormat } from './SyntaxTransformer';
import { WriteAuthorizationModelRequest } from '@openfga/sdk';

type AuthzModelCodeBlockProps = {
  configuration: WriteAuthorizationModelRequest;
  syntaxFormat: SyntaxFormat;
};

const AuthzModelCodeBlock: React.FC<AuthzModelCodeBlockProps> = ({ configuration, syntaxFormat }) => {
  return (
    <CodeBlock
      className={`language-${
        syntaxFormat === SyntaxFormat.Api ? 'json' : syntaxHighlighters.PrismExtensions.LANGUAGE_NAME
      }`}
    >
      {loadSyntax(configuration, syntaxFormat)}
    </CodeBlock>
  );
};

export { AuthzModelCodeBlock };
