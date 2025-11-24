import { getFilteredAllowedLangs, SupportedLanguage } from './SupportedLanguage';
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

function readRequestViewer(lang: SupportedLanguage, opts: ReadRequestViewerOpts) {
  const readTuples = opts.tuples
    ? opts.tuples
        .map(
          ({ user, relation, object }) =>
            `{"key": {"user":"${user}","relation":"${relation}","object":"${object}"}, "timestamp": "2021-10-06T15:32:11.128Z"}`,
        )
        .join(',')
    : '';

  switch (lang) {
    case SupportedLanguage.CLI: {
      return `fga tuple read --store-id=\${FGA_STORE_ID}${opts.user ? ` --user ${opts.user}` : ''}${
        opts.relation ? ` --relation ${opts.relation}` : ''
      }${opts.object ? ` --object ${opts.object}` : ''}`;
    }
    case SupportedLanguage.CURL: {
      const requestTuples = opts.object
        ? (opts.user ? `"user":"${opts.user}",` : '') +
          (opts.relation ? `"relation":"${opts.relation}",` : '') +
          `"object":"${opts.object}"`
        : '';

      const requestTuplePayload = requestTuples
        ? `\\
  -d '{"tuple_key":{${requestTuples}}}`
        : '';

      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/read \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" ${requestTuplePayload}'

# Response: "tuples": {[${readTuples}]}`;
    }

    case SupportedLanguage.JS_SDK: {
      const requestTuples = opts.object
        ? (opts.user ? `user:'${opts.user}',\n` : '') +
          (opts.relation ? `relation:'${opts.relation}',\n` : '') +
          `object:'${opts.object}',`
        : '';
      return `
// Execute a read
const { tuples } = await fgaClient.read({
  ${requestTuples}
});

// tuples = [${readTuples}]
`;
    }

    case SupportedLanguage.GO_SDK: {
      const requestTuples = opts.object
        ? (opts.user ? `\tUser: PtrString("${opts.user}"),\n` : '') +
          (opts.relation ? `\tRelation: PtrString("${opts.relation}"),\n` : '') +
          `\tObject: PtrString("${opts.object}"),\n`
        : '';

      return `options := ClientReadOptions{}
body := ClientReadRequest{
${requestTuples}
}

data, err := fgaClient.Read(context.Background()).
    Body(body).
    Options(options).
    Execute()

// data = { "tuples": [${readTuples}] }`;
    }

    case SupportedLanguage.DOTNET_SDK: {
      const requestTuples = opts.object
        ? (opts.user ? `  User = "${opts.user}",\n` : '') +
          (opts.relation ? `  Relation = "${opts.relation}",\n` : '') +
          `  Object = "${opts.object}",`
        : '';

      return `var options = new ClientReadOptions {}
var body = new ClientReadRequest() {
${requestTuples}
};

var response = await fgaClient.Read(body, options);

// data = { "tuples": [${readTuples}] }`;
    }
    case SupportedLanguage.PYTHON_SDK: {
      const requestTuples = opts.object
        ? (opts.user ? `            user="${opts.user}",\n` : '') +
          (opts.relation ? `            relation="${opts.relation}",\n` : '') +
          `            object="${opts.object}",\n`
        : '';

      return `
options = {}
body = TupleKey(
${requestTuples}
)

response = await fga_client.read(body, options)

# response = ReadResponse({"tuples":[${readTuples}]})`;
    }
    case SupportedLanguage.RPC: {
      const objectOrType = opts.object ? (opts.object.slice(-1) === ':' ? 'type' : 'object') : '';
      const requestTuples = opts.object
        ? (opts.user
            ? `  "${opts.user}", // where user \`${opts.user}\` has ${opts.relation ? '' : 'any '}relation\n`
            : `  // for users who have relation\n`) +
          (opts.relation ? `  "${opts.relation}", // \`${opts.relation}\`\n` : '') +
          `  "${opts.object}", // with the ${objectOrType} \`${opts.object}\``
        : '';

      const readTuples = opts.tuples
        ? opts.tuples
            .map(
              ({ user, relation, object }) =>
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

    case SupportedLanguage.JAVA_SDK: {
      const requestTuples = opts.object
        ? (opts.user ? `\n        .user("${opts.user}")` : '') +
          (opts.relation ? `\n        .relation("${opts.relation}")` : '') +
          `\n        ._object("${opts.object}")`
        : '';
      return `var body = new ClientReadRequest()${requestTuples};

var response = fgaClient.read(body).get();

// response = { "tuples": [${readTuples}] }`;
    }

    case SupportedLanguage.PLAYGROUND:
      return '';
    default:
      assertNever(lang);
  }
}

export function ReadRequestViewer(opts: ReadRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
    SupportedLanguage.CLI,
    SupportedLanguage.CURL,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ReadRequestViewerOpts>(allowedLanguages, opts, readRequestViewer);
}
