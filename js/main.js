// Mobile menu
(function () {
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Offer always runs to the end of the current month, so nobody has to update dates
(function () {
  var months = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];
  var now = new Date();
  document.querySelectorAll('.js-month').forEach(function (el) { el.textContent = months[now.getMonth()]; });
  var left = document.getElementById('days-left');
  if (left) {
    var end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    var days = Math.max(1, Math.ceil((end - now) / 864e5));
    left.textContent = days === 1 ? 'Posledný deň ponuky' : 'Zostáva ' + days + (days < 5 ? ' dni' : ' dní');
  }
})();

// Gallery filter (works for both the home preview and the Realizácie page)
(function () {
  var buttons = document.querySelectorAll('.filters button');
  var items = document.querySelectorAll('[data-c]');
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      buttons.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      items.forEach(function (it) {
        it.classList.toggle('hide', b.dataset.f !== 'all' && it.dataset.c !== b.dataset.f);
      });
    });
  });
})();

// Lead quiz
(function () {
  var form = document.getElementById('quiz');
  if (!form) return;
  var steps = form.querySelectorAll('.q-step');
  var next = document.getElementById('q-next'), back = document.getElementById('q-back');
  var err = document.getElementById('q-err'), bar = document.getElementById('q-bar'), lbl = document.getElementById('q-label');
  var cur = 1;

  // Preselect the furniture type when coming from a service link (objednavka.html?typ=t1)
  var typ = new URLSearchParams(location.search).get('typ');
  if (typ && document.getElementById(typ)) document.getElementById(typ).checked = true;

  function show(n) {
    cur = n;
    steps.forEach(function (s) { s.classList.toggle('active', +s.dataset.step === n); });
    bar.style.width = Math.min(100, n * 33.4) + '%';
    lbl.textContent = n <= 3 ? 'Krok ' + n + ' z 3' : 'Hotovo';
    back.style.visibility = n > 1 && n <= 3 ? 'visible' : 'hidden';
    next.innerHTML = n === 3 ? 'Odoslať dopyt' : 'Pokračovať <svg><use href="#i-arrow"/></svg>';
    if (n === 4) document.getElementById('q-nav').style.display = 'none';
    err.textContent = '';
  }

  function valid() {
    if (cur === 1 && !form.querySelector('input[name="typ"]:checked')) return 'Vyberte aspoň jednu možnosť.';
    if (cur === 3) {
      if (!form.meno.value.trim()) return 'Zadajte, prosím, vaše meno.';
      if (form.telefon.value.replace(/\D/g, '').length < 9) return 'Zadajte platné telefónne číslo.';
      if (!document.getElementById('f-gdpr').checked) return 'Potvrďte súhlas so spracovaním údajov.';
    }
    return '';
  }

  next.addEventListener('click', function () {
    var e = valid();
    if (e) { err.textContent = e; return; }
    // Sending is connected in the final build (as on montwell.sk)
    show(cur + 1);
  });
  back.addEventListener('click', function () { show(cur - 1); });
})();
