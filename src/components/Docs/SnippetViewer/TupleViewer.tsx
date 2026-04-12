/**
 * TupleViewer — displays OpenFGA relationship tuples in a styled code block.
 *
 * - Renders tuples with column-aligned keys in italic muted color.
 * - Matches the site's code block styling (background from global `pre` CSS rule,
 *   text color from the Prism theme, padding/radius from Infima variables).
 * - Copy button writes valid YAML list format to the clipboard.
 * - Optional `rightColumnTuples` renders two columns via CSS grid in a single block.
 */
import React, { useCallback, useRef, useState } from 'react';
import { usePrismTheme } from '@docusaurus/theme-common';

interface Tuple {
  user: string;
  relation: string;
  object: string;
  condition?: {
    name: string;
    context: Record<string, string>;
  };
}

interface TupleViewerProps {
  tuples: Tuple[];
  rightColumnTuples?: Tuple[];
}

// Keys are padded so values start at the same column.
const PAD = 'condition'.length;
const INNER_PAD = 'context'.length;

const keyStyle: React.CSSProperties = { color: 'rgb(170, 170, 170)', fontStyle: 'italic' };

function Key({ name, pad }: { name: string; pad: number }): JSX.Element {
  return <span style={keyStyle}>{name.padEnd(pad)}</span>;
}

function TupleBlock({ tuple }: { tuple: Tuple }): JSX.Element {
  return (
    <div>
      <div><Key name="user" pad={PAD} /> : {tuple.user}</div>
      <div><Key name="relation" pad={PAD} /> : {tuple.relation}</div>
      <div><Key name="object" pad={PAD} /> : {tuple.object}</div>
      {tuple.condition && (
        <>
          <div><Key name="condition" pad={PAD} /> :</div>
          <div style={{ paddingLeft: '2ch' }}>
            <div><Key name="name" pad={INNER_PAD} /> : {tuple.condition.name}</div>
            <div><Key name="context" pad={INNER_PAD} /> :</div>
            <div style={{ paddingLeft: '2ch' }}>
              {Object.entries(tuple.condition.context).map(([k, v]) => (
                <div key={k}><Key name={k} pad={0} /> : {v}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TupleList({ tuples }: { tuples: Tuple[] }): JSX.Element {
  return (
    <>
      {tuples.map((tuple, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div style={{ height: '1em' }} />}
          <TupleBlock tuple={tuple} />
        </React.Fragment>
      ))}
    </>
  );
}

function formatYaml(tuple: Tuple): string {
  const lines = [
    `- user: ${tuple.user}`,
    `  relation: ${tuple.relation}`,
    `  object: ${tuple.object}`,
  ];
  if (tuple.condition) {
    lines.push(`  condition:`);
    lines.push(`    name: ${tuple.condition.name}`);
    lines.push(`    context:`);
    for (const [k, v] of Object.entries(tuple.condition.context)) {
      lines.push(`      ${k}: "${v}"`);
    }
  }
  return lines.join('\n');
}

function CopyButton({ text }: { text: string }): JSX.Element {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      type="button"
      aria-label="Copy YAML to clipboard"
      title="Copy"
      onClick={handleCopy}
      className="clean-btn"
      style={{
        position: 'absolute',
        top: 'calc(var(--ifm-pre-padding) / 2)',
        right: 'calc(var(--ifm-pre-padding) / 2)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
        borderRadius: 'var(--ifm-global-radius)',
        opacity: copied ? 1 : 0.4,
        transition: 'opacity 0.2s',
      }}
    >
      {copied ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ifm-color-success)" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}

export function TupleViewer({ tuples, rightColumnTuples }: TupleViewerProps): JSX.Element {
  const { plain } = usePrismTheme();
  const allTuples = rightColumnTuples ? [...tuples, ...rightColumnTuples] : tuples;
  const yaml = allTuples.map(formatYaml).join('\n');

  const content = rightColumnTuples ? (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2ch' }}>
      <div><TupleList tuples={tuples} /></div>
      <div><TupleList tuples={rightColumnTuples} /></div>
    </div>
  ) : (
    <TupleList tuples={tuples} />
  );

  return (
    <div className="theme-code-block" style={{ position: 'relative', marginBottom: 'var(--ifm-leading)' }}>
      <pre style={{
        color: plain.color,
        margin: 0,
        padding: 'var(--ifm-pre-padding)',
        borderRadius: 'var(--ifm-code-border-radius)',
        fontSize: 'var(--ifm-code-font-size)',
        lineHeight: 'var(--ifm-pre-line-height)',
        overflow: 'auto',
      }}>
        <code>{content}</code>
      </pre>
      <CopyButton text={yaml} />
    </div>
  );
}
