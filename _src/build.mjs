// Builds the static pages from shared layout + page content.
// Run from the project root: node _src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sprite = fs.readFileSync(path.join(root, '_src', 'sprite.html'), 'utf8');

const PHONE = '+421918638713';
const PHONE_TXT = '+421 918 638 713';
const WA = 'https://wa.me/421918638713';
const ic = (id) => `<svg><use href="#i-${id}"/></svg>`;

const NAV = [
  ['index.html', 'Domov'],
  ['o-nas.html', 'O nás'],
  ['nas-tim.html', 'Náš tím'],
  ['sluzby.html', 'Služby'],
  ['realizacie.html', 'Realizácie'],
  ['blog/index.html', 'Blog'],
  ['kontakt.html', 'Kontakt'],
];

// ---------- Data ----------

const projects = [
  { img: 'imajstri_homepage.webp', cat: 'byty', t: 'Moderný byt na mieru', loc: 'Záhorská Bystrica', time: '1 mesiac', d: 'Obývačková stena s lamelami, kuchyňa s lamelami a ostrovčekom, vstavaná skriňa s komodou, chodbová skriňa so sedením a skrinka do kúpeľne.' },
  { img: 'grob_kuchyna.jpg', pos: '30% center', cat: 'byty', t: 'Celý dom na mieru', loc: 'Chorvátsky Grob', time: '5 týždňov', by: 'Dušan', d: 'Drevodekorová kuchyňa, chodba, spálňa so šatníkom, kúpeľňa, minimalistická obývačka a detská izba pre dvoch súrodencov.' },
  { img: 'vinicne_1-770x892.webp', cat: 'kuchyne', t: 'Kuchyňa drevo + čierno-biela', loc: 'Viničné', time: '6 týždňov', by: 'Jozef', d: 'Prírodný dekor dreva s čierno-bielymi prvkami, veľké zásuvky, rohový výsuvný systém LeMans a vstavané spotrebiče.' },
  { img: '1_kuchyna_nivy_nahlad-770x892.webp', cat: 'kuchyne', t: 'Kuchyňa a obývačka pri Nivách', loc: 'Bratislava – Nivy', time: '1 mesiac', by: 'Jozef', d: 'Systém Smart-Cube s podsvietením, čierne dvierka s tmavým sklom Lacobel a pracovný kút v obývačke.' },
  { img: '2-770x892.webp', cat: 'izby', t: 'Detská izba pre dvoch súrodencov', loc: 'Chorvátsky Grob', time: '5 týždňov', by: 'Dušan', d: 'Čalúnená posteľ na poschodí, schodisko s úložným priestorom, vstavaná skriňa a písací stôl.' },
  { img: 'vydrica_kuchyna_1-770x892.jpg', cat: 'byty', t: 'Zariadenie bytu Vydrica', loc: 'Bratislava – Vydrica', time: '5 týždňov', by: 'Jozef', d: 'Kuchyňa, minimalistická stena do obývačky, vstavaná skriňa v spálni a čelo postele s nočnými stolíkmi.' },
  { img: '1-2-770x892.jpeg', cat: 'skrine', t: 'Vstavané skrine', loc: 'Sládkovičovo', time: '4 týždne', by: 'Jozef', d: 'Vstavané skrine do spálne, hosťovskej izby a vstupnej chodby.' },
  { img: 'imajstri_kuchyna_slnecnice-770x892.webp', cat: 'kuchyne', t: 'Kuchyňa a vstavané skrine', loc: 'Slnečnice', time: '1 mesiac', d: 'Moderná kuchyňa s praktickým usporiadaním a vstavané skrine, ktoré naplno využívajú priestor.' },
  { img: 'Landanova-Obyvacka-interierovimajstri-770x892.webp', cat: 'byty', t: 'Trojizbový byt pre rodinu', loc: 'Bratislava – Dúbravka', time: '2 mesiace', d: 'Vstavané skrine, bezpečná detská izba, obývačka, kuchyňa so vstavanými spotrebičmi a skryté úložné priestory v chodbe aj práčovni.' },
  { img: 'byt_nahlad-770x650.webp', cat: 'byty', t: 'Menší byt', loc: 'Bratislava – Dúbravka', time: '1 mesiac', by: 'Jozef', d: 'Kuchyňa na mieru do malého priestoru a chodba s dizajnovým obkladom a vešiakovou stenou.' },
  { img: 'ilustracny-1-770x892.jpeg', cat: 'firmy', t: 'Kozmetický salón Anima', loc: 'Komerčný priestor', time: '3 týždne', d: 'Vstavaná skriňa s veľkou kapacitou, minikuchynka pre personál a zrkadlová skriňa. Realizované podľa návrhu ToøL. interior architects.' },
];

