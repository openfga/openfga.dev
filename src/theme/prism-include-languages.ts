import siteConfig from '@generated/docusaurus.config';
import type * as PrismNamespace from 'prismjs';
import { tools, theming } from '@openfga/frontend-utils';

const { OpenFgaDslThemeTokenType } = theming;

const { PrismExtensions } = tools;

const languageDefinition = {
  ...PrismExtensions.languageDefinition,
  [OpenFgaDslThemeTokenType.KEYWORD]:
    /\b(type|relations|define|and|or|but not|from|as|model|schema|condition|module|extend)\b/,
  condition: {
    pattern: /(\bcondition\s+)\w+/i,
    lookbehind: true,
    greedy: true,
  },
  'condition-params': {
    pattern: /\(.*\)\s*{/,
    inside: {
      'condition-param': /\b(\w+)\s*:/i,
      'condition-param-type': /\b(string|int|map|uint|list|timestamp|bool|duration|double|ipaddress)\b/,
    },
  },
};

export default function prismIncludeLanguages(PrismObject: typeof PrismNamespace): void {
  const {
    themeConfig: { prism },
  } = siteConfig;
  const { additionalLanguages } = prism as { additionalLanguages: string[] };

  // Prism components work on the Prism instance on the window, while prism-
  // react-renderer uses its own Prism instance. We temporarily mount the
  // instance onto window, import components to enhance it, then remove it to
  // avoid polluting global namespace.
  // You can mutate PrismObject: registering plugins, deleting languages... As
  // long as you don't re-assign it
  globalThis.Prism = PrismObject;

  additionalLanguages.forEach((lang) => {
    require(`prismjs/components/prism-${lang}`);
  });

  PrismObject.languages[PrismExtensions.LANGUAGE_NAME] = languageDefinition;

  delete (globalThis as unknown as Global & { Prism?: typeof PrismNamespace }).Prism;
}
