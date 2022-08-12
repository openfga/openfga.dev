import { getFilteredAllowedLangs, SupportedLanguage, LanguageMappings } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';
import { TupleKey } from '@openfga/sdk';

interface ListObjectsRequestViewerOpts {
  user: string;
  relation: string;
  objectType: string;
  contextualTuples?: TupleKey[];
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function listObjectsRequestViewer(
  lang: SupportedLanguage,
  opts: ListObjectsRequestViewerOpts,
  languageMappings: LanguageMappings,
): string {
  const { user, relation, objectType, contextualTuples } = opts;

  switch (lang) {
    case SupportedLanguage.PLAYGROUND:
      return `is ${user} related to ${objectType} as ${relation}? // todo(jon-whit): make sure we extend our query language to support ListObjects in the Playground
${
  contextualTuples
    ? `
# Note: Contextual Tuples are not supported on the playground`
    : ''
}

# Response: ${
        true ? 'A green path from the user to the object' : 'A red object'
      } indicating that the response from the API is \`{"allowed":${true ? 'true' : 'false'}}\`
`;
    case SupportedLanguage.CURL:
      /* eslint-disable max-len */
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \\
  -H "Authorization: Bearer $FGA_BEARER_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{
        "type": "${objectType}",
        "relation": "${relation}",
        "user":"${user}"${
        contextualTuples
          ? `,
        "contextual_tuples": {
          "tuple_keys": [${contextualTuples
              .map((tuple) => `
            {"object": "${tuple.object}", "relation": "${tuple.relation}", "user": "${tuple.user}"}`)
              .join(',')}
          ]
        }
      }'`
          : `
      }'`
        }

# Response: {"object_ids": [...]}`;
    /* eslint-enable max-len */
    case SupportedLanguage.JS_SDK:
      return ``
    case SupportedLanguage.GO_SDK:
      /* eslint-disable no-tabs */
      return ``
    case SupportedLanguage.DOTNET_SDK:
      return ``
    case SupportedLanguage.RPC:
      return ``
  }
}

export function ListObjectsRequestViewer(opts: ListObjectsRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.CURL,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ListObjectsRequestViewerOpts>(allowedLanguages, opts, listObjectsRequestViewer);
}
