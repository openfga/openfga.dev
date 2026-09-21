(function () {
  var stateKey = '__openfgaNavbarLayout';
  if (window[stateKey]) {
    window[stateKey].scan();
    return;
  }

  var scanQueued = false;
  var mobile = window.matchMedia('(max-width: 1023px)');

  function scan() {
    document.querySelectorAll('#navbar .topbar-right-container').forEach(function (container) {
      var links = container.querySelector(':scope > ul');
      var search = container.querySelector('#search-bar-entry');
      var searchContainer = search && search.parentElement;
      if (
        links &&
        searchContainer &&
        searchContainer.parentElement === container &&
        links.nextElementSibling !== searchContainer
      ) {
        // Move the native list, not a copy, so keyboard order follows the visible layout.
        container.insertBefore(links, searchContainer);
      }
      var mobileSearch = document.querySelector('#navbar #search-bar-entry-mobile');
      var desktopRow = container.parentElement;
      var header = desktopRow && desktopRow.parentElement;
      var mobileRow =
        header &&
        mobileSearch &&
        Array.prototype.find.call(header.children, function (row) {
          return row.contains(mobileSearch);
        });
      if (mobileRow) {
        var first = mobile.matches ? mobileRow : desktopRow;
        var second = mobile.matches ? desktopRow : mobileRow;
        // Keep React-managed controls in their original parents when exposing the mobile theme menu.
        if (first.nextElementSibling !== second) {
          header.insertBefore(first, second);
        }
      }
    });
  }

  var observer = new MutationObserver(function () {
    if (scanQueued) {
      return;
    }
    scanQueued = true;
    requestAnimationFrame(function () {
      scanQueued = false;
      scan();
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  mobile.addEventListener('change', scan);

  window[stateKey] = { scan: scan };
  scan();
})();
