// public/assets/js/visitas.js
// Muestra el aviso de cookies si no hay decisión guardada, y registra visitas
// propias (sin terceros) una vez el visitante ha aceptado.
//
// El aviso solo existe si este script se está ejecutando (es lo que lo saca
// de "hidden"), así que los botones son <button type="button"> normales sin
// ningún <form> ni navegación de página detrás.
//
// window.bdCookieDecide queda expuesta en global y CookieBanner.astro la
// llama también por onclick="" directamente en el HTML del botón, como vía
// redundante e independiente de addEventListener — por si en algún entorno
// concreto addEventListener no llega a engancharse mientras que un atributo
// onclick definido en el propio HTML sí funciona.
//
// Trazas con prefijo [visitas.js] en consola en cada paso: cargar, decidir
// si hace falta mostrar el aviso, enganchar los botones, y detectar cada
// clic — para poder ver exactamente hasta dónde llega la ejecución si algo
// falla en un caso concreto.
(function () {
  console.log('[visitas.js] cargado');

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

  var decided = false;

  function decide(decision) {
    console.log('[visitas.js] decide() llamada con', decision, 'ya decidido antes:', decided);
    if (decided) return; // evita doble ejecución si onclick Y addEventListener saltan ambos
    decided = true;
    setCookie(CONSENT_COOKIE, decision, CONSENT_MAX_AGE);
    var banner = document.getElementById('bd-cookie-notice');
    if (banner) banner.hidden = true;
    console.log('[visitas.js] cookie guardada, aviso oculto. document.cookie ahora:', document.cookie);
    if (decision === 'accepted') track();
  }
  window.bdCookieDecide = decide;

  function showBanner() {
    var banner = document.getElementById('bd-cookie-notice');
    if (!banner) {
      console.log('[visitas.js] no se encuentra #bd-cookie-notice en el DOM');
      return;
    }
    banner.hidden = false;
    console.log('[visitas.js] aviso mostrado');

    var acceptBtn = document.getElementById('bd-cookie-accept');
    var rejectBtn = document.getElementById('bd-cookie-reject');
    console.log('[visitas.js] botones encontrados:', { accept: !!acceptBtn, reject: !!rejectBtn });
    if (acceptBtn) acceptBtn.addEventListener('click', function () { console.log('[visitas.js] click en Aceptar (addEventListener)'); decide('accepted'); });
    if (rejectBtn) rejectBtn.addEventListener('click', function () { console.log('[visitas.js] click en Rechazar (addEventListener)'); decide('rejected'); });
    console.log('[visitas.js] listeners enganchados');
  }

  var consent = getCookie(CONSENT_COOKIE);
  console.log('[visitas.js] cookie de consentimiento actual:', JSON.stringify(consent));
  if (consent === 'accepted') {
    track();
  } else if (consent !== 'rejected') {
    showBanner();
  }
  // Si consent === 'rejected', no se hace nada: ni aviso ni tracking.
})();
