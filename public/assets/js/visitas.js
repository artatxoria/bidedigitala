// public/assets/js/visitas.js
// Muestra el aviso de cookies si no hay decisión guardada, y registra visitas
// propias (sin terceros) una vez el visitante ha aceptado.
// La decisión de aceptar/rechazar la gestiona /api/consent mediante un
// <form> normal (ver src/components/CookieBanner.astro) — este script NO
// participa en esa acción, solo decide si el aviso debe mostrarse o no.
(function () {
  var CONSENT_COOKIE = 'bd_consent';

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
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

    fetch('/api/visita', {
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
        navigator.sendBeacon('/api/visita-duracion', payload);
      } else {
        fetch('/api/visita-duracion', { method: 'POST', body: payload, keepalive: true }).catch(function () {});
      }
    }

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') sendDuration();
    });
    window.addEventListener('pagehide', sendDuration);
  }

  var consent = getCookie(CONSENT_COOKIE);
  if (consent === 'accepted') {
    track();
  } else if (consent !== 'rejected') {
    var banner = document.getElementById('bd-cookie-notice');
    if (banner) banner.hidden = false;
  }
  // Si consent === 'rejected', no se hace nada: ni aviso ni tracking.
})();
