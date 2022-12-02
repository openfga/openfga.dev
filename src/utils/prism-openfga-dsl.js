import { Prism } from 'prism-react-renderer';
import { syntaxHighlighters } from '@openfga/syntax-transformer';
import { OpenFgaDslThemeTokenType } from '@openfga/syntax-transformer/dist/theme';

const languageDef = {
  ...syntaxHighlighters.PrismExtensions.languageDefinition,
  [OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE]: /\[.*\]|self/,
};

Prism.languages[syntaxHighlighters.PrismExtensions.LANGUAGE_NAME] = languageDef;
