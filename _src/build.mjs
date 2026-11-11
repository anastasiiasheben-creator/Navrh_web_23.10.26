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
const WA = 'https://wa.me/421918638713';
const privacy = (b) => `${b}ochrana-sukromia/`; // text taken over from the old imajstri.sk/ochrana-sukromia/
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

// Project texts are taken from the project pages on the old imajstri.sk (Zadanie, Riešenie, Projektové informácie).
// Client names are left out until the client confirms we may publish them.
const projects = [
  { slug: 'vinicne', title: 'Kuchyňa drevo + čierno-biela', h1: 'Moderná kuchyňa v kombinácii dreva a čierno-bieleho dizajnu', loc: 'Viničné', main: 'kuchyne', cats: ['kuchyne'], type: 'Kuchyňa', rooms: 'Kuchyňa', time: '6 týždňov', by: 'Jozef', ours: true, cover: 3,
    alt: 'Kuchyňa na mieru vo Viničnom s drevenou doskou a čiernymi skrinkami',
    task: 'Moderná kuchyňa na mieru, ktorá spojí prírodný dekor dreva s čierno-bielym dizajnom.',
    solution: 'Kombinácia prírodného dekoru dreva s čierno-bielymi prvkami vytvára elegantnú kuchyňu, ktorá sa hodí do moderných interiérov.',
    items: ['Moderný a nadčasový dizajn — prírodný dekor dreva s čierno-bielymi prvkami', 'Veľké zásuvky a rohový výsuvný systém LeMans pre jednoduchý prístup a maximálne využitie priestoru', 'Premyslené rozloženie pracovnej plochy, vstavané spotrebiče a čisté línie pre pohodlné každodenné používanie'] },
  { slug: 'zahorska-bystrica', title: 'Moderný byt na mieru', h1: 'Nábytok na mieru pre moderný byt v Záhorskej Bystrici', loc: 'Bratislava – Záhorská Bystrica', main: 'byty', cats: ['byty', 'kuchyne', 'obyvacky', 'izby', 'kupelne', 'chodby', 'skrine'], type: 'Celý byt', rooms: 'Chodba, kuchyňa, kúpeľňa, obývačka, spálňa', time: '7 týždňov', by: 'Jozef', ours: true, cover: 2,
    alt: 'Obývačka s lamelovou TV stenou a kuchyňa s ostrovčekom v Záhorskej Bystrici',
    task: 'V byte v Záhorskej Bystrici bolo potrebné navrhnúť moderný nábytok na mieru.',
    solution: 'Vytvorili sme unikátny interiér, ktorý spája eleganciu a funkčnosť. Každý kus nábytku bol navrhnutý s ohľadom na individuálne potreby zákazníka, s cieľom vytvoriť harmonický a moderný domov.',
    items: ['Obývačková stena s lamelami, ktorá dodáva priestoru štýlový a sofistikovaný vzhľad', 'Kuchyňa s lamelami a ostrovčekom pre tých, ktorí ocenia moderný dizajn a praktickosť', 'Vstavaná skriňa s komodou a nočnými stolíkmi', 'Chodbová skriňa so sedením pri vstupe', 'Kúpeľňová skrinka pod umývadlo'] },
  { slug: 'chorvatsky-grob', title: 'Celý dom na mieru', h1: 'Zariadenie celého domu na mieru v Chorvátskom Grobe', loc: 'Chorvátsky Grob', main: 'byty', cats: ['byty', 'kuchyne', 'obyvacky', 'izby', 'kupelne', 'chodby', 'skrine'], type: 'Celý dom', rooms: 'Chodba, detská izba, kuchyňa, kúpeľňa, obývačka, šatník, spálňa', time: '7 týždňov', by: 'Dušana', ours: true, cover: 1,
    alt: 'Kuchyňa a interiér rodinného domu v Chorvátskom Grobe',
    task: 'Dostali sme za úlohu zariadiť novostavbu v Chorvátskom Grobe.',
    solution: 'Projekt rodinného domu zahŕňa nábytok na mieru do všetkých miestností — od kuchyne až po detskú izbu.',
    items: ['Kuchyňa v drevodekore s prepojenou textúrou na dvierkach', 'Chodba plynule prepojená s kuchyňou', 'Spálňa so vstavanými skriňami a šatníkom', 'Kúpeľňa', 'Detská izba pre dvoch súrodencov — poschodová posteľ s čalúnením, schody s úložným priestorom, vstavaná skriňa a písací stôl', 'Minimalistická obývačka s lamelovým plátom, zladená do farieb kuchyne'] },
  { slug: 'guthaus', title: 'Kuchyňa s ostrovčekom a TV stena', h1: 'Kuchyňa, obývačka, kúpeľňa a chodba na mieru – Guthaus', loc: 'Bratislava – Guthaus', main: 'byty', cats: ['byty', 'kuchyne', 'obyvacky', 'kupelne', 'chodby'], type: 'Byt', rooms: 'Chodba, kuchyňa, kúpeľňa, obývačka', time: '3 týždne', by: 'Jozef', ours: true, cover: 1,
    alt: 'Biela kuchyňa s dubovými skrinkami a ostrovčekom v byte Guthaus',
    task: 'Zariadiť nový byt nábytkom na mieru v kombinácii dubového dekoru a bielej.',
    solution: 'Kuchyňu, obývačku, kúpeľňu aj chodbu sme navrhli v jednom štýle — biele matné plochy dopĺňa teplý dubový dekor. Byt tak pôsobí čisto a útulne zároveň.',
    items: ['Kuchyňa v tvare L s ostrovčekom a vstavanými spotrebičmi', 'TV stena s podsvietením a výklopnými skrinkami', 'Kúpeľňový nábytok s doskou nad práčkou a zrkadlovými skrinkami', 'Chodbová skriňa so sedením a vešiakmi'] },
  { slug: 'nivy', title: 'Kuchyňa a obývačka pri Nivách', h1: 'Kuchyňa a obývačka na mieru pri Nivách', loc: 'Bratislava – Nivy', main: 'kuchyne', cats: ['kuchyne', 'obyvacky', 'kupelne'], type: 'Kuchyňa a obývačka', rooms: 'Kuchyňa, obývačka, kúpeľňa', time: '5 týždňov', by: 'Jozef', ours: true, cover: 1, skip: [5],
    alt: 'Kuchyňa so systémom Smart-Cube a čiernou policou pri Nivách',
    task: 'V byte pri Nivách bolo potrebné navrhnúť moderný nábytok na mieru.',
    solution: 'Moderná kuchyňa na mieru sa pýši výrazným Smart-Cube systémom s podsvietením, ktorý dodáva interiéru sofistikovaný a technologicky pokročilý vzhľad. Dokonalý kontrast vytvárajú čierne dvere s tmavým sklom Lacobel. Každý detail je premyslený tak, aby kuchyňa nebola len miestom na varenie, ale aj priestorom, kde sa budete cítiť výnimočne.',
    items: ['Kuchyňa so Smart-Cube systémom s podsvietením', 'Čierne dvere s tmavým sklom Lacobel', 'Vysoká skriňa s výsuvnými zásuvkami a vstavanými spotrebičmi', 'Knižnica okolo dverí a pracovný stôl so zásuvkami v obývačke', 'Skriňa v kúpeľni, ktorá ukrýva kotol a inštalácie, s podsvietenou nikou'] },
  { slug: 'detska-izba-s-poschodovou-postelou', title: 'Detská izba s posteľou na poschodí', h1: 'Detská izba s posteľami na poschodí a úložnými schodmi', loc: 'Okolie Bratislavy', main: 'izby', cats: ['izby', 'chodby', 'skrine'], type: 'Detská izba', rooms: 'Chodba, detská izba', time: '6 týždňov', by: 'Jozef', ours: true, cover: 1,
    alt: 'Detská izba na mieru s posteľou na poschodí a úložnými schodmi',
    task: 'Navrhnúť detskú izbu pre dve deti tak, aby malo každé svoje miesto na spanie, učenie aj hru.',
    solution: 'Postele sme umiestnili na poschodie a pod nimi vznikli pracovné stoly s policami. Do postelí sa vystupuje po schodoch, ktoré sú zároveň skrinkami a zásuvkami. Farebné dvierka dávajú každej časti izby vlastný charakter. Súčasťou realizácie je aj chodbová skriňa s posuvnými dverami.',
    items: ['Dve postele na poschodí so zábradlím', 'Schody s úložnými skrinkami a zásuvkami', 'Písacie stoly a police pod posteľami', 'Chodbová skriňa s posuvnými dverami a otvoreným regálom'] },
  { slug: 'vydrica', title: 'Zariadenie bytu Vydrica', h1: 'Zariadenie bytu Vydrica – Bratislava', loc: 'Bratislava – Vydrica', main: 'byty', cats: ['byty', 'kuchyne', 'obyvacky', 'izby', 'kupelne', 'skrine'], type: 'Celý byt', rooms: 'Kuchyňa, kúpeľňa, obývačka, spálňa', time: '5 týždňov', by: 'Jozef', ours: true, cover: 1,
    alt: 'Svetlá kuchyňa na mieru v byte vo Vydrici',
    task: 'Kompletné vybavenie bytu nábytkom na mieru.',
    solution: 'Tentokrát sme vytvorili kompletné vybavenie bytu na mieru. Každý kus nábytku bol navrhnutý s ohľadom na individuálne potreby zákazníka, s cieľom vytvoriť harmonický a moderný domov.',
    items: ['Kuchyňa', 'Minimalistická obývačková stena', 'Vstavaná skriňa v spálni', 'Čelo postele so stolíkmi', 'Kúpeľňa — skrinka pod umývadlo a vysoká skriňa nad práčkou a WC'] },
  { slug: 'pezinok', title: 'Kuchyňa pod schodmi', h1: 'Kuchyňa na mieru so skrinkami pod schodmi – Pezinok', loc: 'Pezinok', main: 'kuchyne', cats: ['kuchyne'], type: 'Kuchyňa', rooms: 'Kuchyňa', time: '5 týždňov', by: 'Jozef', ours: true, cover: 1,
    alt: 'Krémová kuchyňa so skrinkami pod schodiskom v Pezinku',
    task: 'Navrhnúť kuchyňu do domu, v ktorom časť priestoru zaberá schodisko.',
    solution: 'Kuchyňu sme prispôsobili šikmine schodiska — skrinky pod schodmi kopírujú jeho tvar a ukrývajú výsuvné zásuvky. Rámové dvierka v krémovej farbe dávajú kuchyni klasický vzhľad a LED pásik pri podlahe ju jemne osvetľuje.',
    items: ['Skrinky a zásuvky na mieru pod schodiskom', 'Rámové dvierka v krémovej farbe', 'Vstavaná rúra a mikrovlnka vo vysokej skrini', 'LED podsvietenie pri podlahe a pod skrinkami'] },
  { slug: 'metropolis', title: 'Kuchyňa s drevenými portálmi', h1: 'Kuchyňa a skrine podľa návrhu architektov – Metropolis', loc: 'Bratislava – Metropolis', main: 'kuchyne', cats: ['kuchyne', 'kupelne', 'skrine'], type: 'Kuchyňa', rooms: 'Kuchyňa, kúpeľňa', time: '3 týždne', by: 'TooL architects', ours: false, cover: 1,
    alt: 'Kuchyňa s portálmi v tmavom drevodekore v byte Metropolis',
    task: 'Výroba a montáž nábytku do bytu v projekte Metropolis podľa návrhu architektov.',
    solution: 'Tmavý drevodekor tvorí v byte výrazné portály, ktoré rámujú vstup do kuchyne a skrývajú úložný priestor. Svetlé skrinky kuchyne ich vyvažujú. V kúpeľni sme práčku a police ukryli za dvierka v rovnakom dekore.',
    items: ['Portály a vysoké skrine v tmavom drevodekore', 'Svetlá kuchynská linka so vstavanými spotrebičmi', 'Skriňa na práčku a úložné police v kúpeľni'] },
  { slug: 'dubravka-landauova', title: 'Trojizbový byt pre rodinu', h1: 'Trojizbový byt pre rodinu s dieťaťom – Dúbravka', loc: 'Bratislava – Dúbravka', main: 'byty', cats: ['byty', 'kuchyne', 'obyvacky', 'izby', 'skrine'], type: 'Celý byt', rooms: 'Chodba, izba, kuchyňa, obývačka, šatník, spálňa', time: '2 mesiace', cover: 1,
    alt: 'Knižnica a obývačka na mieru v trojizbovom byte v Dúbravke',
    task: 'Návrh a výroba nábytku na mieru pre rodinu s malým dieťaťom v trojizbovom byte v Dúbravke. Cieľom bolo vytvoriť praktický a útulný domov, ktorý vyhovuje špecifickým potrebám rodiny a zabezpečí dostatok úložného priestoru.',
    solution: 'Každú miestnosť sme navrhli podľa toho, ako ju rodina používa — s dôrazom na úložný priestor, bezpečnosť a prehľadnosť.',
    items: ['Spálňa — vstavané skrine a minimalistický dizajn pre pokojné prostredie na odpočinok', 'Detská izba pre 5-ročné dieťa — bezpečnosť, flexibilita a praktické úložné riešenia', 'Obývačka s pracovňou — pohodlný a moderný priestor na spoločné chvíle rodiny', 'Kuchyňa a jedáleň — efektívne využitý priestor, vstavané spotrebiče a dostatok pracovnej plochy', 'Chodba — vstavané skrine, ktoré využívajú každý centimeter', 'Práčovňa — úložné riešenia pre práčku, sušičku a ďalšie vybavenie, skryté úložné priestory'] },
  { slug: 'dubravka-mensi-byt', title: 'Menší byt v Dúbravke', h1: 'Kuchyňa, chodba, detská izba a kúpeľňa na mieru – Dúbravka', loc: 'Bratislava – Dúbravka', main: 'byty', cats: ['byty', 'kuchyne', 'chodby', 'izby', 'kupelne'], type: 'Byt', rooms: 'Chodba, detská izba, kuchyňa, kúpeľňa', time: '5 týždňov', by: 'Jozef', ours: true, cover: 7,
    alt: 'Kuchyňa na mieru do malého priestoru v Dúbravke',
    task: 'Zariadiť funkčne menší byt v Dúbravke — kuchyňu, chodbu, detskú izbu a kúpeľňu.',
    solution: 'Realizovali sme funkčné a moderné riešenie kuchyne na mieru, ktoré efektívne využíva dostupný priestor a zvyšuje úložnú kapacitu. Súčasťou realizácie bolo aj dizajnové obloženie chodby s vešiakovou stenou, ktoré spája praktickosť s estetickým vzhľadom.',
    items: ['Kuchyňa na mieru do malého priestoru', 'Vyššia úložná kapacita', 'Dizajnové obloženie chodby s vešiakovou stenou', 'Detská izba — posteľ s úložným priestorom, písací stôl, police a vysoké skrine', 'Kúpeľňa — skrinka pod umývadlo s miestom pre práčku'] },
  { slug: 'devinska-nova-ves', title: 'Biela kuchyňa s drevenou zástenou', h1: 'Kuchyňa a chodba na mieru – Devínska Nová Ves', loc: 'Bratislava – Devínska Nová Ves', main: 'kuchyne', cats: ['kuchyne', 'chodby', 'skrine'], type: 'Kuchyňa a chodba', rooms: 'Chodba, kuchyňa', time: '4 týždne', by: 'Jozef', ours: true, cover: 1,
    alt: 'Biela kuchyňa s drevenou zástenou a barovým pultom v Devínskej Novej Vsi',
    task: 'Navrhnúť do rodinného domu priestrannú kuchyňu a praktickú chodbu.',
    solution: 'Biele bezúchytkové skrinky sme doplnili drevodekorom na pracovnej doske, zástene a stĺpe s barovým pultom. Na chodbe vznikla vysoká skriňa s botníkom a lavicou v rovnakom štýle.',
    items: ['Kuchyňa s vysokými skriňami na spotrebiče', 'Pracovná doska a zástena v drevodekore', 'Stĺp s barovým pultom', 'Chodbová skriňa s botníkom a lavicou'] },
  { slug: 'slnecnice', title: 'Kuchyňa a vstavané skrine', h1: 'Kuchyňa a vstavané skrine – Slnečnice', loc: 'Bratislava – Slnečnice', main: 'kuchyne', cats: ['kuchyne', 'skrine'], type: 'Kuchyňa a skrine', rooms: 'Chodba, kuchyňa', time: '1 mesiac', cover: 1,
    alt: 'Moderná kuchyňa s tmavou zástenou v byte v Slnečniciach',
    task: 'V byte v projekte Slnečnice bolo potrebné navrhnúť funkčnú a štýlovú kuchyňu na mieru a vstavané skrine.',
    solution: 'Vytvorili sme modernú kuchyňu s praktickým usporiadaním a vstavané skrine, ktoré efektívne využívajú priestor a dodávajú interiéru nadčasový vzhľad.',
    items: ['Moderná kuchyňa s praktickým usporiadaním', 'Vstavané skrine, ktoré efektívne využívajú priestor'] },
  { slug: 'sladkovicovo', title: 'Vstavané skrine', h1: 'Vstavané skrine – Sládkovičovo', loc: 'Sládkovičovo', main: 'skrine', cats: ['skrine', 'chodby'], type: 'Vstavané skrine', rooms: 'Šatník', time: '4 týždne', by: 'Jozef', ours: true, cover: 2,
    alt: 'Vstavaná skriňa s posuvnými dverami a otvoreným vnútorným vybavením',
    task: 'Ďalší úložný priestor v domácnosti — vstavané skrine do troch miestností.',
    solution: 'Výroba a montáž vstavaných skríň pre klienta v Sládkovičove.',
    items: ['Spálňa', 'Hosťovská izba', 'Vstupná chodba'] },
  { slug: 'zavod', title: 'Kúpeľne a TV stena v Závode', h1: 'Kúpeľňový nábytok, TV stena a chodba – Závod', loc: 'Závod', main: 'byty', cats: ['byty', 'kupelne', 'obyvacky', 'chodby'], type: 'Kúpeľne a obývačka', rooms: 'Chodba, kúpeľňa, obývačka', time: '4 týždne', by: 'Jozef', ours: true, cover: 1,
    alt: 'TV stena s lamelami a skrinkami v rodinnom dome v Závode',
    task: 'Zariadiť dve kúpeľne, obývačku a chodbu v rodinnom dome.',
    solution: 'Do kúpeľní sme navrhli závesné skrinky pod umývadlá s veľkými zásuvkami a vysokú skriňu, ktorá ukrýva kotol. V obývačke vznikla TV stena s lamelami a skrinkami, na chodbe lamelový obklad s policami.',
    items: ['Závesné skrinky pod umývadlo so zásuvkami', 'Vysoká skriňa so skrytým kotlom', 'TV stena s lamelami a úložným priestorom', 'Lamelový obklad na chodbe'] },
  { slug: 'petrzalka', title: 'Kuchyňa a chodba v Petržalke', h1: 'Kuchyňa a chodba na mieru – Petržalka', loc: 'Bratislava – Petržalka', main: 'kuchyne', cats: ['kuchyne', 'chodby', 'skrine'], type: 'Kuchyňa a chodba', rooms: 'Chodba, kuchyňa', time: '4 týždne', by: 'Jozef', ours: true, cover: 1,
    alt: 'Kuchyňa až po strop vo svetlom drevodekore v Petržalke',
    task: 'Vymeniť kuchyňu v byte a lepšie využiť úzku vstupnú chodbu.',
    solution: 'Kuchyňa vo svetlom drevodekore siaha až po strop, takže ponúka veľa úložného priestoru. Na chodbe sme nad dverami a pozdĺž steny vytvorili skrine, botník a vešiakovú časť.',
    items: ['Kuchyňa až po strop so vstavanými spotrebičmi', 'Skrinky nad dverami', 'Botník a vešiaková časť na chodbe'] },
  { slug: 'velke-levare', title: 'Chodba s botníkom pod oknom', h1: 'Nábytok do chodby na mieru – Veľké Leváre', loc: 'Veľké Leváre', main: 'skrine', cats: ['chodby', 'skrine'], type: 'Chodba', rooms: 'Chodba', time: '3 týždne', by: 'Jozef', ours: true, cover: 1,
    alt: 'Botník a kryt radiátora pod oknom na chodbe vo Veľkých Levároch',
    task: 'Využiť dlhú chodbu rodinného domu na odkladanie obuvi a oblečenia.',
    solution: 'Pod oknom vznikla nízka zostava s výklopnými botníkmi a mriežkou, ktorá zakrýva radiátor a nechá teplo prúdiť do miestnosti. Šatník s posuvnými zrkadlovými dverami opticky zväčšuje priestor.',
    items: ['Výklopné botníky', 'Kryt radiátora v rovnakom dekore', 'Šatník s posuvnými zrkadlovými dverami'] },
  { slug: 'salon-anima', title: 'Kozmetický salón Anima', h1: 'Kozmetický salón Anima', loc: 'Bratislava', main: 'firmy', cats: ['firmy', 'skrine'], type: 'Komerčný priestor', rooms: 'Komerčné priestory', time: '3 týždne', by: 'ToøL. interior architects', ours: false, cover: 1,
    alt: 'Vstavané skrine a recepcia v kozmetickom salóne Anima',
    task: 'Realizácia nábytku pre salón krásy Anima podľa návrhu architektov.',
    solution: 'Každý kus nábytku bol navrhnutý s ohľadom na individuálne potreby priestoru a zákazníka, s cieľom vytvoriť harmonický komerčný priestor.',
    items: ['Vstavaná skriňa s množstvom úložného priestoru — dvere elegantne zakrývajú sokle a vytvárajú čistý, jednotný vzhľad', 'Minikuchynka pre pracovníkov salónu', 'Zrkadlová skriňa, ktorá opticky zväčšuje priestor'] },
  { slug: 'herny-stol', title: 'Herný stôl s podsvietením', h1: 'Herný stôl na mieru s podsvietenou plochou', loc: 'Bratislava', main: 'ostatne', cats: ['ostatne'], type: 'Atypický nábytok', rooms: 'Obývačka', time: '', cover: 1,
    alt: 'Herný stôl na mieru s podsvietenou plochou na skladanie puzzle',
    task: 'Stôl na skladanie puzzle, stavebníc a spoločenské hry.',
    solution: 'Herná plocha je zapustená a podsvietená, takže sa z nej nič nestratí a večer netreba ďalšie svetlo. Pod ňou je polica na rozložené hry.',
    items: ['Zapustená herná plocha s vyvýšeným okrajom', 'LED podsvietenie plochy', 'Polica pod stolom'] },
];
projects.forEach((p) => { p.photos = photos(p.slug, p.skip); p.coverImg = p.photos[p.cover - 1]; });

