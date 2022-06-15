/* eslint-disable @typescript-eslint/no-explicit-any */

import yaml from 'js-yaml';
import _ from 'lodash';
import { TypeDefinitions } from '@openfga/sdk';

import { Keywords } from './Dsl';

const apiToFriendlySyntaxV1 = (config: Record<string, any>) => {
  const result: Record<string, any> = {};

  for (const entry of Object.entries(config)) {
    let [key, value]: any = entry;

    switch (key) {
      case 'difference':
        key = 'diff';
        break;
      case 'intersection':
        key = 'allOf';
        value = value.child;
        break;
      case 'computedUserset':
        key = 'usersRelatedToObjectAs';
        value = value.relation;
        break;
      case 'union':
        key = 'anyOf';
        value = value.child;
        break;
      case 'this':
        return 'self';
      case 'tupleToUserset':
        key = 'fromObjects';
        break;
      case 'tupleset':
        key = 'relatedToObjectAs';
        value = value.relation;
        break;
      default:
        break;
    }

    if (Array.isArray(value)) {
      const xs = [];

      for (const item of value) {
        xs.push(apiToFriendlySyntaxV1(item));
      }

      result[key] = xs;
      continue;
    }

    if (typeof value === 'object') {
      result[key] = apiToFriendlySyntaxV1(value);
      continue;
    }

    result[key] = value;
  }

  return result;
};

const readFrom = (obj, define) => {
  const childKeys = Object.keys(obj);

  _.forEach(childKeys, (childKey: string) => {
    if (childKey === 'this') {
      define.push(Keywords.SELF);
    }

    if (childKey === 'tupleToUserset') {
      define.push(`${obj[childKey].computedUserset.relation} ${Keywords.FROM} ${obj[childKey].tupleset.relation}`);
    }

    if (childKey === 'computedUserset') {
      define.push(`${obj[childKey].relation}`);
    }
  });
};

const apiToFriendlyV2Relation = (
  relation: string,
  relationDefinition: any,
  relations: string[],
  idx: number,
  newSyntax: string[],
) => {
  const relationKeys = Object.keys(relationDefinition);
  const define = [`    ${Keywords.DEFINE} ${relation}${relationKeys?.length ? ` ${Keywords.AS} ` : ''}`];

  // Read simple definitions
  readFrom(relationDefinition, define);

  _.forEach(relationKeys, (relationKey: any) => {
    if (relationKey === 'union') {
      const children = relationDefinition[relationKey].child;
      _.forEach(children, (child: any, idx: number) => {
        readFrom(child, define);

        if (idx < children.length - 1) {
          define.push(` ${Keywords.OR} `);
        }
      });
    }

    if (relationKey === 'intersection') {
      const children = relationDefinition[relationKey].child;
      _.forEach(children, (child: any, idx: number) => {
        readFrom(child, define);

        if (idx < children.length - 1) {
          define.push(` ${Keywords.AND} `);
        }
      });
    }

    if (relationKey === 'difference') {
      const { base, subtract } = relationDefinition[relationKey];

      readFrom(base, define);
      define.push(` ${Keywords.BUT_NOT} `);
      readFrom(subtract, define);
    }
  });

  if (relations.length === idx + 1) {
    // define.push("\n");
  }

  newSyntax.push(define.join(''));
};

const apiToFriendlyV2Type = (typeDef: Record<string, any>, newSyntax: string[]) => {
  if (typeDef.relations) {
    newSyntax.push(`${Keywords.NAMESPACE} ${typeDef.name || typeDef.type}`);
    if (Object.keys(typeDef.relations).length) {
      newSyntax.push(`  ${Keywords.RELATIONS}`);

      const relations = Object.keys(typeDef.relations);

      _.forEach(relations, (relation: any, idx: number) => {
        const relationDefinition = typeDef.relations[relation];
        apiToFriendlyV2Relation(relation, relationDefinition, relations, idx, newSyntax);
      });
    }
  } else {
    const relations = Object.keys(typeDef);
    const relation = relations[0];
    apiToFriendlyV2Relation(relation, typeDef[relation], relations, 0, newSyntax);
  }
};

const apiToFriendlySyntaxV2 = (config: Record<string, any>, newSyntax: string[] = []) => {
  const typeDefs = config.namespaces || config.type_definitions;
  if (typeDefs) {
    _.forEach(typeDefs, (typeDef: any) => {
      apiToFriendlySyntaxV2(typeDef, newSyntax);
    });
  } else {
    apiToFriendlyV2Type(config, newSyntax);
  }

  return newSyntax.join('\n') + '\n';
};

export enum SyntaxFormat {
  Api = 'api',
  Friendly1 = 'friendly_v1',
  Friendly2 = 'friendly_v2',
}

export const loadSyntax = (configuration: TypeDefinitions, format: SyntaxFormat = SyntaxFormat.Api) => {
  switch (format) {
    case SyntaxFormat.Friendly1:
      return yaml.dump(apiToFriendlySyntaxV1(configuration));
    case SyntaxFormat.Friendly2:
      return apiToFriendlySyntaxV2(configuration);
    case SyntaxFormat.Api:
    default:
      return JSON.stringify(configuration, null, '  ');
  }
};
