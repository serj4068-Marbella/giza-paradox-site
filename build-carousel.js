// Собирает страницы каруселей: node build-carousel.js  (данные: data/*.json, слайды: img/carousel/<slug>/<lang>-NN.jpg)
const fs = require('fs');
const path = require('path');

const SITE = 'https://giza-paradox-site.vercel.app/';
const TG = { ru: 'https://t.me/giza_paradox_ru', en: 'https://t.me/giza_paradox_en', es: 'https://t.me/giza_paradox_es' };

const UI = {
  ru: { name: 'RU', home: 'Giza Paradox', back: 'На главную', skip: 'К содержимому', slide: 'Слайд', of: 'из', prev: 'Предыдущий слайд', next: 'Следующий слайд', steps: 'Все шаги текстом', credit: 'Источники изображений', cta: 'Больше в Telegram', ctaSub: 'Канал на русском', swipe: 'Листайте стрелками или свайпом', alt: 'Слайд' },
  en: { name: 'EN', home: 'Giza Paradox', back: 'Home', skip: 'Skip to content', slide: 'Slide', of: 'of', prev: 'Previous slide', next: 'Next slide', steps: 'All steps as text', credit: 'Image sources', cta: 'More on Telegram', ctaSub: 'English channel', swipe: 'Use arrows or swipe', alt: 'Slide' },
  es: { name: 'ES', home: 'Giza Paradox', back: 'Inicio', skip: 'Ir al contenido', slide: 'Diapositiva', of: 'de', prev: 'Diapositiva anterior', next: 'Diapositiva siguiente', steps: 'Todos los pasos en texto', credit: 'Fuentes de las imágenes', cta: 'Más en Telegram', ctaSub: 'Canal en español', swipe: 'Usa las flechas o desliza', alt: 'Diapositiva' },
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const nb = (s) => s.replace(/ ([^ ]{1,3}) /g, ' $1&nbsp;');

function viewer(d, l) {
  const u = UI[l], c = d[l];
  const alts = [c.hook + '. ' + c.lead, ...c.steps.map((s) => s.title + '. ' + s.text)];
  const slides = alts.map((a, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `<li id="s-${l}-${i + 1}" class="slide"><img src="../../img/carousel/${d.slug}/${l}-${n}.jpg" width="720" height="900" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} alt="${u.alt} ${i + 1}: ${esc(a)}"></li>`;
  }).join('\n          ');
  return `<div class="viewer" data-lang="${l}" data-count="${d.slides}">
      <ul class="track" tabindex="0" aria-label="${esc(c.title)}">
          ${slides}
      </ul>
      <div class="vbar">
        <button type="button" class="vprev" aria-label="${u.prev}">←</button>
        <p class="vcount" aria-live="polite">${u.slide} <b>1</b> ${u.of} ${d.slides}</p>
        <button type="button" class="vnext" aria-label="${u.next}">→</button>
      </div>
      <p class="hint">${u.swipe}</p>
    </div>`;
}

function article(d, l) {
  const u = UI[l], c = d[l];
  return `<div class="art" data-lang="${l}">
      ${c.article.map((p) => `<p>${nb(esc(p))}</p>`).join('\n      ')}
      <h2 class="art-h">${u.steps}</h2>
      <ol class="steps">
        ${c.steps.map((s) => `<li><span class="tag">${esc(s.tag)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('\n        ')}
      </ol>
      <p class="credit">${u.credit}: ${esc(c.credit)}.</p>
      <a class="cta" href="${TG[l]}" target="_blank" rel="noopener"><span>${u.cta}<small>${u.ctaSub}</small></span><span class="go" aria-hidden="true">→</span></a>
    </div>`;
}

function head(d, l) {
  const c = d[l], u = UI[l];
  return `<div class="chead" data-lang="${l}">
      <a class="backlink" href="../../#${l}">← ${u.back}</a>
      <p class="kicker">${esc(c.hook)}</p>
      <h1>${esc(c.title)}</h1>
      <p class="lead">${esc(c.lead)}</p>
    </div>`;
}

function page(d) {
  const L = ['ru', 'en', 'es'];
  const url = `${SITE}carousel/${d.slug}/`;
  const titles = Object.fromEntries(L.map((l) => [l, `${d[l].title} | Giza Paradox`]));
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titles.ru)}</title>
<meta name="description" content="${esc(d.ru.lead)}">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0b0a09">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(titles.ru)}">
<meta property="og:description" content="${esc(d.ru.lead)}">
<meta property="og:image" content="${SITE}img/carousel/${d.slug}/ru-01.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../../img/giza-ru.jpg">
<link rel="stylesheet" href="../../style.css">
<link rel="preload" as="font" type="font/woff2" href="../../fonts/oswald-cyrillic.woff2" crossorigin>
</head>
<body class="cpage">
${L.map((l) => `<a class="skip" href="#main" data-lang="${l}">${UI[l].skip}</a>`).join('\n')}
<header class="top static">
  <a class="logo" href="../../" translate="no">GIZA PARADOX</a>
  <div class="lang" role="group" aria-label="Language">
    ${L.map((l, i) => `<button type="button" data-l="${l}" aria-pressed="${i === 0}">${UI[l].name}</button>`).join('\n    ')}
  </div>
</header>
<main id="main" class="wrap cmain">
  <div class="chead-wrap">
    ${L.map((l) => head(d, l)).join('\n    ')}
  </div>
  <div class="cgrid">
    <div class="vwrap">
    ${L.map((l) => viewer(d, l)).join('\n    ')}
    </div>
    <div class="awrap">
    ${L.map((l) => article(d, l)).join('\n    ')}
    </div>
  </div>
</main>
<footer class="foot wrap">
  <p><a href="../../">Giza Paradox</a></p>
</footer>
<script>
  (function () {
    var titles = ${JSON.stringify(titles)};
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
    document.querySelectorAll(".viewer").forEach(function (v) {
      var track = v.querySelector(".track"), slides = track.children, count = v.querySelector(".vcount b");
      function idx() { return Math.round(track.scrollLeft / track.clientWidth); }
      function go(i) {
        i = Math.max(0, Math.min(slides.length - 1, i));
        track.scrollTo({ left: i * track.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
      track.addEventListener("scroll", function () { count.textContent = idx() + 1; v.querySelector(".vprev").disabled = idx() === 0; v.querySelector(".vnext").disabled = idx() === slides.length - 1; });
      v.querySelector(".vprev").addEventListener("click", function () { go(idx() - 1); });
      v.querySelector(".vnext").addEventListener("click", function () { go(idx() + 1); });
      track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); go(idx() + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(idx() - 1); }
      });
      v.querySelector(".vprev").disabled = true;
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
}

const dataDir = path.join(__dirname, 'data');
for (const f of fs.readdirSync(dataDir).filter((x) => x.endsWith('.json'))) {
  const d = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
  const out = path.join(__dirname, 'carousel', d.slug);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'index.html'), page(d));
  console.log('собрано:', 'carousel/' + d.slug + '/index.html');
}
