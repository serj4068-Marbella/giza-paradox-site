// Импорт текстов каруселей из D:\РИЛС-ВСЕ-ПЛОЩАДКИ в data/<slug>.json: node tools/import-carousel.js [all|номер]
// Последний слайд (призыв с кодовым словом) не берём: на сайт идут обложка и шаги.
const fs = require("fs"), path = require("path");
const SRC = "D:/РИЛС-ВСЕ-ПЛОЩАДКИ/carousels";
const clean = (s) => s.replace(/\*/g, "");
const ru = require(SRC + "/carousels.json"), en = require(SRC + "/i18n/en.json"), es = require(SRC + "/i18n/es.json");
const PD = { ru: "общественное достояние", en: "public domain", es: "dominio público" };
const slugOf = (c, i) => (i === 0 ? "antarktida" : c.id.replace(/^\d+-/, ""));
const credit = (c, l) => [...new Set(Object.values(c.images || {}).map((x) => x.credit.replace(/^(фото|снимок Landsat): ?/, "").replace(/общественное достояние/, PD[l])))].join(", ");
const arg = process.argv[2] || "all";
const list = arg === "all" ? ru.map((_, i) => i) : [Number(arg)];
for (const idx of list) {
  const base = ru[idx], slug = slugOf(base, idx);
  const out = { slug, id: base.id, idx, slides: base.slides.length + 1 };
  for (const [l, c] of [["ru", base], ["en", en[idx]], ["es", es[idx]]]) {
    out[l] = {
      title: c.title, lead: clean(c.hook[1]), hook: clean(c.hook[0]),
      steps: c.slides.map((s) => ({ tag: s[0].replace(/^\/\s*/, ""), title: clean(s[1]), text: s[2] })),
      article: c.caption.split("\n\n").slice(0, 2), credit: credit(base, l),
    };
  }
  fs.writeFileSync(path.join(__dirname, "..", "data", slug + ".json"), JSON.stringify(out, null, 1));
  console.log(String(idx).padStart(2), slug, "слайдов:", out.slides);
}
