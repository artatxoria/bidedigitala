/* =========================================================
   contact.js — formulario de contacto sin backend: construye
   un mailto: con los datos y precarga la pieza si viene de
   una ficha (contacto.html?pieza=...)
   ========================================================= */
(function(){
  function lang(){ return (window.AlexI18N && AlexI18N.getLang()) || "es"; }

  function applyPlaceholders(){
    document.querySelectorAll("[data-placeholder-es]").forEach(function(el){
      var l = lang();
      el.setAttribute("placeholder", el.dataset["placeholder" + l.charAt(0).toUpperCase() + l.slice(1)] || el.dataset.placeholderEs);
    });
  }

  document.addEventListener("langchange", applyPlaceholders);

  document.addEventListener("DOMContentLoaded", function(){
    applyPlaceholders();
    var params = new URLSearchParams(window.location.search);
    var pieza = params.get("pieza");
    var msgField = document.getElementById("f-mensaje");
    if (pieza && msgField && !msgField.value){
      var prefill = {
        es: "Hola, estoy interesado/a en la pieza «" + pieza + "». ¿Sigue disponible?",
        eu: "Kaixo, «" + pieza + "» piezarekin interesatuta nago. Eskuragarri jarraitzen du?",
        en: "Hi, I'm interested in the piece «" + pieza + "». Is it still available?",
        fr: "Bonjour, je suis intéressé(e) par la pièce « " + pieza + " ». Est-elle toujours disponible ?"
      };
      msgField.value = prefill[lang()] || prefill.es;
    }

    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var nombre = document.getElementById("f-nombre").value;
      var email = document.getElementById("f-email").value;
      var mensaje = document.getElementById("f-mensaje").value;
      var subject = encodeURIComponent("Contacto desde la web — " + nombre);
      var body = encodeURIComponent(mensaje + "\n\n— " + nombre + " (" + email + ")");
      window.location.href = "mailto:hola@alexartesania.eus?subject=" + subject + "&body=" + body;
    });
  });
})();