// Realizácie filter: every project has one main category
const FILTERS = [['kuchyne', 'Kuchyne'], ['skrine', 'Skrine a chodby'], ['izby', 'Detské izby'], ['byty', 'Celé byty a domy'], ['firmy', 'Firmy'], ['ostatne', 'Ostatné']];
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
    projects: ['vinicne', 'nivy', 'pezinok', 'guthaus', 'zahorska-bystrica', 'devinska-nova-ves', 'slnecnice', 'chorvatsky-grob'],
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
    projects: ['zahorska-bystrica', ['guthaus', [3, 4]], 'nivy', ['zavod', [1, 2]], 'dubravka-landauova', 'chorvatsky-grob', 'vydrica'],
    faq: [['Dá sa skryť kabeláž od televízora?', 'Áno, vedenie káblov navrhujeme priamo do TV steny.'], ['Môže obývačka ladiť s kuchyňou?', 'Áno, navrhujeme ich spolu s rovnakými dekormi — ako v Záhorskej Bystrici.'], ['Robíte aj samotné lamelové obklady?', 'Áno, lamely vyrábame a montujeme ako súčasť TV steny alebo samostatne.']] },
  { slug: 'detske-izby-a-spalne', key: 'izba', name: 'Detské izby a spálne', h1: 'Nábytok do spálne a detskej izby', img: 'projekty/chorvatsky-grob/dom-na-mieru-chorvatsky-grob-04', price: '1 500 €', icon: 'bed',
    title: 'Nábytok do spálne a detskej izby na mieru | Interiéroví majstri',
    desc: 'Postele na poschodí, schody s úložným priestorom, šatníky a čelá postelí na mieru. Bratislava a okolie.',
    short: 'Postele na poschodí, schody s úložným priestorom, šatníky.',
    intro: 'Detská izba, ktorá rastie s deťmi, a spálňa, v ktorej je poriadok. Navrhneme nábytok na mieru podľa rozmerov miestnosti aj veku detí.',
    forWhom: ['Dve deti v jednej izbe', 'Malá spálňa, v ktorej chýba úložný priestor', 'Chcete čelo postele, nočné stolíky a skriňu v jednom štýle'],
    variants: [['Posteľ na poschodí', 'Aj čalúnená, so schodiskom s úložným priestorom.'], ['Šatníky a skrine', 'Na mieru do spálne aj detskej izby.'], ['Čelá postelí', 'S nočnými stolíkmi v jednom celku.'], ['Písacie stoly', 'Pracovné miesto pre školákov.']],
    materials: ['Dosky Egger', 'Kovanie Blum', 'Čalúnenie', 'Úložné schody a zásuvky'],
    projects: [['detska-izba-s-poschodovou-postelou', [1, 2]], ['chorvatsky-grob', [9, 10]], ['dubravka-mensi-byt', [9, 11]], ['zahorska-bystrica', [11]]],
    faq: [['Je posteľ na poschodí bezpečná?', 'Navrhujeme ju s ohľadom na vek detí — so zábradlím a stabilným schodiskom.'], ['Dá sa nábytok neskôr upraviť?', 'Pri návrhu myslíme na to, ako bude izba rásť s dieťaťom.'], ['Robíte aj samotné šatníky?', 'Áno, aj samostatné šatníky a vstavané skrine.']] },
  // Kúpeľne and Chodby added at the client's request (Nov 2026); texts are a draft for the client to confirm.
  { slug: 'kupelnovy-nabytok', key: 'kupelna', name: 'Kúpeľňový nábytok', h1: 'Kúpeľňový nábytok na mieru', img: 'projekty/chorvatsky-grob/dom-na-mieru-chorvatsky-grob-07', price: null, icon: 'cube',
    title: 'Kúpeľňový nábytok na mieru | Interiéroví majstri',
    desc: 'Skrinky pod umývadlo, vysoké skrine a zrkadlové skrinky do kúpeľne na mieru. Návrh, výroba a montáž od jedného tímu.',
    short: 'Skrinky pod umývadlo, vysoké skrine, zrkadlové skrinky.',
    intro: 'Aj v malej kúpeľni sa dá nájsť miesto na všetko. Navrhneme nábytok presne do vašich rozmerov — od skrinky pod umývadlo až po vysokú skriňu na uteráky a drogériu.',
    forWhom: ['Malá kúpeľňa, v ktorej chýba úložný priestor', 'Nepravidelné rozmery alebo šikmina, kam sa hotový nábytok nezmestí', 'Chcete kúpeľňu zladenú s ostatným nábytkom v byte'],
    variants: [['Skrinky pod umývadlo', 'Na mieru k vášmu umývadlu a batérii.'], ['Vysoké skrine', 'Na uteráky, drogériu aj práčku či sušičku.'], ['Zrkadlové skrinky', 'S osvetlením a úložným priestorom.'], ['Police a niky', 'Využijeme aj priestor nad WC či vaňou.']],
    materials: ['Materiály vhodné do vlhkého prostredia', 'Kovanie Blum', 'Zrkadlá a sklo', 'LED osvetlenie'],
    projects: [['guthaus', [5, 6]], ['zavod', [3, 5]], ['dubravka-mensi-byt', [13, 14]], ['vydrica', [9]], ['zahorska-bystrica', [10]], ['metropolis', [6]]],
    faq: [['Vydrží nábytok vlhkosť v kúpeľni?', 'Na kúpeľňový nábytok používame materiály a hrany určené do vlhkého prostredia.'], ['Viete nábytok prispôsobiť umývadlu a batérii?', 'Áno, rozmery aj výrezy navrhneme podľa konkrétneho umývadla a batérie.'], ['Robíte aj skrine na práčku a sušičku?', 'Áno, aj vstavané skrine pre práčku a sušičku nad sebou.']] },
  { slug: 'chodby-a-predsiene', key: 'chodba', name: 'Chodby a predsiene', h1: 'Nábytok do chodby a predsiene na mieru', img: 'projekty/dubravka-mensi-byt/mensi-byt-dubravka-02', price: null, icon: 'wardrobe',
    title: 'Nábytok do chodby a predsiene na mieru | Interiéroví majstri',
    desc: 'Vstavané skrine, botníky, vešiakové steny a sedenie pri vstupe na mieru. Návrh, výroba a montáž od jedného tímu.',
    short: 'Vstavané skrine, botníky, vešiaky a sedenie pri vstupe.',
    intro: 'Chodba je prvé, čo uvidíte po príchode domov. Navrhneme ju tak, aby mali svoje miesto bundy, topánky aj tašky — a aby pôsobila čisto a vzdušne aj v úzkom priestore.',
    forWhom: ['Úzka alebo dlhá chodba, kde je každý centimeter dôležitý', 'Chcete skryť bundy a topánky za jednotné dvierka', 'Potrebujete sedenie na obúvanie a miesto na kľúče či tašky'],
    variants: [['Vstavané skrine', 'Od podlahy po strop, aj s posuvnými dverami.'], ['Botníky', 'Výklopné aj výsuvné, podľa počtu párov.'], ['Vešiakové steny', 'Otvorené vešiaky s lamelami alebo policami.'], ['Sedenie pri vstupe', 'S úložným priestorom pod sedákom.']],
    materials: ['Dosky Egger', 'Kovanie Blum', 'Lamely a obklady', 'Zrkadlá a LED osvetlenie'],
    projects: [['velke-levare', [1, 2]], ['devinska-nova-ves', [6, 8]], ['petrzalka', [3, 4]], ['guthaus', [7]], ['chorvatsky-grob', [12]], ['zahorska-bystrica', [9]]],
    faq: [['Dá sa skriňa vstavať aj do úzkej chodby?', 'Áno, navrhneme plytšie skrine alebo posuvné dvere, ktoré pri otváraní nezaberajú miesto.'], ['Robíte aj samostatné botníky?', 'Áno, aj samostatné botníky a vešiakové steny.'], ['Viete chodbu zladiť s ostatným nábytkom?', 'Áno, použijeme rovnaké dekory ako v kuchyni či obývačke.']] },
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

