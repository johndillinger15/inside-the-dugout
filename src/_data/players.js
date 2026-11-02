// Lädt alle Spieler-JSONs aus src/_players/ (vom Pi per player_pages.py erzeugt).
const fs = require("fs");
const path = require("path");

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
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
};