const services = [
  { id: 'kuchyne', typ: 't1', img: 'grob_kuchyna.jpg', pos: '30% center', t: 'Kuchyne na mieru', short: 'Rovné, do L, U aj s ostrovčekom. Kovanie Blum, dosky Egger, drezy BLANCO.', price: '3 900 €',
    p: 'Kuchyňa je srdce domova. Navrhneme ju presne do vášho priestoru — od malej linky do bytu až po veľkú kuchyňu s ostrovčekom v rodinnom dome.',
    li: ['Rovné, rohové, do U aj s ostrovčekom', 'Rohové výsuvné systémy LeMans a Smart-Cube s podsvietením', 'Kovanie Blum, dosky Egger, drezy BLANCO, sklo Lacobel', 'Vstavané spotrebiče podľa vášho výberu'] },
  { id: 'skrine', typ: 't2', img: 'byt_nahlad-770x650.webp', t: 'Vstavané skrine a šatníky', short: 'Do spálne, hosťovskej izby aj chodby. Každý centimeter využitý.', price: '990 €',
    p: 'Vstavaná skriňa využije aj nepraktické kúty, výklenky a priestor až po strop. Vnútro navrhneme podľa toho, čo v nej budete naozaj skladovať.',
    li: ['Posuvné aj krídlové dvere, bez úchytiek alebo s profilom', 'Do spálne, chodby, podkrovia aj pod šikminy', 'Vnútorné vybavenie: zásuvky, tyče, výsuvné koše', 'Šatníky a celé steny úložných priestorov'] },
  { id: 'obyvacky', typ: 't3', img: 'Landanova-Obyvacka-interierovimajstri-770x892.webp', t: 'Obývačky a TV steny', short: 'Lamelové TV steny, knižnice a úložné priestory zladené s kuchyňou.', price: '1 200 €',
    p: 'Obývačka, v ktorej má všetko svoje miesto. TV stena s lamelami, knižnica či pracovný kút — farebne zladené s kuchyňou, aby priestor pôsobil ako celok.',
    li: ['Lamelové TV steny a obklady', 'Knižnice, komody a nízke skrinky', 'Pracovný kút a home office', 'Skryté vedenie káblov a podsvietenie'] },
  { id: 'izby', typ: 't4', img: '2-770x892.webp', t: 'Detské izby a spálne', short: 'Postele na poschodí, schody s úložným priestorom, šatníky.', price: '1 500 €',
    p: 'Detská izba, ktorá rastie s deťmi, a spálňa, v ktorej je poriadok. Bezpečné, praktické a s množstvom úložného priestoru.',
    li: ['Čalúnené postele na poschodí', 'Schodiská s úložným priestorom', 'Čelá postelí a nočné stolíky', 'Písacie stoly a šatníky'] },
  { id: 'byt', typ: 't5', img: 'full_vydrica_kuchyna_1.jpg', t: 'Kompletný byt na kľúč', short: 'Kuchyňa, skrine, obývačka aj chodba v jednom štýle.', price: '8 900 €',
    p: 'Celý byt alebo dom od jedného dodávateľa. Všetok nábytok navrhneme v jednom štýle, vyrobíme a namontujeme — vy riešite len jeden kontakt.',
    li: ['Kuchyňa, chodba, obývačka, spálne aj kúpeľňa', 'Jednotný štýl, materiály a farby', 'Jeden harmonogram a jeden kontakt', 'Napríklad celý dom v Chorvátskom Grobe za 5 týždňov'] },
  { id: 'komercne', typ: 't6', img: 'ilustracny-1-770x892.jpeg', t: 'Komerčné interiéry', short: 'Salóny, kancelárie a prevádzky. Aj podľa návrhu architekta.', price: null,
    p: 'Nábytok pre salóny, kancelárie a prevádzky. Vyrobíme podľa nášho návrhu alebo presne podľa projektu vášho architekta.',
    li: ['Úložné steny a recepcie', 'Minikuchynky pre personál', 'Zrkadlové a vstavané skrine', 'Napríklad kozmetický salón Anima za 3 týždne'] },
];

const faq = [
  ['Koľko stojí kuchyňa na mieru?', 'Bežná kuchynská linka do bytu vychádza od 3 900 €. Presnú cenu určí zameranie, materiály a kovanie. Po zameraní dostanete fixnú ponuku, ktorá sa už nezmení.'],
  ['Ako dlho trvá výroba a montáž?', 'Podľa rozsahu 3–6 týždňov. Napríklad kozmetický salón sme zariadili za 3 týždne, vstavané skrine v Sládkovičove za 4 a celý dom v Chorvátskom Grobe za 5 týždňov.'],
  ['Koľko je záloha?', 'Za zameranie a 3D návrh neplatíte nič. Záloha na materiál sa platí až po podpise zmluvy, zvyšok po montáži a odovzdaní.'],
  ['Pracujete aj mimo Bratislavy?', 'Áno. Okrem Bratislavy (Dúbravka, Nivy, Vydrica, Záhorská Bystrica…) sme realizovali napríklad v Chorvátskom Grobe, Viničnom a Sládkovičove. Pôsobíme do 50 km od Bratislavy.'],
  ['Spolupracujete aj s architektmi?', 'Áno. Návrh pripraví náš dizajnér, alebo vyrobíme nábytok podľa návrhu vášho architekta — tak vznikol napríklad kozmetický salón Anima.'],
  ['Čo ak sa mi návrh nebude páčiť?', 'Návrh upravíme, kým nebude podľa vás. Ak sa nedohodneme, neplatíte nič a nič nepodpisujete.'],
  ['Môžem si vybrať vlastné spotrebiče?', 'Samozrejme. Kuchyňu navrhneme na mieru vašim spotrebičom, alebo vám pomôžeme s výberom.'],
];

// ---------- Shared blocks ----------

const head = (p, b) => `<!doctype html>
<html lang="sk">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${p.title}</title>
  <meta name="description" content="${p.desc}" />
  <link rel="icon" href="${b}images/Logo_Interierovi_Majstri.webp" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${b}css/style.css" />
  <link rel="stylesheet" href="${b}css/pages.css" />
</head>
<body>
${sprite}`;

const header = (p, b) => `
  <div class="offer-bar">
    Do konca <span class="js-month">mesiaca</span>: <strong>zameranie + 3D návrh zdarma</strong> a LED osvetlenie kuchyne ako darček. <a href="${b}objednavka.html">Chcem ponuku</a>
  </div>
  <header>
    <div class="wrap nav">
      <a href="${b}index.html" class="logo"><img src="${b}images/Logo_Interierovi_Majstri_main.webp" alt="Interiéroví majstri logo" />Interiéroví majstri</a>
      <nav class="nav-links" id="nav" aria-label="Hlavná navigácia">
        ${NAV.map(([href, label]) => `<a href="${b}${href}"${p.file === href ? ' class="active"' : ''}>${label}</a>`).join('\n        ')}
      </nav>
      <div class="nav-cta">
        <a class="nav-icon" href="tel:${PHONE}" aria-label="Zavolať">${ic('phone')}</a>
        <a class="btn btn-primary" href="${b}objednavka.html">3D návrh zdarma</a>
        <button class="burger" id="burger" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>
`;

const footer = (p, b) => `
  <footer>
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <div class="foot-logo"><img src="${b}images/Logo_Interierovi_Majstri.webp" alt="" />Interiéroví majstri</div>
          <p><b style="color:#fff">Vaša vízia, náš nábytok.</b> Kuchyne, skrine a nábytok na mieru v Bratislave a okolí. Návrh, výroba a montáž od A po Z.</p>
          <div class="foot-social">
            <a href="https://www.instagram.com/imajstri/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
            <a href="https://www.facebook.com/profile.php?id=61573057973324" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="${WA}" target="_blank" rel="noopener" aria-label="WhatsApp">${ic('chat')}</a>
          </div>
        </div>
        <div>
          <h4>Rýchle odkazy</h4>
          <ul>${NAV.map(([href, label]) => `<li><a href="${b}${href}">${label}</a></li>`).join('')}<li><a href="${b}objednavka.html">Objednávka</a></li></ul>
        </div>
        <div>
          <h4>Kontakt</h4>
          <ul><li><a href="tel:${PHONE}">${PHONE_TXT}</a></li><li><a href="${WA}" target="_blank" rel="noopener">WhatsApp</a></li><li><a href="mailto:info@imajstri.sk">info@imajstri.sk</a></li><li>Landauova 3146/20, Bratislava</li><li>Po – Pi: 9:00 – 17:00</li></ul>
        </div>
        <div>
          <h4>Máte otázky?</h4>
          <p>Radi vám pripravíme nezáväznú ponuku a 3D návrh zdarma.</p>
          <a class="btn btn-primary foot-cta" href="${b}objednavka.html">Dopyt ${ic('arrow')}</a>
        </div>
      </div>
      <div class="foot-bottom"><span>© 2026 BK Creative s. r. o. · Interiéroví majstri · IČO: 56343744</span><span>Bratislava a okolie do 50 km</span></div>
    </div>
  </footer>

  <div class="m-bar">
    <a class="btn btn-ghost" href="tel:${PHONE}">${ic('phone')}Zavolať</a>
    <a class="btn btn-primary" href="${b}objednavka.html">3D návrh zdarma</a>
  </div>

  <script src="${b}js/main.js"></script>
</body>
</html>
`;

