// Mobile menu
(function () {
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Realizácie filter
(function () {
  var buttons = document.querySelectorAll('.filters button');
  var items = document.querySelectorAll('[data-c]');
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      buttons.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      items.forEach(function (it) {
        var cats = it.dataset.c.split(' ');
        it.classList.toggle('is-hidden', b.dataset.f !== 'all' && cats.indexOf(b.dataset.f) === -1);
      });
    });
  });
})();

// Lead forms
(function () {
  var MAX_FILE = 10 * 1024 * 1024;
  var TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  var params = new URLSearchParams(location.search);

  document.querySelectorAll('form.lead-form').forEach(function (form) {
    var err = form.querySelector('.form-error');
    var btn = form.querySelector('button[type="submit"]');

    // Preselect from links like objednavka/?typ=kuchyna or ?projekt=vinicne
    var typ = params.get('typ');
    if (typ && form.potreba) form.potreba.value = typ;
    var projekt = params.get('projekt');
    if (projekt && form.sprava && !form.sprava.value) form.sprava.value = 'Chcem podobné riešenie ako v projekte: ' + projekt + '. ';

    function fail(msg, field) {
      err.textContent = msg;
      if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
      return false;
    }

    form.addEventListener('input', function (e) { e.target.removeAttribute('aria-invalid'); err.textContent = ''; });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var tel = form.telefon ? form.telefon.value.trim() : '';
      var mail = form.email ? form.email.value.trim() : '';
      if (!tel && !mail) return fail('Zadajte telefón alebo e-mail, aby sme vás mohli kontaktovať.', form.telefon || form.email);
      if (tel && tel.replace(/\D/g, '').length < 9) return fail('Skontrolujte telefónne číslo.', form.telefon);
      if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return fail('Skontrolujte e-mailovú adresu.', form.email);
      if (form.foto && form.foto.files.length) {
        for (var i = 0; i < form.foto.files.length; i++) {
          var f = form.foto.files[i];
          if (TYPES.indexOf(f.type) === -1) return fail('Fotografie môžu byť vo formáte JPG, PNG alebo WEBP.', form.foto);
          if (f.size > MAX_FILE) return fail('Jedna fotografia môže mať najviac 10 MB.', form.foto);
        }
      }
      if (form.suhlas && !form.suhlas.checked) return fail('Potvrďte, prosím, súhlas so spracovaním údajov.', form.suhlas);

      // Prevent double submits; in production the success state is shown only after the server confirms.
      btn.disabled = true;
      btn.textContent = 'Odosielam…';
      setTimeout(function () { form.classList.add('is-sent'); }, 600);
    });
  });
})();
