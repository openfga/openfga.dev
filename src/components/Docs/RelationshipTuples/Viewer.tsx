import React from 'react';
import CodeBlock from '@theme/CodeBlock';

interface RelationshipTuple {
  user: string;
  relation: string;
  object: string;
  _description?: string; // Optional comment describing what this tuple represents
}

interface RelationshipTuplesViewerOpts {
  relationshipTuples: RelationshipTuple[];
}

enum RelationshipTuplesLang {
  JSON = 'json',
}

function relationshipTuplesViewer(lang: RelationshipTuplesLang, opts: RelationshipTuplesViewerOpts) {
  switch (lang) {
    case RelationshipTuplesLang.JSON:
    default:
      return `[${opts.relationshipTuples
        .map(
          ({ user, relation, object, _description }) => `
  ${_description ? `// ${_description}\n  ` : ''}{
    "user": "${user}",
    "relation": "${relation}",
    "object": "${object}",
  },`,
        )
        .join('')}
]`;
  }
}

export function RelationshipTuplesViewer(opts: RelationshipTuplesViewerOpts): JSX.Element {
  return (
    <>
      <CodeBlock className="language-json">{relationshipTuplesViewer(RelationshipTuplesLang.JSON, opts)}</CodeBlock>
    </>
  );
}
