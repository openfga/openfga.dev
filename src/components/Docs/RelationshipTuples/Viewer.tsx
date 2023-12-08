import React from 'react';
import CodeBlock from '@theme/CodeBlock';

interface RelationshipTuple {
  user: string;
  relation: string;
  object: string;
  condition?: RelationshipCondition;
  _description?: string; // Optional comment describing what this tuple represents
}

export interface RelationshipCondition {
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
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
          (tuple) => `${tuple._description ? `// ${tuple._description}\n  ` : ''}${JSON.stringify(tuple, null, "  ")}`,
        )
        .join('')}]`;
  }
}

export function RelationshipTuplesViewer(opts: RelationshipTuplesViewerOpts): JSX.Element {
  return (
    <>
      <CodeBlock className="language-json">{relationshipTuplesViewer(RelationshipTuplesLang.JSON, opts)}</CodeBlock>
    </>
  );
}