// 3-second rule on every page: what the page is about + the next step, without scrolling
const pageHero = (crumb, h1, lead, b, cta = true) => `
    <section class="page-hero">
      <div class="wrap">
        <div class="crumbs"><a href="${b}index.html">Domov</a> / ${crumb}</div>
        <h1>${h1}</h1>
        ${lead ? `<p class="lead">${lead}</p>` : ''}
        ${cta ? `<div class="hero-actions">
          <a class="btn btn-primary" href="${b}objednavka.html">Chcem 3D návrh zdarma ${ic('arrow')}</a>
          <a class="btn btn-ghost" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a>
        </div>` : ''}
      </div>
    </section>`;

// Offer rule on every page: concrete value, bonus, deadline, risk reversal
const ctaBand = (b, h = 'Získajte 3D návrh a cenu zdarma', sub = 'Do konca <span class="js-month">mesiaca</span>: zameranie (60 €) + 3D návrh (150 €) zdarma a LED osvetlenie kuchyne ako darček. Nepáči sa vám návrh? Neplatíte nič.') => `
    <section class="cta-band">
      <div class="wrap">
        <div><h2>${h}</h2><p>${sub}</p></div>
        <div class="btns">
          <a class="btn btn-primary" href="${b}objednavka.html">Chcem 3D návrh zdarma ${ic('arrow')}</a>
          <a class="btn btn-light" href="${WA}" target="_blank" rel="noopener">${ic('chat')}WhatsApp</a>
        </div>
      </div>
    </section>`;

const partners = (b) => `
    <div class="partners">
      <div class="wrap">
        <p>Pracujeme s overenými materiálmi a kovaním</p>
        <div class="partner-logos">
          <img src="${b}images/blum_imajstri.webp" alt="Blum" />
          <img src="${b}images/egger_imajstri.webp" alt="Egger" />
          <img src="${b}images/knauf_imajstri.webp" alt="Knauf" />
          <img src="${b}images/logo-benalexplus-imajstri.webp" alt="Benalex" />
          <span style="font-weight:800;letter-spacing:.08em;color:#8A8077">BLANCO</span>
          <span style="font-weight:800;letter-spacing:.08em;color:#8A8077">PEBE</span>
        </div>
      </div>
    </div>`;

const azSteps = `
        <div class="az-steps">
          <div class="az-step">${ic('chat')}<b>Konzultácia</b><span>u vás alebo online</span></div>
          <div class="az-step">${ic('ruler')}<b>Zameranie</b><span>laserom, na milimeter</span></div>
          <div class="az-step">${ic('cube')}<b>3D návrh</b><span>uvidíte ho ešte pred výrobou</span></div>
          <div class="az-step">${ic('factory')}<b>Výroba</b><span>z overených materiálov</span></div>
          <div class="az-step">${ic('truck')}<b>Doprava</b><span>aj vynáška na poschodie</span></div>
          <div class="az-step">${ic('wrench')}<b>Montáž</b><span>vrátane spotrebičov</span></div>
          <div class="az-step">${ic('broom')}<b>Upratanie</b><span>a odvoz starého nábytku</span></div>
        </div>`;

const azSection = (b) => `
    <section class="az">
      <div class="wrap">
        <div class="center">
          <span class="eyebrow" style="color:var(--oak)">Komplet služby</span>
          <h2>Všetko vybavíme za vás — od A po Z</h2>
          <p class="lead">Nemusíte koordinovať stolára, dopravu, montážnikov ani elektrikára. Máte jeden kontakt a jednu zodpovednú firmu.</p>
        </div>${azSteps}
        <div class="az-foot"><strong>Vy si len vyberiete. My sa postaráme o zvyšok.</strong><a class="btn btn-primary" href="${b}objednavka.html">Začať 3D návrhom zdarma</a></div>
      </div>
    </section>`;

const processSection = (b) => `
    <section id="postup" style="background:var(--bg-alt)">
      <div class="wrap">
        <div class="center">
          <span class="eyebrow">Postup krok po kroku</span>
          <h2>Od prvého stretnutia po hotový nábytok za 3–6 týždňov</h2>
          <p class="lead">Jednoduchý proces, úžasné výsledky.</p>
        </div>
        <div class="process-grid">
          <div class="p-step"><div class="p-num">1</div><h3>Poradenstvo a konzultácie</h3><p>Začneme tým, že sa s vami porozprávame o vašich predstavách a požiadavkách. Zadarmo, u vás alebo online.</p><span class="p-time">ozveme sa do 24 h</span></div>
          <div class="p-step"><div class="p-num">2</div><h3>Návrh a vizualizácia</h3><p>Spoločne navrhneme nábytok, ktorý bude presne zodpovedať vašim požiadavkám a štýlu. Dostanete 3D návrh a fixnú cenu.</p><span class="p-time">do 7 dní</span></div>
          <div class="p-step"><div class="p-num">3</div><h3>Výroba a realizácia</h3><p>Po schválení návrhu prejdeme k výrobe, pričom každý detail je starostlivo spracovaný.</p><span class="p-time">2–5 týždňov</span></div>
          <div class="p-step"><div class="p-num">4</div><h3>Doprava a montáž</h3><p>Váš nový nábytok doručíme a namontujeme priamo u vás doma, aby ste sa mohli ihneď tešiť z výsledku.</p><span class="p-time">1–2 dni</span></div>
        </div>
        <div class="center" style="margin-top:44px"><a class="btn btn-primary" href="${b}objednavka.html">Dohodnúť prvé stretnutie zdarma</a></div>
      </div>
    </section>`;