// Gallery layout = one big photo + 3 beside it + rows of 3 (a last row of 2 is stretched), so there is never a lone photo
const fullRows = (list) => list.slice(0, [10, 9, 7, 6, 4, 1].find((n) => n <= list.length) || 0);

const img = (base, b, alt, sizes = '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw', eager = false, style = '') =>
  base.endsWith('.jpg')
    ? `<img src="${b}images/${base}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}${style}>`
    : `<img src="${b}images/${base}-700.jpg" srcset="${b}images/${base}-700.jpg 700w, ${b}images/${base}-1400.jpg 1400w" sizes="${sizes}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}${style}>`;

const link = (b, p) => (b + p) || './';

// Logo variant: our new logo (default) or the client's round logo. ?logo=klient / ?logo=novy, remembered for the browser tab.
const LOGO_JS = "try{var q=new URLSearchParams(location.search).get('logo');if(q)sessionStorage.setItem('imj-logo',q);var l=q||sessionStorage.getItem('imj-logo');if(l==='klient')document.documentElement.setAttribute('data-logo','klient');else if(l==='novy')document.documentElement.removeAttribute('data-logo')}catch(e){}";
const roundLogo = (b, cls) => `<img class="brand-round${cls ? ' ' + cls : ''}" src="${b}images/logo-klient.png" alt="" width="288" height="288">`;

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
  <script>${LOGO_JS}</script>
  <link rel="preload" href="${b}css/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${b}css/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${b}css/site.css?v=${CSS_V}">${pg.preload ? `\n  <link rel="preload" as="image" href="${b}images/${pg.preload}" fetchpriority="high">` : ''}${pg.jsonld ? `\n  <script type="application/ld+json">${JSON.stringify(pg.jsonld)}</script>` : ''}
