import React from 'react';

import { WriteAuthorizationModelRequest } from '@openfga/sdk';
import Link from '@docusaurus/Link';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';

import { SyntaxFormat, WriteAuthzModelViewer } from '@components/Docs';
import { AuthzModelCodeBlock } from './AuthzModelCodeBlock';
import { constants } from '@openfga/frontend-utils';

type AuthzModelSnippetViewerProps = {
  // Authorization Model in api syntax
  configuration: WriteAuthorizationModelRequest & Required<Pick<WriteAuthorizationModelRequest, 'schema_version'>>;
  // optional description
  description?: string;
  onlyShow?: SyntaxFormat;
  showWrite?: boolean;
  // do not display the model schema in DSL and JSON
  skipVersion?: boolean;
  // Display a roughly equivalent v1.0 schema
  showSchemaOneDotZero?: boolean;
};

const BaseAuthzModelSnippetViewer: React.FC<AuthzModelSnippetViewerProps> = ({
  onlyShow,
  configuration,
  skipVersion,
  showSchemaOneDotZero,
}) => {
  if (onlyShow) {
    return <AuthzModelCodeBlock configuration={{ ...configuration, id: "" }} syntaxFormat={onlyShow} skipVersion={skipVersion} />;
  }

  if (!showSchemaOneDotZero) {
    return (
      <>
        <Tabs groupId="dsl">
          <TabItem value="dsl" label="DSL">
            <AuthzModelCodeBlock
              configuration={{ ...configuration, id: "" }}
              syntaxFormat={SyntaxFormat.Friendly2}
              skipVersion={skipVersion}
            />
          </TabItem>
          <TabItem value="json" label="JSON">
            <AuthzModelCodeBlock
              configuration={{ ...configuration, id: "" }}
              syntaxFormat={SyntaxFormat.Api}
              skipVersion={skipVersion}
            />
          </TabItem>
        </Tabs>
      </>
    );
  }

  return (
    <>
      <Tabs groupId="dsl">
        <TabItem value="dsl" label="DSL">
          <AuthzModelCodeBlock
            configuration={{ ...configuration, id: "" }}
            syntaxFormat={SyntaxFormat.Friendly2}
            skipVersion={skipVersion}
          />
        </TabItem>
        <TabItem value="dsl-onedotzero" label="DSL (Version 1.0)">
          <AuthzModelCodeBlock
            configuration={{ ...configuration, schema_version: constants.enums.SchemaVersion.OneDotZero, id: "" }}
            syntaxFormat={SyntaxFormat.Friendly2}
            skipVersion={skipVersion}
          />
        </TabItem>
        <TabItem value="json" label="JSON">
          <AuthzModelCodeBlock
            configuration={{ ...configuration, id: "" }}
            syntaxFormat={SyntaxFormat.Api}
            skipVersion={skipVersion}
          />
        </TabItem>
      </Tabs>
    </>
  );
};

const AuthzModelSnippetViewer: React.FC<AuthzModelSnippetViewerProps> = ({
  configuration,
  onlyShow,
  showWrite,
  skipVersion,
  showSchemaOneDotZero,
}) => {
  return (
    <>
      <BaseAuthzModelSnippetViewer
        configuration={configuration}
        skipVersion={skipVersion}
        onlyShow={onlyShow}
        showSchemaOneDotZero={showSchemaOneDotZero}
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

          <WriteAuthzModelViewer authorizationModel={{ ...configuration, id: "" }} skipSetup={true} />
        </details>
      ) : undefined}
    </>
  );
};

export { AuthzModelSnippetViewer };
