import { getFilteredAllowedLangs, SupportedLanguage, DefaultAuthorizationModelId } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';
import { TupleKey } from '@openfga/sdk';

interface Check {
  user: string;
  relation: string;
  object: string;
  correlation_id: string;
  allowed: boolean;
  contextualTuples?: TupleKey[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
}
interface BatchCheckRequestViewerOpts {
  authorizationModelId?: string;
  checks: Check[];
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function batchCheckRequestViewer(lang: SupportedLanguage, opts: BatchCheckRequestViewerOpts): string {
  const { checks } = opts;
  const modelId = opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId;

  switch (lang) {
    case SupportedLanguage.CURL: {
      /* eslint-disable max-len */
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/batch-check \\
-H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
-H "content-type: application/json" \\
-d '{
  "authorization_model_id": "${modelId}", 
  "checks": [
  ${checks
    .map(
      (check) => `  {
      "tuple_key": {
        "user":"${check.user}",
        "relation":"${check.relation}",
        "object":"${check.object}",
      },
      "correlation_id": "${check.correlation_id}"${
        check.contextualTuples
          ? `,"contextual_tuples":{"tuple_keys":[${check.contextualTuples
              .map((tuple) => `{"user":"${tuple.user}","relation":"${tuple.relation}","object":"${tuple.object}"}`)
              .join(',')}]}`
          : ''
      }${check.context ? `,"context":${JSON.stringify(check.context)}}` : ''}
    },
  `,
    )
    .join('')}

# Response: 
{
  "results": {
    ${checks
      .map(
        (check) => `{ "${check.correlation_id}": { "allowed":${check.allowed} }}, # ${check.relation}
    `,
      )
      .join('')}
  }
}`;
    }

    default:
      assertNever(lang);
  }
  /* eslint-enable no-tabs */
}

export function BatchCheckRequestViewer(opts: BatchCheckRequestViewerOpts): JSX.Element {
  const defaultLangs = [SupportedLanguage.CURL];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<BatchCheckRequestViewerOpts>(allowedLanguages, opts, batchCheckRequestViewer);
}
