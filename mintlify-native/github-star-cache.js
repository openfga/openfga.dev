(function () {
  var REPOSITORY_URL = 'https://github.com/openfga/openfga';
  var CACHE_KEY = 'openfga:github-stars:v1';
  var CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
  var LOADING_WINDOW_MS = 2500;
  var stateKey = '__openfgaGithubStarCache';

  if (window[stateKey]) {
    window[stateKey].scan();
    return;
  }

  var linkState = new WeakMap();
  var timer;
  var scanQueued = false;

  function readCache() {
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      var now = Date.now();
      if (
        !cached ||
        typeof cached.display !== 'string' ||
        !Number.isSafeInteger(cached.value) ||
        cached.value < 0 ||
        !Number.isFinite(cached.timestamp) ||
        cached.timestamp > now ||
        now - cached.timestamp > CACHE_TTL_MS ||
        Number(cached.display.replace(/,/g, '')) !== cached.value
      ) {
        return null;
      }
      return cached;
    } catch {
      return null;
    }
  }

  function writeCache(display, value) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          display: display,
          value: value,
          timestamp: Date.now(),
        }),
      );
    } catch {
      // Storage can be disabled by privacy settings; the native widget still works.
    }
  }

  function findNativeCount(link) {
    var spans = link.querySelectorAll('span');
    for (var index = 0; index < spans.length; index += 1) {
      var span = spans[index];
      var display = span.textContent.trim();
      if (!span.closest('[data-openfga-github-stars-fallback]') && /^(?:\d{1,3}(?:,\d{3})+|\d+)$/.test(display)) {
        return {
          display: display,
          value: Number(display.replace(/,/g, '')),
        };
      }
    }
    return null;
  }

  function removeFallback(link) {
    link.querySelectorAll('[data-openfga-github-stars-fallback]').forEach(function (fallback) {
      fallback.remove();
    });
  }

  function setAccessibleLabel(link, display) {
    var label = display ? 'OpenFGA on GitHub — ' + display + ' stars' : 'OpenFGA on GitHub';
    link.setAttribute('aria-label', label);
    link.setAttribute('title', label);
  }

  function addFallback(link, cached) {
    var fallback = link.querySelector('[data-openfga-github-stars-fallback]');
    if (!fallback) {
      fallback = document.createElement('span');
      fallback.className = 'openfga-github-stars-fallback';
      fallback.dataset.openfgaGithubStarsFallback = '';

      var icon = document.createElement('span');
      icon.className = 'openfga-github-stars-fallback__icon';
      icon.setAttribute('aria-hidden', 'true');

      var count = document.createElement('span');
      count.className = 'openfga-github-stars-fallback__count';

      fallback.append(icon, count);
      link.append(fallback);
    }

    var countElement = fallback.querySelector('.openfga-github-stars-fallback__count');
    if (countElement.textContent !== cached.display) {
      countElement.textContent = cached.display;
    }
  }

  function scan() {
    clearTimeout(timer);
    var now = Date.now();
    var nextScanDelay = Infinity;

    document.querySelectorAll('a[href="' + REPOSITORY_URL + '"]').forEach(function (link) {
      var nativeCount = findNativeCount(link);
      var status = linkState.get(link) || { absentSince: now, nativeDisplay: null };

      if (nativeCount && Number.isSafeInteger(nativeCount.value)) {
        removeFallback(link);
        if (status.nativeDisplay !== nativeCount.display) {
          writeCache(nativeCount.display, nativeCount.value);
        }
        setAccessibleLabel(link, nativeCount.display);
        status.absentSince = null;
        status.nativeDisplay = nativeCount.display;
      } else {
        if (status.absentSince === null) {
          status.absentSince = now;
        }
        status.nativeDisplay = null;

        var remaining = LOADING_WINDOW_MS - (now - status.absentSince);
        if (remaining <= 0) {
          var cached = readCache();
          if (cached) {
            addFallback(link, cached);
            setAccessibleLabel(link, cached.display);
            nextScanDelay = Math.min(nextScanDelay, CACHE_TTL_MS - (now - cached.timestamp) + 25);
          } else {
            removeFallback(link);
            setAccessibleLabel(link);
          }
        } else {
          nextScanDelay = Math.min(nextScanDelay, remaining);
        }
      }

      linkState.set(link, status);
    });

    if (Number.isFinite(nextScanDelay)) {
      timer = setTimeout(scan, nextScanDelay + 25);
    }
  }

  function queueScan() {
    if (scanQueued) {
      return;
    }
    scanQueued = true;
    requestAnimationFrame(function () {
      scanQueued = false;
      scan();
    });
  }

  var observer = new MutationObserver(queueScan);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  window[stateKey] = { scan: scan };
  scan();
})();
