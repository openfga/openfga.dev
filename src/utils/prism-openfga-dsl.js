import { Prism } from 'prism-react-renderer';

const languageDef = {
  comment: {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: true,
    greedy: true,
  },
  'fga-type': /^(type)\b/m,
  'fga-keyword': /\b(?:relations|define|as)\b/,
  'fga-operator': /\b(?:and|or|but\snot)\b/,
  'fga-self': /\bself\b/,
  'fga-tuple-to-userset': /\bfrom\b/,
};

Prism.languages['openfga-dsl'] = languageDef;
Prism.languages.dsl = languageDef;

console.log('PROISM', Prism);
