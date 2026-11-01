// Разовый импорт текста карусели из D:\РИЛС-ВСЕ-ПЛОЩАДКИ в data/<slug>.json (слайд 08 с кодовым словом не берём)
const fs = require("fs"), path = require("path");
const SRC = "D:/РИЛС-ВСЕ-ПЛОЩАДКИ/carousels";
const [idx, slug] = [Number(process.argv[2] || 0), process.argv[3] || "antarktida"];
const clean = (s) => s.replace(/\*/g, "");
const ru = require(SRC + "/carousels.json")[idx];
const out = { slug, id: ru.id, slides: 7, credit: "NASA, Landsat" };
for (const [l, c] of [["ru", ru], ["en", require(SRC + "/i18n/en.json")[idx]], ["es", require(SRC + "/i18n/es.json")[idx]]]) {
  out[l] = {
    title: c.title, lead: clean(c.hook[1]), hook: clean(c.hook[0]),
    steps: c.slides.map((s) => ({ tag: s[0].replace(/^\/\s*/, ""), title: clean(s[1]), text: s[2] })),
    article: c.caption.split("\n\n").slice(0, 2),
  };
}
fs.writeFileSync(path.join(__dirname, "..", "data", slug + ".json"), JSON.stringify(out, null, 1));
console.log("ok", slug);