</head>
<body>
<a class="skip" href="#obsah">Preskočiť na obsah</a>
${sprite}`;
};

const header = (pg, b) => `
<header class="site-header">
  <div class="container container--wide header-row">
    <a href="${link(b, '')}" class="brand" aria-label="Interiéroví majstri – nábytok na mieru, úvodná stránka"><img class="brand-mark" src="${b}images/logo-mark.png" alt="" width="600" height="86"><span class="brand-tag" aria-hidden="true">Nábytok na mieru</span>${roundLogo(b)}</a>
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
        <div class="brand brand--light"><img class="brand-mark" src="${b}images/logo-mark-light.png" alt="Interiéroví majstri" width="600" height="86"><span class="brand-tag">Nábytok na mieru</span>${roundLogo(b)}</div>
        <p>Vaša vízia, náš nábytok. Kuchyne, skrine a nábytok na mieru v Bratislave a okolí — od návrhu až po montáž.</p>
        <div class="social">
          <a href="https://www.instagram.com/imajstri/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
          <a href="https://www.facebook.com/profile.php?id=61573057973324" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="${WA}" target="_blank" rel="noopener" aria-label="WhatsApp">${ic('whatsapp')}</a>
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
    <div class="foot-bottom"><span>© 2026 BK Creative s. r. o. · IČO: 56343744</span><span><a href="${privacy(b)}">Ochrana osobných údajov</a> · Bratislava a okolie</span></div>
  </div>
</footer>
<div class="m-bar">
  <a class="btn btn-outline" href="tel:${PHONE}">${ic('phone')}Zavolať</a>
  <a class="btn btn-primary" href="${link(b, 'objednavka/')}">Nezáväzná ponuka</a>
</div>
<script src="${b}js/main.js?v=${JS_V}" defer></script>
<div class="logo-switch" role="group" aria-label="Náhľad loga"><span>Logo:</span><button type="button" data-l="novy">Nové</button><button type="button" data-l="klient">Pôvodné</button></div>
<script>document.querySelectorAll('.logo-switch button').forEach(function(x){x.addEventListener('click',function(){try{sessionStorage.setItem('imj-logo',x.dataset.l)}catch(e){}if(x.dataset.l==='klient')document.documentElement.setAttribute('data-logo','klient');else document.documentElement.removeAttribute('data-logo')})})</script>
</body>
</html>
`;

const crumbs = (b, trail) => `<nav class="crumbs" aria-label="Omrvinky"><a href="${link(b, '')}">Domov</a>${trail.map(([p, label]) => p === null ? `<span aria-hidden="true">/</span><span>${label}</span>` : `<span aria-hidden="true">/</span><a href="${b}${p}">${label}</a>`).join('')}</nav>`;

const breadcrumbLd = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [['', 'Domov'], ...trail].map(([p, name], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(p !== null ? { item: SITE + '/' + p } : {}) })),
});

const potrebaOptions = (selected = '') => [['', 'Vyberte'], ['kuchyna', 'Kuchyňa'], ['skrina', 'Vstavaná skriňa / šatník'], ['obyvacka', 'Obývačka / TV stena'], ['izba', 'Spálňa / detská izba'], ['kupelna', 'Kúpeľňa'], ['chodba', 'Chodba / predsieň'], ['interier', 'Celý interiér'], ['firma', 'Firma / prevádzka'], ['ine', 'Iné']]
  .map(([v, l]) => `<option value="${v}"${v === selected ? ' selected' : ''}>${l}</option>`).join('');

let formCount = 0;
const shortForm = (b, selected = '', withPhoto = false) => {
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
            <label class="consent"><input type="checkbox" name="suhlas" required> <span>Potvrdzujem, že som sa oboznámil/a so <a href="${privacy(b)}" target="_blank" rel="noopener">Zásadami ochrany osobných údajov</a>.</span></label>
            <p class="form-error" role="alert"></p>
            <button class="btn btn-primary" type="submit">Odoslať dopyt ${ic('arrow')}</button>
            <p class="form-note">Stačí telefón alebo e-mail. Ozveme sa vám.</p>
          </div>
          <div class="form-success" role="status">${ic('check')}<h3>Ďakujeme, ozveme sa vám.</h3><p>Váš dopyt sme prijali.</p></div>
        </form>`;
};

