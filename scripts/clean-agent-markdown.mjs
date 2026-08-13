function isHeading(node) {
  return node.type === 'element' && /^h[1-6]$/.test(node.tagName);
}

function isHeadingPermalink(node, parent) {
  if (!isHeading(parent) || node.type !== 'element' || node.tagName !== 'a') {
    return false;
  }

  const classNames = Array.isArray(node.properties?.className) ? node.properties.className : [];
  const ariaLabel = node.properties?.ariaLabel;

  return classNames.includes('hash-link') || (typeof ariaLabel === 'string' && ariaLabel.startsWith('Direct link'));
}

function cleanChildren(parent) {
  if (!Array.isArray(parent.children)) {
    return;
  }

  parent.children = parent.children.filter((node) => node.type !== 'comment' && !isHeadingPermalink(node, parent));

  parent.children.forEach(cleanChildren);
}

export default function cleanAgentMarkdown() {
  return cleanChildren;
}
