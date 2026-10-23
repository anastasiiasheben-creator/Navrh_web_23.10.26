// Static site builder for the Interiéroví majstri proposal.
// Run from anywhere: node _src/build.mjs
// Structure, content and rules follow IMajstri_Technicke_zadanie_web_2026.pdf.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sprite = fs.readFileSync(path.join(root, '_src', 'sprite.html'), 'utf8');
// Appended to asset URLs so browsers fetch fresh CSS/JS after every change
const ver = (rel) => crypto.createHash('md5').update(fs.readFileSync(path.join(root, rel))).digest('hex').slice(0, 8);
const CSS_V = ver('css/site.css');
const JS_V = ver('js/main.js');

const SITE = 'https://www.imajstri.sk';          // canonical / sitemap domain (production)
const PREVIEW_BASE = '/Navrh_web_23.10.26/';     // where 404.html is served on GitHub Pages
const PHONE = '+421918638713';
const PHONE_TXT = '+421 918 638 713';
const MAIL = 'info@imajstri.sk';
const WA = 'https://wa.me/421918638713';         // number to be confirmed by the client
const ic = (id, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true"><use href="#i-${id}"/></svg>`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const NAV = [
  ['', 'Domov'],
  ['o-nas/', 'O nás'],
  ['nas-tim/', 'Náš tím'],
  ['sluzby/', 'Služby'],
  ['realizacie/', 'Realizácie'],
  ['blog/', 'Blog'],
  ['objednavka/', 'Objednávka'],
  ['kontakt/', 'Kontakt'],
];

// ---------------------------------------------------------------- projects

const projectImgDir = path.join(root, 'images', 'projekty');
const photos = (slug, skip = []) => fs.readdirSync(path.join(projectImgDir, slug))
  .filter((f) => f.endsWith('-700.jpg'))
  .sort()
  .filter((f) => !skip.includes(Number(f.match(/-(\d\d)-700\.jpg$/)[1])))
  .map((f) => `projekty/${slug}/${f.replace(/-700\.jpg$/, '')}`);

const projects = [
  { slug: 'vinicne', title: 'Kuchyňa drevo + čierno-biela', h1: 'Moderná kuchyňa na mieru — Viničné', loc: 'Viničné', cats: ['kuchyne'], type: 'Kuchyňa', time: '6 týždňov', by: 'Jozef', cover: 3,
    alt: 'Kuchyňa na mieru vo Viničnom s drevenou doskou a čiernymi skrinkami',
    task: 'Moderná kuchyňa, ktorá spojí prírodný dekor dreva s čierno-bielym dizajnom a pritom ponúkne čo najviac praktického úložného priestoru.',
    items: ['Prírodný dekor dreva v kombinácii s čierno-bielymi prvkami', 'Veľké výsuvné zásuvky na hrnce a riad', 'Rohový výsuvný systém LeMans — využitý aj roh linky', 'Vstavané spotrebiče a premyslené rozloženie pracovnej plochy', 'LED osvetlenie pracovnej dosky'] },
  { slug: 'zahorska-bystrica', title: 'Moderný byt na mieru', h1: 'Nábytok na mieru pre moderný byt — Záhorská Bystrica', loc: 'Bratislava – Záhorská Bystrica', cats: ['byty', 'kuchyne'], type: 'Celý byt', time: '1 mesiac', cover: 2,
    alt: 'Obývačka s lamelovou TV stenou a kuchyňa s ostrovčekom v Záhorskej Bystrici',
    task: 'Zariadiť celý byt v jednom štýle — s dôrazom na eleganciu a funkčnosť.',
    items: ['Obývačková stena s lamelami', 'Kuchyňa s lamelami a ostrovčekom', 'Vstavaná skriňa s komodou a nočnými stolíkmi', 'Chodbová skriňa so sedením pri vstupe', 'Skrinka pod umývadlo do kúpeľne'] },
  { slug: 'chorvatsky-grob', title: 'Celý dom na mieru', h1: 'Zariadenie celého domu na mieru — Chorvátsky Grob', loc: 'Chorvátsky Grob', cats: ['byty', 'kuchyne', 'izby'], type: 'Celý dom', time: '5 týždňov', by: 'Dušana', cover: 1,
    alt: 'Kuchyňa a interiér rodinného domu v Chorvátskom Grobe',
    task: 'Kompletné zariadenie rodinného domu — od kuchyne cez spálňu až po detskú izbu pre dvoch súrodencov.',
    items: ['Drevodekorová kuchyňa s previazanou textúrou dvierok', 'Chodba plynulo prepojená s kuchyňou', 'Spálňa so vstavanými skriňami a šatníkom', 'Detská izba: čalúnená poschodová posteľ, schodisko s úložným priestorom, skriňa a písací stôl', 'Minimalistická obývačka s lamelami a nábytok do kúpeľne'] },
  { slug: 'nivy', title: 'Kuchyňa a obývačka pri Nivách', h1: 'Kuchyňa a obývačka na mieru — pri Nivách', loc: 'Bratislava – Nivy', cats: ['kuchyne', 'byty'], type: 'Kuchyňa a obývačka', time: '1 mesiac', by: 'Jozef', cover: 1, skip: [5],
    alt: 'Kuchyňa so systémom Smart-Cube a čiernou policou pri Nivách',
    task: 'Moderný nábytok na mieru do bytu pri Nivách — kuchyňa ako miesto na varenie aj príjemný pobyt a obývačka s priestorom na prácu.',
    items: ['Kuchyňa so systémom Smart-Cube s podsvietením', 'Čierne dvierka s tmavým sklom Lacobel', 'Knižnica cez celú stenu', 'Pracovný kút v obývačke'] },
  { slug: 'vydrica', title: 'Zariadenie bytu Vydrica', h1: 'Zariadenie bytu na mieru — Vydrica, Bratislava', loc: 'Bratislava – Vydrica', cats: ['byty', 'kuchyne', 'skrine'], type: 'Celý byt', time: '5 týždňov', by: 'Jozef', cover: 1,
    alt: 'Svetlá kuchyňa na mieru v byte vo Vydrici',
    task: 'Kompletné zariadenie bytu, kde je každý kus navrhnutý podľa individuálnych potrieb zákazníka.',
    items: ['Kuchyňa s otvorenými policami a LED osvetlením', 'Minimalistická stena do obývačky', 'Vstavaná skriňa v spálni s posuvnými dverami', 'Čelo postele s nočnými stolíkmi'] },
  { slug: 'sladkovicovo', title: 'Vstavané skrine', h1: 'Vstavané skrine na mieru — Sládkovičovo', loc: 'Sládkovičovo', cats: ['skrine'], type: 'Vstavané skrine', time: '4 týždne', by: 'Jozef', cover: 2,
    alt: 'Vstavaná skriňa s posuvnými dverami a otvoreným vnútorným vybavením',
    task: 'Vstavané skrine do troch miestností s maximálnym využitím priestoru.',
    items: ['Skriňa do spálne', 'Skriňa do hosťovskej izby', 'Skriňa do vstupnej chodby', 'Posuvné dvere s čiernym rámom a vnútorné zásuvky'] },
  { slug: 'slnecnice', title: 'Kuchyňa a vstavané skrine', h1: 'Kuchyňa a vstavané skrine — Slnečnice', loc: 'Bratislava – Slnečnice', cats: ['kuchyne', 'skrine'], type: 'Kuchyňa a skrine', time: '1 mesiac', cover: 4,
    alt: 'Moderná kuchyňa s tmavou zástenou v byte v Slnečniciach',
    task: 'Kuchyňa na mieru s praktickým usporiadaním a vstavané skrine, ktoré naplno využijú priestor.',
    items: ['Kuchyňa s vysokými skrinkami a vstavanými spotrebičmi', 'Vstavané skrine do chodby', 'Galéria obsahuje aj fotografie z priebehu montáže'] },
  { slug: 'dubravka-landauova', title: 'Trojizbový byt pre rodinu', h1: 'Trojizbový byt pre rodinu — Dúbravka', loc: 'Bratislava – Dúbravka', cats: ['byty', 'izby', 'skrine'], type: 'Celý byt', time: '2 mesiace', cover: 1,
    alt: 'Knižnica a obývačka na mieru v trojizbovom byte v Dúbravke',
    task: 'Praktický domov pre rodinu s malým dieťaťom s dôrazom na úložný priestor.',
    items: ['Vstavané skrine a prehľadná spálňa', 'Bezpečná a funkčná detská izba', 'Obývačka s knižnicou a TV stenou', 'Kuchyňa so vstavanými spotrebičmi', 'Skryté úložné priestory v chodbe a práčovni'] },
  { slug: 'dubravka-mensi-byt', title: 'Menší byt', h1: 'Zariadenie menšieho bytu — Dúbravka', loc: 'Bratislava – Dúbravka', cats: ['kuchyne', 'byty'], type: 'Kuchyňa a chodba', time: '1 mesiac', by: 'Jozef', cover: 7,
    alt: 'Kuchyňa na mieru do malého priestoru v Dúbravke',
    task: 'Kuchyňa do malého priestoru, ktorá šetrí miesto a zvyšuje úložnú kapacitu.',
    items: ['Kuchyňa na mieru do malého priestoru', 'Vysoké skrinky po strop', 'Chodba s dizajnovým obkladom a vešiakovou stenou'] },
  { slug: 'salon-anima', title: 'Kozmetický salón Anima', h1: 'Nábytok na mieru pre kozmetický salón Anima', loc: 'Bratislava', cats: ['firmy', 'skrine'], type: 'Komerčný interiér', time: '3 týždne', by: 'ToøL. interior architects (návrh)', cover: 1,
    alt: 'Vstavané skrine a recepcia v kozmetickom salóne Anima',
    task: 'Realizácia nábytku podľa návrhu architektov pre komerčný priestor salónu.',
    items: ['Vstavaná skriňa s veľkou úložnou kapacitou, dvere zakrývajú aj sokel', 'Minikuchynka pre personál', 'Zrkadlová skriňa, ktorá opticky zväčšuje priestor'] },
];
projects.forEach((p) => { p.photos = photos(p.slug, p.skip); p.coverImg = p.photos[p.cover - 1]; });
const P = Object.fromEntries(projects.map((p) => [p.slug, p]));

