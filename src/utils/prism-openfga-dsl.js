import { Prism } from 'prism-react-renderer';

const languageDef = {
  comment: {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: true,
    greedy: true,
  },
  'fga-type': /^(type|relations|define)\b/m,
  'fga-definition': /\b(relations|define)\b/m,
  'fga-keyword': /\b(?:as)\b/,
  'fga-operator': /\b(?:and|or|but\snot)\b/,
  'fga-self': /\bself\b/,
  'fga-tuple-to-userset': /\bfrom\b/,
};

Prism.languages['openfga-dsl'] = languageDef;
Prism.languages.dsl = languageDef;

console.log('PROISM', Prism);
