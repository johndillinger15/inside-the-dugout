// Verlinkt Spielernamen in Artikeln beim Build mit den vorhandenen Spielerseiten.
// Quelle der Namen: src/_players/*.json (nur Spieler mit Seite, es entstehen keine toten Links).
// Regeln: nur vollständige Namen (zwei Wörter oder mehr), Akzente egal, nur das erste Vorkommen
// je Seite, nicht in Überschriften, Links, Code, Skripten. Mehrdeutige Namen werden übersprungen.
const fs = require("fs");
const path = require("path");

const SKIP_TAGS = new Set([
  "a",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "code",
  "pre",
  "script",
  "style",
  "title",
  "button",
  "textarea",
  "head",
]);
const SCOPES = ["src/posts/", "src/shortposts/"];

function foldChar(c) {
  const a = c.normalize("NFKD").replace(/[^\x00-\x7F]/g, "");
  return (a[0] || c).toLowerCase();
}
const fold = (s) =>
  Array.from(s, foldChar).join("").replace(/\s+/g, " ").trim();

let cache = null;
function load() {
  if (cache) return cache;
  const dir = path.join(__dirname, "..", "..", "src", "_players");
  const byName = new Map();
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (!/^\d+\.json$/.test(f)) continue;
      try {
        const p = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
        if (!p.slug || !p.name || !Array.isArray(p.blocks) || !p.blocks.length)
          continue;
        const key = fold(p.name);
        if (!key.includes(" ")) continue;
        if (!byName.has(key)) byName.set(key, new Set());
        byName.get(key).add(p.slug);
      } catch (e) {
        console.warn(`[linkPlayers] ${f}: ${e.message}`);
      }
    }
  }
  const slugs = new Map();
  for (const [k, set] of byName) if (set.size === 1) slugs.set(k, [...set][0]); // mehrdeutig: weglassen
  const keys = [...slugs.keys()].sort((a, b) => b.length - a.length);
  const re = keys.length
    ? new RegExp(
        "(?<![\\w])(" +
          keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") +
          ")(?![\\w])",
        "g",
      )
    : null;
  cache = { slugs, re };
  return cache;
}

function linkText(text, state, { slugs, re }) {
  const folded = Array.from(text, foldChar).join("");
  if (folded.length !== text.length) return text; // Längenabweichung (Surrogate): nicht anfassen
  let out = "",
    last = 0,
    m;
  re.lastIndex = 0;
  while ((m = re.exec(folded))) {
    const slug = slugs.get(m[1]);
    if (state.done.has(slug)) continue;
    state.done.add(slug);
    const s = m.index,
      e = s + m[1].length;
    out +=
      text.slice(last, s) +
      `<a href="/spieler/${slug}/">${text.slice(s, e)}</a>`;
    last = e;
  }
  return out + text.slice(last);
}

module.exports = function linkPlayers(content) {
  const out = (this.page && this.page.outputPath) || "";
  const input = ((this.page && this.page.inputPath) || "").replace(/^\.\//, "");
  if (!out.endsWith(".html") || !SCOPES.some((s) => input.startsWith(s)))
    return content;
  const data = load();
  if (!data.re) return content;

  const state = { done: new Set() };
  // Bereits verlinkte Spieler (z.B. Briefings mit /spieler/-Links) nicht noch einmal verlinken
  for (const m of content.matchAll(
    /href="(?:https:\/\/inside-the-dugout\.de)?\/spieler\/([^"/]+)\//g,
  ))
    state.done.add(m[1]);

  let skip = 0;
  return content
    .split(/(<[^>]+>)/)
    .map((part) => {
      if (part.startsWith("<")) {
        const m = /^<(\/?)([a-zA-Z0-9]+)/.exec(part);
        if (m && SKIP_TAGS.has(m[2].toLowerCase()) && !/\/>$/.test(part)) {
          skip += m[1] ? -1 : 1;
          if (skip < 0) skip = 0;
        }
        return part;
      }
      return skip > 0 ? part : linkText(part, state, data);
    })
    .join("");
};