// ---------------------------------------------------------------- services

const services = [
  { slug: 'kuchyne-na-mieru', key: 'kuchyna', name: 'Kuchyne na mieru', h1: 'Kuchyne na mieru v Bratislave', img: 'hero-kuchyna.jpg', price: '3 900 €', icon: 'kitchen2',
    title: 'Kuchyne na mieru Bratislava | Návrh a montáž | Interiéroví majstri',
    desc: 'Kuchyne na mieru v Bratislave a okolí — rovné, do L, do U aj s ostrovčekom. Návrh, vizualizácia, výroba a montáž od jednej firmy.',
    short: 'Rovné, do L, do U aj s ostrovčekom. Kovanie Blum, dosky Egger, drezy BLANCO.',
    intro: 'Kuchyňa je srdce domova. Navrhneme ju presne do vášho priestoru — od malej linky do bytu až po veľkú kuchyňu s ostrovčekom v rodinnom dome.',
    forWhom: ['Rekonštruujete byt alebo dom a chcete kuchyňu na milimeter', 'Máte netypický priestor — šikminy, výklenky, malú plochu', 'Chcete využiť každý roh a mať poriadok v zásuvkách'],
    variants: [['Rovná linka', 'Do menších bytov a úzkych priestorov.'], ['Kuchyňa do L', 'Najčastejšie riešenie s rohom využitým systémom LeMans.'], ['Kuchyňa do U', 'Veľa pracovnej plochy a úložného priestoru.'], ['S ostrovčekom', 'Pre otvorené priestory spojené s obývačkou.']],
    materials: ['Kovanie Blum', 'Dosky Egger', 'Drezy BLANCO', 'Sklo Lacobel, systémy LeMans a Smart-Cube'],
    projects: ['vinicne', 'nivy', 'zahorska-bystrica', 'dubravka-mensi-byt', 'slnecnice', 'chorvatsky-grob'],
    faq: [['Koľko stojí kuchyňa na mieru?', 'Cena závisí od rozmerov, materiálov, kovania a spotrebičov. Presnú ponuku pripravíme po zameraní a návrhu.'], ['Môžem si vybrať vlastné spotrebiče?', 'Áno. Kuchyňu navrhneme na mieru vašim spotrebičom alebo vám pomôžeme s výberom.'], ['Ako dlho trvá výroba?', 'Závisí od rozsahu. Napríklad kuchyňa vo Viničnom bola hotová za 6 týždňov.']] },
  { slug: 'vstavane-skrine', key: 'skrina', name: 'Vstavané skrine a šatníky', h1: 'Vstavané skrine a šatníky na mieru', img: 'projekty/sladkovicovo/vstavane-skrine-sladkovicovo-02', price: '990 €', icon: 'wardrobe2',
    title: 'Vstavané skrine na mieru Bratislava | Interiéroví majstri',
    desc: 'Vstavané skrine a šatníky na mieru v Bratislave a okolí. Posuvné aj krídlové dvere, vnútorné vybavenie podľa vás, zameranie a montáž.',
    short: 'Do spálne, chodby aj podkrovia. Každý centimeter využitý.',
    intro: 'Vstavaná skriňa využije aj nepraktické kúty, výklenky a priestor až po strop. Vnútro navrhneme podľa toho, čo v nej budete naozaj skladovať.',
    forWhom: ['Potrebujete viac úložného priestoru v spálni alebo chodbe', 'Máte výklenok, šikminu alebo nepravidelnú stenu', 'Chcete šatník s presným vnútorným vybavením'],
    variants: [['Posuvné dvere', 'Šetria miesto pred skriňou, aj s rámom v čiernej farbe.'], ['Krídlové dvere', 'Klasické riešenie s plným prístupom do skrine.'], ['Šatníky', 'Otvorené aj uzavreté systémy na oblečenie a topánky.'], ['Skrine do chodby', 'Aj so sedením a vešiakovou stenou.']],
    materials: ['Kovanie Blum', 'Dosky Egger', 'Posuvné systémy', 'Vnútorné zásuvky a výsuvy'],
    projects: ['sladkovicovo', 'vydrica', 'slnecnice', 'dubravka-landauova', 'salon-anima'],
    faq: [['Robíte aj skrine pod šikminu?', 'Áno, každú skriňu vyrábame na mieru podľa zamerania priestoru.'], ['Čo všetko môže byť vo vnútri skrine?', 'Police, tyče na vešiaky, zásuvky, výsuvné koše a priestor na topánky — podľa toho, čo potrebujete uložiť.'], ['Ako dlho trvá výroba?', 'Závisí od rozsahu. Skrine do troch miestností v Sládkovičove boli hotové za 4 týždne.']] },
  { slug: 'obyvacky-a-tv-steny', key: 'obyvacka', name: 'Obývačky a TV steny', h1: 'Obývačky a TV steny na mieru', img: 'projekty/zahorska-bystrica/byt-na-mieru-zahorska-bystrica-03', price: '1 200 €', icon: 'tv2',
    title: 'Obývačky a TV steny na mieru Bratislava | Interiéroví majstri',
    desc: 'Lamelové TV steny, knižnice a úložné priestory do obývačky na mieru. Bratislava a okolie.',
    short: 'Lamelové TV steny, knižnice a úložné priestory zladené s kuchyňou.',
    intro: 'Obývačka, v ktorej má všetko svoje miesto. TV stena s lamelami, knižnica či pracovný kút — farebne zladené s kuchyňou, aby priestor pôsobil ako celok.',
    forWhom: ['Chcete TV stenu bez viditeľných káblov', 'Potrebujete knižnicu alebo úložný priestor do obývačky', 'Máte otvorený priestor s kuchyňou a chcete jednotný štýl'],
    variants: [['Lamelová TV stena', 'Drevené lamely s nízkou komodou.'], ['Knižnice', 'Od podlahy po strop, aj okolo dverí.'], ['Pracovný kút', 'Stôl a police do obývačky alebo spálne.'], ['Nízke skrinky a komody', 'Úložný priestor pod televízorom.']],
    materials: ['Dosky Egger', 'Drevené lamely', 'Kovanie Blum', 'Skryté vedenie káblov'],
    projects: ['zahorska-bystrica', 'nivy', 'dubravka-landauova', 'chorvatsky-grob', 'vydrica'],
    faq: [['Dá sa skryť kabeláž od televízora?', 'Áno, vedenie káblov navrhujeme priamo do TV steny.'], ['Môže obývačka ladiť s kuchyňou?', 'Áno, navrhujeme ich spolu s rovnakými dekormi — ako v Záhorskej Bystrici.'], ['Robíte aj samotné lamelové obklady?', 'Áno, lamely vyrábame a montujeme ako súčasť TV steny alebo samostatne.']] },
  { slug: 'detske-izby-a-spalne', key: 'izba', name: 'Detské izby a spálne', h1: 'Nábytok do spálne a detskej izby', img: 'projekty/chorvatsky-grob/dom-na-mieru-chorvatsky-grob-04', price: '1 500 €', icon: 'bed',
    title: 'Nábytok do spálne a detskej izby na mieru | Interiéroví majstri',
    desc: 'Postele na poschodí, schody s úložným priestorom, šatníky a čelá postelí na mieru. Bratislava a okolie.',
    short: 'Postele na poschodí, schody s úložným priestorom, šatníky.',
    intro: 'Detská izba, ktorá rastie s deťmi, a spálňa, v ktorej je poriadok. Navrhneme nábytok na mieru podľa rozmerov miestnosti aj veku detí.',
    forWhom: ['Dve deti v jednej izbe', 'Malá spálňa, v ktorej chýba úložný priestor', 'Chcete čelo postele, nočné stolíky a skriňu v jednom štýle'],
    variants: [['Posteľ na poschodí', 'Aj čalúnená, so schodiskom s úložným priestorom.'], ['Šatníky a skrine', 'Na mieru do spálne aj detskej izby.'], ['Čelá postelí', 'S nočnými stolíkmi v jednom celku.'], ['Písacie stoly', 'Pracovné miesto pre školákov.']],
    materials: ['Dosky Egger', 'Kovanie Blum', 'Čalúnenie', 'Úložné schody a zásuvky'],
    projects: ['chorvatsky-grob', 'dubravka-landauova', 'vydrica'],
    faq: [['Je posteľ na poschodí bezpečná?', 'Navrhujeme ju s ohľadom na vek detí — so zábradlím a stabilným schodiskom.'], ['Dá sa nábytok neskôr upraviť?', 'Pri návrhu myslíme na to, ako bude izba rásť s dieťaťom.'], ['Robíte aj samotné šatníky?', 'Áno, aj samostatné šatníky a vstavané skrine.']] },
  { slug: 'kompletne-interiery', key: 'interier', name: 'Kompletné interiéry', h1: 'Kompletné interiéry na mieru', img: 'projekty/zahorska-bystrica/byt-na-mieru-zahorska-bystrica-02', price: '8 900 €', icon: 'home',
    title: 'Kompletné interiéry na mieru Bratislava | Interiéroví majstri',
    desc: 'Celý byt alebo dom na mieru v jednom štýle — kuchyňa, skrine, obývačka, detská izba aj kúpeľňa od jednej firmy.',
    short: 'Celý byt alebo dom v jednom štýle — jeden návrh, jeden tím.',
    intro: 'Celý byt alebo dom od jedného dodávateľa. Všetok nábytok navrhneme v jednom štýle, vyrobíme a namontujeme — vy riešite len jeden kontakt.',
    forWhom: ['Zariaďujete novostavbu alebo kompletne rekonštruovaný byt', 'Chcete jednotné materiály a farby v celom interiéri', 'Nechcete koordinovať viac dodávateľov'],
    variants: [['Byty', 'Ako v Záhorskej Bystrici, Vydrici či Dúbravke.'], ['Rodinné domy', 'Ako v Chorvátskom Grobe.'], ['Kuchyňa + obývačka', 'Otvorené priestory v jednom štýle.'], ['Chodby a kúpeľne', 'Skrine, sedenie a nábytok pod umývadlo.']],
    materials: ['Dosky Egger', 'Kovanie Blum', 'Drezy BLANCO', 'Lamely, sklo Lacobel'],
    projects: ['zahorska-bystrica', 'chorvatsky-grob', 'vydrica', 'dubravka-landauova', 'nivy'],
    faq: [['Koľko trvá zariadenie celého bytu?', 'Závisí od rozsahu. Celý dom v Chorvátskom Grobe bol hotový za 5 týždňov.'], ['Môžem začať jednou miestnosťou?', 'Áno, návrh pripravíme pre celý byt a realizovať ho môžete postupne.'], ['Spolupracujete s architektmi?', 'Áno, vyrobíme nábytok aj podľa návrhu vášho architekta.']] },
  { slug: 'komercne-interiery', key: 'firma', name: 'Komerčné interiéry', h1: 'Nábytok na mieru pre firmy', img: 'projekty/salon-anima/kozmeticky-salon-anima-01', price: null, icon: 'tools',
    title: 'Nábytok na mieru pre firmy a prevádzky | Interiéroví majstri',
    desc: 'Nábytok na mieru pre salóny, kancelárie a prevádzky v Bratislave. Realizácia aj podľa návrhu architekta.',
    short: 'Salóny, kancelárie a prevádzky. Aj podľa návrhu architekta.',
    intro: 'Nábytok pre salóny, kancelárie a prevádzky. Vyrobíme ho podľa nášho návrhu alebo presne podľa projektu vášho architekta.',
    forWhom: ['Otvárate salón, štúdio alebo prevádzku', 'Máte projekt od architekta a hľadáte výrobu a montáž', 'Potrebujete úložné steny, recepciu alebo kuchynku pre personál'],
    variants: [['Úložné steny', 'Skrine s veľkou kapacitou, aj so zakrytým soklom.'], ['Recepcie', 'Na mieru podľa priestoru a značky.'], ['Kuchynky pre personál', 'Kompaktné a praktické.'], ['Zrkadlové skrine', 'Opticky zväčšia priestor.']],
    materials: ['Dosky Egger', 'Kovanie Blum', 'Zrkadlá a sklo', 'Realizácia podľa projektu architekta'],
    projects: ['salon-anima'],
    faq: [['Vyrobíte nábytok podľa projektu architekta?', 'Áno — napríklad salón Anima sme realizovali podľa návrhu ToøL. interior architects.'], ['Ako dlho trvá realizácia?', 'Salón Anima bol hotový za 3 týždne. Termín dohodneme podľa rozsahu.'], ['Fakturujete na firmu?', 'Áno, ponuku aj faktúru pripravíme na vašu firmu.']] },
];

