// Lädt alle Spieler-JSONs aus src/_players/ (vom Pi per player_pages.py erzeugt).
// Ergänzt je Spieler: marquee (Kennzahl je Rolle) und sortName (Nachname zuerst).
const fs = require("fs");
const path = require("path");

function lastNameKey(name) {
  const parts = String(name).trim().split(/\s+/);
  const suffixes = new Set(["jr.", "jr", "sr.", "sr", "ii", "iii", "iv"]);
  while (
    parts.length > 1 &&
    suffixes.has(parts[parts.length - 1].toLowerCase())
  )
    parts.pop();
  const last = parts[parts.length - 1] || "";
  return (last + " " + parts.slice(0, -1).join(" ")).toLowerCase();
}

module.exports = function () {
  const dir = path.join(__dirname, "..", "_players");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d+\.json$/.test(f))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      } catch (e) {
        console.warn(`[players] ${f} nicht lesbar: ${e.message}`);
        return null;
      }
    })
    .filter((p) => p && p.slug && Array.isArray(p.blocks) && p.blocks.length)
    .map((p) => {
      p.marquee = {};
      for (const b of p.blocks) {
        const main = (b.rows || []).find((r) => r.main);
        p.marquee[b.kind] = {
          label: b.mainLabel,
          value: main ? main.v26 : "–",
        };
      }
      p.sortName = lastNameKey(p.name);
      return p;
    })
    .sort((a, b) => a.sortName.localeCompare(b.sortName, "de"));
};
