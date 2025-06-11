import React from 'react';

import { WriteAuthorizationModelRequest } from '@openfga/sdk';
import Link from '@docusaurus/Link';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';

import { SyntaxFormat, WriteAuthzModelViewer } from '@components/Docs';
import { AuthzModelCodeBlock } from './AuthzModelCodeBlock';

type AuthzModelSnippetViewerProps = {
  // Authorization Model in api syntax
  configuration: WriteAuthorizationModelRequest & Required<Pick<WriteAuthorizationModelRequest, 'schema_version'>>;
  showWrite?: boolean;
  syntaxesToShow?: SyntaxFormat[];
  // do not display the model schema in DSL and JSON
  skipVersion?: boolean;
};

const BaseAuthzModelSnippetViewer: React.FC<AuthzModelSnippetViewerProps> = ({
  syntaxesToShow = [],
  configuration,
  skipVersion,
}) => {
  const showTabs: boolean = Array.isArray(syntaxesToShow) && syntaxesToShow.length > 1;

  if (showTabs) {
    return (
      <>
        <Tabs groupId="dsl">
          {syntaxesToShow.map((syntax, index) => (
            <TabItem value={syntax} label={syntax.toUpperCase()} key={index}>
              <AuthzModelCodeBlock
                configuration={{ ...configuration, id: '' }}
                syntaxFormat={syntax}
                skipVersion={skipVersion}
              />
            </TabItem>
          ))}
        </Tabs>
      </>
    );
  }

  return (
    <AuthzModelCodeBlock
      configuration={{ ...configuration, id: '' }}
      syntaxFormat={syntaxesToShow[0] || SyntaxFormat.Dsl}
      skipVersion={skipVersion}
    />
  );
};

const AuthzModelSnippetViewer: React.FC<AuthzModelSnippetViewerProps> = ({
  configuration,
  showWrite,
  skipVersion,
  syntaxesToShow,
}) => {
  return (
    <>
      <BaseAuthzModelSnippetViewer
        syntaxesToShow={syntaxesToShow}
        configuration={configuration}
        skipVersion={skipVersion}
      />
      {showWrite ? (
        <details>
          <summary>Write the Authorization Model</summary>
          <Admonition type="note">
            <div>The OpenFGA API only accepts an authorization model in the API&#39;s JSON syntax.</div>
            <div>
              To convert between the API Syntax and the friendly DSL, you can use the{' '}
              <Link href={'https://github.com/openfga/cli/'}>FGA CLI</Link>.
            </div>
          </Admonition>
          <WriteAuthzModelViewer authorizationModel={{ ...configuration, id: '' }} skipSetup={true} />
        </details>
      ) : undefined}
    </>
  );
};

export { AuthzModelSnippetViewer };
