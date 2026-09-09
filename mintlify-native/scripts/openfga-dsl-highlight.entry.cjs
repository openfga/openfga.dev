/* global window */

const { languageDefinition } = require('@openfga/frontend-utils/dist/tools/prism/language-definition.js');
const { openfgaDark } = require('@openfga/frontend-utils/dist/theme/supported-themes/openfga-dark.js');

let Prism;
const previousPrism = window.Prism;
try {
  window.Prism = { manual: true, disableWorkerMessageHandler: true };
  Prism = require('prismjs/components/prism-core.js');
} finally {
  if (previousPrism === undefined) {
    delete window.Prism;
  } else {
    window.Prism = previousPrism;
  }
}

const colors = {
  green: openfgaDark.colors.type,
  cyan: openfgaDark.colors.relation,
  lightGreen: openfgaDark.colors['directly-assignable'],
  grey: openfgaDark.colors.keyword,
  comment: openfgaDark.colors.comment,
  default: openfgaDark.colors.default,
  background: openfgaDark.background.color,
};

function flatten(nodes, inheritedType, output) {
  for (const node of Array.isArray(nodes) ? nodes : [nodes]) {
    if (typeof node === 'string') {
      if (!node) continue;
      const color = inheritedType ? openfgaDark.colors[inheritedType] : undefined;
      output.push(color ? { text: node, color } : { text: node });
      continue;
    }

    const aliases = Array.isArray(node.alias) ? node.alias : node.alias ? [node.alias] : [];
    const tokenType =
      aliases.find((alias) => openfgaDark.colors[alias]) ?? (openfgaDark.colors[node.type] ? node.type : inheritedType);
    flatten(node.content, tokenType, output);
  }
  return output;
}

function tokenize(text) {
  if (typeof text !== 'string') {
    throw new TypeError('window.openfgaDsl.tokenize expects a string');
  }
  return flatten(Prism.tokenize(text, languageDefinition), null, []);
}

window.openfgaDsl = { tokenize, colors };
