(function () {
  var stateKey = '__openfgaHeaderNavigation';
  if (window[stateKey]) {
    window[stateKey].scan();
    return;
  }

  var destinations = [
    'https://openfga.dev/project',
    'https://openfga.dev/community',
    'https://openfga.dev/blog',
  ];
  var parents = new Set();
  var observer = new MutationObserver(scan);

  function scan() {
    observer.disconnect();
    parents.add(document.body);
    document.querySelectorAll('#navbar, nav[aria-label="Mobile menu"]').forEach(function (root) {
      root.querySelectorAll('.navbar-link > a').forEach(function (link) {
        if (
          destinations.indexOf(link.getAttribute('href')) !== -1 &&
          link.getAttribute('target') !== '_self'
        ) {
          link.setAttribute('target', '_self');
        }
      });
      observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href', 'target'],
      });
      // Watch only ancestor child lists for header replacement and body-mounted menus.
      for (var parent = root.parentElement; parent; parent = parent.parentElement) {
        parents.add(parent);
      }
    });
    parents.forEach(function (parent) {
      if (parent && parent.isConnected) {
        observer.observe(parent, { childList: true });
      } else {
        parents.delete(parent);
      }
    });
  }

  window[stateKey] = { scan: scan };
  scan();
})();
