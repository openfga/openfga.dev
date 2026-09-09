#!/usr/bin/env bash
# Generates or checks both committed standalone Mintlify browser artifacts.
# - fga-codegen.js bundles the installed @openfga/syntax-transformer and exposes
#   window.fgaCodegen for AuthzModelSnippetViewer.
# - openfga-dsl-highlight.js bundles installed official Prism core with the
#   @openfga/frontend-utils grammar/theme and exposes window.openfgaDsl for
#   AuthzModelSnippetViewer and OpenFGACodeBlock.
#
# These files are committed because Mintlify snippets cannot import npm packages
# at runtime; Mintlify serves the standalone artifacts to the browser snippets.
# Source versions come from the lockfile-installed packages, not this script.
#
# From the repository root:
#   npm ci
#   npm run generate:mintlify-codegen
# Verify with npm run check:mintlify-codegen or this script's --check option.
# See mintlify-native/README.md for architecture and maintenance details.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

if [[ "${1:-}" != "" && "${1:-}" != "--check" ]]; then
  echo "Usage: $0 [--check]" >&2
  exit 2
fi

CHECK_ONLY=false
if [[ "${1:-}" == "--check" ]]; then
  CHECK_ONLY=true
fi

if [[ ! -x node_modules/.bin/esbuild ]]; then
  echo "Missing local esbuild. Run npm ci before generating Mintlify codegen artifacts." >&2
  exit 1
fi

TMP_DIR="$(mktemp -d "$REPO_ROOT/mintlify-native/.codegen.XXXXXX")"
trap 'rm -rf "$TMP_DIR"' EXIT

SYNTAX_TRANSFORMER_VERSION="$(node -p "require('@openfga/syntax-transformer/package.json').version")"
FRONTEND_UTILS_VERSION="$(node -p "require('@openfga/frontend-utils/package.json').version")"
PRISM_VERSION="$(node -p "require('prismjs/package.json').version")"
HIGHLIGHT_BANNER="// GENERATED FILE - DO NOT EDIT. Sources: prismjs@$PRISM_VERSION and @openfga/frontend-utils@$FRONTEND_UTILS_VERSION. Regenerate: npm run generate:mintlify-codegen"
HIGHLIGHT_BANNER+=$'\n/* eslint-disable */'

cat > "$TMP_DIR/fga-codegen-entry.js" << 'EOF'
import { transformer } from '@openfga/syntax-transformer';
window.fgaCodegen = { transformer };
EOF

cat > "$TMP_DIR/crypto-browser-shim.cjs" << 'EOF'
module.exports = {
  randomUUID: function() { return globalThis.crypto.randomUUID(); },
  getRandomValues: function(buf) { return globalThis.crypto.getRandomValues(buf); },
};
EOF

echo "Building fga-codegen.js from @openfga/syntax-transformer@$SYNTAX_TRANSFORMER_VERSION ..."
NODE_PATH="$REPO_ROOT/node_modules" node_modules/.bin/esbuild "$TMP_DIR/fga-codegen-entry.js" \
  --bundle \
  --format=iife \
  --platform=browser \
  --minify \
  --alias:crypto="$TMP_DIR/crypto-browser-shim.cjs" \
  "--banner:js=// GENERATED FILE - DO NOT EDIT. Source: @openfga/syntax-transformer@$SYNTAX_TRANSFORMER_VERSION. Regenerate: npm run generate:mintlify-codegen" \
  --outfile="$TMP_DIR/fga-codegen.js"

echo "Building openfga-dsl-highlight.js from prismjs@$PRISM_VERSION and @openfga/frontend-utils@$FRONTEND_UTILS_VERSION ..."
NODE_PATH="$REPO_ROOT/node_modules" node_modules/.bin/esbuild \
  mintlify-native/scripts/openfga-dsl-highlight.entry.cjs \
  --bundle \
  --format=iife \
  --platform=browser \
  --target=es2020 \
  --minify \
  --define:document=undefined \
  --define:global=undefined \
  --legal-comments=eof \
  "--banner:js=$HIGHLIGHT_BANNER" \
  --outfile="$TMP_DIR/openfga-dsl-highlight.js"

if [[ "$CHECK_ONLY" == true ]]; then
  STALE=0
  for artifact in fga-codegen.js openfga-dsl-highlight.js; do
    if ! cmp -s "$TMP_DIR/$artifact" "mintlify-native/$artifact"; then
      echo "mintlify-native/$artifact is stale; run npm run generate:mintlify-codegen" >&2
      STALE=1
    fi
  done
  if [[ "$STALE" -ne 0 ]]; then
    exit 1
  fi
  echo "Mintlify codegen artifacts are current."
  exit 0
fi

mv "$TMP_DIR/fga-codegen.js" mintlify-native/fga-codegen.js
mv "$TMP_DIR/openfga-dsl-highlight.js" mintlify-native/openfga-dsl-highlight.js

FGA_SIZE="$(wc -c < mintlify-native/fga-codegen.js)"
HIGHLIGHT_SIZE="$(wc -c < mintlify-native/openfga-dsl-highlight.js)"
echo "Generated mintlify-native/fga-codegen.js: $(( FGA_SIZE / 1024 ))KB"
echo "Generated mintlify-native/openfga-dsl-highlight.js: $(( HIGHLIGHT_SIZE / 1024 ))KB"
