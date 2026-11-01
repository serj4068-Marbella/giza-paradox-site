// Собирает index.html из одного шаблона для трёх языков: node build.js
const fs = require('fs');
const path = require('path');

const SITE = 'https://giza-paradox-site.vercel.app/';
const TG = { ru: 'https://t.me/giza_paradox_ru', en: 'https://t.me/giza_paradox_en', es: 'https://t.me/giza_paradox_es' };
const LINKS = {
  yt: 'https://www.youtube.com/@Archeotech_ru',
  ig: 'https://www.instagram.com/giza.paradox/',
  fb: 'https://www.facebook.com/groups/2659911541126314',
};
const COVERS = ['01', '02', '04', '10', '11', '14'];

const T = {
  ru: {
    name: 'RU', htmlLang: 'ru', title: 'Giza Paradox | Проверь сам',
    skip: 'К содержимому', kicker: 'Загадки древности без мистики',
    big: 'Проверь сам',
    lead: 'Загадки древности без мистики и без занудства. Новая карусель почти каждый день: что известно точно, что спорно и как проверить самому.',
    cta: 'Читать в Telegram', ctaSub: 'Канал на русском',
    stats: [['3', 'канала в Telegram'], ['3', 'языка: RU, EN, ES'], ['14', 'каруселей в первой серии']],
    s1: 'Как это устроено',
    how: [['Что известно', 'Факты, которые подтверждены открытыми источниками.'], ['Что спорно', 'Версии и гипотезы: отделяю их от фактов.'], ['Как проверить', 'Открытые снимки и данные, чтобы вы убедились сами.']],
    s2: 'Карусели', s2lead: 'Свайпайте в Telegram: каждая карусель отделяет факт от версии.',
    covers: ['Антарктида: проверь сам', 'Как построили Великую пирамиду', 'Сфинкс: 5 вопросов', 'Гёбекли-Тепе', 'Антикитерский механизм', 'Саксайуаман'],
    s3: 'Об авторе',
    about: ['Я Сергей. Мне 58, а вайбкодинг я начал в 57. Решил, что динозавры тоже умеют в нейросети, и подружился с ИИ.', 'Теперь мы вместе копаемся в пирамидах, а я проверяю за ними факты. Учусь, не сдаюсь, пока ни разу не обиделся на робота.'],
    dino: 'Рисунок: динозавр с ноутбуком',
    s4: 'Каналы и соцсети',
    rows: [['Telegram: Проверь сам', 'Канал на русском', TG.ru], ['Telegram: Check It Yourself', 'English channel', TG.en], ['Telegram: Compruébalo tú', 'Canal en español', TG.es], ['YouTube Archeotech', 'Видео', LINKS.yt], ['Instagram giza.paradox', 'Карусели и ролики', LINKS.ig], ['Группа на Facebook', 'Обсуждения', LINKS.fb]],
    foot: 'Giza Paradox · Сергей', open: 'Открывается в новой вкладке',
  },
  en: {
    name: 'EN', htmlLang: 'en', title: 'Giza Paradox | Check It Yourself',
    skip: 'Skip to content', kicker: 'Ancient mysteries without the mysticism',
    big: 'Check it yourself',
    lead: 'Ancient mysteries without the mysticism and without the boredom. A new carousel almost every day: what is known, what is disputed, and how to check it yourself.',
    cta: 'Read on Telegram', ctaSub: 'English channel',
    stats: [['3', 'Telegram channels'], ['3', 'languages: RU, EN, ES'], ['14', 'carousels in the first series']],
    s1: 'How it works',
    how: [['What is known', 'Facts confirmed by open sources.'], ['What is disputed', 'Theories and hypotheses, kept apart from facts.'], ['How to check', 'Open images and data, so you can see for yourself.']],
    s2: 'Carousels', s2lead: 'Swipe through them on Telegram: each one separates fact from theory.',
    covers: ['Antarctica: check it yourself', 'How the Great Pyramid was built', 'The Sphinx: 5 questions', 'Göbekli Tepe', 'The Antikythera Mechanism', 'Sacsayhuamán'],
    s3: 'About the author',
    about: ["I'm Sergey. I'm 58 and started vibe coding at 57. I decided that dinosaurs can do AI too, and made friends with the AIs.", "Now we dig into pyramids together, and I fact-check what they say. I keep learning and I don't give up. So far I haven't taken offence at a robot once."],
    dino: 'Drawing: a dinosaur with a laptop',
    s4: 'Channels & socials',
    rows: [['Telegram: Check It Yourself', 'English channel', TG.en], ['Telegram: Проверь сам', 'Канал на русском', TG.ru], ['Telegram: Compruébalo tú', 'Canal en español', TG.es], ['YouTube Archeotech', 'Videos', LINKS.yt], ['Instagram giza.paradox', 'Carousels & reels', LINKS.ig], ['Facebook group', 'Discussions', LINKS.fb]],
    foot: 'Giza Paradox · Sergey', open: 'Opens in a new tab',
  },
  es: {
    name: 'ES', htmlLang: 'es', title: 'Giza Paradox | Compruébalo tú',
    skip: 'Ir al contenido', kicker: 'Misterios de la antigüedad sin misticismo',
    big: 'Compruébalo tú',
    lead: 'Misterios de la antigüedad sin misticismo y sin aburrimiento. Un carrusel nuevo casi cada día: qué se sabe, qué se discute y cómo comprobarlo tú mismo.',
    cta: 'Leer en Telegram', ctaSub: 'Canal en español',
    stats: [['3', 'canales de Telegram'], ['3', 'idiomas: RU, EN, ES'], ['14', 'carruseles en la primera serie']],
    s1: 'Cómo funciona',
    how: [['Qué se sabe', 'Hechos confirmados por fuentes abiertas.'], ['Qué se discute', 'Teorías e hipótesis, separadas de los hechos.'], ['Cómo comprobarlo', 'Imágenes y datos abiertos para que lo veas tú mismo.']],
    s2: 'Carruseles', s2lead: 'Desliza en Telegram: cada carrusel separa el hecho de la teoría.',
    covers: ['Antártida: compruébalo tú', 'Cómo se construyó la Gran Pirámide', 'La Esfinge: 5 preguntas', 'Göbekli Tepe', 'El mecanismo de Anticitera', 'Sacsayhuamán'],
    s3: 'Sobre el autor',
    about: ['Soy Sergey. Tengo 58 años y empecé con el vibe coding a los 57. Decidí que los dinosaurios también pueden usar IA y me hice amigo de las IA.', 'Ahora exploramos juntos las pirámides y yo verifico sus datos. Sigo aprendiendo y no me rindo. Hasta ahora no me he ofendido con ningún robot.'],
    dino: 'Dibujo: un dinosaurio con portátil',
    s4: 'Canales y redes',
    rows: [['Telegram: Compruébalo tú', 'Canal en español', TG.es], ['Telegram: Check It Yourself', 'English channel', TG.en], ['Telegram: Проверь сам', 'Канал на русском', TG.ru], ['YouTube Archeotech', 'Vídeos', LINKS.yt], ['Instagram giza.paradox', 'Carruseles y reels', LINKS.ig], ['Grupo de Facebook', 'Conversación', LINKS.fb]],
    foot: 'Giza Paradox · Sergey', open: 'Se abre en una pestaña nueva',
  },
};

