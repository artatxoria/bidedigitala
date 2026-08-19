/* =========================================================
   piece.js — renderiza la ficha individual de una pieza
   (pieza.html?id=N) a partir de pieces-data.js
   ========================================================= */
(function(){
  function lang(){ return (window.AlexI18N && AlexI18N.getLang()) || "es"; }

  function getIdFromUrl(){
    var params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"), 10);
  }

  var LABELS = {
    dimensions: { es: "Medidas", eu: "Neurriak", en: "Dimensions", fr: "Dimensions" },
    material:   { es: "Material", eu: "Materiala", en: "Material", fr: "Matériau" },
    motivation: { es: "Inspiración", eu: "Inspirazioa", en: "Inspiration", fr: "Inspiration" },
    status:     { es: "Estado", eu: "Egoera", en: "Status", fr: "État" },
    cta:        { es: "Consultar disponibilidad", eu: "Eskuragarritasuna galdetu", en: "Ask about availability", fr: "Demander la disponibilité" },
    back:       { es: "Volver a la galería", eu: "Itzuli galeriara", en: "Back to gallery", fr: "Retour à la galerie" },
    others:     { es: "Otras piezas", eu: "Beste piezak", en: "Other pieces", fr: "Autres pièces" },
    notfound:   { es: "No hemos encontrado esta pieza.", eu: "Pieza hori ez dugu aurkitu.", en: "We couldn't find this piece.", fr: "Nous n’avons pas trouvé cette pièce." }
  };

  function render(){
    var piece = ALEX_PIECES.find(function(p){ return p.id === getIdFromUrl(); });
    var l = lang();
    var root = document.getElementById("piece-root");
    if (!root) return;

    if (!piece){
      root.innerHTML = '<p class="lead">' + LABELS.notfound[l] + '</p><a class="btn btn-outline" href="galeria.html">' + LABELS.back[l] + '</a>';
      return;
    }

    document.title = piece.title[l] + " — Alex Artesanía";

    var visual = piece.image
      ? '<img src="' + piece.image + '" alt="' + piece.title[l] + '" width="900" height="900" fetchpriority="high">'
      : '<svg aria-hidden="true"><use href="assets/img/icons.svg#' + piece.icon + '"></use></svg>';
    var visualClass = piece.image ? "" : "icon-" + piece.category;

    root.innerHTML =
      '<div class="piece-visual ' + visualClass + '">' +
        '<span class="badge ' + piece.status + '">' + ALEX_STATUS_LABELS[piece.status][l] + '</span>' +
        visual +
      '</div>' +
      '<div>' +
        '<a class="btn-outline btn" href="galeria.html" style="margin-bottom:18px;padding:.5em 1.1em;font-size:.8rem;">&larr; ' + LABELS.back[l] + '</a>' +
        '<div class="tag-row"><span class="tag">' + ALEX_CATEGORY_LABELS[piece.category][l] + '</span></div>' +
        '<h1>' + piece.title[l] + '</h1>' +
        '<p class="lead">' + piece.short[l] + '</p>' +
        '<div class="piece-meta">' +
          '<div><strong>' + piece.material[l] + '</strong>' + LABELS.material[l] + '</div>' +
          '<div><strong>' + piece.dimensions + '</strong>' + LABELS.dimensions[l] + '</div>' +
          '<div><strong>' + piece.motivation[l] + '</strong>' + LABELS.motivation[l] + '</div>' +
        '</div>' +
        '<p>' + piece.story[l] + '</p>' +
        '<a class="btn btn-primary" href="contacto.html?pieza=' + encodeURIComponent(piece.title.es) + '">' + LABELS.cta[l] + '</a>' +
        '<p class="disclaimer" data-i18n-lang="es">Pieza de ejemplo imaginada para este borrador — cuando incorporemos las piezas reales de Alex, esta ficha se sustituirá por sus fotos y su historia real.</p>' +
        '<p class="disclaimer" data-i18n-lang="eu">Zirriborro honetarako asmatutako pieza da adibide gisa — Alexen benetako piezak gehitzen ditugunean, fitxa hau bere argazki eta benetako istorioarekin ordezkatuko da.</p>' +
        '<p class="disclaimer" data-i18n-lang="en">Example piece imagined for this draft — once we add Alex&rsquo;s real pieces, this page will be replaced with his actual photos and story.</p>' +
        '<p class="disclaimer" data-i18n-lang="fr">Pièce d&rsquo;exemple imaginée pour ce brouillon — une fois les pièces réelles d&rsquo;Alex ajoutées, cette page sera remplacée par ses vraies photos et sa véritable histoire.</p>' +
      '</div>';

    renderOthers(piece, l);
  }

  function renderOthers(current, l){
    var el = document.getElementById("piece-others");
    if (!el) return;
    var others = ALEX_PIECES.filter(function(p){ return p.id !== current.id; })
      .sort(function(){ return Math.random() - 0.5; })
      .slice(0, 3);
    el.innerHTML = others.map(function(p){
      var visual = p.image ? '<img src="' + p.image + '" alt="' + p.title[l] + '" width="900" height="900" loading="lazy">' : '<svg aria-hidden="true"><use href="assets/img/icons.svg#' + p.icon + '"></use></svg>';
      var visualClass = p.image ? "" : "icon-" + p.category;
      return '<article class="piece-card reveal">' +
        '<a href="pieza.html?id=' + p.id + '" class="piece-visual ' + visualClass + '">' +
          '<span class="badge ' + p.status + '">' + ALEX_STATUS_LABELS[p.status][l] + '</span>' + visual +
        '</a>' +
        '<div class="piece-body">' +
          '<span class="piece-material">' + p.material[l] + '</span>' +
          '<h3><a href="pieza.html?id=' + p.id + '">' + p.title[l] + '</a></h3>' +
        '</div>' +
      '</article>';
    }).join("");
    if (window.AlexI18N) AlexI18N.scanReveals();
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("langchange", render);
})();
