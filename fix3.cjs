const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  /(<div className="search-container"[\s\S]*?)(<button type="submit" className="search-button">Buscar<\/button>\s*<\/div>\s*<\/form>)/,
  '$1$2\n\n              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "10px", fontSize: "0.9rem", color: "var(--text-main)", cursor: "pointer", userSelect: "none", width: "fit-content" }}>\n                <input type="checkbox" checked={exactMatch} onChange={(e) => setExactMatch(e.target.checked)} style={{ cursor: "pointer" }} />\n                Buscar coincidencia exacta\n              </label>'
);

fs.writeFileSync('src/App.jsx', c);
