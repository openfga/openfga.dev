// Auto-loaded by Mintlify on every page (any .js file in the content
// directory is injected site-wide after hydration — see
// MINTLIFY-MIGRATION-STATUS.md, "DSL syntax highlighting").
//
// Ports the OpenFGA DSL Prism grammar from
// `@openfga/frontend-utils` (`tools.PrismExtensions.languageDefinition`,
// node_modules/@openfga/frontend-utils/dist/tools/prism/language-definition.js)
// and its color mapping (`openfga-dark` theme,
// dist/theme/supported-themes/openfga-dark.js) into a small standalone
// tokenizer. No Prism/ANTLR dependency needed — the grammar is ~10 regex
// rules, not the 484KB syntax-transformer (that package is only needed for
// JSON<->DSL codegen, a separate feature already handled by fga-codegen.js).
(function () {
  var COLORS = {
    green: '#79ED83', // module / type / extend-type / condition name
    cyan: '#20F1F5', // relation name (define) / condition param name
    lightGreen: '#CEEC93', // directly-assignable ([user], self)
    grey: '#AAAAAA', // keywords / condition param type
    comment: '#737981',
  };

  // Ordered by specificity: rules that capture just an identifier after a
  // keyword run first so the generic KEYWORD rule (last) only ever colors
  // the leftover keyword text itself, mirroring how Prism applies each
  // grammar rule over the remaining un-tokenized text in object order.
  var RULES = [
    { name: 'comment', re: /#[^\n]*/g, color: COLORS.comment, whole: true },
    { name: 'extendType', re: /\bextend\s+type\s+([\w-]+)\b/g, color: COLORS.green, group: 1 },
    { name: 'moduleDef', re: /\bmodule\s+([\w-]+)\b/g, color: COLORS.green, group: 1 },
    { name: 'typeDef', re: /\btype\s+([\w-]+)\b/g, color: COLORS.green, group: 1 },
    { name: 'defineRel', re: /\bdefine\s+([\w-]+)\b/g, color: COLORS.cyan, group: 1 },
    { name: 'conditionDef', re: /\bcondition\s+([\w-]+)\b/g, color: COLORS.green, group: 1 },
    {
      name: 'conditionParamPair',
      re: /\b([\w-]+)\s*:\s*(string|int|uint|list|map|timestamp|bool|duration|double|ipaddress)\b/g,
      pair: [COLORS.cyan, COLORS.grey],
    },
    { name: 'directlyAssignable', re: /\[[^\]\n]*\]|\bself\b/g, color: COLORS.lightGreen, whole: true },
    {
      name: 'keyword',
      re: /\b(type|relations|define|and|or|but not|from|as|model|schema|condition|module|extend)\b/g,
      color: COLORS.grey,
      whole: true,
    },
  ];

  function overlaps(claims, start, end) {
    for (var i = 0; i < claims.length; i++) {
      if (start < claims[i].end && end > claims[i].start) return true;
    }
    return false;
  }

  function tokenize(text) {
    var claims = [];
    var commentSpans = [];

    RULES.forEach(function (rule) {
      var re = new RegExp(rule.re.source, rule.re.flags);
      var m;
      while ((m = re.exec(text))) {
        var start = m.index;
        var end = start + m[0].length;

        if (rule.name !== 'comment' && commentSpans.some(function (c) { return start >= c.start && start < c.end; })) {
          continue;
        }

        if (rule.whole) {
          if (!overlaps(claims, start, end)) {
            claims.push({ start: start, end: end, color: rule.color });
          }
        } else if (rule.pair) {
          var nameStart = start;
          var nameEnd = nameStart + m[1].length;
          var typeEnd = end;
          var typeStart = typeEnd - m[2].length;
          if (!overlaps(claims, nameStart, nameEnd)) claims.push({ start: nameStart, end: nameEnd, color: rule.pair[0] });
          if (!overlaps(claims, typeStart, typeEnd)) claims.push({ start: typeStart, end: typeEnd, color: rule.pair[1] });
        } else {
          var idLen = m[rule.group].length;
          var idStart = start + m[0].length - idLen;
          var idEnd = idStart + idLen;
          if (!overlaps(claims, idStart, idEnd)) claims.push({ start: idStart, end: idEnd, color: rule.color });
        }

        if (rule.name === 'comment') commentSpans.push({ start: start, end: end });
      }
    });

    claims.sort(function (a, b) { return a.start - b.start; });

    var out = [];
    var cursor = 0;
    claims.forEach(function (c) {
      if (c.start > cursor) out.push({ text: text.slice(cursor, c.start) });
      out.push({ text: text.slice(c.start, c.end), color: c.color });
      cursor = c.end;
    });
    if (cursor < text.length) out.push({ text: text.slice(cursor) });

    return out;
  }

  window.openfgaDsl = { tokenize: tokenize, colors: COLORS };
})();
