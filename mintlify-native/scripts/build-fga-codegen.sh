#!/usr/bin/env bash
# Rebuilds mintlify-native/fga-codegen.js — the pre-bundled browser global that
# exposes window.fgaCodegen = { transformer } for use by AuthzModelSnippetViewer.jsx.
#
# Built from: @openfga/syntax-transformer@0.2.1
# Run from:   repo root (openfga.dev/)
#
# Why committed: Mintlify snippets cannot import npm packages at runtime.
# The transformer bundle is served as a static file and loaded via a self-injecting
# <script> tag in AuthzModelSnippetViewer.jsx. See mintlify-native/README.md for
# the full architecture explanation.
#
# To rebuild after upgrading @openfga/syntax-transformer:
#   1. npm install (or yarn) to pick up the new version
#   2. Run this script
#   3. Commit the updated fga-codegen.js with the new version in this comment

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

# Entry point: import the transformer and expose it as a window global
cat > /tmp/fga-codegen-entry.js << 'EOF'
import { transformer } from '@openfga/syntax-transformer';
window.fgaCodegen = { transformer };
EOF

# Crypto shim: @openfga/sdk (a transitive dep) calls require("crypto") which
# doesn't exist in browsers. Map it to the Web Crypto API.
cat > /tmp/crypto-browser-shim.cjs << 'EOF'
module.exports = {
  randomUUID: function() { return globalThis.crypto.randomUUID(); },
  getRandomValues: function(buf) { return globalThis.crypto.getRandomValues(buf); },
};
EOF

echo "Building fga-codegen.js from @openfga/syntax-transformer@0.2.1 ..."

npx esbuild /tmp/fga-codegen-entry.js \
  --bundle \
  --format=iife \
  --platform=browser \
  --minify \
  --alias:crypto=/tmp/crypto-browser-shim.cjs \
  --outfile=mintlify-native/fga-codegen.js

rm /tmp/fga-codegen-entry.js /tmp/crypto-browser-shim.cjs

SIZE=$(wc -c < mintlify-native/fga-codegen.js)
echo "Done. fga-codegen.js: $(( SIZE / 1024 ))KB"
echo "Commit the updated file with the new @openfga/syntax-transformer version noted above."
