/* eslint-disable @typescript-eslint/no-explicit-any */

import { AuthorizationModel, TypeDefinition } from '@openfga/sdk';
import { transformer } from '@openfga/syntax-transformer';
import { constants } from '@openfga/frontend-utils';

const { SchemaVersion } = constants.enums;

export enum SyntaxFormat {
  Api = 'api',
  Friendly2 = 'friendly_v2',
}

export const loadSyntax = (
  configuration: AuthorizationModel,
  format: SyntaxFormat = SyntaxFormat.Api,
  skipVersion?: boolean,
) => {
  let config = configuration;
  switch (format) {
    case SyntaxFormat.Friendly2:
      if (!config.type_definitions && (config as unknown as TypeDefinition).type) {
        config = {
          schema_version: SchemaVersion.OneDotOne,
          type_definitions: [config as unknown as TypeDefinition],
          id: ""
        };
        skipVersion = true;
      } else if (!config.type_definitions) {
        throw new Error('invalid partial model');
      }
      return skipVersion
        ? transformer.transformJSONToDSL(config).replace('model\n  schema 1.1\n', '')
        : transformer.transformJSONToDSL(config);
    case SyntaxFormat.Api:
    default: {
      return skipVersion
        ? JSON.stringify(config, null, '  ').replace('  "schema_version": "1.1",\n', '').replace(',\n  "id": ""', '')
        : JSON.stringify(config, null, '  ').replace(',\n  "id": ""', '');
    }
  }
};
