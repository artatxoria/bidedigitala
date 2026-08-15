// public/assets/js/visitas.js
// Muestra el aviso de cookies si no hay decisión guardada, y registra visitas
// propias (sin terceros) una vez el visitante ha aceptado.
//
// El clic en Aceptar/Rechazar actúa al instante por JavaScript (oculta el
// aviso y guarda la cookie en el momento, sin esperar a que termine ninguna
// navegación de página). El <form method="POST" action="/api/consent"> de
// CookieBanner.astro sigue ahí como red de seguridad — si por lo que sea
// este script no llega a ejecutarse o a enganchar el clic, el envío nativo
// del formulario sigue guardando la decisión igualmente.
(function () {
  var CONSENT_COOKIE = 'bd_consent';
  var CONSENT_MAX_AGE = 365 * 24 * 60 * 60; // 1 año, en segundos

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

  function decide(banner, decision) {
    setCookie(CONSENT_COOKIE, decision, CONSENT_MAX_AGE);
    banner.hidden = true;
    if (decision === 'accepted') track();
    // Aviso al servidor en segundo plano, sin bloquear ni depender de la
    // respuesta — la decisión ya ha quedado aplicada arriba.
    var fd = new URLSearchParams();
    fd.set('decision', decision);
    fetch('/api/consent', { method: 'POST', body: fd, keepalive: true }).catch(function () {});
  }

  function showBanner() {
    var banner = document.getElementById('bd-cookie-notice');
    if (!banner) return;
    banner.hidden = false;

    var acceptBtn = banner.querySelector('button[value="accepted"]');
    var rejectBtn = banner.querySelector('button[value="rejected"]');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function (e) {
        e.preventDefault();
        decide(banner, 'accepted');
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function (e) {
        e.preventDefault();
        decide(banner, 'rejected');
      });
    }
  }

  var consent = getCookie(CONSENT_COOKIE);
  if (consent === 'accepted') {
    track();
  } else if (consent !== 'rejected') {
    showBanner();
  }
  // Si consent === 'rejected', no se hace nada: ni aviso ni tracking.
})();