const reviewsSection = `
    <section class="reviews" id="recenzie">
      <div class="wrap">
        <div class="rev-top">
          <div>
            <span class="eyebrow">Recenzie</span>
            <h2>Čo hovoria naši zákazníci</h2>
          </div>
          <div class="g-badge"><span class="stars">★★★★★</span><div><b style="font-size:18px">Recenzie na Google</b><small>overené hodnotenia zákazníkov</small></div></div>
        </div>
        <div class="rev-grid">
          <div class="rev"><span class="stars">★★★★★</span><p>„Kuchyňu sme mali hotovú za 6 týždňov, presne ako sme sa dohodli. Rohový výsuvný systém je geniálny — konečne využijeme celý roh.“</p><div class="rev-who"><i>L</i><div><b>Meno zákazníka</b><span>kuchyňa · Viničné</span></div></div></div>
          <div class="rev"><span class="stars">★★★★★</span><p>„Zariadili nám celý dom — kuchyňu, spálne, detskú izbu aj kúpeľňu. Všetko ladí a riešili sme to s jedným človekom.“</p><div class="rev-who"><i>R</i><div><b>Meno zákazníka</b><span>celý dom · Chorvátsky Grob</span></div></div></div>
          <div class="rev"><span class="stars">★★★★★</span><p>„Skrine do spálne, hosťovskej izby aj chodby boli hotové za 4 týždne. Rýchla komunikácia a čistá montáž.“</p><div class="rev-who"><i>Ľ</i><div><b>Meno zákazníka</b><span>vstavané skrine · Sládkovičovo</span></div></div></div>
        </div>
      </div>
    </section>`;

const faqSection = (items) => `
    <section id="faq">
      <div class="wrap faq-grid">
        <div>
          <span class="eyebrow">Časté otázky</span>
          <h2>Na čo sa nás najčastejšie pýtate</h2>
          <p class="lead">Nenašli ste odpoveď? Zavolajte nám na <a href="tel:${PHONE}" style="color:var(--accent);font-weight:700">0918 638 713</a>.</p>
        </div>
        <div>
          ${items.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('\n          ')}
        </div>
      </div>
    </section>`;

const quizForm = `
        <form class="quiz" id="quiz" novalidate>
          <div class="q-progress"><span id="q-label">Krok 1 z 3</span><span>Zaberie to 30 sekúnd</span></div>
          <div class="q-bar"><i id="q-bar"></i></div>

          <div class="q-step active" data-step="1">
            <h3>Čo plánujete?</h3>
            <div class="q-opts">
              <div class="q-opt"><input type="checkbox" id="t1" name="typ" value="Kuchyňa" /><label for="t1">${ic('kitchen')}Kuchyňa</label></div>
              <div class="q-opt"><input type="checkbox" id="t2" name="typ" value="Vstavaná skriňa" /><label for="t2">${ic('wardrobe')}Vstavaná skriňa</label></div>
              <div class="q-opt"><input type="checkbox" id="t3" name="typ" value="Obývačka / TV stena" /><label for="t3">${ic('tv')}Obývačka / TV stena</label></div>
              <div class="q-opt"><input type="checkbox" id="t4" name="typ" value="Detská izba / spálňa" /><label for="t4">${ic('bed')}Detská izba / spálňa</label></div>
              <div class="q-opt"><input type="checkbox" id="t5" name="typ" value="Celý byt / dom" /><label for="t5">${ic('home')}Celý byt / dom</label></div>
              <div class="q-opt"><input type="checkbox" id="t6" name="typ" value="Iné" /><label for="t6">${ic('plus')}Iné / firma</label></div>
            </div>
          </div>

          <div class="q-step" data-step="2">
            <h3>Kde a kedy?</h3>
            <div class="field"><label for="f-loc">Lokalita</label><input id="f-loc" name="lokalita" placeholder="napr. Bratislava – Petržalka" /></div>
            <div class="field-row">
              <div class="field"><label for="f-when">Kedy chcete začať?</label>
                <select id="f-when" name="termin"><option value="">Vyberte</option><option>Čo najskôr</option><option>Do 3 mesiacov</option><option>O 3–6 mesiacov</option><option>Zatiaľ len zisťujem</option></select></div>
              <div class="field"><label for="f-budget">Približný rozpočet</label>
                <select id="f-budget" name="rozpocet"><option value="">Neviem / nechcem uviesť</option><option>do 3 000 €</option><option>3 000 – 6 000 €</option><option>6 000 – 12 000 €</option><option>nad 12 000 €</option></select></div>
            </div>
            <div class="field"><label for="f-file">Pôdorys alebo fotky (nepovinné)</label><input id="f-file" name="subory" type="file" multiple accept="image/*,.pdf" /></div>
          </div>

          <div class="q-step" data-step="3">
            <h3>Kam vám pošleme návrh?</h3>
            <div class="field"><label for="f-name">Meno</label><input id="f-name" name="meno" autocomplete="name" placeholder="Vaše meno" /></div>
            <div class="field-row">
              <div class="field"><label for="f-tel">Telefón</label><input id="f-tel" name="telefon" type="tel" autocomplete="tel" placeholder="+421 9xx xxx xxx" /></div>
              <div class="field"><label for="f-mail">E-mail (nepovinné)</label><input id="f-mail" name="email" type="email" autocomplete="email" placeholder="vas@email.sk" /></div>
            </div>
            <div class="field"><label for="f-msg">Poznámka (nepovinné)</label><textarea id="f-msg" name="sprava" rows="2" placeholder="Rozmery, štýl, čokoľvek dôležité…"></textarea></div>
            <label class="gdpr"><input type="checkbox" id="f-gdpr" />Súhlasím so spracovaním osobných údajov za účelom vypracovania ponuky.</label>
          </div>

          <div class="q-step" data-step="4">
            <div class="q-done">
              ${ic('check')}
              <h3>Ďakujeme, dopyt máme!</h3>
              <p>Ozveme sa vám do 24 hodín a dohodneme termín bezplatného zamerania.</p>
            </div>
          </div>

          <p class="q-err" id="q-err" role="alert"></p>
          <div class="q-nav" id="q-nav">
            <button type="button" class="q-back" id="q-back" style="visibility:hidden">← Späť</button>
            <button type="button" class="btn btn-primary" id="q-next">Pokračovať ${ic('arrow')}</button>
          </div>
        </form>`;

const figure = (pr, b, wide) => `<figure class="project${wide ? ' wide' : ''}" data-c="${pr.cat}"><img src="${b}images/${pr.img}" alt="${pr.t} – ${pr.loc}" loading="lazy"${pr.pos ? ` style="object-position:${pr.pos}"` : ''} /><figcaption><b>${pr.t} · ${pr.loc}</b><span>${pr.time}</span></figcaption></figure>`;

