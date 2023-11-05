/* eslint-disable @typescript-eslint/no-explicit-any */

import { AuthorizationModel } from '@openfga/sdk';
import { transformer } from '@openfga/syntax-transformer';

export enum SyntaxFormat {
  Api = 'api',
  Friendly2 = 'friendly_v2',
}

export const loadSyntax = (
  configuration: AuthorizationModel,
  format: SyntaxFormat = SyntaxFormat.Api,
  skipVersion?: boolean,
) => {
  switch (format) {
    case SyntaxFormat.Friendly2:
      return skipVersion
        ? transformer.transformJSONToDSL(configuration).replace('model\n  schema 1.1\n', '')
        : transformer.transformJSONToDSL(configuration);
    case SyntaxFormat.Api:
    default: {
      return skipVersion
        ? JSON.stringify(configuration, null, '  ').replace('  "schema_version": "1.1",\n', '')
        : JSON.stringify(configuration, null, '  ');
    }
  }
};
