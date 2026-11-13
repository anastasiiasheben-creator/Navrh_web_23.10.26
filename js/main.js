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

// Project gallery lightbox: arrows, keyboard, swipe
(function () {
  var gallery = document.querySelector('[data-lightbox]');
  if (!gallery) return;
  var links = Array.prototype.slice.call(gallery.querySelectorAll('a'));
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Fotografie projektu');
  box.innerHTML =
    '<button class="lb-close" type="button" aria-label="Zavrieť">×</button>' +
    '<button class="lb-prev" type="button" aria-label="Predchádzajúca fotografia">‹</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-next" type="button" aria-label="Ďalšia fotografia">›</button>';
  document.body.appendChild(box);
  var imgEl = box.querySelector('img');
  var cap = box.querySelector('figcaption');
  var cur = 0;
  var lastFocus = null;

  function show(i) {
    cur = (i + links.length) % links.length;
    imgEl.src = links[cur].getAttribute('href');
    imgEl.alt = links[cur].querySelector('img').alt;
    cap.textContent = (cur + 1) + ' / ' + links.length;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }
  function close() {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(i); });
  });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
  var x0 = null;
  box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
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
      if (form.suhlas && !form.suhlas.checked) return fail('Pred odoslaním potvrďte, že ste sa oboznámili so Zásadami ochrany osobných údajov.', form.suhlas);

      // Prevent double submits. The WordPress theme defines window.imjSend (real sending);
      // the static prototype only simulates the success state.
      var label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Odosielam…';
      if (!window.imjSend) { setTimeout(function () { form.classList.add('is-sent'); }, 600); return; }
      window.imjSend(form).then(function () {
        form.classList.add('is-sent');
      }, function (msg) {
        btn.disabled = false;
        btn.innerHTML = label;
        fail(msg || 'Odoslanie sa nepodarilo. Skúste to znova alebo nám zavolajte.');
      });
    });
  });
})();


// Cookie bar (contract čl. XI), same look as on montwell.sk. "Prijať všetky" also allows the Google map on Kontakt;
// "Len nevyhnutné" keeps only the picture of the map. The choice is kept in localStorage and can be changed
// via "Nastavenia cookies" in the footer.
(function () {
  var KEY = 'imj-cookies';
  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}

  function loadMaps() {
    document.querySelectorAll('[data-map-src]').forEach(function (box) {
      if (box.querySelector('iframe')) return;
      var f = document.createElement('iframe');
      f.src = box.dataset.mapSrc;
      f.title = box.dataset.mapTitle || 'Mapa';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      box.innerHTML = '';
      box.appendChild(f);
    });
  }

  var bar;
  function save(c) {
    choice = c;
    try { localStorage.setItem(KEY, c); } catch (err) {}
    if (c === 'all') loadMaps(); else if (document.querySelector('.map-consent iframe')) location.reload();
    if (bar) {
      bar.classList.remove('show');
      document.body.classList.remove('has-cookie-bar');
    }
  }

  function open() {
    if (!bar) {
      var privacy = document.querySelector('.foot-bottom a[href*="ochrana-sukromia"]');
      bar = document.createElement('div');
      bar.className = 'cookie-bar';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Cookies');
      bar.innerHTML = '<div class="cookie-inner"><p>Táto stránka používa nevyhnutné cookies. S vaším súhlasom načítame aj mapu Google, ktorá ukladá vlastné cookies.' +
        (privacy ? ' Prečítajte si naše <a href="' + privacy.getAttribute('href') + '">Zásady ochrany osobných údajov</a>.' : '') + '</p>' +
        '<div class="cookie-btns"><button class="btn btn-primary" type="button" data-c="all">Prijať všetky</button>' +
        '<button class="btn btn-outline" type="button" data-c="necessary">Len nevyhnutné</button></div></div>';
      document.body.appendChild(bar);
      bar.addEventListener('click', function (e) {
        var b = e.target.closest('[data-c]');
        if (b) save(b.dataset.c);
      });
    }
    requestAnimationFrame(function () { bar.classList.add('show'); document.body.classList.add('has-cookie-bar'); });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookies]')) open();
    if (e.target.closest('[data-map-load]')) save('all');
  });

  if (choice === 'all') loadMaps();
  if (!choice) setTimeout(open, 1000);
})();

// Phone links on a computer: the browser usually has nothing to call with, so the click looked broken.
// On devices without touch WhatsApp opens with this number (app or web) and the number is shown and copied;
// on phones the call opens as usual.
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  var toast;
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="tel:"]');
    if (!a) return;
    e.preventDefault();
    window.open("https://wa.me/" + a.getAttribute("href").replace(/\D/g, ""), "_blank", "noopener");
    var num = a.getAttribute('href').slice(4).replace(/^\+421/, '+421 ').replace(/(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3');
    try { navigator.clipboard.writeText(num); } catch (err) {}
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.innerHTML = 'Otvárame WhatsApp. Alebo zavolajte: <b>' + num + '</b><span>Číslo sme skopírovali.</span>';
    toast.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { toast.classList.remove('show'); }, 4000);
  });
})();
