/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash';
import { TypeDefinitions } from '@openfga/sdk';
import { apiSyntaxToFriendlySyntax } from "@openfga/syntax-transformer";

export enum SyntaxFormat {
  Api = 'api',
  Friendly2 = 'friendly_v2',
}

export const loadSyntax = (configuration: TypeDefinitions, format: SyntaxFormat = SyntaxFormat.Api) => {
  switch (format) {
    case SyntaxFormat.Friendly2:
      return apiSyntaxToFriendlySyntax(configuration);
    case SyntaxFormat.Api:
    default:
      return JSON.stringify(configuration, null, '  ');
  }
};