// ---------------------------------------------------------------- shared markup

const img = (base, b, alt, sizes = '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw', eager = false, style = '') =>
  base.endsWith('.jpg')
    ? `<img src="${b}images/${base}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}${style}>`
    : `<img src="${b}images/${base}-700.jpg" srcset="${b}images/${base}-700.jpg 700w, ${b}images/${base}-1400.jpg 1400w" sizes="${sizes}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}${style}>`;

const link = (b, p) => (b + p) || './';

const head = (pg, b) => {
  const url = SITE + '/' + pg.path;
  const ogImg = SITE + '/images/' + (pg.og || 'hero-kuchyna.jpg');
  return `<!doctype html>
<html lang="sk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(pg.title)}</title>
  <meta name="description" content="${esc(pg.desc)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="sk_SK">
  <meta property="og:site_name" content="Interiéroví majstri">
  <meta property="og:title" content="${esc(pg.title)}">
  <meta property="og:description" content="${esc(pg.desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ogImg}">
  <link rel="icon" href="${b}images/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@300;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${b}css/site.css?v=${CSS_V}">${pg.preload ? `\n  <link rel="preload" as="image" href="${b}images/${pg.preload}" fetchpriority="high">` : ''}${pg.jsonld ? `\n  <script type="application/ld+json">${JSON.stringify(pg.jsonld)}</script>` : ''}
</head>
<body>
<a class="skip" href="#obsah">Preskočiť na obsah</a>
${sprite}`;
};

const header = (pg, b) => `
<header class="site-header">
  <div class="container header-row">
    <a href="${link(b, '')}" class="brand" aria-label="Interiéroví majstri – nábytok na mieru, úvodná stránka"><img src="${b}images/logo-mark.png" alt="" width="600" height="86"><span class="brand-tag" aria-hidden="true">Nábytok na mieru</span></a>
    <nav class="nav" id="nav" aria-label="Hlavná navigácia">
      ${NAV.map(([p, label]) => `<a href="${link(b, p)}"${pg.section === p ? ' aria-current="page"' : ''}>${label}</a>`).join('\n      ')}
    </nav>
    <div class="header-cta">
      <a class="icon-btn" href="tel:${PHONE}" aria-label="Zavolať ${PHONE_TXT}">${ic('phone')}</a>
      <a class="btn btn-primary" href="${link(b, 'objednavka/')}">Nezáväzná ponuka ${ic('arrow')}</a>
      <button class="burger" id="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<main id="obsah">`;

const footer = (b) => `
</main>
<footer class="site-footer">
  <div class="container">
    <div class="foot-grid">
      <div>
        <div class="brand brand--light"><img src="${b}images/logo-mark-light.png" alt="Interiéroví majstri" width="600" height="86"><span class="brand-tag">Nábytok na mieru</span></div>
        <p>Vaša vízia, náš nábytok. Kuchyne, skrine a nábytok na mieru v Bratislave a okolí — od návrhu až po montáž.</p>
        <div class="social">
          <a href="https://www.instagram.com/imajstri/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
          <a href="https://www.facebook.com/profile.php?id=61573057973324" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="${WA}" target="_blank" rel="noopener" aria-label="WhatsApp">${ic('chat')}</a>
        </div>
      </div>
      <div>
        <h2>Stránky</h2>
        <ul>${NAV.map(([p, label]) => `<li><a href="${link(b, p)}">${label}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2>Služby</h2>
        <ul>${services.map((s) => `<li><a href="${b}${s.slug}/">${s.name}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2>Kontakt</h2>
        <ul>
          <li><a href="tel:${PHONE}">${PHONE_TXT}</a></li>
          <li><a href="mailto:${MAIL}">${MAIL}</a></li>
          <li>Landauova 3146/20, 841 01 Bratislava</li>
          <li>Po – Pi: 9:00 – 17:00</li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom"><span>© 2026 BK Creative s. r. o. · IČO: 56343744</span><span>Bratislava a okolie</span></div>
  </div>
</footer>
<div class="m-bar">
  <a class="btn btn-outline" href="tel:${PHONE}">${ic('phone')}Zavolať</a>
  <a class="btn btn-primary" href="${link(b, 'objednavka/')}">Nezáväzná ponuka</a>
</div>
<script src="${b}js/main.js?v=${JS_V}" defer></script>
</body>
</html>
`;

const crumbs = (b, trail) => `<nav class="crumbs" aria-label="Omrvinky"><a href="${link(b, '')}">Domov</a>${trail.map(([p, label]) => p === null ? `<span aria-hidden="true">/</span><span>${label}</span>` : `<span aria-hidden="true">/</span><a href="${b}${p}">${label}</a>`).join('')}</nav>`;

const breadcrumbLd = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [['', 'Domov'], ...trail].map(([p, name], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(p !== null ? { item: SITE + '/' + p } : {}) })),
});

const potrebaOptions = (selected = '') => [['', 'Vyberte'], ['kuchyna', 'Kuchyňa'], ['skrina', 'Vstavaná skriňa / šatník'], ['obyvacka', 'Obývačka / TV stena'], ['izba', 'Spálňa / detská izba'], ['interier', 'Celý interiér'], ['firma', 'Firma / prevádzka'], ['ine', 'Iné']]
  .map(([v, l]) => `<option value="${v}"${v === selected ? ' selected' : ''}>${l}</option>`).join('');

