/**
 * TupleViewer — displays OpenFGA relationship tuples in a styled code block.
 *
 * - Renders tuples with column-aligned keys in italic muted color.
 * - Exposes CSS hook classes so shared styles can control the block surface, keys, copy button, and responsive layout.
 * - Copy button writes valid YAML list format to the clipboard.
 * - Optional `rightColumnTuples` renders two columns via CSS grid with a mobile fallback.
 */
import React, { useMemo, useRef } from 'react';
import { usePrismTheme } from '@docusaurus/theme-common';
import { CodeBlockContextProvider, createCodeBlockMetadata } from '@docusaurus/theme-common/internal';
import CopyButton from '@theme/CodeBlock/Buttons/CopyButton';
import type { RelationshipCondition } from '../RelationshipTuples/Viewer';

interface Tuple {
  user: string;
  relation: string;
  object: string;
  condition?: RelationshipCondition;
}

interface TupleViewerProps {
  tuples: Tuple[];
  rightColumnTuples?: Tuple[];
}

const PAD = 'condition'.length;
const INNER_PAD = 'context'.length;
const keyStyle: React.CSSProperties = { fontStyle: 'italic' };

function Key({ name, pad }: { name: string; pad: number }): JSX.Element {
  return (
    <span className="tuple-viewer__key" style={keyStyle}>
      {name.padEnd(pad)}
    </span>
  );
}

function formatDisplayValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function formatYamlValue(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value);
}

function getTupleKey(tuple: Tuple): string {
  return JSON.stringify([tuple.user, tuple.relation, tuple.object, tuple.condition ?? null]);
}

function TupleBlock({ tuple }: { tuple: Tuple }): JSX.Element {
  const contextEntries = Object.entries(tuple.condition?.context ?? {});

  return (
    <div className="tuple-viewer__tuple-block">
      <div>
        <Key name="user" pad={PAD} /> : {tuple.user}
      </div>
      <div>
        <Key name="relation" pad={PAD} /> : {tuple.relation}
      </div>
      <div>
        <Key name="object" pad={PAD} /> : {tuple.object}
      </div>
      {tuple.condition && (
        <>
          <div>
            <Key name="condition" pad={PAD} /> :
          </div>
          <div className="tuple-viewer__nested-block">
            <div>
              <Key name="name" pad={INNER_PAD} /> : {tuple.condition.name}
            </div>
            {contextEntries.length > 0 && (
              <>
                <div>
                  <Key name="context" pad={INNER_PAD} /> :
                </div>
                <div className="tuple-viewer__nested-block tuple-viewer__context-block">
                  {contextEntries.map(([key, value]) => (
                    <div key={key}>
                      <Key name={key} pad={0} /> : {formatDisplayValue(value)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function TupleList({ tuples }: { tuples: Tuple[] }): JSX.Element {
  const seenTuples = new Map<string, number>();

  return (
    <>
      {tuples.map((tuple) => {
        const baseKey = getTupleKey(tuple);
        const count = seenTuples.get(baseKey) ?? 0;
        seenTuples.set(baseKey, count + 1);
        const tupleKey = count === 0 ? baseKey : `${baseKey}:${count}`;

        return <TupleBlock key={tupleKey} tuple={tuple} />;
      })}
    </>
  );
}

function formatYaml(tuple: Tuple): string {
  const lines = [`- user: ${tuple.user}`, `  relation: ${tuple.relation}`, `  object: ${tuple.object}`];

  if (tuple.condition) {
    lines.push(`  condition:`);
    lines.push(`    name: ${tuple.condition.name}`);

    const contextEntries = Object.entries(tuple.condition.context ?? {});
    if (contextEntries.length > 0) {
      lines.push(`    context:`);
    }

    for (const [key, value] of contextEntries) {
      lines.push(`      ${key}: ${formatYamlValue(value)}`);
    }
  }

  return lines.join('\n');
}

function TupleViewerCopyButton({ text }: { text: string }): JSX.Element {
  const codeBlockRef = useRef<HTMLPreElement>(null);
  const metadata = useMemo(
    () =>
      createCodeBlockMetadata({
        code: text,
        className: 'language-yaml',
        language: 'yaml',
        defaultLanguage: undefined,
        metastring: undefined,
        magicComments: [],
        title: null,
        showLineNumbers: false,
      }),
    [text],
  );

  return (
    <CodeBlockContextProvider
      metadata={metadata}
      wordWrap={{
        codeBlockRef,
        isEnabled: false,
        isCodeScrollable: false,
        toggle: () => undefined,
      }}
    >
      <div className="tuple-viewer__button-group">
        <CopyButton className="tuple-viewer__copy-button" />
      </div>
    </CodeBlockContextProvider>
  );
}

export function TupleViewer({ tuples, rightColumnTuples }: TupleViewerProps): JSX.Element {
  const { plain } = usePrismTheme();
  const allTuples = rightColumnTuples ? [...tuples, ...rightColumnTuples] : tuples;
  const yaml = allTuples.map(formatYaml).join('\n');

  return (
    <div
      className="theme-code-block tuple-viewer"
      style={{
        position: 'relative',
        marginBottom: 'var(--ifm-leading)',
        color: plain.color,
        borderRadius: 'var(--ifm-code-border-radius)',
      }}
    >
      <div
        className="tuple-viewer__body"
        style={{
          padding: 'var(--ifm-pre-padding)',
          fontFamily: 'var(--ifm-font-family-monospace)',
          fontSize: 'var(--ifm-code-font-size)',
          lineHeight: 'var(--ifm-pre-line-height)',
          overflow: 'auto',
          whiteSpace: 'pre',
        }}
      >
        {rightColumnTuples ? (
          <div className="tuple-viewer__grid">
            <div className="tuple-viewer__column">
              <TupleList tuples={tuples} />
            </div>
            <div className="tuple-viewer__column tuple-viewer__column--secondary">
              <TupleList tuples={rightColumnTuples} />
            </div>
          </div>
        ) : (
          <TupleList tuples={tuples} />
        )}
      </div>
      <TupleViewerCopyButton text={yaml} />
    </div>
  );
}