// onMobile=false hides the section on phones (only Kontakt keeps it, other pages have the m-bar button)
const finalCta = (b, selected = '', h = 'Zistite, koľko bude stáť váš nový nábytok', sub = 'Na bezplatnej konzultácii preberieme vaše predstavy, možnosti priestoru a rozpočet. Získate jasnejšiu predstavu o vhodnom riešení a jeho cene.', withPhoto = false, onMobile = false) => `
  <section class="section section--dark${onMobile ? '' : ' hide-mobile'}" id="dopyt">
    <div class="container cta-final">
      <div>
        <span class="eyebrow eyebrow--line">Nezáväzný dopyt</span>
        <h2>${h}</h2>
        <p class="lead">${sub}</p>
        <div class="quick">
          <a href="tel:${PHONE}">${ic('phone')}<span><small>Zavolajte nám</small><b>${PHONE_TXT}</b></span></a>
          <a href="${WA}" target="_blank" rel="noopener">${ic('whatsapp')}<span><small>Napíšte na WhatsApp</small><b>Poslať správu alebo fotku priestoru</b></span></a>
          <a href="mailto:${MAIL}">${ic('doc')}<span><small>E-mail</small><b>${MAIL}</b></span></a>
        </div>
      </div>
      ${shortForm(b, selected, withPhoto)}
    </div>
  </section>`;

// Short call-to-action for informational pages (no form)
const ctaBand = (b, h, sub) => `
  <section class="cta-band">
    <div class="container cta-band__row">
      <div><h2>${h}</h2><p>${sub}</p></div>
      <div class="actions">
        <a class="btn btn-primary" href="${b}objednavka/">Získať nezáväznú ponuku ${ic('arrow')}</a>
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
      <span class="eyebrow eyebrow--line">Pracujeme s materiálmi a kovaním</span>
      <div class="brand-logos">
        <span class="brand-logo brand-logo--blum" role="img" aria-label="Blum"></span>
        <span class="brand-logo brand-logo--egger" role="img" aria-label="Egger"></span>
        <span class="brand-logo brand-logo--knauf" role="img" aria-label="Knauf"></span>
        <span class="brand-logo brand-logo--benalex" role="img" aria-label="Benalex"></span>
        <span class="brand-logo brand-logo--blanco" role="img" aria-label="BLANCO"></span>
        <span class="brand-name">PEBE</span>
      </div>
    </div>
  </section>`;

const faqBlock = (items, h = 'Na čo sa nás najčastejšie pýtate') => `
  <section class="section" id="faq">
    <div class="container faq-grid">
      <div>
        <span class="eyebrow eyebrow--line">Časté otázky</span>
        <h2>${h}</h2>
        <p class="lead">Nenašli ste odpoveď?<br>Zavolajte nám na <a class="link-more" href="tel:${PHONE}">${PHONE_TXT}</a></p>
      </div>
      <div>
        ${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n        ')}
      </div>
    </div>
  </section>`;

const projectCard = (p, b, cls = '') => `<article class="card card--link${cls}" data-c="${p.main}">
          <a class="card-img" href="${b}realizacie/${p.slug}/" tabindex="-1" aria-hidden="true">${img(p.coverImg, b, p.alt)}</a>
          <div class="card-body">
            <div class="chips"><span class="chip">${p.loc}</span>${p.time ? `<span class="chip">${ic('clock')}Realizácia: ${p.time}</span>` : ''}</div>
            <h3><a class="card-link" href="${b}realizacie/${p.slug}/">${p.title}</a></h3>
            <p>${p.task}</p>
            <div class="card-foot"><span class="from">${p.type}</span><span class="go" aria-hidden="true">Pozrieť projekt ${ic('arrow')}</span></div>
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
pages.push({ path: '', section: '', preload: 'hero-kuchyna-ostrov.jpg', jsonld: orgLd,
  title: 'Kuchyne a nábytok na mieru Bratislava | Interiéroví majstri',
  desc: 'Kuchyne, vstavané skrine a nábytok na mieru v Bratislave a okolí. Návrh s vizualizáciou, výroba, doprava a montáž od jedného tímu.',
  body: (b) => {
    return `
  <section class="hero">
    <div class="container container--wide hero-grid">
      <div class="hero-text">
        <span class="eyebrow eyebrow--line">Bratislava a okolie</span>
        <h1>Kuchyne a nábytok na mieru<span>podľa vašich predstáv.</span></h1>
        <p class="hero-sub">Od prvého návrhu až po montáž. Vytvoríme funkčné riešenie, ktoré využije váš priestor naplno a bude zodpovedať vášmu rozpočtu.</p>
        <ul class="hero-feats">
          <li class="feat"><i>${ic('ruler')}</i>Návrh a riešenie na mieru</li>
          <li class="feat"><i>${ic('cube')}</i>Výber materiálov a doplnkov</li>
          <li class="feat"><i>${ic('gear')}</i>Výroba a profesionálna montáž</li>
        </ul>
        <div class="actions">
          <a class="btn btn-primary" href="${b}objednavka/">Získať nezáväznú ponuku ${ic('arrow')}</a>
          <a class="btn-text play" href="${b}realizacie/"><i>${ic('play')}</i>Pozrieť realizácie</a>
        </div>
        <p class="hero-note">Prvým krokom je bezplatná konzultácia vašich predstáv, priestoru a možností.</p>
      </div>
      <div class="hero-media">
        <img src="${b}images/hero-kuchyna-ostrov.jpg" alt="Moderná kuchyňa na mieru s ostrovčekom, drevenou pracovnou doskou a LED osvetlením" width="1536" height="1024" fetchpriority="high">
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
      ${img('hero-kuchyna.jpg', b, 'Kuchyňa na mieru vo Viničnom s otvorenými zásuvkami a rohovým systémom LeMans', '(max-width: 1023px) 100vw, 45vw')}
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
      <div class="grid-3">
        ${['vinicne', 'zahorska-bystrica', 'chorvatsky-grob'].map((s) => projectCard(P[s], b)).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--white">
    <div class="container">
      <div class="sec-head">
        <div>
          <span class="eyebrow eyebrow--line">Služby</span>
          <h2>Čo pre vás vyrobíme</h2>
          <p class="lead">Orientačné ceny. Výslednú cenu ovplyvňujú rozmery, materiály, vybavenie a náročnosť projektu.</p>
        </div>
        <a class="link-more" href="${b}sluzby/">Všetky služby →</a>
      </div>
      <div class="prices">
        ${services.map((s) => `<a class="price" href="${b}${s.slug}/"><svg aria-hidden="true"><use href="#i-${s.icon}"/></svg><span>${s.name}</span><b>${s.price ? 'od ' + s.price : 'individuálne'}</b></a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- Recenzie klientov: hidden until real reviews are approved by the client -->
${ctaBand(b, 'Zistite, koľko bude stáť váš nový nábytok', 'Prvá konzultácia je bezplatná a nezáväzná.')}`;
  } });

