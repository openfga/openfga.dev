/**
 * TupleViewer — displays OpenFGA relationship tuples in a styled code block.
 *
 * - Renders tuples with column-aligned keys in italic muted color.
 * - Exposes CSS hook classes so shared styles can control the block surface, keys, copy button, and responsive layout.
 * - Copy button writes valid YAML list format to the clipboard.
 * - Optional `rightColumnTuples` renders two columns via CSS grid with a mobile fallback.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePrismTheme } from '@docusaurus/theme-common';
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

type CopyStatus = 'idle' | 'success' | 'error';

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
    <div>
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
          <div style={{ paddingLeft: '2ch' }}>
            <div>
              <Key name="name" pad={INNER_PAD} /> : {tuple.condition.name}
            </div>
            {contextEntries.length > 0 && (
              <>
                <div>
                  <Key name="context" pad={INNER_PAD} /> :
                </div>
                <div style={{ paddingLeft: '2ch' }}>
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
      {tuples.map((tuple, index) => {
        const baseKey = getTupleKey(tuple);
        const count = seenTuples.get(baseKey) ?? 0;
        seenTuples.set(baseKey, count + 1);
        const tupleKey = count === 0 ? baseKey : `${baseKey}:${count}`;

        return (
          <React.Fragment key={tupleKey}>
            {index > 0 && <div style={{ height: '1em' }} />}
            <TupleBlock tuple={tuple} />
          </React.Fragment>
        );
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

function CopyButton({ text }: { text: string }): JSX.Element {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const canCopy = typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function';

  const resetStatus = useCallback(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setStatus('idle'), 2000);
  }, []);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const handleCopy = useCallback(() => {
    if (!canCopy) {
      setStatus('error');
      resetStatus();
      return;
    }

    void navigator.clipboard
      .writeText(text)
      .then(() => {
        setStatus('success');
        resetStatus();
      })
      .catch(() => {
        setStatus('error');
        resetStatus();
      });
  }, [canCopy, resetStatus, text]);

  return (
    <button
      type="button"
      aria-label="Copy YAML to clipboard"
      title={canCopy ? 'Copy YAML' : 'Clipboard unavailable'}
      onClick={handleCopy}
      className="clean-btn tuple-viewer__copy-button"
      disabled={!canCopy}
      style={{
        position: 'absolute',
        top: 'calc(var(--ifm-pre-padding) / 2)',
        right: 'calc(var(--ifm-pre-padding) / 2)',
        background: 'none',
        border: 'none',
        color: status === 'error' ? 'var(--ifm-color-danger)' : undefined,
        cursor: canCopy ? 'pointer' : 'not-allowed',
        padding: 4,
        borderRadius: 'var(--ifm-global-radius)',
        opacity: status === 'idle' ? undefined : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {status === 'success' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ifm-color-success)" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : status === 'error' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18" />
          <path d="M6 6L18 18" />
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
            <div>
              <TupleList tuples={tuples} />
            </div>
            <div>
              <TupleList tuples={rightColumnTuples} />
            </div>
          </div>
        ) : (
          <TupleList tuples={tuples} />
        )}
      </div>
      <CopyButton text={yaml} />
    </div>
  );
}