// ---------- Pages ----------

const pages = [];

// Domov
pages.push({ file: 'index.html', title: 'Kuchyne a nábytok na mieru Bratislava | Interiéroví majstri', desc: 'Kuchyne, vstavané skrine a nábytok na mieru v Bratislave a okolí. Návrh, výroba a montáž od A po Z. Fixná cena v zmluve, 3D návrh zdarma.',
  body: (b) => `
    <section class="hero">
      <div class="wrap">
        <div class="hero-grid">
          <div>
            <span class="eyebrow">Bratislava a okolie do 50 km</span>
            <h1>Kuchyne a nábytok <em>na mieru</em> — od návrhu až po montáž</h1>
            <p class="lead">Navrhneme, vyrobíme a namontujeme. Jedna firma, jedna fixná cena v zmluve, žiadne doplatky.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="${b}objednavka.html">Chcem 3D návrh zdarma ${ic('arrow')}</a>
              <a class="btn btn-ghost" href="${b}realizacie.html">Pozrieť realizácie</a>
            </div>
            <p class="hero-micro">${ic('check')}Ozveme sa do 24 hodín · nezáväzne · bez zálohy za návrh</p>
            <div class="hero-facts">
              <div class="fact"><b>3–6 týž.</b><span>od návrhu po montáž</span></div>
              <div class="fact"><b>do 24 h</b><span>sa vám ozveme</span></div>
              <div class="fact"><b>0 €</b><span>konzultácia a 3D návrh</span></div>
            </div>
          </div>
          <div class="hero-media">
            <img src="${b}images/2025_03_interierovi_majstri_obyvacka_kuchyna.webp" alt="Obývačka s lamelovou stenou a kuchyňa s ostrovčekom – realizácia Záhorská Bystrica" />
            <span class="hero-tag">Naša realizácia · Záhorská Bystrica</span>
            <div class="hero-card">
              <div class="stars">★★★★★</div>
              <p>Hodnotenie na Google</p>
              <ul>
                <li>${ic('check')}Fixná cena v zmluve</li>
                <li>${ic('check')}Termín montáže v zmluve</li>
                <li>${ic('check')}Po montáži upraceme</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
${partners(b)}

    <section class="offer" id="ponuka">
      <div class="wrap">
        <div class="offer-box">
          <div class="offer-main">
            <span class="offer-label"><svg width="16" height="16"><use href="#i-gift"/></svg><span>Ponuka mesiaca · platí do konca <span class="js-month">mesiaca</span></span></span>
            <h2>Zameranie a 3D návrh zdarma + LED osvetlenie ako darček</h2>
            <ul class="offer-list">
              <li><span class="what">${ic('ruler')}Laserové zameranie u vás doma</span><span class="price"><s>60 €</s><b>0 €</b></span></li>
              <li><span class="what">${ic('cube')}3D vizualizácia v 2 variantoch</span><span class="price"><s>150 €</s><b>0 €</b></span></li>
              <li><span class="what">${ic('light')}LED podsvietenie pracovnej dosky pri objednávke kuchyne</span><span class="price"><s>250 €</s><b>darček</b></span></li>
            </ul>
            <div class="offer-total"><span>Ušetríte</span><span>až 460 €</span></div>
          </div>
          <div class="offer-side">
            <div class="deadline">Platí do konca <span class="js-month">mesiaca</span><small id="days-left"></small></div>
            <div class="slots"><b>Mesačne prijímame len obmedzený počet zákaziek</b> — aby sme dodržali každý termín v zmluve.</div>
            <div class="guarantee">${ic('shield')}<div><b>Garancia spokojnosti s návrhom</b>Ak sa vám 3D návrh nebude páčiť, neplatíte nič a nič nepodpisujete.</div></div>
            <a class="btn btn-primary" href="${b}objednavka.html">Rezervovať bezplatné zameranie</a>
          </div>
        </div>
      </div>
    </section>

    <section id="sluzby">
      <div class="wrap">
        <div class="sec-head">
          <div>
            <span class="eyebrow">Čo vyrábame</span>
            <h2>Nábytok na mieru do celého bytu</h2>
            <p class="lead">Orientačné ceny vidíte hneď. Presnú cenu dostanete po zameraní — a tá sa už nezmení.</p>
          </div>
          <a class="link-more" href="${b}sluzby.html">Všetky služby →</a>
        </div>
        <div class="services-grid">
          ${services.map((s) => `<article class="service">
            <a href="${b}sluzby.html#${s.id}"><img src="${b}images/${s.img}" alt="${s.t}" loading="lazy"${s.pos ? ` style="object-position:${s.pos}"` : ''} /></a>
            <div class="service-body">
              <h3>${s.t}</h3>
              <p>${s.short}</p>
              <div class="service-foot"><span class="from">${s.price ? `od <b>${s.price}</b>` : '<b>individuálne</b>'}</span><a href="${b}sluzby.html#${s.id}">Viac →</a></div>
            </div>
          </article>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="photo-band">
      <img src="${b}images/grob_kuchyna.jpg" alt="Kuchyňa v rodinnom dome – Chorvátsky Grob" loading="lazy" style="object-position:30% 60%" />
      <div class="wrap">
        <div>
          <span class="eyebrow" style="color:#F0B98E">Realizácia · Chorvátsky Grob</span>
          <h2>Celý dom na mieru za 5 týždňov</h2>
          <p>Kuchyňa, chodba, spálne, kúpeľňa, obývačka aj detská izba — jeden návrh, jeden tím.</p>
        </div>
        <a class="btn btn-primary" href="${b}realizacie.html">Pozrieť realizácie</a>
      </div>
    </section>
${azSection(b)}

    <section id="realizacie">
      <div class="wrap">
        <div class="sec-head">
          <div>
            <span class="eyebrow">Realizácie</span>
            <h2>Skutočné projekty, skutočné byty</h2>
          </div>
          <a class="link-more" href="${b}realizacie.html">Všetky realizácie →</a>
        </div>
        <div class="gallery">
          ${figure(projects[0], b, true)}
          ${figure(projects[2], b)}
          ${figure(projects[3], b)}
          ${figure(projects[4], b)}
          ${figure(projects[5], b)}
          ${figure(projects[1], b, true)}
        </div>
      </div>
    </section>

    <section class="team">
      <div class="wrap team-grid">
        <div>
          <span class="eyebrow">Kto sme</span>
          <h2>Nehovoríte s predajcom, ale priamo s dizajnérom</h2>
          <p class="lead">Nie sme reťazec s desiatkami predajní. Váš projekt od prvého stretnutia až po montáž vedie jeden človek — ten, ktorý ho aj navrhuje.</p>
          <ul class="team-points">
            <li>${ic('check')}Jeden kontakt počas celej zákazky</li>
            <li>${ic('check')}Realizujeme aj podľa návrhu vášho architekta</li>
            <li>${ic('check')}Bratislava a okolie do 50 km</li>
          </ul>
        </div>
        <div class="team-cards">
          <a class="member" href="${b}nas-tim.html"><i>J</i><div><b>Jozef</b><span>Návrh, konzultácie a vedenie projektov</span></div></a>
          <a class="member" href="${b}nas-tim.html"><i>D</i><div><b>Dušan</b><span>Návrh a 3D vizualizácie</span></div></a>
          <a class="member member-cta" href="${WA}" target="_blank" rel="noopener"><i>${ic('chat')}</i><div><b>Napíšte nám na WhatsApp</b><span>Pošlite fotku priestoru a odpovieme ešte dnes</span></div></a>
        </div>
      </div>
    </section>
${reviewsSection}
${ctaBand(b)}` });

// O nás
pages.push({ file: 'o-nas.html', title: 'O nás – Interiéroví majstri | Nábytok na mieru Bratislava', desc: 'Interiéroví majstri – návrh, výroba a montáž nábytku na mieru v Bratislave. Fixná cena, termín v zmluve, záruka 5 rokov.',
  body: (b) => `${pageHero('O nás', 'Nábytok na mieru od návrhu po montáž — v jednej firme', 'Vaša vízia, náš nábytok. Navrhneme, vyrobíme a namontujeme nábytok na mieru v Bratislave a okolí — s fixnou cenou a termínom v zmluve.', b)}

    <section>
      <div class="wrap story">
        <div>
          <span class="eyebrow">Kto sme</span>
          <h2>Nábytok, ktorý sa prispôsobí vašim snom</h2>
          <p>Sme odborníci na výrobu nábytku na mieru, ktorí vnímajú každú objednávku ako príležitosť pre vytvorenie jedinečného kúska priamo podľa vašich predstáv. Či už ide o moderný dizajn, minimalistické línie alebo sofistikované detaily — váš nápad je našou inšpiráciou.</p>
          <p>S nami si môžete byť istí, že každý kus nábytku je originál, ktorý dokonale zapadne do vášho interiéru. Naša filozofia je jednoduchá — čo si dokážete predstaviť, to vieme vytvoriť.</p>
          <p>S vaším projektom pracuje priamo dizajnér, ktorý ho navrhuje — od prvého stretnutia cez 3D návrh až po odovzdanie hotového nábytku.</p>
        </div>
        <img src="${b}images/full_vydrica_kuchyna_1.jpg" alt="Kuchyňa na mieru – Vydrica, Bratislava" loading="lazy" />
      </div>
    </section>
${processSection(b)}

    <section class="compare">
      <div class="wrap">
        <div class="center">
          <span class="eyebrow">Prečo my</span>
          <h2>Porovnajte si to sami</h2>
        </div>
        <div class="cmp">
          <div class="cmp-row cmp-head"><div></div><div>Interiéroví majstri</div><div>Bežné štúdio / stolár</div></div>
          <div class="cmp-row"><div>Návrh, výroba aj montáž v jednej firme</div><div><svg class="yes"><use href="#i-check"/></svg>Áno</div><div><svg class="no"><use href="#i-x"/></svg>Často subdodávky</div></div>
          <div class="cmp-row"><div>Cena po podpise zmluvy</div><div><svg class="yes"><use href="#i-check"/></svg>Fixná</div><div><svg class="no"><use href="#i-x"/></svg>Doplatky počas realizácie</div></div>
          <div class="cmp-row"><div>Termín montáže</div><div><svg class="yes"><use href="#i-check"/></svg>V zmluve</div><div><svg class="no"><use href="#i-x"/></svg>„Keď to bude hotové“</div></div>
          <div class="cmp-row"><div>3D návrh</div><div><svg class="yes"><use href="#i-check"/></svg>Zdarma</div><div><svg class="no"><use href="#i-x"/></svg>100–200 €</div></div>
          <div class="cmp-row"><div>Upratanie a odvoz starého nábytku</div><div><svg class="yes"><use href="#i-check"/></svg>V cene</div><div><svg class="no"><use href="#i-x"/></svg>Za príplatok</div></div>
          <div class="cmp-row"><div>Záruka</div><div><svg class="yes"><use href="#i-check"/></svg>5 rokov na materiál aj prácu</div><div><svg class="no"><use href="#i-x"/></svg>Zákonné 2 roky</div></div>
          <div class="cmp-row"><div>Návrh od vlastného dizajnéra</div><div><svg class="yes"><use href="#i-check"/></svg>Áno</div><div><svg class="no"><use href="#i-x"/></svg>Často len predajca</div></div>
        </div>
        <div class="guar-grid">
          <div class="guar">${ic('lock')}<h3>Fixná cena</h3><p>Cena v zmluve platí. Žiadne „ešte treba doplatiť“.</p></div>
          <div class="guar">${ic('calendar')}<h3>Termín v zmluve</h3><p>Dátum montáže dostanete písomne pri podpise.</p></div>
          <div class="guar">${ic('shield')}<h3>Záruka 5 rokov</h3><p>Na materiál aj prácu. Kovanie Blum a dosky Egger vydržia roky.</p></div>
          <div class="guar">${ic('broom')}<h3>Čisto po montáži</h3><p>Odvezieme obaly, odpad aj starú kuchyňu.</p></div>
        </div>
      </div>
    </section>
${partners(b)}
${ctaBand(b)}` });

// Náš tím
pages.push({ file: 'nas-tim.html', title: 'Náš tím – Interiéroví majstri | Nábytok na mieru Bratislava', desc: 'Ľudia za vaším nábytkom na mieru. Dizajnéri Jozef a Dušan – návrh, 3D vizualizácie a vedenie projektov.',
  body: (b) => `${pageHero('Náš tím', 'Ľudia, ktorí váš nábytok navrhnú aj dotiahnu do konca', 'S vaším projektom nepracuje predajca, ale priamo dizajnér. Od prvého stretnutia až po odovzdanie máte jeden kontakt.', b)}

    <section>
      <div class="wrap">
        <div class="team-big">
          <div class="person-card"><div class="ava">J</div><h3>Jozef</h3><div class="role">Návrh, konzultácie a vedenie projektov</div><p>Prvé stretnutie, zameranie, návrh a dohľad nad výrobou aj montážou. Autor návrhov pri Nivách, vo Vydrici, Viničnom a Sládkovičove.</p></div>
          <div class="person-card"><div class="ava">D</div><h3>Dušan</h3><div class="role">Návrh a 3D vizualizácie</div><p>3D návrhy, materiály a detaily. Autor návrhu celého domu v Chorvátskom Grobe vrátane detskej izby pre dvoch súrodencov.</p></div>
          <a class="person-card wa" href="${WA}" target="_blank" rel="noopener"><div class="ava">${ic('chat')}</div><h3>Napíšte nám</h3><div class="role">WhatsApp · ${PHONE_TXT}</div><p>Pošlite fotku alebo pôdorys priestoru a ozveme sa ešte v ten deň.</p></a>
        </div>
      </div>
    </section>

    <section style="background:var(--bg-alt)">
      <div class="wrap">
        <div class="center">
          <span class="eyebrow">Ako pracujeme</span>
          <h2>Na čom nám záleží</h2>
        </div>
        <div class="values">
          <div class="guar">${ic('ruler')}<h3>Nábytok na mieru</h3><p>S nami si môžete byť istí, že váš nábytok bude presne podľa vašich predstáv — od dizajnu po materiál.</p></div>
          <div class="guar">${ic('light')}<h3>Kreatívne riešenia</h3><p>Nebojíme sa inovácií. Čo si dokážete predstaviť, to vám pomôžeme realizovať.</p></div>
          <div class="guar">${ic('shield')}<h3>Kvalita a trvácnosť</h3><p>Kladieme dôraz na kvalitu spracovania a výber materiálov, aby nábytok vydržal roky.</p></div>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap story">
        <img src="${b}images/ilustracny-1-770x892.jpeg" alt="Kozmetický salón Anima" loading="lazy" />
        <div>
          <span class="eyebrow">Spolupráca</span>
          <h2>Pracujeme aj s architektmi</h2>
          <p>Ak už máte návrh od architekta, vyrobíme a namontujeme nábytok presne podľa neho. Takto vznikol napríklad kozmetický salón Anima podľa návrhu ToøL. interior architects — hotový za 3 týždne.</p>
          <p style="margin-top:22px"><a class="btn btn-primary" href="${b}objednavka.html">Poslať projekt na nacenenie</a></p>
        </div>
      </div>
    </section>
${ctaBand(b)}` });

// Služby
pages.push({ file: 'sluzby.html', title: 'Služby – Kuchyne, vstavané skrine a nábytok na mieru Bratislava | Interiéroví majstri', desc: 'Kuchyne na mieru od 3 900 €, vstavané skrine od 990 €, obývačky, detské izby, kompletné byty a komerčné interiéry. Bratislava a okolie.',
  body: (b) => `${pageHero('Služby', 'Kuchyne, skrine a nábytok na mieru — navrhneme, vyrobíme, namontujeme', 'Každý kúsok, ktorý vyrobíme, je odrazom vášho štýlu. Či už hľadáte štýlový nábytok do obývačky, kuchyňu na mieru alebo unikátne úložné riešenia, sme tu pre vás.', b)}

    <section style="padding-top:24px">
      <div class="wrap">
        ${services.map((s) => `<div class="svc" id="${s.id}">
          <div class="svc-media"><img src="${b}images/${s.img}" alt="${s.t}" loading="lazy"${s.pos ? ` style="object-position:${s.pos}"` : ''} /></div>
          <div>
            <h2>${s.t}</h2>
            <p>${s.p}</p>
            <ul>${s.li.map((x) => `<li>${ic('check')}${x}</li>`).join('')}</ul>
            <div class="svc-foot">
              <span class="svc-price">${s.price ? `od <b>${s.price}</b>` : '<b>individuálne</b>'}</span>
              <a class="btn btn-primary" href="${b}objednavka.html?typ=${s.typ}">Chcem ponuku</a>
            </div>
          </div>
        </div>`).join('\n        ')}
      </div>
    </section>
${azSection(b)}
${faqSection(faq)}
${ctaBand(b)}` });

// Realizácie
pages.push({ file: 'realizacie.html', title: 'Realizácie – Kuchyne a nábytok na mieru Bratislava | Interiéroví majstri', desc: 'Naše realizácie: kuchyne, vstavané skrine, detské izby a celé byty na mieru v Bratislave, Chorvátskom Grobe, Viničnom a Sládkovičove.',
  body: (b) => `${pageHero('Realizácie', 'Skutočné príbehy, skutočné výsledky', 'Kuchyne, skrine a celé byty na mieru v Bratislave a okolí. Pri každom projekte vidíte lokalitu, rozsah a za ako dlho bol hotový.', b)}

    <section style="padding-top:48px">
      <div class="wrap">
        <div class="filters" role="tablist">
          <button class="active" data-f="all">Všetko</button>
          <button data-f="kuchyne">Kuchyne</button>
          <button data-f="skrine">Skrine</button>
          <button data-f="izby">Izby</button>
          <button data-f="byty">Celé byty a domy</button>
          <button data-f="firmy">Firmy</button>
        </div>
        <div class="proj-grid">
          ${projects.map((pr) => `<article class="proj-card" data-c="${pr.cat}">
            <img src="${b}images/${pr.img}" alt="${pr.t} – ${pr.loc}" loading="lazy"${pr.pos ? ` style="object-position:${pr.pos}"` : ''} />
            <div class="proj-body">
              <div class="proj-meta"><span class="chip">${pr.loc}</span><span class="chip">${ic('clock').replace('<svg>', '<svg width="12" height="12" style="vertical-align:-1px;margin-right:4px">')}${pr.time}</span></div>
              <h3>${pr.t}</h3>
              <p>${pr.d}</p>
              ${pr.by ? `<span class="proj-by">Návrh: ${pr.by}</span>` : ''}
            </div>
          </article>`).join('\n          ')}
        </div>
        <div class="gallery-cta">
          <p><b>Páči sa vám niektorá realizácia?</b> Navrhneme podobnú presne do vášho priestoru.</p>
          <a class="btn btn-primary" href="${b}objednavka.html">Chcem podobný návrh zdarma</a>
        </div>
      </div>
    </section>
${reviewsSection}
${ctaBand(b)}` });

// Blog
pages.push({ file: 'blog/index.html', title: 'Blog – Rady k nábytku na mieru | Interiéroví majstri', desc: 'Rady a inšpirácie ku kuchyniam, vstavaným skriniam a nábytku na mieru.',
  body: (b) => `${pageHero('Blog', 'Rady a inšpirácie k nábytku na mieru', 'Praktické články, ktoré vám pomôžu naplánovať kuchyňu, skriňu či celý byt.', b)}

    <section>
      <div class="wrap">
        <div class="blog-grid">
          <article class="blog-card"><img src="${b}images/vinicne_1-770x892.webp" alt="" loading="lazy" /><div class="blog-body"><span class="soon">Pripravujeme</span><h3>Koľko stojí kuchyňa na mieru v roku 2026</h3><p>Čo ovplyvňuje cenu, kde sa dá ušetriť a kde radšej nie.</p></div></article>
          <article class="blog-card"><img src="${b}images/1-2-770x892.jpeg" alt="" loading="lazy" /><div class="blog-body"><span class="soon">Pripravujeme</span><h3>Vstavaná skriňa: posuvné alebo krídlové dvere?</h3><p>Výhody, nevýhody a čo sa hodí do malej spálne či chodby.</p></div></article>
          <article class="blog-card"><img src="${b}images/1_kuchyna_nivy_nahlad-770x892.webp" alt="" loading="lazy" /><div class="blog-body"><span class="soon">Pripravujeme</span><h3>7 chýb pri plánovaní kuchyne na mieru</h3><p>Na čo nezabudnúť pri rozložení, zásuvkách a spotrebičoch.</p></div></article>
        </div>
      </div>
    </section>
${ctaBand(b, 'Radšej to preberieme osobne?', 'Prvé stretnutie je zadarmo a nezáväzné.')}` });

// Objednávka
pages.push({ file: 'objednavka.html', title: 'Nezáväzná cenová ponuka a 3D návrh zdarma | Interiéroví majstri', desc: 'Získajte 3D návrh a cenu nábytku na mieru zdarma. 3 krátke otázky, ozveme sa do 24 hodín.',
  body: (b) => `${pageHero('Objednávka', 'Nezáväzná ponuka a 3D návrh zdarma', 'Odpovedzte na 3 krátke otázky. Ozveme sa do 24 hodín a dohodneme termín zamerania. Do konca <span class="js-month">mesiaca</span> je zameranie aj 3D návrh zdarma.', b, false)}

    <section style="padding:56px 0">
      <div class="wrap">
        <div class="center" style="margin-bottom:32px"><span class="eyebrow">Ako to funguje?</span></div>
        <div class="steps3">
          <div class="step3"><b>1</b><h3>Vyplníte dopyt</h3><p>Typ nábytku, lokalita a kontakt. Fotky alebo pôdorys môžete priložiť.</p></div>
          <div class="step3"><b>2</b><h3>Ozveme sa do 24 h</h3><p>Dohodneme bezplatné stretnutie a zameranie u vás alebo online.</p></div>
          <div class="step3"><b>3</b><h3>Dostanete 3D návrh</h3><p>Do 7 dní 3D vizualizácia a fixná cena. Nepáči sa? Neplatíte nič.</p></div>
        </div>
      </div>
    </section>

    <section class="lead-sec" id="dopyt">
      <div class="wrap lead-grid">
        <div>
          <span class="eyebrow" style="color:#F0B98E">Nezáväzný dopyt</span>
          <h2>Získajte 3D návrh a cenu zdarma</h2>
          <p class="lead">3 krátke otázky, 30 sekúnd.</p>
          <ul class="lead-points">
            <li>${ic('check')}Zameranie a 3D návrh zdarma do konca <span class="js-month">mesiaca</span></li>
            <li>${ic('check')}Fixná cena — žiadne doplatky</li>
            <li>${ic('check')}Nepáči sa vám návrh? Neplatíte nič.</li>
          </ul>
          <div class="person">
            <i>JK</i>
            <div><b>Jozef Kutalek</b>Návrh a konzultácie — ozvem sa vám osobne<br /><a href="tel:${PHONE}">${PHONE_TXT}</a> · <a href="${WA}" target="_blank" rel="noopener">WhatsApp</a></div>
          </div>
        </div>
${quizForm}
      </div>
    </section>` });

// Kontakt
pages.push({ file: 'kontakt.html', title: 'Kontakt – Interiéroví majstri | Nábytok na mieru Bratislava | +421 918 638 713', desc: 'Kontakt: +421 918 638 713, info@imajstri.sk, Landauova 3146/20, Bratislava. Po – Pi 9:00 – 17:00.',
  body: (b) => `${pageHero('Kontakt', 'Bezplatná konzultácia k nábytku na mieru', 'Máte otázky ohľadom našej práce? Máte záujem o bezplatnú konzultáciu? Neváhajte nás kontaktovať cez telefón, WhatsApp alebo e-mail. Odpovedáme v najkratšom možnom čase, väčšinou do 24 hodín.', b)}

    <section>
      <div class="wrap contact-grid">
        <div class="contact-cards">
          <a class="c-card" href="tel:${PHONE}"><span class="ic">${ic('phone')}</span><div><small>Telefón</small><b>${PHONE_TXT}</b></div></a>
          <a class="c-card wa" href="${WA}" target="_blank" rel="noopener"><span class="ic">${ic('chat')}</span><div><small>WhatsApp</small><b>Napísať správu</b></div></a>
          <a class="c-card" href="mailto:info@imajstri.sk"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span><div><small>E-mail</small><b>info@imajstri.sk</b></div></a>
          <div class="c-card"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span><div><small>Adresa</small><b>Landauova 3146/20, 841 01 Bratislava</b></div></div>
          <div class="c-card"><span class="ic">${ic('clock')}</span><div><small>Pracovný čas</small><b>Po – Pi: 9:00 – 17:00</b><small>So – Ne: individuálne</small></div></div>
          <p class="company">BK Creative s. r. o. · IČO: 56343744 · DIČ: 2122278433 · IČ DPH: SK2122278433</p>
        </div>
        <iframe class="map" title="Mapa – Landauova 3146/20, Bratislava" loading="lazy" src="https://www.google.com/maps?q=Landauova+3146%2F20,+841+01+Bratislava&output=embed"></iframe>
      </div>
    </section>
${ctaBand(b, 'Potrebujete cenovú ponuku?', 'Vyplňte krátky dopyt a do 24 hodín sa vám ozveme.')}` });

// ---------- Write ----------

for (const p of pages) {
  const depth = p.file.split('/').length - 1;
  const b = '../'.repeat(depth);
  const html = head(p, b) + header(p, b) + '\n  <main>' + p.body(b) + '\n  </main>\n' + footer(p, b);
  const out = path.join(root, p.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log('built', p.file, html.length);
}
