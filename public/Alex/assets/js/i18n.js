/* =========================================================
   i18n.js — selector de idioma (ES / EU / EN), menú móvil
   y pequeñas animaciones de entrada. Sin dependencias.
   ========================================================= */
(function(){
  var LANG_KEY = "alex_lang";
  var SUPPORTED = ["es", "eu", "en", "fr"];

  function getLang(){
    var saved = localStorage.getItem(LANG_KEY);
    if (SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || "es").slice(0,2);
    return SUPPORTED.indexOf(nav) !== -1 ? nav : "es";
  }

  function setLang(lang){
    if (SUPPORTED.indexOf(lang) === -1) lang = "es";
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll(".lang-switch button").forEach(function(btn){
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  // Animación de entrada al hacer scroll — reutilizable: gallery.js y piece.js
  // la llaman también después de inyectar tarjetas por JS, porque esas tarjetas
  // no existen todavía cuando el DOMContentLoaded de este archivo se dispara.
  var revealObserver = null;
  function scanReveals(){
    var revealEls = document.querySelectorAll(".reveal:not([data-reveal-bound])");
    if (!revealEls.length) return;
    if ("IntersectionObserver" in window){
      if (!revealObserver){
        revealObserver = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if (entry.isIntersecting){
              entry.target.classList.add("in");
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
      }
      revealEls.forEach(function(el){
        el.setAttribute("data-reveal-bound", "1");
        revealObserver.observe(el);
        // Red de seguridad: si por lo que sea el observer no dispara
        // (pestaña en segundo plano, entorno atípico, etc.), el contenido
        // se muestra igualmente — nunca debe quedar invisible para siempre.
        setTimeout(function(){ el.classList.add("in"); }, 1200);
      });
    } else {
      revealEls.forEach(function(el){
        el.setAttribute("data-reveal-bound", "1");
        el.classList.add("in");
      });
    }
  }

  window.AlexI18N = { getLang: getLang, setLang: setLang, SUPPORTED: SUPPORTED, scanReveals: scanReveals };

  document.addEventListener("DOMContentLoaded", function(){
    // Idioma inicial
    setLang(getLang());

    // Botones de idioma (puede haber más de un selector, ej. menú móvil)
    document.querySelectorAll(".lang-switch button").forEach(function(btn){
      btn.addEventListener("click", function(){ setLang(btn.dataset.lang); });
    });

    // Menú móvil
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    var toggleIconUse = toggle ? toggle.querySelector("use") : null;
    function setMenu(open){
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open);
      if (toggleIconUse) toggleIconUse.setAttribute("href", "assets/img/icons.svg#" + (open ? "ico-close" : "ico-menu"));
    }
    if (toggle && links){
      toggle.addEventListener("click", function(){
        setMenu(!links.classList.contains("open"));
      });
      links.querySelectorAll("a").forEach(function(a){
        a.addEventListener("click", function(){ setMenu(false); });
      });
      document.addEventListener("keydown", function(e){
        if (e.key === "Escape") setMenu(false);
      });
    }

    // Año en el pie de página
    document.querySelectorAll(".current-year").forEach(function(el){
      el.textContent = new Date().getFullYear();
    });

    // Animación de entrada al hacer scroll (contenido estático ya presente)
    scanReveals();
  });
})();