const DINO = `<svg class="dino" viewBox="0 0 240 140" role="img" aria-label="__ALT__" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M52 92 C60 62 96 56 124 62 C142 64 150 54 150 38 C150 24 156 16 168 16 C180 16 188 22 188 30 C188 36 184 40 178 40 C170 40 168 50 164 62 C160 78 140 100 118 100 L60 100"/>
    <path d="M52 92 C36 96 20 104 8 122"/>
    <path d="M70 100 L70 124 L86 124 L86 100"/>
    <path d="M112 100 L112 124 L128 124 L128 100"/>
    <circle cx="172" cy="26" r="2.5" fill="currentColor" stroke="none"/>
    <path d="M178 38 C182 40 186 38 188 35"/>
    <rect x="156" y="102" width="52" height="30" rx="3"/>
    <path d="M148 132 H216"/>
    <path d="M198 56 l4 -9 M208 62 l9 -4 M204 72 l9 3"/>
  </g>
</svg>`;

const arrow = '<span class="go" aria-hidden="true">→</span>';

function hero(L) {
  return `<div class="hero-copy" data-lang="${L.k}">
      <p class="kicker">${L.kicker}</p>
      <h1><span class="brand" translate="no">Giza Paradox</span><span class="big">${L.big}</span></h1>
      <p class="lead">${L.lead.replace(/ (\d)/g, '&nbsp;$1').replace(/ в (\d)/g, '&nbsp;в&nbsp;$1')}</p>
      <a class="cta" href="${TG[L.k]}" target="_blank" rel="noopener"><span>${L.cta}<small>${L.ctaSub}</small></span>${arrow}</a>
      <dl class="stats">
        ${L.stats.map(([n, t]) => `<div><dt>${n}</dt><dd>${t}</dd></div>`).join('\n        ')}
      </dl>
    </div>`;
}

