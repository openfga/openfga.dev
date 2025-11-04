import assertNever from 'assert-never/index';
import { RelationshipCondition } from '@components/Docs/RelationshipTuples';
import { getFilteredAllowedLangs, SupportedLanguage, DefaultAuthorizationModelId } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';

interface RelationshipTuple {
  user: string;
  relation: string;
  object: string;
  condition?: RelationshipCondition;
  _description?: string; // Optional comment describing what this tuple represents
}

interface RelationshipTupleWithoutCondition {
  user: string;
  relation: string;
  object: string;
  _description?: string; // Optional comment describing what this tuple represents
}

interface WriteRequestViewerOpts {
  authorizationModelId?: string;
  relationshipTuples: RelationshipTuple[];
  deleteRelationshipTuples: RelationshipTupleWithoutCondition[];
  isDelete?: boolean;
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
  conflictOptions?: {
    onDuplicateWrites?: 'error' | 'ignore';
    onMissingDeletes?: 'error' | 'ignore';
  };
}

function writeRequestViewer(lang: SupportedLanguage, opts: WriteRequestViewerOpts) {
  const modelId = opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId;
  switch (lang) {
    case SupportedLanguage.CLI: {
      return `${
        opts.relationshipTuples?.length
          ? opts.relationshipTuples
              .map(
                (tuple) =>
                  `fga tuple write --store-id=\${FGA_STORE_ID} --model-id=${modelId} ${tuple.user} ${tuple.relation} ${
                    tuple.object
                  } ${
                    tuple.condition
                      ? `--condition-name ${tuple.condition.name} --condition-context '${JSON.stringify(
                          tuple.condition.context,
                        )}'`
                      : ''
                  } ${
                    opts.conflictOptions?.onDuplicateWrites
                      ? `--on-duplicate ${opts.conflictOptions.onDuplicateWrites}`
                      : ''
                  }`,
              )
              .join('\n')
          : ''
      }

${
  opts.deleteRelationshipTuples?.length
    ? opts.deleteRelationshipTuples
        .map((tuple) => `fga tuple delete --store-id=\${FGA_STORE_ID} ${tuple.user} ${tuple.relation} ${tuple.object}  ${
                    opts.conflictOptions?.onMissingDeletes
                      ? `--on-missing ${opts.conflictOptions.onMissingDeletes}`
                      : ''
                  }`)
        .join('\n')
    : ''
}`;
    }
    case SupportedLanguage.CURL: {
      // Build the JSON object for pretty printing
      interface RequestBody {
        writes?: {
          tuple_keys: Array<Omit<RelationshipTuple, '_description'>>;
          on_duplicate?: string;
        };
        deletes?: {
          tuple_keys: Array<Omit<RelationshipTuple, '_description'>>;
          on_missing?: string;
        };
        authorization_model_id?: string;
      }

      const requestBody: RequestBody = {};

      if (opts.relationshipTuples?.length) {
        requestBody.writes = {
          tuple_keys: opts.relationshipTuples.map((tuple) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _description, ...cleanTuple } = tuple;
            return cleanTuple;
          }),
        };
        if (opts.conflictOptions?.onDuplicateWrites) {
          requestBody.writes.on_duplicate = opts.conflictOptions.onDuplicateWrites;
        }
      }

      if (opts.deleteRelationshipTuples?.length) {
        requestBody.deletes = {
          tuple_keys: opts.deleteRelationshipTuples.map((tuple) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _description, ...cleanTuple } = tuple;
            return cleanTuple;
          }),
        };
        if (opts.conflictOptions?.onMissingDeletes) {
          requestBody.deletes.on_missing = opts.conflictOptions.onMissingDeletes;
        }
      }

      // Add authorization_model_id at the end
      requestBody.authorization_model_id = modelId;

      const prettyJson = JSON.stringify(requestBody, null, 2);

      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/write \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '${prettyJson}'`;
    }

    case SupportedLanguage.JS_SDK: {
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(
              (tuple) => `
      ${tuple._description ? `// ${tuple._description}\n      ` : ''}${JSON.stringify(tuple)}`,
            )
            .join(',')
        : '';

      const deleteTuples = opts.deleteRelationshipTuples
        ? opts.deleteRelationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
      ${
        _description ? `// ${_description}\n      ` : ''
      }{ user: '${user}', relation: '${relation}', object: '${object}'}`,
            )
            .join(',')
        : '';
      const writes = `writes: [${writeTuples.length > 0 ? `${writeTuples}\n  ]` : ']'}`;
      const deletes = `deletes: [${deleteTuples.length > 0 ? `${deleteTuples}\n  ]` : ']'}`;
      const separator = `${opts.deleteRelationshipTuples && opts.relationshipTuples ? ',\n  ' : ''}`;
      return `
await fgaClient.write({
  ${opts.relationshipTuples ? writes : ''}${separator}${opts.deleteRelationshipTuples ? deletes : ''},
}, {
  authorizationModelId: "${modelId}" 
});`;
    }

    case SupportedLanguage.GO_SDK: {
      /* eslint-disable no-tabs */
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(
              ({ user, relation, object, condition, _description }) =>
                `        {${
                  _description
                    ? `
             // ${_description}`
                    : ''
                }
             User: "${user}",
             Relation: "${relation}",
             Object: "${object}",${
               condition
                 ? `
             Condition: &RelationshipCondition{
                 Name: "${condition.name}",
                 Context: &map[string]interface{}${JSON.stringify(condition.context)},
             },`
                 : ''
             }
        }, `,
            )
            .join('')
        : '';

      const deleteTuples = opts.deleteRelationshipTuples
        ? opts.deleteRelationshipTuples
            .map(
              ({ user, relation, object, _description }) =>
                `        {${
                  _description
                    ? `
             // ${_description}`
                    : ''
                }
             User: "${user}",
             Relation: "${relation}",
             Object: "${object}",
        }, `,
            )
            .join('')
        : '';

      const writes = `\n    Writes: []ClientTupleKey{${
        writeTuples.length > 0
          ? `\n${writeTuples}
    },`
          : '},'
      }`;

      const deletes = `\n    Deletes: []ClientTupleKeyWithoutCondition{${
        deleteTuples.length > 0
          ? `\n${deleteTuples}
    },`
          : '},'
      }`;

      return `
options := ClientWriteOptions{${modelId ? `\n    AuthorizationModelId: openfga.PtrString("${modelId}"),` : ''}${
        opts.conflictOptions
          ? `\n    Conflict: ClientWriteConflictOptions{${
              opts.conflictOptions.onDuplicateWrites
                ? `\n        OnDuplicateWrites: CLIENT_WRITE_REQUEST_ON_DUPLICATE_WRITES_${opts.conflictOptions.onDuplicateWrites.toUpperCase()},`
                : ''
            }${
              opts.conflictOptions.onMissingDeletes
                ? `\n        OnMissingDeletes: CLIENT_WRITE_REQUEST_ON_MISSING_DELETES_${opts.conflictOptions.onMissingDeletes.toUpperCase()},`
                : ''
            }\n},`
          : ''
      }\n}

body := ClientWriteRequest{${opts.relationshipTuples ? writes : ''}${opts.deleteRelationshipTuples ? deletes : ''} 
}

data, err := fgaClient.Write(context.Background()).
    Body(body).
    Options(options).
    Execute()

if err != nil {
    // .. Handle error
}

_ = data // use the response
`;
    }

    case SupportedLanguage.DOTNET_SDK: {
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(
              ({ user, relation, object, _description, condition }) =>
                `${_description ? `    // ${_description}\n` : ''}       new() {
                  User = "${user}",
                  Relation = "${relation}",
                  Object = "${object}"${
                    condition
                      ? `,
                  Condition = new RelationshipCondition(){
                    Name = "${condition.name}",
                    Context = new { ${Object.entries(condition.context)
                      .map(
                        ([k, v]) => `
                        ${k}="${v}"`,
                      )
                      .join(',')}
                    }
                  }`
                      : ''
                  }
              }`,
            )
            .join(',\n')
        : '';
      const deleteTuples = opts.deleteRelationshipTuples
        ? opts.deleteRelationshipTuples
            .map(
              ({ user, relation, object, _description }) =>
                `${
                  _description ? `    // ${_description}\n` : ''
                }    new() { User = "${user}", Relation = "${relation}", Object = "${object}" }`,
            )
            .join(',\n')
        : '';
      const writes = `Writes = new List<ClientTupleKey>() {
${writeTuples}
  }`;
      const deletes = `Deletes = new List<ClientTupleKeyWithoutCondition>() {
${deleteTuples}
  }`;
      const separator = `${opts.deleteRelationshipTuples && opts.relationshipTuples ? ',\n  ' : ''}`;
      return `
var options = new ClientWriteOptions {${modelId ? `\n    AuthorizationModelId = ${modelId},` : ''}${
        opts.conflictOptions
          ? `
    Conflict = new ConflictOptions {${
      opts.conflictOptions.onDuplicateWrites
        ? `
        OnDuplicateWrites = OnDuplicateWrites.${opts.conflictOptions.onDuplicateWrites.charAt(0).toUpperCase() + opts.conflictOptions.onDuplicateWrites.slice(1)},`
        : ''
    }${
      opts.conflictOptions.onMissingDeletes
        ? `
        OnMissingDeletes = OnMissingDeletes.${opts.conflictOptions.onMissingDeletes.charAt(0).toUpperCase() + opts.conflictOptions.onMissingDeletes.slice(1)}`
        : ''
    }
    }`
          : ''
      }
};
var body = new ClientWriteRequest() {
    ${opts.relationshipTuples ? writes : ''}${separator}${opts.deleteRelationshipTuples ? deletes : ''},
};
var response = await fgaClient.Write(body, options);`;
    }

    case SupportedLanguage.PYTHON_SDK: {
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(
              ({ user, relation, object, _description, condition }) => `
                ClientTuple(
${_description ? `                    # ${_description}\n                    ` : '                    '}user="${user}",
                    relation="${relation}",
                    object="${object}",${
                      condition
                        ? `
                    condition=RelationshipCondition(
                        name='${condition.name}',
                        context=dict(${Object.entries(condition.context)
                          .map(
                            ([k, v]) => `
                            ${k}="${v}"`,
                          )
                          .join(',')}
                        )
                    )`
                        : ''
                    }
                ),`,
            )
            .join('')
        : '';
      const deleteTuples = opts.deleteRelationshipTuples
        ? opts.deleteRelationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
                ClientTuple(
${_description ? `                    # ${_description}\n                    ` : '                    '}user="${user}",
                    relation="${relation}",
                    object="${object}",
                ),`,
            )
            .join('')
        : '';
      const writes = `    writes=[${writeTuples}
        ],`;
      const deletes = `    deletes=[${deleteTuples}
        ],`;

      return `options = {${modelId ? `\n    "authorization_model_id": "${modelId}"` : ''}${
        opts.conflictOptions
          ? `,
    "conflict": ConflictOptions(${
      opts.conflictOptions.onDuplicateWrites
        ? `
        on_duplicate_writes=ClientWriteRequestOnDuplicateWrites.${opts.conflictOptions.onDuplicateWrites.toUpperCase()},`
        : ''
    }${
      opts.conflictOptions.onMissingDeletes
        ? `
        on_missing_deletes=ClientWriteRequestOnMissingDeletes.${opts.conflictOptions.onMissingDeletes.toUpperCase()}`
        : ''
    }
    )`
          : ''
      }\n}
body = ClientWriteRequest(
    ${opts.relationshipTuples ? writes : ''}${opts.deleteRelationshipTuples ? deletes : ''}
)

response = await fga_client.write(body, options)
`;
    }

    case SupportedLanguage.RPC: {
      const writeTuples = opts.relationshipTuples
        ?.map(
          ({ user, relation, object, _description }) =>
            `${
              _description
                ? `
    // ${_description}`
                : ''
            }
    {
      "user":"${user}",
      "relation":"${relation}",
      "object":"${object}"
    }`,
        )
        .join(',');
      const deleteTuples = opts.deleteRelationshipTuples
        ?.map(
          ({ user, relation, object, _description }) =>
            `${
              _description
                ? `
    // ${_description}`
                : ''
            }
    {
      "user":"${user}",
      "relation":"${relation}",
      "object":"${object}"
    }`,
        )
        .join(',');
      const writes = `write([${writeTuples}\n], authorization_model_id="${modelId}")`;
      const deletes = `delete([${deleteTuples}\n], authorization_model_id="${modelId}")`;
      const separator = `${opts.deleteRelationshipTuples && opts.relationshipTuples ? ',' : ''}`;

      return `${opts.relationshipTuples ? writes : ''}${separator}
${opts.deleteRelationshipTuples ? deletes : ''}`;
      /* eslint-enable no-tabs */
    }

    case SupportedLanguage.JAVA_SDK: {
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(
              ({ user, relation, object, condition, _description }) => `
    ${_description ? `            // ${_description}\n    ` : ''}            new ClientTupleKey()
                        .user("${user}")
                        .relation("${relation}")
                        ._object("${object}")${
                          condition
                            ? `
                        .condition(new ClientRelationshipCondition()
                                .name("${condition.name}")
                                .context(Map.of(${Object.entries(condition.context)
                                  .map(([k, v]) => `"${k}", "${v}"`)
                                  .join(',')}))
                        )
                        `
                            : ''
                        }`,
            )
            .join(',')
        : '';

      const deleteTuples = opts.deleteRelationshipTuples
        ? opts.deleteRelationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
    ${_description ? `            // ${_description}\n    ` : ''}            new ClientTupleKey()
                        .user("${user}")
                        .relation("${relation}")
                        ._object("${object}")`,
            )
            .join(',')
        : '';

      const writes = `
        .writes(List.of(${writeTuples}
        ))`;
      const deletes = `
        .deletes(List.of(${deleteTuples}
        ))`;

      return `var options = new ClientWriteOptions()${
        modelId
          ? `
        .authorizationModelId("${modelId}")`
          : ''
      }${
        opts.conflictOptions?.onDuplicateWrites
          ? `
        .onDuplicate(WriteRequestWrites.OnDuplicateEnum.${opts.conflictOptions.onDuplicateWrites.toUpperCase()})`
          : ''
      }${
        opts.conflictOptions?.onMissingDeletes
          ? `
        .onMissing(WriteRequestDeletes.OnMissingEnum.${opts.conflictOptions.onMissingDeletes.toUpperCase()})`
          : ''
      };

var body = new ClientWriteRequest()${opts.relationshipTuples ? writes : ' '}${
        opts.deleteRelationshipTuples ? deletes : ''
      };

var response = fgaClient.write(body, options).get();`;
    }
    case SupportedLanguage.PLAYGROUND:
      return '';
    default:
      assertNever(lang);
  }
}

export function WriteRequestViewer(opts: WriteRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
    SupportedLanguage.CURL,
    SupportedLanguage.CLI,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<WriteRequestViewerOpts>(allowedLanguages, opts, writeRequestViewer);
}
