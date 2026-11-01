// Рендер img/og.jpg 1200x630: node tools/render-og.js
const fs = require("fs"), path = require("path");
const { spawnSync } = require("child_process");
const ROOT = path.resolve(__dirname, "..");
const B = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe"].find(fs.existsSync);
const out = path.join(ROOT, "img", "og.png");
const url = "file:///" + path.join(__dirname, "og.html").split(path.sep).join("/");
const r = spawnSync(B, ["--headless", "--disable-gpu", "--allow-file-access-from-files", "--hide-scrollbars", "--window-size=1200,630", "--screenshot=" + out, url], { encoding: "utf8", timeout: 60000 });
console.log(r.status, r.stderr && r.stderr.slice(-200), fs.existsSync(out) ? fs.statSync(out).size : "нет файла");