function body(L) {
  const thumbs = COVERS.map((c, i) => `<li><a href="${TG[L.k]}" target="_blank" rel="noopener"><img src="img/carousels/${L.k}-${c}.jpg" width="540" height="675" loading="lazy" alt="${L.covers[i]}"><span>${L.covers[i]}</span></a></li>`).join('\n          ');
  return `<div class="content" data-lang="${L.k}">
    <section class="block" aria-labelledby="h-${L.k}-1">
      <h2 id="h-${L.k}-1"><i>01</i>${L.s1}</h2>
      <ol class="how">
        ${L.how.map(([a, b], i) => `<li><span class="num">${i + 1}</span><h3>${a}</h3><p>${b}</p></li>`).join('\n        ')}
      </ol>
    </section>
    <section class="block" aria-labelledby="h-${L.k}-2">
      <h2 id="h-${L.k}-2"><i>02</i>${L.s2}</h2>
      <p class="sub">${L.s2lead}</p>
      <ul class="thumbs">
          ${thumbs}
      </ul>
    </section>
    <section class="block" aria-labelledby="h-${L.k}-3">
      <h2 id="h-${L.k}-3"><i>03</i>${L.s3}</h2>
      <div class="about">
        <div class="about-text">
          ${L.about.map((p) => `<p>${p}</p>`).join('\n          ')}
        </div>
        ${DINO.replace('__ALT__', L.dino)}
      </div>
    </section>
    <section class="block" aria-labelledby="h-${L.k}-4">
      <h2 id="h-${L.k}-4"><i>04</i>${L.s4}</h2>
      <ul class="rows">
        ${L.rows.map(([a, b, h]) => `<li><a href="${h}" target="_blank" rel="noopener" title="${L.open}"><span>${a}<small>${b}</small></span>${arrow}</a></li>`).join('\n        ')}
      </ul>
    </section>
  </div>`;
}

const langs = Object.keys(T).map((k) => ({ k, ...T[k] }));
const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');

const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${T.ru.title}</title>
<meta name="description" content="Загадки древности без мистики и без занудства. Что известно точно, что спорно и как проверить самому. Ancient mysteries without the mysticism. Misterios de la antigüedad sin misticismo.">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0b0a09">
<link rel="canonical" href="${SITE}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}">
<meta property="og:title" content="Giza Paradox | Проверь сам">
<meta property="og:description" content="Что известно точно, что спорно и как проверить самому. EN · ES · RU">
<meta property="og:image" content="${SITE}img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}img/og.jpg">
<link rel="icon" href="img/giza-ru.jpg">
<link rel="preload" as="font" type="font/woff2" href="fonts/oswald-cyrillic.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="fonts/oswald-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="fonts/inter-cyrillic.woff2" crossorigin>
<style>
${css}
</style>
</head>
<body>
${langs.map((L) => `<a class="skip" href="#main" data-lang="${L.k}">${L.skip}</a>`).join('\n')}
<header class="top">
  <span class="logo" translate="no">GIZA PARADOX</span>
  <div class="lang" role="group" aria-label="Language">
    ${langs.map((L, i) => `<button type="button" data-l="${L.k}" aria-pressed="${i === 0}">${L.name}</button>`).join('\n    ')}
  </div>
</header>
<main id="main">
  <section class="hero">
    <img class="hero-img" src="img/pyramid.jpg" width="2000" height="1346" alt="" fetchpriority="high">
    <div class="lens" aria-hidden="true"></div>
    <div class="wrap hero-in">
    ${langs.map(hero).join('\n    ')}
    </div>
  </section>
  <div class="wrap">
  ${langs.map(body).join('\n  ')}
  </div>
</main>
<footer class="foot wrap">
  ${langs.map((L) => `<p data-lang="${L.k}">${L.foot}</p>`).join('\n  ')}
</footer>
<script>
  (function () {
    var titles = ${JSON.stringify(Object.fromEntries(langs.map((L) => [L.k, L.title])))};
    function show(l) {
      if (!titles[l]) l = "ru";
      document.documentElement.lang = l;
      document.title = titles[l];
      document.querySelectorAll("[data-lang]").forEach(function (el) { el.hidden = el.dataset.lang !== l; });
      document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.l === l)); });
      try { localStorage.setItem("lang", l); } catch (e) {}
    }
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () { show(b.dataset.l); history.replaceState(null, "", "#" + b.dataset.l); });
    });
    var fromHash = location.hash.slice(1);
    var saved = ""; try { saved = localStorage.getItem("lang") || ""; } catch (e) {}
    var nav = (navigator.language || "ru").slice(0, 2);
    show(titles[fromHash] ? fromHash : (titles[saved] ? saved : (titles[nav] ? nav : "ru")));
  })();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('index.html собран:', html.length, 'байт');
