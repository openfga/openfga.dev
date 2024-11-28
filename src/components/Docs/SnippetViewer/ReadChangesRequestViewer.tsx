import { getFilteredAllowedLangs, SupportedLanguage } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';

interface ReadChangesRequestViewerOpts {
  type: string;
  pageSize: number;
  continuationToken: string;
  allowedLanguages?: SupportedLanguage[];
  skipSetup?: boolean;
}

function readChangesRequestViewer(lang: SupportedLanguage, opts: ReadChangesRequestViewerOpts) {
  switch (lang) {
    case SupportedLanguage.CLI: {
      return `fga tuple changes --store-id=\${FGA_STORE_ID}${opts.type ? ` --type ${opts.type}` : ''}${
        opts.continuationToken ? ` --continuation-token ${opts.continuationToken}` : ''
      }`;
    }
    case SupportedLanguage.CURL: {
      let params = '';
      if (opts.type) {
        params = `?type=${opts.type}`;
      }
      if (opts.pageSize) {
        params = `${params === '' ? '?' : (params + '&')}` + `page_size=${opts.pageSize}`;
      }
      if (opts.continuationToken) {
        params = `${params === '' ? '?' : (params + '&')}` + `continuation_token=${opts.continuationToken}`;
      }
      return `curl -X GET $FGA_API_URL/stores/$FGA_STORE_ID/changes${params} \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json"`;
    }

    case SupportedLanguage.JS_SDK: {
      const typeString = `${'var type = "' + (opts.type ? opts.type : '') + '";\n'}`;
      const tokenString = `${
        'var continuationToken = "' + (opts.continuationToken ? opts.continuationToken : '') + '";\n'
      }`;
      // eslint-disable-next-line max-len
      const pageSizeString = `${'var pageSize = ' + (opts.pageSize ? opts.pageSize : '') + ';\n'}`;
      return `${typeString}${tokenString}${pageSizeString}
await fgaClient.readChanges({ type }, { pageSize, continuationToken });`;
    }

    case SupportedLanguage.GO_SDK: {
      // eslint-disable-next-line max-len
      return `options := ClientReadChangesOptions{${
        opts.pageSize ? `\n\tPageSize: PtrInt32(${opts.pageSize}),\n` : ''
      }${opts.continuationToken ? `\n\tContinuationToken: PtrString("${opts.continuationToken}"),\n` : ''}}
body := ClientReadChangesRequest{${opts.type ? `\n\tType: "${opts.type}",` : ''}
}

data, err := fgaClient.ReadChanges(context.Background()).
    Body(body).
    Options(options).
    Execute()

if err != nil {
    // .. Handle error
}`;
    }

    case SupportedLanguage.DOTNET_SDK: {
      return `var body = new ClientReadChangesRequest { ${opts.type ? `Type = "${opts.type}"` : ''} };
var options = new ClientReadChangesOptions {
    ${opts.pageSize ? `PageSize = ${opts.pageSize},\n` : ''}
    ${opts.continuationToken ? `ContinuationToken = "${opts.continuationToken}",\n` : ''}
};

var response = await fgaClient.ReadChanges(body, options);`;
    }

    case SupportedLanguage.PYTHON_SDK: {
      return `
body = ClientReadChangesRequest(${opts.type ? `"${opts.type}"` : ''})
options = new ClientReadChangesOptions {
    ${opts.pageSize ? `page_size: ${opts.pageSize},\n` : ''}
    ${opts.continuationToken ? `continuation_token: "${opts.continuationToken}",\n` : ''}
};
response = await fga_client.read_changes(body, options)`;
    }

    case SupportedLanguage.JAVA_SDK: {
      return `var options = new ClientReadChangesOptions()${
        opts.pageSize ? `\n        .pageSize(${opts.pageSize})` : ''
      }${opts.continuationToken ? `\n        .continuationToken("${opts.continuationToken}")` : ''};

var body = new ClientReadChangesRequest()${opts.type ? `\n        .type("${opts.type}")` : ''};

var response = fgaClient.readChanges(body, options).get();`;
    }

    default: {
      return ``;
    }
  }
}

export function ReadChangesRequestViewer(opts: ReadChangesRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
    SupportedLanguage.CLI,
    SupportedLanguage.CURL,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ReadChangesRequestViewerOpts>(allowedLanguages, opts, readChangesRequestViewer);
}
