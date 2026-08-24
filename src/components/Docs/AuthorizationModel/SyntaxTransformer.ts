import { AuthorizationModel, TypeDefinition } from '@openfga/sdk';
import { transformer } from '@openfga/syntax-transformer';
import { constants } from '@openfga/frontend-utils';

const { SchemaVersion } = constants.enums;

export enum SyntaxFormat {
  Json = 'json',
  Dsl = 'dsl',
}

const isTypeDefinition = (config: AuthorizationModel | TypeDefinition): config is TypeDefinition =>
  !(config as AuthorizationModel).type_definitions && Boolean((config as TypeDefinition).type);

export const loadSyntax = (
  configuration: AuthorizationModel,
  format: SyntaxFormat = SyntaxFormat.Json,
  skipVersion?: boolean,
) => {
  let config: AuthorizationModel = configuration;
  switch (format) {
    case SyntaxFormat.Dsl:
      if (isTypeDefinition(config)) {
        config = {
          schema_version: SchemaVersion.OneDotOne,
          type_definitions: [config],
          id: '',
        };
        skipVersion = true;
      } else if (!config.type_definitions) {
        throw new Error('invalid partial model');
      }
      return skipVersion
        ? transformer.transformJSONToDSL(config).replace('model\n  schema 1.1\n', '')
        : transformer.transformJSONToDSL(config);
    case SyntaxFormat.Json:
    default: {
      return skipVersion
        ? JSON.stringify(config, null, '  ').replace('  "schema_version": "1.1",\n', '').replace(',\n  "id": ""', '')
        : JSON.stringify(config, null, '  ').replace(',\n  "id": ""', '');
    }
  }
};
