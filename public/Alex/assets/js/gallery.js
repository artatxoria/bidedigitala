/* =========================================================
   gallery.js — renderiza piezas destacadas (home) y la
   galería completa con filtros (galeria.html)
   ========================================================= */
(function(){
  function lang(){ return (window.AlexI18N && AlexI18N.getLang()) || "es"; }

  function visualMarkup(piece, l){
    if (piece.image){
      return '<img src="' + piece.image + '" alt="' + piece.title[l] + '" width="900" height="900" loading="lazy">';
    }
    return '<svg aria-hidden="true"><use href="assets/img/icons.svg#' + piece.icon + '"></use></svg>';
  }

  function cardMarkup(piece){
    var l = lang();
    var catClass = "icon-" + piece.category;
    var visualClass = piece.image ? "" : catClass;
    return (
      '<article class="piece-card reveal">' +
        '<a href="pieza.html?id=' + piece.id + '" class="piece-visual ' + visualClass + '">' +
          '<span class="badge ' + piece.status + '">' + ALEX_STATUS_LABELS[piece.status][l] + '</span>' +
          visualMarkup(piece, l) +
        '</a>' +
        '<div class="piece-body">' +
          '<span class="piece-material">' + piece.material[l] + '</span>' +
          '<h3><a href="pieza.html?id=' + piece.id + '">' + piece.title[l] + '</a></h3>' +
          '<p class="piece-desc">' + piece.short[l] + '</p>' +
          '<a class="btn btn-outline" href="pieza.html?id=' + piece.id + '">' +
            (l === "es" ? "Ver la pieza" : l === "eu" ? "Piezaren xehetasunak" : l === "fr" ? "Voir la pièce" : "View piece") +
          '</a>' +
        '</div>' +
      '</article>'
    );
  }

  function renderFeatured(){
    var el = document.getElementById("featured-grid");
    if (!el) return;
    var featured = ALEX_PIECES.filter(function(p){ return p.featured; });
    el.innerHTML = featured.map(cardMarkup).join("");
    if (window.AlexI18N) AlexI18N.scanReveals();
  }

  var urlParams = new URLSearchParams(window.location.search);
  var validCats = ["all", "mar", "rural", "urbano"];
  var validStatuses = ["all", "disponible", "encargo", "vendido"];
  var activeCategory = validCats.indexOf(urlParams.get("cat")) !== -1 ? urlParams.get("cat") : "all";
  var activeStatus = validStatuses.indexOf(urlParams.get("estado")) !== -1 ? urlParams.get("estado") : "all";

  function syncUrl(){
    var params = new URLSearchParams(window.location.search);
    activeCategory === "all" ? params.delete("cat") : params.set("cat", activeCategory);
    activeStatus === "all" ? params.delete("estado") : params.set("estado", activeStatus);
    var qs = params.toString();
    history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
  }

  function renderGallery(){
    var el = document.getElementById("gallery-grid");
    if (!el) return;
    var items = ALEX_PIECES.filter(function(p){
      var okCat = activeCategory === "all" || p.category === activeCategory;
      var okStatus = activeStatus === "all" || p.status === activeStatus;
      return okCat && okStatus;
    });
    el.innerHTML = items.map(cardMarkup).join("") ||
      '<p class="lead">' + (lang()==="es" ? "No hay piezas con este filtro todavía." : lang()==="eu" ? "Iragazki honekin ez dago piezarik oraingoz." : lang()==="fr" ? "Aucune pièce ne correspond encore à ce filtre." : "No pieces match this filter yet.") + '</p>';
    var count = document.getElementById("gallery-count");
    if (count) count.textContent = items.length;
    if (window.AlexI18N) AlexI18N.scanReveals();
  }

  function wireFilters(){
    document.querySelectorAll("[data-filter-cat]").forEach(function(btn){
      btn.classList.toggle("active", btn.dataset.filterCat === activeCategory);
      btn.addEventListener("click", function(){
        activeCategory = btn.dataset.filterCat;
        document.querySelectorAll("[data-filter-cat]").forEach(function(b){ b.classList.toggle("active", b===btn); });
        syncUrl();
        renderGallery();
      });
    });
    document.querySelectorAll("[data-filter-status]").forEach(function(btn){
      btn.classList.toggle("active", btn.dataset.filterStatus === activeStatus);
      btn.addEventListener("click", function(){
        activeStatus = btn.dataset.filterStatus;
        document.querySelectorAll("[data-filter-status]").forEach(function(b){ b.classList.toggle("active", b===btn); });
        syncUrl();
        renderGallery();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    renderFeatured();
    renderGallery();
    wireFilters();
  });
  document.addEventListener("langchange", function(){
    renderFeatured();
    renderGallery();
  });
})();
