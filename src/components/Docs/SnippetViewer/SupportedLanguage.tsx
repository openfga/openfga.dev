export enum SupportedLanguage {
  JS_SDK = 'js-sdk',
  GO_SDK = 'go-sdk',
  DOTNET_SDK = 'dotnet-sdk',
  PYTHON_SDK = 'python-sdk',
  CURL = 'curl',
  RPC = 'rpc',
  PLAYGROUND = 'playground',
}

export const languageLabelMap: Map<SupportedLanguage, string> = new Map([
  [SupportedLanguage.JS_SDK, 'Node.js'],
  [SupportedLanguage.GO_SDK, 'Go'],
  [SupportedLanguage.DOTNET_SDK, '.NET'],
  [SupportedLanguage.PYTHON_SDK, 'Python'],
  [SupportedLanguage.CURL, 'curl'],
  [SupportedLanguage.RPC, 'Pseudocode'],
  [SupportedLanguage.PLAYGROUND, 'Playground'],
]);

export const languageCodeMap: Map<SupportedLanguage, string> = new Map([
  [SupportedLanguage.JS_SDK, 'javascript'],
  [SupportedLanguage.GO_SDK, 'go'],
  [SupportedLanguage.DOTNET_SDK, 'dotnet'],
  [SupportedLanguage.PYTHON_SDK, 'python'],
  [SupportedLanguage.CURL, 'shell'],
  [SupportedLanguage.RPC, 'shell'],
  [SupportedLanguage.PLAYGROUND, 'shell'],
]);

/**
 * This takes a list of languages, and a superset of all languages
 * If both lists are defined, it returns the intersection
 * If only one list is defined, it returns it as is
 * If non is defined - it returns an empty array
 *
 * @param {SupportedLanguage[]} [languages]
 * @param {SupportedLanguage[]} [allLanguages]
 */
export const getFilteredAllowedLangs = (languages?: SupportedLanguage[], allLanguages?: SupportedLanguage[]) =>
  languages ? (allLanguages ? languages.filter((lang) => allLanguages.includes(lang)) : languages) : allLanguages || [];

/**
 * This returns an array of the language codes along with their labels
 * @param opt
 * @param opt.allowedLanguages
 */
export function getAllowedValuesLabels(opt: {
  allowedLanguages: SupportedLanguage[];
}): { label?: string; value: SupportedLanguage }[] {
  const { allowedLanguages } = opt;

  return allowedLanguages.map((item) => {
    return { label: languageLabelMap.get(item), value: item };
  });
}

export interface LanguageMapping {
  importStatement: string;
  apiName: string;
  setupNote: string;
}

export interface LanguageMappings {
  [key: string]: LanguageMapping;
}
