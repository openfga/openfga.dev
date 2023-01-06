/* eslint-disable @typescript-eslint/no-explicit-any */

import { WriteAuthorizationModelRequest } from '@openfga/sdk';
import { apiSyntaxToFriendlySyntax } from '@openfga/syntax-transformer';

export enum SyntaxFormat {
  Api = 'api',
  Friendly2 = 'friendly_v2',
}

export const loadSyntax = (
  configuration: WriteAuthorizationModelRequest,
  format: SyntaxFormat = SyntaxFormat.Api,
  skipVersion?: boolean,
) => {
  switch (format) {
    case SyntaxFormat.Friendly2:
      return skipVersion
        ? apiSyntaxToFriendlySyntax(configuration).replace('model\n  schema 1.1\n', '')
        : apiSyntaxToFriendlySyntax(configuration);
    case SyntaxFormat.Api:
    default: {
      return skipVersion
        ? JSON.stringify(configuration, null, '  ').replace('  "schema_version": "1.1",\n', '')
        : JSON.stringify(configuration, null, '  ');
    }
  }
};
