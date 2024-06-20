import { getFilteredAllowedLangs, SupportedLanguage, DefaultAuthorizationModelId } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';
import { ListUsersResponse, TupleKey } from '@openfga/sdk';

interface ListUsersRequestViewerOpts {
  authorizationModelId?: string;
  objectType: string;
  objectId: string;
  relation: string;
  userFilterType: string;
  userFilterRelation?: string;
  contextualTuples?: TupleKey[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
  expectedResults: ListUsersResponse;
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function listUsersRequestViewer(lang: SupportedLanguage, opts: ListUsersRequestViewerOpts): string {
  const {
    relation,
    objectType,
    objectId,
    userFilterType,
    userFilterRelation,
    contextualTuples,
    context,
    expectedResults,
  } = opts;
  const modelId = opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId;

  const response = `{"users": [${expectedResults.users.map((r) => JSON.stringify(r)).join(', ')}]}`;

  switch (lang) {
    case SupportedLanguage.PLAYGROUND:
      return `# Note: List Users is not currently supported on the playground`;
    case SupportedLanguage.CLI:
      return `fga query list-users --store-id=\${FGA_STORE_ID} --model-id=${modelId} --object ${objectType}:${objectId} --relation ${relation} --user-filter ${userFilterType}${userFilterRelation ? `#${userFilterRelation}` : ''} ${
        contextualTuples
          ? `${contextualTuples
              .map((tuple) => ` --contextual-tuple "${tuple.user} ${tuple.relation} ${tuple.object}"`)
              .join(' ')}`
          : ''
      }${context ? ` --context='${JSON.stringify(context)}'` : ''}

# Response: ${response}`;
    case SupportedLanguage.CURL:
      /* eslint-disable max-len */
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-users \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{
        "authorization_model_id": "${modelId}",
        "object": {
          "type: "${objectType}",
          "id": "${objectId}",
        },
        "relation": "${relation}",
        "user_filters": [
          { 
            "type": "${userFilterType}"${
              userFilterRelation
                ? `,
            "relation": "${userFilterRelation}"`
                : ''
            }
          }
        ]${
          contextualTuples
            ? `,
        "contextual_tuples": {
          "tuple_keys": [${contextualTuples
            .map(
              (tuple) => `
            {"object": "${tuple.object}", "relation": "${tuple.relation}", "user": "${tuple.user}"}`,
            )
            .join(',')}
          ]
        }`
            : ''
        }${
          context
            ? `,
        "context":${JSON.stringify(context)}`
            : ''
        }
    }'


# Response: ${response}`;
    /* eslint-enable max-len */
    case SupportedLanguage.JS_SDK:
      return `const response = await fgaClient.listUsers({
  object: {
    type: "${objectType}",
    id: "${objectId}"
  },
  user_filters: [{
    type: "${userFilterType}"${
      userFilterRelation
        ? `,
    relation: "${userFilterRelation}"`
        : ''
    }
  }],
  relation: "${relation}",${
    contextualTuples?.length
      ? `
      contextualTuples: {
    tuple_keys: [${contextualTuples
      .map(
        (tupleKey) => `{
      user: "${tupleKey.user}",
      relation: "${tupleKey.relation}",
      object: "${tupleKey.object}"
    }`,
      )
      .join(', ')}]
  },`
      : ''
  }${
    context
      ? `
  context:${JSON.stringify(context)},`
      : ''
  }
}, {
  authorization_model_id: "${modelId}",
});
// response.users = [${expectedResults.users.map((u) => JSON.stringify(u)).join(',')}]`;
    case SupportedLanguage.GO_SDK:
      /* eslint-disable no-tabs */
      return `options := ClientListUsersOptions{
    AuthorizationModelId: PtrString("${modelId}"),
}

userFilters := []openfga.UserTypeFilter{{ Type:"${userFilterType}"${userFilterRelation ? `,Relation:"${userFilterRelation}" ` : ' '}}}

body := ClientListUsersRequest{
    Object:       openfga.Object{
        Type:    "${objectType}",
        Id:      "${objectId}",
    },
    Relation:     "${relation}",
    UserFilters:   userFilters,${
      !contextualTuples
        ? ''
        : `
    ContextualTuples: []ClientContextualTupleKey{
${
  !contextualTuples
    ? ''
    : contextualTuples
        .map(
          (tuple) =>
            `        {
             User:     "${tuple.user}",
             Relation: "${tuple.relation}",
             Object:   "${tuple.object}",
        },`,
        )
        .join('\n')
}
    },`
    }${
      context
        ? `
    Context: &map[string]interface{}${JSON.stringify(context)},`
        : ''
    }
}

data, err := fgaClient.ListUsers(context.Background()).
    Body(body).
    Options(options).
    Execute()

// data.Users = [${expectedResults.users.map((u) => JSON.stringify(u)).join(', ')}]`;
    case SupportedLanguage.DOTNET_SDK:
      return `
var options = new ClientWriteOptions {
    AuthorizationModelId = "${modelId}",
};
var body = new ClientListUsersRequest {
    Object = new FgaObject {
      Type = "${objectType}",
      Id = "${objectId}"
    },
    Relation = "${relation}",
    UserFilters = new List<UserTypeFilter> {
      new() {
        Type = "${userFilterType}"${
          userFilterRelation
            ? `
        Relation = "${userFilterRelation}"
        `
            : ''
        }
      }
    }${
      contextualTuples
        ? `,
    ,ContextualTuples = new List<ClientTupleKey>({
    ${contextualTuples
      .map((tuple) => `new(user: "${tuple.user}", relation: "${tuple.relation}", _object: "${tuple.object}")`)
      .join(',\n    ')}
})`
        : ''
    }
    ${
      context
        ? `Context = new { ${Object.entries(context)
            .map(([k, v]) => `${k}="${v}"`)
            .join(',')} }`
        : ''
    }
};

var response = await fgaClient.ListUsers(body, options);

// response.Users = [${expectedResults.users.map((u) => JSON.stringify(u)).join(',')}]`;
    case SupportedLanguage.PYTHON_SDK:
      return '';
    //       return `
    // options = {
    //     "authorization_model_id": "${modelId}"
    // }

    // userFilters=[UserTypeFilter(type="${userFilterType}"${userFilterRelation ? `, relation="${userFilterRelation}"` : ''})]

    // body = ClientListUsersRequest(
    //     object=FgaObject(type="${objectId}, id="${objectId}"),
    //     relation="${relation}",
    //     userFilters=userFilters,${
    //       contextualTuples
    //         ? `
    //     contextual_tuples=[
    //         ${contextualTuples
    //           .map(
    //             (tuple) => `ClientTupleKey(user="${tuple.user}", relation="${tuple.relation}", object="${tuple.object}")`,
    //           )
    //           .join(',\n                ')}
    //     ],`
    //         : ``
    //     }${
    //       context
    //         ? `
    //     context=dict(${Object.entries(context)
    //       .map(
    //         ([k, v]) => `
    //         ${k}="${v}"`,
    //       )
    //       .join(',')}
    //     )`
    //         : ''
    //     }
    // )

    // response = await fga_client.list_users(body, options)

    // # response.users = [${expectedResults.users.map((u) => JSON.stringify(u)).join(',')}]`;
    case SupportedLanguage.RPC:
      return `listUsers(
  user_filter=[ "${userFilterType}" ], // list users of type \`${userFilterType}\`
  "${relation}", // that have the \`${relation}\` relation
  "${objectType}:${objectId}", // for the object \`${objectType}:${objectId}\`
  authorization_model_id = "${modelId}", // for this particular authorization model id ${
    contextualTuples
      ? `
  contextual_tuples = [ // Assuming the following is true
    ${contextualTuples
      .map((tuple) => `{user = "${tuple.user}", relation = "${tuple.relation}", object = "${tuple.object}"}`)
      .join(',\n    ')}
  ]`
      : ''
  }
);

Reply: ${response}`;

    case SupportedLanguage.JAVA_SDK: {
      const contextualTuplesList = contextualTuples
        ? `
        .contextualTupleKeys(
                List.of(${contextualTuples.map(
                  (tuple) => `
                        new ClientTupleKey()
                                .user("${tuple.user}")
                                .relation("${tuple.relation}")
                                ._object("${tuple.object}")
                ))`,
                )}`
        : '';
      const contextCall = context
        ? `
        .context(Map.of(${Object.entries(context)
          .map(([k, v]) => `"${k}", "${v}"`)
          .join(',')}))`
        : '';
      return `var options = new ClientListUsersOptions()
        .authorizationModelId("${modelId}");

var userFilters = new ArrayList<UserTypeFilter>() {
  {
      add(new UserTypeFilter().type("${userFilterType}")${userFilterRelation ? `.relation("${userFilterRelation}")` : ''});
  }
};


var body = new ClientListUsersRequest()
        ._object(new FgaObject().type("${objectType}").id("${objectId}"))
        .relation("${relation}")
        .userFilters(userFilters)${contextualTuplesList}${contextCall};

var response = fgaClient.listUsers(body, options).get();

// response.getUsers() = [${expectedResults.users.map((u) => JSON.stringify(u)).join(',')}]`;
    }
    default:
      assertNever(lang);
  }
}

export function ListUsersRequestViewer(opts: ListUsersRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    // SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
    SupportedLanguage.CLI,
    SupportedLanguage.CURL,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ListUsersRequestViewerOpts>(allowedLanguages, opts, listUsersRequestViewer);
}