let formCount = 0;
const shortForm = (selected = '', withPhoto = false) => {
  const n = ++formCount;
  const photo = withPhoto ? `
            <div class="field field--full"><label for="f${n}">Fotografia priestoru <small>(nepovinné · JPG, PNG, WEBP do 10 MB)</small></label><input id="f${n}" name="foto" type="file" accept="image/jpeg,image/png,image/webp" multiple></div>` : '';
  return `<form class="form-card lead-form" novalidate>
          <div class="form-grid">
            <div class="field"><label for="m${n}">Meno <small>(nepovinné)</small></label><input id="m${n}" name="meno" autocomplete="name"></div>
            <div class="field"><label for="p${n}">Čo potrebujete?</label><select id="p${n}" name="potreba">${potrebaOptions(selected)}</select></div>
            <div class="field"><label for="t${n}">Telefón</label><input id="t${n}" name="telefon" type="tel" autocomplete="tel" inputmode="tel" placeholder="+421 9xx xxx xxx"></div>
            <div class="field"><label for="e${n}">E-mail</label><input id="e${n}" name="email" type="email" autocomplete="email" placeholder="vas@email.sk"></div>
            <div class="field field--full"><label for="s${n}">Krátko o projekte <small>(nepovinné)</small></label><textarea id="s${n}" name="sprava" rows="3" maxlength="2000" placeholder="Miestnosť, približné rozmery, termín…"></textarea></div>${photo}
            <label class="consent"><input type="checkbox" name="suhlas"> <span>Súhlasím so spracovaním osobných údajov za účelom prípravy ponuky.</span></label>
            <p class="form-error" role="alert"></p>
            <button class="btn btn-primary" type="submit">Odoslať dopyt ${ic('arrow')}</button>
            <p class="form-note">Stačí telefón alebo e-mail. Ozveme sa vám.</p>
          </div>
          <div class="form-success" role="status">${ic('check')}<h3>Ďakujeme, ozveme sa vám.</h3><p>Váš dopyt sme prijali.</p></div>
        </form>`;
};

const finalCta = (b, selected = '', h = 'Získajte bezplatnú konzultáciu a cenovú ponuku', sub = 'Napíšte nám, čo plánujete. Ozveme sa vám a dohodneme bezplatnú konzultáciu.', withPhoto = false) => `
  <section class="section section--dark" id="dopyt">
    <div class="container cta-final">
      <div>
        <span class="eyebrow eyebrow--line">Nezáväzný dopyt</span>
        <h2>${h}</h2>
        <p class="lead">${sub}</p>
        <div class="quick">
          <a href="tel:${PHONE}">${ic('phone')}<span><small>Zavolajte nám</small><b>${PHONE_TXT}</b></span></a>
          <a href="${WA}" target="_blank" rel="noopener">${ic('chat')}<span><small>Napíšte na WhatsApp</small><b>Poslať správu alebo fotku priestoru</b></span></a>
          <a href="mailto:${MAIL}">${ic('doc')}<span><small>E-mail</small><b>${MAIL}</b></span></a>
        </div>
      </div>
      ${shortForm(selected, withPhoto)}
    </div>
  </section>`;

// Short call-to-action for informational pages (no form)
const ctaBand = (b, h, sub) => `
  <section class="cta-band">
    <div class="container cta-band__row">
      <div><h2>${h}</h2><p>${sub}</p></div>
      <div class="actions">
        <a class="btn btn-primary" href="${b}objednavka/">Nezáväzná ponuka ${ic('arrow')}</a>
        <a class="btn btn-light" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a>
      </div>
    </div>
  </section>`;

const steps = (dark = false) => `
      <ol class="steps">
        <li class="step"><div class="step-num">${ic('chat')}01</div><h3>Konzultácia</h3><p>Porozprávame sa o vašich predstavách a požiadavkách. Prvá konzultácia je bezplatná.</p></li>
        <li class="step"><div class="step-num">${ic('ruler')}02</div><h3>Zameranie</h3><p>Priestor presne zameriame, aby nábytok sedel na milimeter.</p></li>
        <li class="step"><div class="step-num">${ic('cube')}03</div><h3>Návrh a vizualizácia</h3><p>Spoločne navrhneme nábytok, ktorý bude presne zodpovedať vašim požiadavkám a štýlu.</p></li>
        <li class="step"><div class="step-num">${ic('factory')}04</div><h3>Výroba</h3><p>Po schválení návrhu prejdeme k výrobe, pričom každý detail je starostlivo spracovaný.</p></li>
        <li class="step"><div class="step-num">${ic('truck')}05</div><h3>Doprava a montáž</h3><p>Nábytok doručíme a namontujeme priamo u vás doma, aby ste sa mohli ihneď tešiť z výsledku.</p></li>
      </ol>`;

const brands = (b) => `
  <section class="brands" aria-label="Materiály a kovanie">
    <div class="container">
      <p>Pracujeme s materiálmi a kovaním</p>
      <div class="brand-logos">
        <img src="${b}images/blum_imajstri.webp" alt="Blum" loading="lazy">
        <img src="${b}images/egger_imajstri.webp" alt="Egger" loading="lazy">
        <img src="${b}images/knauf_imajstri.webp" alt="Knauf" loading="lazy">
        <img src="${b}images/logo-benalexplus-imajstri.webp" alt="Benalex" loading="lazy">
        <span>BLANCO</span><span>PEBE</span>
      </div>
    </div>
  </section>`;

const faqBlock = (items, h = 'Na čo sa nás najčastejšie pýtate') => `
  <section class="section" id="faq">
    <div class="container faq-grid">
      <div>
        <span class="eyebrow eyebrow--line">Časté otázky</span>
        <h2>${h}</h2>
        <p class="lead">Nenašli ste odpoveď? Zavolajte nám na <a class="link-more" href="tel:${PHONE}">${PHONE_TXT}</a>.</p>
      </div>
      <div>
        ${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n        ')}
      </div>
    </div>
  </section>`;

const projectCard = (p, b, cls = '') => `<article class="card${cls}" data-c="${p.cats.join(' ')}">
          <a class="card-img" href="${b}realizacie/${p.slug}/" tabindex="-1" aria-hidden="true">${img(p.coverImg, b, p.alt)}</a>
          <div class="card-body">
            <div class="chips"><span class="chip">${p.loc}</span><span class="chip">${ic('clock')}${p.time}</span></div>
            <h3><a class="card-link" href="${b}realizacie/${p.slug}/">${p.title}</a></h3>
            <p>${p.items[0]}.</p>
            <div class="card-foot"><span class="from">${p.type}</span><span class="go">Pozrieť projekt ${ic('arrow')}</span></div>
          </div>
        </article>`;

// showPrice=false on the homepage, where prices have their own "Orientačné ceny" block
const serviceCard = (s, b, showPrice = true) => `<a class="card" href="${b}${s.slug}/">
          <div class="card-img">${img(s.img, b, s.name)}</div>
          <div class="card-body">
            <h3>${s.name}</h3>
            <p>${s.short}</p>
            <div class="card-foot"><span class="from">${showPrice ? (s.price ? `orientačne od <b>${s.price}</b>` : '<b>individuálne</b>') : 'Na mieru'}</span><span class="go">Viac ${ic('arrow')}</span></div>
          </div>
        </a>`;

// ---------------------------------------------------------------- pages

const pages = [];
const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Interiéroví majstri',
  legalName: 'BK Creative s. r. o.',
  url: SITE + '/',
  logo: SITE + '/images/logo-mark.png',
  image: SITE + '/images/hero-kuchyna.jpg',
  telephone: PHONE,
  email: MAIL,
  vatID: 'SK2122278433',
  address: { '@type': 'PostalAddress', streetAddress: 'Landauova 3146/20', postalCode: '841 01', addressLocality: 'Bratislava', addressCountry: 'SK' },
  areaServed: 'Bratislava a okolie',
  openingHours: 'Mo-Fr 09:00-17:00',
  sameAs: ['https://www.instagram.com/imajstri/', 'https://www.facebook.com/profile.php?id=61573057973324'],
};