// O nás
pages.push({ path: 'o-nas/', section: 'o-nas/', jsonld: breadcrumbLd([['o-nas/', 'O nás']]),
  title: 'O nás | Interiéroví majstri — nábytok na mieru Bratislava',
  desc: 'Interiéroví majstri — návrh, výroba, doprava a montáž nábytku na mieru v Bratislave a okolí. Vaša vízia, náš nábytok.',
  body: (b) => `
  <section class="page-hero page-hero--wide">
    <div class="container">
      ${crumbs(b, [[null, 'O nás']])}
      <h1>Nábytok, ktorý sa prispôsobí vašim snom</h1>
      <p class="lead">Navrhneme, vyrobíme, dovezieme a namontujeme nábytok na mieru v Bratislave a okolí.</p>
      <div class="actions"><a class="btn btn-primary" href="${b}objednavka/">Získať nezáväznú ponuku ${ic('arrow')}</a><a class="btn-text" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a></div>
    </div>
  </section>

  <section class="section">
    <div class="container split">
      <div class="prose">
        <span class="eyebrow eyebrow--line">Vaša vízia, náš nábytok</span>
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

  <section class="section">
    <div class="container">
      <div class="sec-head">
        <div>
          <span class="eyebrow eyebrow--line">Prečo si vybrať nás</span>
          <h2>Jeden tím, ktorý za výsledok ručí</h2>
          <p class="lead">Nemusíte hľadať návrhára, stolára a montážnikov zvlášť. Celý projekt vedieme za vás.</p>
        </div>
        
      </div>
      <div class="benefits">
        <div class="benefit"><i>${ic('cube')}</i><h3>Návrh, ktorý uvidíte vopred</h3><p>Nábytok si pozriete vo vizualizácii ešte pred výrobou. Upravujeme, kým nebude presne podľa vás.</p></div>
        <div class="benefit"><i>${ic('ruler')}</i><h3>Presne do vášho priestoru</h3><p>Využijeme aj šikminy, výklenky a ťažko dostupné rohy. Žiadne kompromisy z katalógu.</p></div>
        <div class="benefit"><i>${ic('shield')}</i><h3>Kvalitné materiály</h3><p>Pracujeme s overenými značkami — dosky Egger, kovanie Blum, drezy BLANCO.</p></div>
        <div class="benefit"><i>${ic('doc')}</i><h3>Jasná dohoda</h3><p>Rozsah, materiály a cenu preberieme vopred — ešte predtým, ako sa začne vyrábať.</p></div>
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
  <section class="page-hero page-hero--wide">
    <div class="container">
      ${crumbs(b, [[null, 'Náš tím']])}
      <h1>Ľudia, ktorí váš nábytok navrhnú aj dotiahnu do konca</h1>
      <p class="lead">S vaším projektom pracuje priamo dizajnér, ktorý ho navrhuje — od prvej konzultácie až po montáž.</p>
      <div class="actions"><a class="btn btn-primary" href="${b}objednavka/">Získať nezáväznú ponuku ${ic('arrow')}</a><a class="btn-text" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="split person">
        <!-- Placeholder until the client sends a portrait of Jozef -->
        <div class="person-photo" role="img" aria-label="Fotografia Jozefa Kutáleka sa pripravuje">${ic('home')}<span>Fotografiu čoskoro doplníme</span></div>
        <div class="prose">
          <span class="eyebrow eyebrow--line">Konateľ, návrh a vizualizácia</span>
          <h2>Jozef Kutálek</h2>
          <p>Jozef vedie spoločnosť BK Creative s. r. o., ktorá stojí za značkou Interiéroví majstri. Projekty však nielen riadi — sám ich navrhuje a pripravuje k nim vizualizácie. Od prvej konzultácie tak hovoríte priamo s človekom, ktorý váš nábytok navrhuje a ručí za výsledok.</p>
          <p>Pri návrhu vychádza z toho, ako bude priestor naozaj slúžiť: kde treba čo najviac úložného miesta, čo musí byť po ruke a ako nábytok zladiť s celým interiérom. Výsledok uvidíte vo vizualizácii ešte pred výrobou.</p>
          <p class="person-label">Navrhol napríklad:</p>
          <div class="chips person-projects">${['vinicne', 'nivy', 'vydrica', 'pezinok', 'guthaus', 'dubravka-mensi-byt'].map((x) => `<a class="chip" href="${b}realizacie/${x}/">${P[x].loc.replace('Bratislava – ', '')}</a>`).join('')}</div>
        </div>
      </div>
      <div class="grid-2 team-more">
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
  <section class="page-hero page-hero--wide">
    <div class="container">
      ${crumbs(b, [[null, 'Služby']])}
      <h1>Nábytok na mieru do každej miestnosti</h1>
      <p class="lead">Každý kúsok, ktorý vyrobíme, je odrazom vášho štýlu. Či už hľadáte štýlový nábytok do obývačky, kuchyňu na mieru alebo unikátne úložné riešenia, sme tu pre vás.</p>
      <div class="actions"><a class="btn btn-primary" href="${b}objednavka/">Získať nezáväznú ponuku ${ic('arrow')}</a><a class="btn-text" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a></div>
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
  ['Koľko stojí nábytok na mieru?', 'Výslednú cenu ovplyvňujú rozmery, materiály, vybavenie a náročnosť projektu. Po konzultácii a zameraní pripravíme presnú ponuku.'],
  ['V akej oblasti pracujete?', 'V Bratislave a okolí — realizovali sme napríklad v Dúbravke, pri Nivách, vo Vydrici, v Chorvátskom Grobe, Viničnom a Sládkovičove.'],
  ['Spolupracujete s architektmi?', 'Áno, vyrobíme nábytok aj podľa návrhu vášho architekta.'],
])}
${ctaBand(b, 'Neviete, čo presne potrebujete?', 'Poradíme vám na bezplatnej konzultácii.')}` });

