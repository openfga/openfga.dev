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

function makeCardTitleSemantic(node) {
  if (node.type !== 'element') {
    return;
  }

  const classNames = Array.isArray(node.properties?.className) ? node.properties.className : [];
  if (
    classNames.some(
      (className) => typeof className === 'string' && className.startsWith('documentation-card-box-title_'),
    )
  ) {
    node.tagName = 'strong';
    node.properties = {};
  }
}

function cleanChildren(parent) {
  if (!Array.isArray(parent.children)) {
    return;
  }

  parent.children = parent.children.filter((node) => node.type !== 'comment' && !isHeadingPermalink(node, parent));

  parent.children.forEach((node) => {
    makeCardTitleSemantic(node);
    cleanChildren(node);
  });
}

export default function cleanAgentMarkdown() {
  return cleanChildren;
}