// Domov — block order from the technical brief v2 (section 04):
// hero → o nás (short) → realizácie → služby → prečo my → spolupráca → ceny → recenzie → FAQ → formulár
pages.push({ path: '', section: '', preload: 'hero-kuchyna.jpg', jsonld: orgLd,
  title: 'Kuchyne a nábytok na mieru Bratislava | Interiéroví majstri',
  desc: 'Kuchyne, vstavané skrine a nábytok na mieru v Bratislave a okolí. Návrh s vizualizáciou, výroba, doprava a montáž od jedného tímu.',
  body: (b) => {
    const v = P.vinicne;
    return `
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-text">
        <span class="eyebrow eyebrow--line">Bratislava a okolie</span>
        <h1>Kuchyne a nábytok na mieru<span>od návrhu až po montáž.</span></h1>
        <p class="hero-sub">Jeden tím. Jasná dohoda. Interiér presne pre vás.</p>
        <ul class="hero-feats">
          <li class="feat"><i>${ic('chat')}</i>Bezplatná konzultácia</li>
          <li class="feat"><i>${ic('cube')}</i>Návrh a vizualizácia</li>
          <li class="feat"><i>${ic('gear')}</i>Výroba, doprava a montáž</li>
        </ul>
        <div class="actions">
          <a class="btn btn-primary" href="${b}objednavka/">Chcem bezplatnú konzultáciu ${ic('arrow')}</a>
          <a class="btn-text play" href="${b}realizacie/"><i>${ic('play')}</i>Pozrieť realizácie</a>
        </div>
      </div>
      <div class="hero-media">
        <img src="${b}images/hero-kuchyna.jpg" alt="Kuchyňa na mieru vo Viničnom s otvorenými zásuvkami a rohovým systémom LeMans" width="1536" height="1024" fetchpriority="high">
      </div>
    </div>
  </section>

  <section class="section section--white">
    <div class="container about-short">
      <div>
        <span class="eyebrow eyebrow--line">Spoznajte nás</span>
        <h2>Za každým interiérom stojí skúsenosť a poctivá práca</h2>
        <p class="lead">Už roky pomáhame zákazníkom vytvárať nábytok presne podľa ich predstáv. Od prvého návrhu až po finálnu montáž dbáme na kvalitu, funkčnosť a každý detail.</p>
        <ul class="chips" style="margin-top:24px">
          <li class="chip">Roky skúseností</li>
          <li class="chip">Skutočné realizácie</li>
          <li class="chip">Nábytok vytvorený pre vás</li>
        </ul>
      </div>
      ${img(P['zahorska-bystrica'].photos[6], b, 'Montáž lamelovej steny v byte v Záhorskej Bystrici', '(max-width: 1023px) 100vw, 45vw')}
      <div class="actions about-cta"><a class="btn btn-outline" href="${b}o-nas/">Viac o nás ${ic('arrow')}</a></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="sec-head">
        <div>
          <span class="eyebrow eyebrow--line">Naše realizácie</span>
          <h2>Skutočné príbehy, skutočné výsledky</h2>
          <p class="lead">Kuchyne, byty aj celé domy, ktoré sme navrhli a namontovali v Bratislave a okolí.</p>
        </div>
        <a class="btn btn-outline" href="${b}realizacie/">Pozrieť realizácie ${ic('arrow')}</a>
      </div>
      <div class="featured">
        <div class="featured-media">
          <img src="${b}images/hero-kuchyna.jpg" alt="Kuchyňa vo Viničnom — výsuvné zásuvky a rohový systém" loading="lazy">
          ${img(v.photos[5], b, 'Rohový výsuvný systém LeMans v kuchyni vo Viničnom', '(max-width: 1023px) 50vw, 20vw')}
          ${img(v.photos[0], b, 'Pracovná doska s LED osvetlením a varnou doskou', '(max-width: 1023px) 50vw, 20vw')}
        </div>
        <div>
          <span class="chip">Kuchyňa · ${v.loc}</span>
          <h3 style="font-size:clamp(26px,2.4vw,34px);margin-top:16px">Kuchyňa, v ktorej má všetko svoje miesto</h3>
          <p class="lead">${v.task}</p>
          <ul class="check-list">
            <li>${ic('check')}<span><b>Rohový systém LeMans</b> — aj ťažko dostupný roh linky je plne využitý.</span></li>
            <li>${ic('check')}<span><b>LED osvetlenie pracovnej dosky</b> — svetlo presne tam, kde krájate a varíte.</span></li>
            <li>${ic('check')}<span><b>Veľké výsuvné zásuvky</b> na hrnce a riad, vstavané spotrebiče.</span></li>
          </ul>
          <div class="actions" style="margin-top:28px"><a class="btn btn-outline" href="${b}realizacie/vinicne/">Pozrieť celý projekt ${ic('arrow')}</a></div>
        </div>
      </div>
      <div class="grid-3" style="margin-top:56px">
        ${['zahorska-bystrica', 'chorvatsky-grob', 'nivy', 'vydrica', 'sladkovicovo', 'salon-anima'].map((s) => projectCard(P[s], b)).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--white">
    <div class="container">
      <div class="sec-head">
        <div>
          <span class="eyebrow eyebrow--line">Služby</span>
          <h2>Čo pre vás vyrobíme</h2>
          <p class="lead">Kuchyne, skrine, obývačky, spálne aj celé interiéry — všetko na mieru vášmu priestoru.</p>
        </div>
        <a class="link-more" href="${b}sluzby/">Všetky služby →</a>
      </div>
      <div class="grid-3">
        ${services.map((s) => serviceCard(s, b, false)).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="sec-head">
        <div>
          <span class="eyebrow eyebrow--line">Prečo si vybrať nás</span>
          <h2>Jeden tím, ktorý za výsledok ručí</h2>
          <p class="lead">Nemusíte hľadať návrhára, stolára a montážnikov zvlášť. Celý projekt vedieme za vás.</p>
        </div>
        <a class="btn btn-primary" href="${b}objednavka/">Získať ponuku ${ic('arrow')}</a>
      </div>
      <div class="benefits">
        <div class="benefit"><i>${ic('cube')}</i><h3>Návrh, ktorý uvidíte vopred</h3><p>Nábytok si pozriete vo vizualizácii ešte pred výrobou. Upravujeme, kým nebude presne podľa vás.</p></div>
        <div class="benefit"><i>${ic('ruler')}</i><h3>Presne do vášho priestoru</h3><p>Využijeme aj šikminy, výklenky a ťažko dostupné rohy. Žiadne kompromisy z katalógu.</p></div>
        <div class="benefit"><i>${ic('shield')}</i><h3>Kvalitné materiály</h3><p>Pracujeme s overenými značkami — dosky Egger, kovanie Blum, drezy BLANCO.</p></div>
        <div class="benefit"><i>${ic('doc')}</i><h3>Jasná dohoda</h3><p>Rozsah, materiály a cenu preberieme vopred — ešte predtým, ako sa začne vyrábať.</p></div>
      </div>
    </div>
  </section>
${brands(b)}

  <section class="section section--dark">
    <div class="container">
      <div class="sec-head">
        <div>
          <span class="eyebrow eyebrow--line">Ako prebieha spolupráca</span>
          <h2>Od konzultácie po montáž v piatich krokoch</h2>
          <p class="lead">Viete, čo vás čaká v každom kroku.</p>
        </div>
        <a class="btn btn-light" href="${b}objednavka/">Nezáväzná konzultácia</a>
      </div>
${steps(true)}
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="sec-head">
        <div>
          <span class="eyebrow eyebrow--line">Orientačné ceny</span>
          <h2>Koľko stojí nábytok na mieru</h2>
          <p class="lead">Ceny sú orientačné. Presnú cenu určí zameranie, materiály a kovanie — dostanete ju ešte pred výrobou.</p>
        </div>
        <a class="btn btn-primary" href="${b}objednavka/">Vypočítať cenu ${ic('arrow')}</a>
      </div>
      <div class="prices">
        ${services.filter((s) => s.price).map((s) => `<a class="price" href="${b}${s.slug}/"><svg aria-hidden="true"><use href="#i-${s.icon}"/></svg><span>${s.name}</span><b>od ${s.price}</b></a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- Recenzie klientov: hidden until real reviews are approved by the client -->
${faqBlock([
  ['Koľko stojí nábytok na mieru?', 'Cena závisí od rozmerov, materiálov a kovania. Po konzultácii a zameraní dostanete presnú ponuku — skôr, ako sa začne vyrábať.'],
  ['Ako dlho trvá výroba a montáž?', 'Podľa rozsahu. Napríklad salón Anima bol hotový za 3 týždne, vstavané skrine v Sládkovičove za 4 týždne a celý dom v Chorvátskom Grobe za 5 týždňov.'],
  ['Aké materiály používate?', 'Pracujeme napríklad s doskami Egger, kovaním Blum a drezmi BLANCO. Konkrétne materiály a farby vyberieme spolu pri návrhu.'],
  ['Akú záruku poskytujete?', 'Záručné podmienky uvedieme v zmluve pri objednávke.'],
  ['Prídete priestor zamerať?', 'Áno, zameranie je súčasťou prípravy návrhu. Termín dohodneme hneď po prvej konzultácii.'],
  ['Zabezpečíte aj dopravu a montáž?', 'Áno. Nábytok doručíme a namontujeme priamo u vás doma.'],
])}
${finalCta(b, '', 'Získajte bezplatnú konzultáciu a cenovú ponuku', 'Vyberte, čo plánujete, a priložte fotku priestoru. Ozveme sa vám a dohodneme bezplatnú konzultáciu.', true)}`;
  } });

// O nás
pages.push({ path: 'o-nas/', section: 'o-nas/', jsonld: breadcrumbLd([['o-nas/', 'O nás']]),
  title: 'O nás | Interiéroví majstri — nábytok na mieru Bratislava',
  desc: 'Interiéroví majstri — návrh, výroba, doprava a montáž nábytku na mieru v Bratislave a okolí. Vaša vízia, náš nábytok.',
  body: (b) => `
  <section class="page-hero page-hero--media">
    <div class="container ph-grid">
      <div>
        ${crumbs(b, [[null, 'O nás']])}
        <span class="eyebrow eyebrow--line">Vaša vízia, náš nábytok</span>
        <h1>Nábytok, ktorý sa prispôsobí vašim snom</h1>
        <p class="lead">Navrhneme, vyrobíme, dovezieme a namontujeme nábytok na mieru v Bratislave a okolí.</p>
        <div class="actions"><a class="btn btn-primary" href="${b}objednavka/">Nezáväzná ponuka ${ic('arrow')}</a><a class="btn-text" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a></div>
      </div>
      ${img(P.vydrica.photos[0], b, 'Kuchyňa na mieru vo Vydrici', '(max-width: 1023px) 100vw, 50vw', true)}
    </div>
  </section>

  <section class="section">
    <div class="container split">
      <div class="prose">
        <span class="eyebrow eyebrow--line">Kto sme</span>
        <h2>Každá objednávka je pre nás jedinečný kúsok</h2>
        <p>Sme odborníci na výrobu nábytku na mieru, ktorí vnímajú každú objednávku ako príležitosť pre vytvorenie jedinečného kúska priamo podľa vašich predstáv. Či už ide o moderný dizajn, minimalistické línie alebo sofistikované detaily — váš nápad je našou inšpiráciou.</p>
        <p>S nami si môžete byť istí, že každý kus nábytku je originál, ktorý dokonale zapadne do vášho interiéru. Naša filozofia je jednoduchá — čo si dokážete predstaviť, to vieme vytvoriť.</p>
      </div>
      <div>
        <div class="facts" style="margin-top:0">
          <div class="fact"><b>Kuchyne aj celé domy</b><span>od jednej linky po kompletný interiér</span></div>
          <div class="fact"><b>Bratislava a okolie</b><span>Dúbravka, Nivy, Vydrica, Chorvátsky Grob, Sládkovičovo…</span></div>
          <div class="fact"><b>Od návrhu po montáž</b><span>konzultácia, návrh, výroba, doprava a montáž</span></div>
        </div>
        <ul class="check-list">
          <li>${ic('check')}<span><b>Nábytok na mieru</b> — presne podľa vašich predstáv, od dizajnu po materiál.</span></li>
          <li>${ic('check')}<span><b>Kreatívne riešenia</b> — nebojíme sa inovácií.</span></li>
          <li>${ic('check')}<span><b>Kvalita a trvácnosť</b> — dôraz na spracovanie a výber materiálov.</span></li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section section--white">
    <div class="container">
      <div class="sec-head"><div><span class="eyebrow eyebrow--line">Postup krok po kroku</span><h2>Jednoduchý proces, úžasné výsledky</h2></div></div>
${steps()}
    </div>
  </section>
${brands(b)}
${ctaBand(b, 'Chcete, aby sme navrhli aj váš nábytok?', 'Prvá konzultácia je bezplatná a nezáväzná.')}` });

// Náš tím
pages.push({ path: 'nas-tim/', section: 'nas-tim/', jsonld: breadcrumbLd([['nas-tim/', 'Náš tím']]),
  title: 'Náš tím | Interiéroví majstri',
  desc: 'Ľudia za nábytkom na mieru od Interiérových majstrov — návrh, vizualizácia, výroba a montáž v Bratislave a okolí.',
  body: (b) => `
  <section class="page-hero page-hero--media">
    <div class="container ph-grid">
      <div>
        ${crumbs(b, [[null, 'Náš tím']])}
        <h1>Ľudia, ktorí váš nábytok navrhnú aj dotiahnu do konca</h1>
        <p class="lead">S vaším projektom pracuje priamo dizajnér, ktorý ho navrhuje — od prvej konzultácie až po montáž.</p>
        <div class="actions"><a class="btn btn-primary" href="${b}objednavka/">Nezáväzná ponuka ${ic('arrow')}</a><a class="btn-text" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a></div>
      </div>
      ${img(P.nivy.photos[5], b, 'Knižnica cez celú stenu v byte pri Nivách', '(max-width: 1023px) 100vw, 50vw', true)}
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid-3">
        <article class="card"><div class="card-body"><span class="chip" style="align-self:flex-start">Návrh a vizualizácia</span><h3>Jozef</h3><p>Pripravil návrhy realizácií vo Viničnom, pri Nivách, vo Vydrici, v Sládkovičove a v Dúbravke.</p><div class="card-foot"><a class="go" href="${b}realizacie/vinicne/">Projekt Viničné ${ic('arrow')}</a></div></div></article>
        <article class="card"><div class="card-body"><span class="chip" style="align-self:flex-start">Návrh a vizualizácia</span><h3>Dušana</h3><p>Pripravila návrh celého domu v Chorvátskom Grobe — od kuchyne až po detskú izbu pre dvoch súrodencov.</p><div class="card-foot"><a class="go" href="${b}realizacie/chorvatsky-grob/">Projekt Chorvátsky Grob ${ic('arrow')}</a></div></div></article>
        <article class="card"><div class="card-body"><span class="chip" style="align-self:flex-start">Od konzultácie po montáž</span><h3>Jeden tím na celý projekt</h3><p>Poradenstvo, návrh a vizualizácia, výroba, doprava aj montáž — celý projekt vedie jeden tím, ktorý ho pozná od začiatku.</p><div class="card-foot"><a class="go" href="${b}o-nas/">Ako pracujeme ${ic('arrow')}</a></div></div></article>
      </div>
    </div>
  </section>

  <section class="section section--surface">
    <div class="container split">
      ${img(P['salon-anima'].photos[0], b, 'Kozmetický salón Anima — nábytok podľa návrhu architektov', '(max-width: 1023px) 100vw, 50vw')}
      <div class="prose">
        <span class="eyebrow eyebrow--line">Spolupráca</span>
        <h2>Pracujeme aj s architektmi</h2>
        <p>Ak už máte návrh od architekta, vyrobíme a namontujeme nábytok presne podľa neho. Takto vznikol napríklad kozmetický salón Anima podľa návrhu ToøL. interior architects.</p>
        <div class="actions" style="margin-top:24px"><a class="btn btn-outline" href="${b}realizacie/salon-anima/">Pozrieť projekt ${ic('arrow')}</a></div>
      </div>
    </div>
  </section>
${ctaBand(b, 'Chcete sa s nami poradiť o vašom projekte?', 'Ozvite sa nám — prvá konzultácia je bezplatná a nezáväzná.')}` });

// Služby (overview)
pages.push({ path: 'sluzby/', section: 'sluzby/', jsonld: breadcrumbLd([['sluzby/', 'Služby']]),
  title: 'Služby — nábytok na mieru Bratislava | Interiéroví majstri',
  desc: 'Kuchyne na mieru, vstavané skrine, obývačky, detské izby, kompletné a komerčné interiéry. Návrh, výroba a montáž v Bratislave a okolí.',
  body: (b) => `
  <section class="page-hero page-hero--media">
    <div class="container ph-grid">
      <div>
        ${crumbs(b, [[null, 'Služby']])}
        <h1>Nábytok na mieru do každej miestnosti</h1>
        <p class="lead">Každý kúsok, ktorý vyrobíme, je odrazom vášho štýlu. Či už hľadáte štýlový nábytok do obývačky, kuchyňu na mieru alebo unikátne úložné riešenia, sme tu pre vás.</p>
        <div class="actions"><a class="btn btn-primary" href="${b}objednavka/">Chcem bezplatnú konzultáciu ${ic('arrow')}</a><a class="btn-text" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a></div>
      </div>
      ${img(P['zahorska-bystrica'].photos[1], b, 'Obývačka a kuchyňa na mieru v Záhorskej Bystrici', '(max-width: 1023px) 100vw, 50vw', true)}
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="grid-3">
        ${services.map((s) => serviceCard(s, b)).join('\n        ')}
      </div>
    </div>
  </section>
  <section class="section section--dark">
    <div class="container">
      <div class="sec-head"><div><span class="eyebrow eyebrow--line">Kompletný servis</span><h2>Od konzultácie až po montáž</h2></div></div>
${steps(true)}
    </div>
  </section>
${faqBlock([
  ['Koľko stojí nábytok na mieru?', 'Cena závisí od rozmerov, materiálov a kovania. Po konzultácii a zameraní pripravíme presnú ponuku.'],
  ['V akej oblasti pracujete?', 'V Bratislave a okolí — realizovali sme napríklad v Dúbravke, pri Nivách, vo Vydrici, v Chorvátskom Grobe, Viničnom a Sládkovičove.'],
  ['Spolupracujete s architektmi?', 'Áno, vyrobíme nábytok aj podľa návrhu vášho architekta.'],
])}
${ctaBand(b, 'Neviete, čo presne potrebujete?', 'Poradíme vám na bezplatnej konzultácii.')}` });

// Service pages — one template (brief section 05)
for (const s of services) {
  const rel = s.projects.map((x) => P[x]);
  const gallery = rel.flatMap((p) => p.photos.slice(0, 2).map((ph) => [ph, p])).slice(0, 6);
  pages.push({ path: `${s.slug}/`, section: 'sluzby/', og: s.img.endsWith('.jpg') ? s.img : `${s.img}-1400.jpg`, jsonld: breadcrumbLd([['sluzby/', 'Služby'], [`${s.slug}/`, s.name]]),
    title: s.title, desc: s.desc,
    body: (b) => `
  <section class="page-hero page-hero--media">
    <div class="container ph-grid">
      <div>
        ${crumbs(b, [['sluzby/', 'Služby'], [null, s.name]])}
        <span class="eyebrow eyebrow--line">Bratislava a okolie</span>
        <h1>${s.h1}</h1>
        <p class="lead">${s.intro}</p>
        <div class="actions"><a class="btn btn-primary" href="${b}objednavka/?typ=${s.key}">Chcem bezplatnú konzultáciu ${ic('arrow')}</a><a class="btn-text" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a></div>
      </div>
      ${img(s.img, b, s.h1, '(max-width: 1023px) 100vw, 50vw', true)}
    </div>
  </section>

  <section class="section">
    <div class="container split" style="align-items:start">
      <div>
        <span class="eyebrow eyebrow--line">Pre koho</span>
        <h2>Komu sa to hodí</h2>
        <ul class="check-list">${s.forWhom.map((x) => `<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul>
      </div>
      <div>
        <span class="eyebrow eyebrow--line">Varianty</span>
        <h2>Možnosti riešenia</h2>
        <div class="facts facts--2">${s.variants.map(([t, d]) => `<div class="fact"><b>${t}</b><span>${d}</span></div>`).join('')}</div>
      </div>
    </div>
  </section>

  <section class="section section--white">
    <div class="container">
      <div class="sec-head"><div><span class="eyebrow eyebrow--line">Naše práce</span><h2>Z našich realizácií</h2></div><a class="link-more" href="${b}realizacie/">Všetky realizácie →</a></div>
      <div class="gallery">
        ${gallery.map(([ph, p]) => `<a href="${b}realizacie/${p.slug}/">${img(ph, b, `${p.title} — ${p.loc}`)}</a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container split" style="align-items:start">
      <div>
        <span class="eyebrow eyebrow--line">Čo je súčasťou</span>
        <h2>Všetko od jednej firmy</h2>
        <ul class="check-list">${['Konzultácia a poradenstvo', 'Zameranie priestoru', 'Návrh a vizualizácia', 'Výroba nábytku', 'Doprava', 'Montáž u vás doma'].map((x) => `<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul>
      </div>
      <div>
        <span class="eyebrow eyebrow--line">Materiály a kovanie</span>
        <h2>S čím pracujeme</h2>
        <ul class="check-list">${s.materials.map((x) => `<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul>
        <div class="fact" style="margin-top:28px"><span>Orientačný rozpočet</span><b>${s.price ? `od ${s.price}` : 'podľa rozsahu a materiálu'}</b><span>Presnú cenu pripravíme po zameraní a návrhu.</span></div>
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="container">
      <div class="sec-head"><div><span class="eyebrow eyebrow--line">Postup</span><h2>Ako budeme postupovať</h2></div></div>
${steps(true)}
    </div>
  </section>
${faqBlock(s.faq, `Otázky: ${s.name.toLowerCase()}`)}
${finalCta(b, s.key, `Chcete ${s.name.toLowerCase()}?`)}` });
}

// Realizácie (list)
pages.push({ path: 'realizacie/', section: 'realizacie/', jsonld: breadcrumbLd([['realizacie/', 'Realizácie']]),
  title: 'Realizácie nábytku na mieru | Interiéroví majstri',
  desc: 'Naše realizácie: kuchyne, vstavané skrine, detské izby a celé byty na mieru v Bratislave, Chorvátskom Grobe, Viničnom a Sládkovičove.',
  body: (b) => `
  <section class="page-hero page-hero--media">
    <div class="container ph-grid">
      <div>
        ${crumbs(b, [[null, 'Realizácie']])}
        <h1>Skutočné príbehy, skutočné výsledky</h1>
        <p class="lead">Kuchyne, skrine a celé interiéry na mieru v Bratislave a okolí. Pri každom projekte vidíte lokalitu, rozsah a riešenie.</p>
        <div class="actions"><a class="btn btn-primary" href="${b}objednavka/">Chcem podobné riešenie ${ic('arrow')}</a><a class="btn-text" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a></div>
      </div>
      ${img(P['chorvatsky-grob'].photos[0], b, 'Kuchyňa v rodinnom dome v Chorvátskom Grobe', '(max-width: 1023px) 100vw, 50vw', true)}
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="filters" role="group" aria-label="Filter realizácií">
        <button type="button" data-f="all" aria-pressed="true">Všetko</button>
        <button type="button" data-f="kuchyne" aria-pressed="false">Kuchyne</button>
        <button type="button" data-f="skrine" aria-pressed="false">Skrine</button>
        <button type="button" data-f="izby" aria-pressed="false">Izby</button>
        <button type="button" data-f="byty" aria-pressed="false">Celé byty a domy</button>
        <button type="button" data-f="firmy" aria-pressed="false">Firmy</button>
      </div>
      <div class="grid-3">
        ${projects.map((p) => projectCard(p, b)).join('\n        ')}
      </div>
    </div>
  </section>
${finalCta(b, '', 'Páči sa vám niektorá realizácia?', 'Napíšte nám, ktorý projekt sa vám páči. Navrhneme podobné riešenie presne do vášho priestoru.')}` });

// Project detail pages (brief section 06)
projects.forEach((p, i) => {
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  pages.push({ path: `realizacie/${p.slug}/`, section: 'realizacie/', og: `${p.coverImg}-1400.jpg`,
    jsonld: [breadcrumbLd([['realizacie/', 'Realizácie'], [`realizacie/${p.slug}/`, p.title]]), { '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.h1, about: p.type, locationCreated: p.loc, creator: { '@type': 'Organization', name: 'Interiéroví majstri' }, image: p.photos.map((ph) => `${SITE}/images/${ph}-1400.jpg`) }],
    title: `${p.h1} | Interiéroví majstri`.replace(' — ', ', '),
    desc: `${p.task} Realizácia: ${p.loc}.`,
    body: (b) => `
  <section class="page-hero page-hero--media">
    <div class="container ph-grid">
      <div>
        ${crumbs(b, [['realizacie/', 'Realizácie'], [null, p.title]])}
        <div class="chips" style="margin-bottom:16px"><span class="chip">${p.type}</span><span class="chip">${p.loc}</span></div>
        <h1>${p.h1}</h1>
        <p class="lead">${p.task}</p>
      </div>
      <aside class="facts-card" aria-label="O projekte">
        <h2>O projekte</h2>
        <dl class="meta-table">
          <div><dt>Lokalita</dt><dd>${p.loc}</dd></div>
          <div><dt>Typ</dt><dd>${p.type}</dd></div>
          <div><dt>Doba dodania</dt><dd>${p.time}</dd></div>
          ${p.by ? `<div><dt>Návrh</dt><dd>${p.by}</dd></div>` : ''}
        </dl>
        <a class="btn btn-primary" href="${b}objednavka/?projekt=${p.slug}">Chcem podobné riešenie ${ic('arrow')}</a>
      </aside>
    </div>
  </section>
  <section class="section">
    <div class="container project-layout">
      <div>
        <div class="gallery">
          ${p.photos.map((ph, n) => `<a href="${b}images/${ph}-1400.jpg" target="_blank" rel="noopener">${img(ph, b, `${p.alt} — fotografia ${n + 1} z ${p.photos.length}`, n === 0 ? '(max-width: 1023px) 100vw, 60vw' : undefined, n === 0)}</a>`).join('\n          ')}
        </div>
      </div>
      <aside class="sticky-box">
        <h2 style="font-size:24px">Riešenie</h2>
        <ul class="check-list">${p.items.map((x) => `<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul>
        <a class="btn btn-primary" style="width:100%;margin-top:28px" href="${b}objednavka/?projekt=${p.slug}">Chcem podobné riešenie ${ic('arrow')}</a>
      </aside>
    </div>
  </section>
  <section class="section section--white" style="padding-block:48px">
    <div class="container pager">
      <a class="btn-text" href="${b}realizacie/${prev.slug}/">← ${prev.title}</a>
      <a class="btn-text" href="${b}realizacie/">Všetky realizácie</a>
      <a class="btn-text" href="${b}realizacie/${next.slug}/">${next.title} →</a>
    </div>
  </section>
${finalCta(b, '', 'Chcete podobné riešenie?', `Napíšte nám — navrhneme riešenie podobné projektu ${p.loc} presne do vášho priestoru.`)}` });
});

// Blog
pages.push({ path: 'blog/', section: 'blog/', jsonld: breadcrumbLd([['blog/', 'Blog']]),
  title: 'Blog — rady k nábytku na mieru | Interiéroví majstri',
  desc: 'Rady a inšpirácie ku kuchyniam, vstavaným skriniam a nábytku na mieru.',
  body: (b) => `
  <section class="page-hero page-hero--media">
    <div class="container ph-grid">
      <div>
        ${crumbs(b, [[null, 'Blog']])}
        <h1>Rady a inšpirácie k nábytku na mieru</h1>
        <p class="lead">Praktické články, ktoré vám pomôžu naplánovať kuchyňu, skriňu či celý byt.</p>
      </div>
      ${img(P.nivy.photos[0], b, 'Kuchyňa so systémom Smart-Cube pri Nivách', '(max-width: 1023px) 100vw, 50vw', true)}
    </div>
  </section>
  <section class="section">
    <div class="container grid-3">
      <article class="card"><div class="card-img">${img(P.vinicne.photos[2], b, '')}</div><div class="card-body"><span class="soon">Pripravujeme</span><h3>Koľko stojí kuchyňa na mieru</h3><p>Čo ovplyvňuje cenu, kde sa dá ušetriť a kde radšej nie.</p></div></article>
      <article class="card"><div class="card-img">${img(P.sladkovicovo.photos[1], b, '')}</div><div class="card-body"><span class="soon">Pripravujeme</span><h3>Vstavaná skriňa: posuvné alebo krídlové dvere?</h3><p>Výhody, nevýhody a čo sa hodí do malej spálne či chodby.</p></div></article>
      <article class="card"><div class="card-img">${img(P.vinicne.photos[5], b, '')}</div><div class="card-body"><span class="soon">Pripravujeme</span><h3>Ako využiť roh v kuchyni</h3><p>Rohové systémy LeMans a ďalšie riešenia, vďaka ktorým nič nezostane nevyužité.</p></div></article>
    </div>
  </section>
${ctaBand(b, 'Radšej to preberieme osobne?', 'Prvá konzultácia je bezplatná a nezáväzná.')}` });

// Objednávka — full form (brief section 07)
pages.push({ path: 'objednavka/', section: 'objednavka/', jsonld: breadcrumbLd([['objednavka/', 'Objednávka']]),
  title: 'Nezáväzná ponuka a návrh | Interiéroví majstri',
  desc: 'Pošlite nám dopyt na kuchyňu, skriňu alebo nábytok na mieru. Stačí telefón alebo e-mail — ozveme sa vám.',
  body: (b) => `
  <section class="page-hero page-hero--media">
    <div class="container ph-grid">
      <div>
        ${crumbs(b, [[null, 'Objednávka']])}
        <h1>Nezáväzná ponuka a návrh nábytku</h1>
        <p class="lead">Opíšte, čo plánujete. Vyplnenie trvá približne minútu — stačí telefón alebo e-mail.</p>
      </div>
      ${img(P.vinicne.photos[2], b, 'Kuchyňa na mieru vo Viničnom', '(max-width: 1023px) 100vw, 50vw', true)}
    </div>
  </section>
  <section class="section">
    <div class="container cta-final">
      <div>
        <span class="eyebrow eyebrow--line">Ako to funguje</span>
        <h2>Tri kroky k návrhu</h2>
        <ol class="steps" style="grid-template-columns:1fr;margin-top:28px">
          <li class="step"><div class="step-num">${ic('doc')}01</div><h3>Pošlete dopyt</h3><p>Typ nábytku, lokalita a kontakt. Fotky priestoru môžete priložiť.</p></li>
          <li class="step"><div class="step-num">${ic('chat')}02</div><h3>Ozveme sa vám</h3><p>Dohodneme bezplatnú konzultáciu a zameranie.</p></li>
          <li class="step"><div class="step-num">${ic('cube')}03</div><h3>Dostanete návrh a ponuku</h3><p>Návrh s vizualizáciou a cenovú ponuku podľa rozmerov a materiálov.</p></li>
        </ol>
        <p style="margin-top:24px">Radšej telefonicky? <a class="link-more" href="tel:${PHONE}">${PHONE_TXT}</a> · <a class="link-more" href="${WA}" target="_blank" rel="noopener">WhatsApp</a></p>
      </div>
      <form class="form-card lead-form" novalidate>
        <div class="form-grid">
          <div class="field"><label for="o-meno">Meno</label><input id="o-meno" name="meno" autocomplete="name"></div>
          <div class="field"><label for="o-pot">Čo potrebujete?</label><select id="o-pot" name="potreba">${potrebaOptions()}</select></div>
          <div class="field"><label for="o-tel">Telefón</label><input id="o-tel" name="telefon" type="tel" autocomplete="tel" inputmode="tel" placeholder="+421 9xx xxx xxx"></div>
          <div class="field"><label for="o-mail">E-mail</label><input id="o-mail" name="email" type="email" autocomplete="email" placeholder="vas@email.sk"></div>
          <div class="field"><label for="o-lok">Lokalita <small>(mesto alebo časť)</small></label><input id="o-lok" name="lokalita" placeholder="napr. Bratislava – Petržalka"></div>
          <div class="field"><label for="o-roz">Rozmery / rozpočet <small>(nepovinné)</small></label><input id="o-roz" name="rozmery" placeholder="napr. linka 3,2 m, do 6 000 €"></div>
          <div class="field field--full"><label for="o-opis">Opis projektu</label><textarea id="o-opis" name="sprava" rows="4" maxlength="2000" placeholder="Čo plánujete, štýl, termín…"></textarea></div>
          <div class="field field--full"><label for="o-foto">Fotografia priestoru <small>(nepovinné · JPG, PNG, WEBP do 10 MB)</small></label><input id="o-foto" name="foto" type="file" accept="image/jpeg,image/png,image/webp" multiple></div>
          <label class="consent"><input type="checkbox" name="suhlas"> <span>Súhlasím so spracovaním osobných údajov za účelom prípravy ponuky.</span></label>
          <p class="form-error" role="alert"></p>
          <button class="btn btn-primary" type="submit">Odoslať dopyt ${ic('arrow')}</button>
          <p class="form-note">Stačí telefón alebo e-mail. Údaje použijeme len na prípravu ponuky.</p>
        </div>
        <div class="form-success" role="status">${ic('check')}<h3>Ďakujeme, ozveme sa vám.</h3><p>Váš dopyt sme prijali.</p></div>
      </form>
    </div>
  </section>` });

// Kontakt
pages.push({ path: 'kontakt/', section: 'kontakt/', jsonld: [breadcrumbLd([['kontakt/', 'Kontakt']]), orgLd],
  title: 'Kontakt a nezáväzná ponuka | Interiéroví majstri',
  desc: `Kontakt: ${PHONE_TXT}, ${MAIL}, Landauova 3146/20, Bratislava. Po – Pi 9:00 – 17:00.`,
  body: (b) => `
  <section class="page-hero page-hero--media">
    <div class="container ph-grid">
      <div>
        ${crumbs(b, [[null, 'Kontakt']])}
        <h1>Kontakt a bezplatná konzultácia</h1>
        <p class="lead">Máte otázky ohľadom našej práce? Máte záujem o bezplatnú konzultáciu? Kontaktujte nás telefonicky alebo e-mailom. Odpovedáme v najkratšom možnom čase, väčšinou do 24 hodín.</p>
      </div>
      ${img(P['dubravka-landauova'].photos[0], b, 'Knižnica a obývačka na mieru v Dúbravke', '(max-width: 1023px) 100vw, 50vw', true)}
    </div>
  </section>
  <section class="section">
    <div class="container contact-grid">
      <div class="c-list">
        <a class="c-item" href="tel:${PHONE}"><span class="ic">${ic('phone')}</span><span><small>Telefón</small><b>${PHONE_TXT}</b></span></a>
        <a class="c-item" href="mailto:${MAIL}"><span class="ic">${ic('doc')}</span><span><small>E-mail</small><b>${MAIL}</b></span></a>
        <a class="c-item" href="${WA}" target="_blank" rel="noopener"><span class="ic">${ic('chat')}</span><span><small>WhatsApp</small><b>Napísať správu</b></span></a>
        <div class="c-item"><span class="ic">${ic('home')}</span><span><small>Adresa</small><b>Landauova 3146/20, 841 01 Bratislava</b></span></div>
        <div class="c-item"><span class="ic">${ic('clock')}</span><span><small>Pracovný čas</small><b>Po – Pi: 9:00 – 17:00</b><small>So – Ne: individuálne</small></span></div>
        <p class="small" style="color:var(--muted);padding:4px">BK Creative s. r. o. · IČO: 56343744 · DIČ: 2122278433 · IČ DPH: SK2122278433</p>
      </div>
      <iframe class="map" title="Mapa — Landauova 3146/20, Bratislava" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Landauova+3146%2F20,+841+01+Bratislava&output=embed"></iframe>
    </div>
  </section>
${finalCta(b, '', 'Potrebujete cenovú ponuku?')}` });

// ---------------------------------------------------------------- write

const written = [];
for (const pg of pages) {
  const depth = pg.path ? pg.path.split('/').filter(Boolean).length : 0;
  const b = '../'.repeat(depth);
  formCount = 0;
  const html = head(pg, b) + header(pg, b) + pg.body(b) + footer(b);
  const out = path.join(root, pg.path, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  written.push(pg.path);
}

// 404 — served by GitHub Pages at any depth, so it uses an absolute base
{
  const b = PREVIEW_BASE;
  const pg = { path: '404', section: null, title: 'Stránka sa nenašla | Interiéroví majstri', desc: 'Táto stránka neexistuje.' };
  const html = head(pg, b).replace('<link rel="canonical"', '<meta name="robots" content="noindex">\n  <link rel="canonical"') + header(pg, b) + `
  <section class="section not-found">
    <div class="container">
      <div class="code">404</div>
      <h1>Stránka sa nenašla</h1>
      <p class="lead" style="margin-inline:auto">Možno bola presunutá. Pozrite si naše realizácie alebo nám napíšte.</p>
      <div class="actions" style="justify-content:center;margin-top:28px"><a class="btn btn-primary" href="${b}">Na úvodnú stránku</a><a class="btn btn-outline" href="${b}realizacie/">Realizácie</a></div>
    </div>
  </section>` + footer(b);
  fs.writeFileSync(path.join(root, '404.html'), html);
}

fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${written.map((p) => `  <url><loc>${SITE}/${p}</loc></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`built ${written.length} pages + 404, sitemap, robots`);
