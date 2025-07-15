import siteConfig from '@generated/docusaurus.config';
import type * as PrismNamespace from 'prismjs';
import { tools } from '@openfga/frontend-utils';

const { PrismExtensions } = tools;

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
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require(`prismjs/components/prism-${lang}`);
  });

  PrismObject.languages[PrismExtensions.LANGUAGE_NAME] = PrismExtensions.languageDefinition;

  delete (globalThis as typeof globalThis & { Prism?: typeof PrismNamespace }).Prism;
}
