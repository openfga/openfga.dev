import siteConfig from '@generated/docusaurus.config';
import type * as PrismNamespace from 'prismjs';
import { syntaxHighlighters } from '@openfga/syntax-transformer';
import { OpenFgaDslThemeTokenType } from '@openfga/syntax-transformer/dist/theme';

const languageDefinition = {
  ...syntaxHighlighters.PrismExtensions.languageDefinition,
  [OpenFgaDslThemeTokenType.TYPE]: {
    ...syntaxHighlighters.PrismExtensions.languageDefinition[OpenFgaDslThemeTokenType.TYPE],
    greedy: true,
  },
  [OpenFgaDslThemeTokenType.RELATION]: {
    ...syntaxHighlighters.PrismExtensions.languageDefinition[OpenFgaDslThemeTokenType.RELATION],
    greedy: true,
  },
  [OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE]: /\[.*]|self/,
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

  PrismObject.languages[syntaxHighlighters.PrismExtensions.LANGUAGE_NAME] = languageDefinition;

  delete (globalThis as unknown as Global & { Prism?: typeof PrismNamespace }).Prism;
}