// Service pages — one template (brief section 05)
for (const s of services) {
  const rel = s.projects.map((x) => (Array.isArray(x) ? [P[x[0]], x[1]] : [P[x], null]));
  const gallery = fullRows(rel.flatMap(([p, nums]) => (nums ? nums.map((n) => p.photos[n - 1]) : p.photos.slice(0, rel.length === 1 ? 7 : 2)).map((ph) => [ph, p])).slice(0, 7));
  pages.push({ path: `${s.slug}/`, section: 'sluzby/', og: s.img.endsWith('.jpg') ? s.img : `${s.img}-1400.jpg`, jsonld: breadcrumbLd([['sluzby/', 'Služby'], [`${s.slug}/`, s.name]]),
    title: s.title, desc: s.desc,
    body: (b) => `
  <section class="page-hero page-hero--wide">
    <div class="container">
      ${crumbs(b, [['sluzby/', 'Služby'], [null, s.name]])}
      <h1>${s.h1}</h1>
      <p class="lead">${s.intro}</p>
      <div class="actions"><a class="btn btn-primary" href="${b}objednavka/?typ=${s.key}">Získať nezáväznú ponuku ${ic('arrow')}</a><a class="btn-text" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a></div>
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

${gallery.length ? `  <section class="section section--white">
    <div class="container">
      <div class="sec-head"><div><span class="eyebrow eyebrow--line">Naše práce</span><h2>Z našich realizácií</h2></div><a class="link-more" href="${b}realizacie/">Všetky realizácie →</a></div>
      <div class="gallery">
        ${gallery.map(([ph, p]) => `<a href="${b}realizacie/${p.slug}/">${img(ph, b, `${p.title} — ${p.loc}`)}</a>`).join('\n        ')}
      </div>
    </div>
  </section>
` : ''}
  <section class="section">
    <div class="container split" style="align-items:start">
      <div>
        <span class="eyebrow eyebrow--line">Čo je súčasťou</span>
        <h2>Všetko od jednej firmy</h2>
        <ul class="check-list">${['Konzultácia a poradenstvo', 'Zameranie priestoru', 'Návrh a vizualizácia', 'Výroba nábytku', 'Doprava', 'Montáž u vás doma'].map((x) => `<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul>
      </div>
      <div>
        <span class="eyebrow eyebrow--line">Cena</span>
        <h2>Koľko to stojí</h2>
        <div class="fact" style="margin-top:28px"><span>Orientačný rozpočet</span><b>${s.price ? `od ${s.price}` : 'podľa rozsahu a materiálu'}</b><span>Výslednú cenu ovplyvňujú rozmery, materiály, vybavenie a náročnosť projektu.</span></div>
      </div>
    </div>
  </section>

${brands(b)}
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
  <section class="page-hero page-hero--wide">
    <div class="container">
      ${crumbs(b, [[null, 'Realizácie']])}
      <h1>Skutočné príbehy, skutočné výsledky</h1>
      <p class="lead">Kuchyne, skrine a celé interiéry na mieru v Bratislave a okolí. Pri každom projekte vidíte lokalitu, rozsah a riešenie.</p>
      <div class="actions"><a class="btn btn-primary" href="${b}objednavka/">Získať nezáväznú ponuku ${ic('arrow')}</a><a class="btn-text" href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a></div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="filters" role="group" aria-label="Filter realizácií">
        <button type="button" data-f="all" aria-pressed="true">Všetko</button>
        ${FILTERS.filter(([k]) => projects.some((p) => p.main === k)).map(([k, l]) => `<button type="button" data-f="${k}" aria-pressed="false">${l}</button>`).join('\n        ')}
      </div>
      <div class="grid-3">
        ${projects.map((p) => projectCard(p, b)).join('\n        ')}
      </div>
    </div>
  </section>
${ctaBand(b, 'Páči sa vám niektorá realizácia?', 'Navrhneme podobné riešenie presne do vášho priestoru. Prvá konzultácia je bezplatná.')}` });

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
        <h2 class="mini-head">Zadanie</h2>
        <p class="lead">${p.task}</p>
      </div>
      <aside class="facts-card" aria-label="Projektové informácie">
        <h2>Projektové informácie</h2>
        <dl class="meta-table">
          <div><dt>Realizácia</dt><dd>${p.loc}</dd></div>
          <div><dt>Typ projektu</dt><dd>${p.rooms}</dd></div>
          ${p.time ? `<div><dt>Doba dodania</dt><dd>${p.time}</dd></div>` : ''}
          ${p.by ? `<div><dt>Návrh</dt><dd>${p.by}</dd></div>` : ''}
          ${p.ours !== undefined ? `<div><dt>Návrh od imajstri.sk</dt><dd>${p.ours ? 'Áno' : 'Nie'}</dd></div>` : ''}
        </dl>
        <a class="btn btn-primary" href="${b}objednavka/?projekt=${p.slug}">Získať nezáväznú ponuku ${ic('arrow')}</a>
      </aside>
    </div>
  </section>
  <section class="section">
    <div class="container project-layout">
      <div>
        <div class="gallery" data-lightbox>
          ${fullRows(p.photos).map((ph, n, shown) => `<a href="${b}images/${ph}-1400.jpg" aria-label="Zväčšiť fotografiu ${n + 1}">${img(ph, b, `${p.alt} — fotografia ${n + 1} z ${shown.length}`, n === 0 ? '(max-width: 1023px) 100vw, 60vw' : undefined, n === 0)}</a>`).join('\n          ')}
        </div>
      </div>
      <aside class="sticky-box">
        <h2 style="font-size:24px">Riešenie</h2>
        <p class="solution">${p.solution}</p>
        <h3 class="mini-head">${p.slug === 'sladkovicovo' ? 'Miestnosti' : 'Projekt zahŕňa'}</h3>
        <ul class="check-list">${p.items.map((x) => `<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul>
        <a class="btn btn-primary" style="width:100%;margin-top:28px" href="${b}objednavka/?projekt=${p.slug}">Získať nezáväznú ponuku ${ic('arrow')}</a>
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
${ctaBand(b, 'Chcete podobné riešenie?', `Navrhneme riešenie podobné projektu ${p.loc} presne do vášho priestoru.`)}` });
});

// Blog
pages.push({ path: 'blog/', section: 'blog/', jsonld: breadcrumbLd([['blog/', 'Blog']]),
  title: 'Blog — rady k nábytku na mieru | Interiéroví majstri',
  desc: 'Rady a inšpirácie ku kuchyniam, vstavaným skriniam a nábytku na mieru.',
  body: (b) => `
  <section class="page-hero page-hero--wide">
    <div class="container">
      ${crumbs(b, [[null, 'Blog']])}
      <h1>Rady a inšpirácie k nábytku na mieru</h1>
      <p class="lead">Praktické články, ktoré vám pomôžu naplánovať kuchyňu, skriňu či celý byt.</p>
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
  <section class="page-hero page-hero--wide">
    <div class="container">
      ${crumbs(b, [[null, 'Objednávka']])}
      <h1>Nezáväzná ponuka</h1>
      <p class="lead">Opíšte, čo plánujete. Vyplnenie trvá približne minútu — stačí telefón alebo e-mail.</p>
    </div>
  </section>
  <section class="section">
    <div class="container cta-final">
      <div>
        <span class="eyebrow eyebrow--line">Ako to funguje</span>
        <h2>Tri kroky k návrhu</h2>
        <ol class="how">
          <li><span class="how-num">1</span><div><h3>Pošlete dopyt</h3><p>Typ nábytku, lokalita a kontakt. Fotky priestoru môžete priložiť.</p></div></li>
          <li><span class="how-num">2</span><div><h3>Ozveme sa vám</h3><p>Dohodneme bezplatnú konzultáciu a zameranie.</p></div></li>
          <li><span class="how-num">3</span><div><h3>Dostanete návrh a ponuku</h3><p>Návrh s vizualizáciou a cenovú ponuku podľa rozmerov a materiálov.</p></div></li>
        </ol>
        <p class="direct-label">Alebo nás kontaktujte priamo:</p>
        <ul class="direct">
          <li><a href="tel:${PHONE}">${ic('phone')}${PHONE_TXT}</a></li>
          <li><a href="${WA}" target="_blank" rel="noopener">${ic('whatsapp')}WhatsApp</a></li>
          <li><a href="mailto:${MAIL}">${ic('doc')}${MAIL}</a></li>
        </ul>
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
          <label class="consent"><input type="checkbox" name="suhlas" required> <span>Potvrdzujem, že som sa oboznámil/a so <a href="${privacy(b)}" target="_blank" rel="noopener">Zásadami ochrany osobných údajov</a>.</span></label>
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
  <section class="page-hero page-hero--wide">
    <div class="container">
      ${crumbs(b, [[null, 'Kontakt']])}
      <h1>Kontakt a bezplatná konzultácia</h1>
      <p class="lead">Máte otázky ohľadom našej práce? Máte záujem o bezplatnú konzultáciu? Kontaktujte nás telefonicky alebo e-mailom.<br>Odpovedáme v najkratšom možnom čase, väčšinou do 24 hodín.</p>
    </div>
  </section>
  <section class="section">
    <div class="container contact-grid">
      <div class="c-list">
        <a class="c-item" href="tel:${PHONE}"><span class="ic">${ic('phone')}</span><span><small>Telefón</small><b>${PHONE_TXT}</b></span></a>
        <a class="c-item" href="mailto:${MAIL}"><span class="ic">${ic('doc')}</span><span><small>E-mail</small><b>${MAIL}</b></span></a>
        <a class="c-item" href="${WA}" target="_blank" rel="noopener"><span class="ic">${ic('whatsapp')}</span><span><small>WhatsApp</small><b>Napísať správu</b></span></a>
        <div class="c-item"><span class="ic">${ic('home')}</span><span><small>Adresa</small><b>Landauova 3146/20, 841 01 Bratislava</b></span></div>
        <div class="c-item"><span class="ic">${ic('clock')}</span><span><small>Pracovný čas</small><b>Po – Pi: 9:00 – 17:00</b><small>So – Ne: individuálne</small></span></div>
        <p class="small" style="color:var(--muted);padding:4px">BK Creative s. r. o. · IČO: 56343744 · DIČ: 2122278433 · IČ DPH: SK2122278433</p>
      </div>
      <div class="map">
        <iframe src="https://www.google.com/maps?q=Landauova+3146%2F20,+841+01+Bratislava&amp;output=embed" title="Mapa — Landauova 3146/20, Bratislava" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  </section>
${finalCta(b, '', 'Potrebujete cenovú ponuku?', 'Na bezplatnej konzultácii preberieme vaše predstavy, možnosti priestoru a rozpočet. Získate jasnejšiu predstavu o vhodnom riešení a jeho cene. Priložte aj fotku priestoru.', true, true)}` });

// Ochrana osobných údajov — information under Art. 13 GDPR, tailored to this site (contract čl. XI); the client approves the wording
pages.push({ path: 'ochrana-sukromia/', section: null, jsonld: breadcrumbLd([['ochrana-sukromia/', 'Ochrana osobných údajov']]),
  title: 'Zásady ochrany osobných údajov | Interiéroví majstri',
  desc: 'Aké osobné údaje spracúva BK Creative s. r. o. pri dopytoch a objednávkach nábytku na mieru, na aký účel, ako dlho a aké máte práva.',
  body: (b) => `
  <section class="page-hero page-hero--wide">
    <div class="container">
      ${crumbs(b, [[null, 'Ochrana osobných údajov']])}
      <h1>Zásady ochrany osobných údajov</h1>
      <p class="lead">Na tejto stránke vysvetľujeme, aké osobné údaje spracúvame, prečo ich potrebujeme, ako dlho ich uchovávame a aké máte práva. Informácie poskytujeme podľa čl. 13 nariadenia (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z. o ochrane osobných údajov.</p>
    </div>
  </section>
  <section class="section">
    <div class="container"><div class="legal">
      <h2>1. Prevádzkovateľ</h2>
      <p>Prevádzkovateľom osobných údajov je <strong>BK Creative s. r. o.</strong>, so sídlom Landauova 3146/20, 841 01 Bratislava, IČO: 56343744 (ďalej len „prevádzkovateľ“ alebo „my“).</p>
      <p>Kontakt vo veciach ochrany osobných údajov: <a href="mailto:${MAIL}">${MAIL}</a>, tel. <a href="tel:${PHONE}">${PHONE_TXT}</a>. Prevádzkovateľ nemá určenú zodpovednú osobu.</p>

      <h2>2. Aké osobné údaje spracúvame</h2>
      <p><strong>Z formulárov na webovej stránke</strong> (nezáväzný dopyt a objednávka) spracúvame údaje, ktoré do formulára sami zadáte:</p>
      <ul>
        <li>meno a priezvisko,</li>
        <li>telefónne číslo a/alebo e-mailová adresa,</li>
        <li>druh nábytku, o ktorý máte záujem,</li>
        <li>lokalita, približné rozmery a rozpočet,</li>
        <li>opis projektu a fotografie priestoru, ak ich priložíte.</li>
      </ul>
      <p><strong>Pri komunikácii telefonicky, e-mailom alebo cez WhatsApp</strong> spracúvame údaje, ktoré nám v rámci komunikácie poskytnete.</p>
      <p><strong>Pri uzatvorení zmluvy a fakturácii</strong> spracúvame obchodné meno, meno a priezvisko, fakturačnú adresu, adresu montáže, IČO, DIČ a IČ DPH.</p>
      <p><strong>Technické údaje</strong> — pri návšteve stránky sa na serveri automaticky zaznamenáva IP adresa, čas prístupu a typ prehliadača. Slúžia na bezpečnú prevádzku webu a ochranu formulárov pred spamom.</p>

      <h2>3. Účel a právny základ spracúvania</h2>
      <ul>
        <li><strong>Vybavenie dopytu, konzultácia, zameranie a príprava cenovej ponuky</strong> — opatrenia pred uzatvorením zmluvy na vašu žiadosť (čl. 6 ods. 1 písm. b) GDPR).</li>
        <li><strong>Výroba, dodanie a montáž nábytku, reklamácie</strong> — plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR).</li>
        <li><strong>Fakturácia a vedenie účtovníctva</strong> — plnenie zákonnej povinnosti (čl. 6 ods. 1 písm. c) GDPR, zákon č. 431/2002 Z. z. o účtovníctve).</li>
        <li><strong>Bezpečnosť webu a ochrana formulárov pred spamom</strong> — oprávnený záujem prevádzkovateľa (čl. 6 ods. 1 písm. f) GDPR).</li>
      </ul>
      <p>Vaše osobné údaje nevyužívame na marketing ani na automatizované rozhodovanie či profilovanie.</p>

      <h2>4. Je poskytnutie údajov povinné?</h2>
      <p>Poskytnutie údajov je dobrovoľné. Bez telefónneho čísla alebo e-mailu vás však nemôžeme kontaktovať a dopyt vybaviť. Údaje potrebné na fakturáciu sú zákonnou požiadavkou — bez nich nie je možné zmluvu uzavrieť.</p>

      <h2>5. Komu údaje poskytujeme</h2>
      <p>Osobné údaje nepredávame ani nezverejňujeme. Prístup k nim môžu mať len títo príjemcovia, a to v nevyhnutnom rozsahu:</p>
      <ul>
        <li>poskytovateľ webhostingu a e-mailových služieb,</li>
        <li>poskytovateľ ochrany formulárov pred spamom (CAPTCHA),</li>
        <li>externá účtovná kancelária,</li>
        <li>orgány verejnej moci, ak to vyžaduje zákon.</li>
      </ul>
      <p>Na stránke Kontakt zobrazujeme mapu Google Maps. Pri jej načítaní sa vaša IP adresa odovzdá spoločnosti Google, ktorá môže údaje spracúvať aj v USA na základe rámca ochrany údajov EÚ – USA (Data Privacy Framework). Iný prenos údajov do tretích krajín neuskutočňujeme.</p>

      <h2>6. Ako dlho údaje uchovávame</h2>
      <p>Osobné údaje uchovávame len po dobu nevyhnutnú na účel, na ktorý boli získané, a po dobu, ktorú nám ukladajú právne predpisy. Potom ich vymažeme.</p>

      <h2>7. Súbory cookies</h2>
      <p>Stránka používa len nevyhnutné cookies a úložisko prehliadača, ktoré sú potrebné na jej fungovanie, napríklad na ochranu formulárov pred spamom a na zapamätanie, že ste informáciu o cookies už videli. Na tieto cookies sa súhlas nevyžaduje. Analytické ani marketingové cookies nepoužívame. Mapa Google Maps na stránke Kontakt môže ukladať vlastné cookies spoločnosti Google podľa jej <a href="https://policies.google.com/privacy?hl=sk" target="_blank" rel="noopener">zásad ochrany súkromia</a>.</p>

      <h2>8. Zabezpečenie osobných údajov</h2>
      <p>Prijali sme primerané technické a organizačné opatrenia na ochranu vašich údajov. Komunikácia s webovou stránkou je šifrovaná (SSL) a k údajom majú prístup len poverené osoby.</p>

      <h2>9. Vaše práva</h2>
      <p>V súvislosti so spracúvaním osobných údajov máte právo:</p>
      <ul>
        <li><strong>na prístup</strong> — vedieť, aké údaje o vás spracúvame, a získať ich kópiu,</li>
        <li><strong>na opravu</strong> nesprávnych alebo neúplných údajov,</li>
        <li><strong>na vymazanie</strong> údajov, ak už nie sú potrebné alebo sa spracúvajú nezákonne (nevzťahuje sa na údaje, ktoré musíme uchovávať zo zákona, napr. faktúry),</li>
        <li><strong>na obmedzenie spracúvania</strong>, napríklad kým sa overuje správnosť údajov,</li>
        <li><strong>na prenosnosť</strong> — získať údaje, ktoré ste nám poskytli, v bežne používanom strojovo čitateľnom formáte,</li>
        <li><strong>namietať</strong> proti spracúvaniu založenému na oprávnenom záujme,</li>
        <li><strong>odvolať súhlas</strong>, ak sa spracúvanie zakladá na súhlase — odvolanie nemá vplyv na zákonnosť spracúvania pred ním.</li>
      </ul>
      <p>Svoje práva si môžete uplatniť e-mailom na <a href="mailto:${MAIL}">${MAIL}</a> alebo písomne na adrese sídla. Odpovieme bez zbytočného odkladu, najneskôr do 1 mesiaca.</p>
      <p>O vymazanie údajov z dopytu odoslaného cez webovú stránku môžete požiadať aj cez <a href="${b}vymaz-udajov/">formulár na vymazanie údajov</a>.</p>
      <p>Ak sa domnievate, že spracúvame vaše údaje v rozpore s predpismi, môžete podať návrh na začatie konania na <strong>Úrad na ochranu osobných údajov Slovenskej republiky</strong>, Hraničná 12, 820 07 Bratislava, <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener">dataprotection.gov.sk</a>.</p>

      <p class="legal-date">Tieto zásady sú účinné od 2. 11. 2026.</p>
    </div></div>
  </section>` });

// Vymazanie údajov — request to erase a web enquiry (number from the confirmation e-mail + e-mail address).
// The prototype only simulates sending; in WordPress the request is confirmed by a link sent to that e-mail.
pages.push({ path: 'vymaz-udajov/', section: null, jsonld: breadcrumbLd([['ochrana-sukromia/', 'Ochrana osobných údajov'], ['vymaz-udajov/', 'Vymazanie údajov']]),
  title: 'Vymazanie osobných údajov | Interiéroví majstri',
  desc: 'Požiadajte o vymazanie osobných údajov z dopytu, ktorý ste poslali cez našu webovú stránku.',
  body: (b) => `
  <section class="page-hero page-hero--wide">
    <div class="container">
      ${crumbs(b, [['ochrana-sukromia/', 'Ochrana osobných údajov'], [null, 'Vymazanie údajov']])}
      <h1>Vymazanie osobných údajov</h1>
      <p class="lead">Zadajte e-mail, ktorý ste uviedli v dopyte, a ak ho máte, aj číslo dopytu z potvrdzujúceho e-mailu. Na e-mail vám pošleme odkaz na potvrdenie, aby o vymazanie nemohol požiadať nikto iný. Potvrdenú žiadosť posúdime a ozveme sa vám najneskôr do jedného mesiaca.</p>
    </div>
  </section>
  <section class="section">
    <div class="container" style="max-width:720px">
      <form class="form-card lead-form" novalidate>
        <input type="hidden" name="form" value="vymaz">
        <div class="form-grid">
          <div class="field"><label for="v-mail">E-mail z dopytu</label><input id="v-mail" name="email" type="email" autocomplete="email" required placeholder="vas@email.sk"></div>
          <div class="field"><label for="v-id">Číslo dopytu <small>(nepovinné)</small></label><input id="v-id" name="id_dopytu" placeholder="napr. IM-26-7KQ4XP" autocapitalize="characters"></div>
          <p class="form-error" role="alert"></p>
          <button class="btn btn-primary" type="submit">Požiadať o vymazanie ${ic('arrow')}</button>
          <p class="form-note">Bez čísla dopytu sa žiadosť týka všetkých dopytov odoslaných z tohto e-mailu. Údaje, ktoré musíme uchovávať zo zákona (napr. faktúry), vymazať nemôžeme.</p>
        </div>
        <div class="form-success" role="status">${ic('check')}<h3>Skontrolujte svoj e-mail.</h3><p>Ak k tomuto e-mailu evidujeme dopyt, poslali sme naň odkaz na potvrdenie žiadosti. Odkaz platí 48 hodín.</p></div>
      </form>
    </div>
  </section>` });

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
