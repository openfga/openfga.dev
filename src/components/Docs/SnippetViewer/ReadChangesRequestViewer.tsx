import { getFilteredAllowedLangs, SupportedLanguage, LanguageMappings } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';

interface ReadChangesRequestViewerOpts {
  type: string;
  pageSize: number;
  continuationToken: string;
  allowedLanguages?: SupportedLanguage[];
  skipSetup?: boolean;
}

function readChangesRequestViewer(
  lang: SupportedLanguage,
  opts: ReadChangesRequestViewerOpts,
  languageMappings: LanguageMappings,
) {
  switch (lang) {
    case SupportedLanguage.CURL: {
      const typeString = `${opts.type ? '"type": ' + opts.type + '", ' : ''}`;
      // eslint-disable-next-line max-len
      const tokenString = `${opts.continuationToken ? '"continuation_token": "' + opts.continuationToken + '", ' : ''}`;
      // eslint-disable-next-line max-len
      const pageSizeString = `${opts.pageSize ? '"page_size": ' + opts.pageSize : ''}`;
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/changes \\
  -H "Authorization: Bearer $FGA_BEARER_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{${typeString}${tokenString}${pageSizeString}}'`;
    }

    case SupportedLanguage.JS_SDK: {
      const typeString = `${'var type = "' + (opts.type ? opts.type : '') + '";\n'}`;
      const tokenString = `${
        'var continuationToken = "' + (opts.continuationToken ? opts.continuationToken : '') + '";\n'
      }`;
      // eslint-disable-next-line max-len
      const pageSizeString = `${'var pageSize = ' + (opts.pageSize ? opts.pageSize : '') + ';\n'}`;
      return `${typeString}${tokenString}${pageSizeString}
await fgaClient.readChanges(type, pageSize, continuationToken);`;
    }

    case SupportedLanguage.GO_SDK: {
      // eslint-disable-next-line max-len
      return `data, response, err := fgaClient.${languageMappings['go'].apiName}.ReadChanges(context.Background()).${
        opts.type ? `\n\tType_("${opts.type}").` : ''
      }${opts.pageSize ? `\n\tPageSize(${opts.pageSize}).` : ''}${
        opts.continuationToken ? `\n\tContinuationToken("${opts.continuationToken}").` : ''
      }
\tExecute()

if err != nil {
    // .. Handle error
}`;
    }

    case SupportedLanguage.DOTNET_SDK: {
      const typeString = `${'var type = "' + (opts.type ? opts.type : '') + '";\n'}`;
      const tokenString = `${
        'var continuationToken = "' + (opts.continuationToken ? opts.continuationToken : '') + '";\n'
      }`;
      // eslint-disable-next-line max-len
      const pageSizeString = `${'var pageSize = ' + (opts.pageSize ? opts.pageSize : '') + ';\n'}`;
      return `${typeString}${tokenString}${pageSizeString}
await fgaClient.ReadChanges(type, pageSize, continuationToken);`;
    }

    case SupportedLanguage.PYTHON_SDK: {
      return `
async def read_changes():
    response = await fga_client_instance.read_changes(${
      opts.type
        ? `
        type="${opts.type}",`
        : ``
    }${
        opts.pageSize
          ? `
        page_size="${opts.pageSize}",`
          : ``
      }${
        opts.continuationToken
          ? `
        continuation_token="${opts.continuationToken}",`
          : ``
      }
    )`;
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
    SupportedLanguage.CURL,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ReadChangesRequestViewerOpts>(allowedLanguages, opts, readChangesRequestViewer);
}
