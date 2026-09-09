// GENERATED FILE - DO NOT EDIT.
// Source: @openfga/frontend-utils@0.2.0-beta.11
// Grammar: tools.PrismExtensions.languageDefinition
// Theme: theming.supportedThemes["openfga-dark"]
// Regenerate: npm run generate:mintlify-codegen
(function () {
  'use strict';

  var GRAMMAR = [
  {
    "name": "module",
    "pattern": {
      "source": "(module\\s+)[\\w_-]+",
      "flags": "i"
    },
    "lookbehind": true,
    "inside": null
  },
  {
    "name": "type",
    "pattern": {
      "source": "(\\btype\\s+)[\\w_-]+",
      "flags": "i"
    },
    "lookbehind": true,
    "inside": null
  },
  {
    "name": "extend",
    "pattern": {
      "source": "(\\bextend type\\s+)[\\w_-]+",
      "flags": "i"
    },
    "lookbehind": true,
    "inside": null
  },
  {
    "name": "relation",
    "pattern": {
      "source": "(\\bdefine\\s+)[\\w_-]+",
      "flags": "i"
    },
    "lookbehind": true,
    "inside": null
  },
  {
    "name": "directly-assignable",
    "pattern": {
      "source": "\\[.*]|self",
      "flags": ""
    },
    "lookbehind": false,
    "inside": null
  },
  {
    "name": "condition",
    "pattern": {
      "source": "(\\bcondition\\s+)[\\w_-]+",
      "flags": "i"
    },
    "lookbehind": true,
    "inside": null
  },
  {
    "name": "condition-params",
    "pattern": {
      "source": "\\(.*\\)\\s*{",
      "flags": ""
    },
    "lookbehind": false,
    "inside": [
      {
        "name": "condition-param",
        "pattern": {
          "source": "\\b([\\w_-]+)\\s*:",
          "flags": "i"
        },
        "lookbehind": false,
        "inside": null
      },
      {
        "name": "condition-param-type",
        "pattern": {
          "source": "\\b(string|int|map|uint|list|timestamp|bool|duration|double|ipaddress)\\b",
          "flags": ""
        },
        "lookbehind": false,
        "inside": null
      }
    ]
  },
  {
    "name": "comment",
    "pattern": {
      "source": "(^\\s*|\\s+)#.*",
      "flags": ""
    },
    "lookbehind": false,
    "inside": null
  },
  {
    "name": "keyword",
    "pattern": {
      "source": "\\b(type|relations|define|and|or|but not|from|as|model|schema|condition|module|extend)\\b",
      "flags": ""
    },
    "lookbehind": false,
    "inside": null
  }
];
  var TOKEN_COLORS = {
  "default": "#FFFFFF",
  "comment": "#737981",
  "keyword": "#AAAAAA",
  "module": "#79ED83",
  "extend": "#79ED83",
  "type": "#79ED83",
  "relation": "#20F1F5",
  "directly-assignable": "#CEEC93",
  "condition": "#79ED83",
  "condition-param": "#20F1F5",
  "condition-param-type": "#AAAAAA"
};
  var COLORS = {
  "green": "#79ED83",
  "cyan": "#20F1F5",
  "lightGreen": "#CEEC93",
  "grey": "#AAAAAA",
  "comment": "#737981",
  "default": "#FFFFFF",
  "background": "#141517"
};

  function compileGrammar(rules) {
    return rules.map(function (rule) {
      return {
        name: rule.name,
        pattern: new RegExp(rule.pattern.source, rule.pattern.flags),
        lookbehind: rule.lookbehind,
        inside: rule.inside ? compileGrammar(rule.inside) : null,
      };
    });
  }

  function tokenizeGrammar(text, grammar) {
    var nodes = [text];

    grammar.forEach(function (rule) {
      for (var index = 0; index < nodes.length;) {
        if (nodes.length > text.length) return nodes;
        var node = nodes[index];
        if (typeof node !== 'string') {
          index += 1;
          continue;
        }

        rule.pattern.lastIndex = 0;
        var match = rule.pattern.exec(node);
        if (!match) {
          index += 1;
          continue;
        }

        var lookbehindLength = rule.lookbehind && match[1] ? match[1].length : 0;
        var start = match.index + lookbehindLength;
        var tokenText = match[0].slice(lookbehindLength);
        var before = node.slice(0, start);
        var after = node.slice(start + tokenText.length);
        var replacement = [];

        if (before) replacement.push(before);
        replacement.push({
          type: rule.name,
          content: rule.inside ? tokenizeGrammar(tokenText, rule.inside) : tokenText,
        });
        if (after) replacement.push(after);

        nodes.splice.apply(nodes, [index, 1].concat(replacement));
        index += (before ? 1 : 0) + 1;
      }
    });

    return nodes;
  }

  function flatten(nodes, inheritedType, output) {
    nodes.forEach(function (node) {
      if (typeof node === 'string') {
        if (!node) return;
        var color = inheritedType ? TOKEN_COLORS[inheritedType] : undefined;
        output.push(color ? { text: node, color: color } : { text: node });
        return;
      }

      var tokenType = TOKEN_COLORS[node.type] ? node.type : inheritedType;
      var content = typeof node.content === 'string' ? [node.content] : node.content;
      flatten(content, tokenType, output);
    });
  }

  var compiledGrammar = compileGrammar(GRAMMAR);

  function tokenize(text) {
    if (typeof text !== 'string') {
      throw new TypeError('window.openfgaDsl.tokenize expects a string');
    }
    var output = [];
    flatten(tokenizeGrammar(text, compiledGrammar), null, output);
    return output;
  }

  window.openfgaDsl = { tokenize: tokenize, colors: COLORS };
})();
