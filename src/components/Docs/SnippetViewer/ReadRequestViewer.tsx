import { getFilteredAllowedLangs, SupportedLanguage, LanguageMappings } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';

interface ReadTuples {
  user: string;
  relation: string;
  object: string;
}

interface ReadRequestViewerOpts {
  ModelId?: string;
  user?: string;
  relation?: string;
  object?: string;
  tuples?: ReadTuples[];
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function readRequestViewer(lang: SupportedLanguage, opts: ReadRequestViewerOpts, languageMappings: LanguageMappings) {
  const readTuples = opts.tuples
    ? opts.tuples
        .map(
          ({ user, relation, object }) =>
            // eslint-disable-next-line max-len
            `{"key": {"user":"${user}","relation":"${relation}","object":"${object}"}, "timestamp": "2021-10-06T15:32:11.128Z"}`,
        )
        .join(',')
    : '';

  switch (lang) {
    case SupportedLanguage.CURL: {
      const requestTuples = opts.object
        ? (opts.user ? `"user":"${opts.user}",` : '') +
          (opts.relation ? `"relation":"${opts.relation}",` : '') +
          `"object":"${opts.object}"`
        : '';

      const requestTuplePayload =
        requestTuples != ''
          ? `\\
  -d '{"tuple_key":{${requestTuples}}}`
          : '';

      // eslint-disable-next-line max-len
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/read \\
  -H "Authorization: Bearer $FGA_BEARER_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" ${requestTuplePayload}'

# Response: "tuples": {[${readTuples}]}`;
    }

    case SupportedLanguage.JS_SDK: {
      const requestTuples = opts.object
        ? (opts.user ? `    user:'${opts.user}',\n` : '') +
          (opts.relation ? `    relation:'${opts.relation}',\n` : '') +
          `    object:'${opts.object}',`
        : '';
      const requestTuplesPayload =
        requestTuples != ''
          ? `
  tuple_key: {
${requestTuples}
  },
`
          : '';
      return `
// Execute a read
const { tuples } = await fgaClient.read({${requestTuplesPayload}});

// tuples = [${readTuples}]
`;
    }

    case SupportedLanguage.GO_SDK: {
      const requestTuples = opts.object
        ? (opts.user ? `\t\tUser: fgaSdk.PtrString("${opts.user}"),\n` : '') +
          (opts.relation ? `\t\tRelation: fgaSdk.PtrString("${opts.relation}"),\n` : '') +
          `\t\tObject: fgaSdk.PtrString("${opts.object}"),\n`
        : '';
      const requestTuplePayload =
        requestTuples != ''
          ? `
  TupleKey: fgaSdk.TupleKey{
${requestTuples}
  },
`
          : '';

      /* eslint-disable no-tabs */
      return `
body := fgaSdk.ReadRequest{${requestTuplePayload}}
data, response, err := fgaClient.${languageMappings['go'].apiName}.Read(context.Background()).Body(body).Execute()

// data = { "tuples": [${readTuples}] }`;
    }

    case SupportedLanguage.DOTNET_SDK: {
      const requestTuples = opts.object
        ? (opts.user ? `  User = "${opts.user}",\n` : '') +
          (opts.relation ? `  Relation = "${opts.relation}",\n` : '') +
          `  Object = "${opts.object}",`
        : '';

      const requestTuplePayload =
        requestTuples != ''
          ? `new TupleKey() {
${requestTuples}
}`
          : '';

      /* eslint-disable no-tabs */
      return `
var response = fgaClient.Read(new ReadRequest(${requestTuplePayload}));

// data = { "tuples": [${readTuples}] }`;
    }
    case SupportedLanguage.PYTHON_SDK: {
      const requestTuples = opts.object
        ? (opts.user ? `            user="${opts.user}",\n` : '') +
          (opts.relation ? `            relation="${opts.relation}",\n` : '') +
          `            object="${opts.object}",\n`
        : '';

      const requestTuplePayload =
        requestTuples != ''
          ? `
        tuple_key=TupleKey(
${requestTuples}
        ),
    `
          : '';
      return `
# from openfga_sdk.models.read_request import ReadRequest
# from openfga_sdk.models.read_response import ReadResponse
# from openfga_sdk.models.tuple_key import TupleKey

async def read():
    body = ReadRequest(${requestTuplePayload})
    response = await fga_client_instance.read(body)
    # response = ReadResponse({"tuples":[${readTuples}]})`;
    }
    case SupportedLanguage.RPC: {
      const objectOrType = opts.object ? (opts.object.slice(-1) === ':' ? 'type' : 'object') : '';
      const requestTuples = opts.object
        ? (opts.user
            ? `  "${opts.user}", // where user \`${opts.user}\` has $(opts.relation ? '': 'any ' )relation\n`
            : `  // for users who have relation\n`) +
          (opts.relation ? `  "${opts.relation}", // \`${opts.relation}\`\n` : '') +
          `  "${opts.object}", // with the ${objectOrType} \`${opts.object}\``
        : '';

      const readTuples = opts.tuples
        ? opts.tuples
            .map(
              ({ user, relation, object }) =>
                // eslint-disable-next-line max-len
                `{"key": {"user":"${user}","relation":"${relation}","object":"${object}"}, "timestamp": "2021-10-06T15:32:11.128Z"}`,
            )
            .join(',')
        : '';

      return `read(
  // read all stored tuples
${requestTuples}
);

Reply: tuples:[${readTuples}]`;
    }

    case SupportedLanguage.PLAYGROUND:
      return '';
    default:
      assertNever(lang);
  }
  /* eslint-enable no-tabs */
}

export function ReadRequestViewer(opts: ReadRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.CURL,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ReadRequestViewerOpts>(allowedLanguages, opts, readRequestViewer);
}
