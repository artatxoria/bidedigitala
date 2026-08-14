// public/assets/js/analytics.js
// Banner de consentimiento + tracking de visitas propio (sin terceros).
// No hace nada hasta que el visitante pulsa "Aceptar" (o ya lo había hecho
// antes). Si pulsa "Rechazar", no se manda ni guarda absolutamente nada.
(function () {
  var CONSENT_COOKIE = 'bd_consent';
  var CONSENT_MAX_AGE = 31536000; // 1 año, en segundos

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, maxAgeSeconds) {
    document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=' + maxAgeSeconds + '; SameSite=Lax';
  }

  function uuid() {
    if (window.crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    // Fallback simple (no exige seguridad criptográfica, solo un id de vista único).
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function track() {
    var pageViewId = uuid();
    var startedAt = Date.now();

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageViewId: pageViewId, path: location.pathname, referrer: document.referrer || '' }),
      keepalive: true,
    }).catch(function () {});

    var durationSent = false;
    function sendDuration() {
      if (durationSent) return;
      durationSent = true;
      var payload = JSON.stringify({ pageViewId: pageViewId, durationMs: Date.now() - startedAt });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track-duration', payload);
      } else {
        fetch('/api/track-duration', { method: 'POST', body: payload, keepalive: true }).catch(function () {});
      }
    }

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') sendDuration();
    });
    window.addEventListener('pagehide', sendDuration);
  }

  function initBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.hidden = false;

    var acceptBtn = document.getElementById('cookie-accept');
    var rejectBtn = document.getElementById('cookie-reject');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        setCookie(CONSENT_COOKIE, 'accepted', CONSENT_MAX_AGE);
        banner.hidden = true;
        track();
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        setCookie(CONSENT_COOKIE, 'rejected', CONSENT_MAX_AGE);
        banner.hidden = true;
      });
    }
  }

  var consent = getCookie(CONSENT_COOKIE);
  if (consent === 'accepted') {
    track();
  } else if (consent !== 'rejected') {
    initBanner();
  }
  // Si consent === 'rejected', no se hace nada: ni banner ni tracking.

  // Enlace "Gestionar cookies" del footer: reabre el banner para cambiar de opinión.
  document.addEventListener('DOMContentLoaded', function () {
    var manageLink = document.getElementById('cookie-manage');
    if (manageLink) {
      manageLink.addEventListener('click', function (e) {
        e.preventDefault();
        document.cookie = CONSENT_COOKIE + '=; path=/; max-age=0';
        location.reload();
      });
    }
  });
})();
