const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  'const [hasSearched, setHasSearched] = React.useState(false);',
  'const [hasSearched, setHasSearched] = React.useState(false);\n  const [exactMatch, setExactMatch] = React.useState(false);'
);

c = c.replace(
  'const res = await fetch(`/api/live-search?q=${encodeURIComponent(termToSearch)}`);',
  'const res = await fetch(`/api/live-search?q=${encodeURIComponent(termToSearch)}&exact=${exactMatch}`);'
);

c = c.replace(
  /<button type="submit" className="search-button">Buscar<\/button>\s*<\/div>\s*<\/form>\s*<div className="advanced-search-toggle"/g,
  '<button type="submit" className="search-button">Buscar</button>\n                </div>\n              </form>\n\n              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "10px", fontSize: "0.9rem", color: "var(--text-main)", cursor: "pointer", userSelect: "none", width: "fit-content" }}>\n                <input type="checkbox" checked={exactMatch} onChange={(e) => setExactMatch(e.target.checked)} style={{ cursor: "pointer" }} />\n                Buscar coincidencia exacta\n              </label>\n\n              <div className="advanced-search-toggle"'
);

c = c.replace(
  /\{\s*results\.length > 0 && \(\s*<button\s*onClick=\{exportToExcel\}[\s\S]*?<\/button>\s*\)\}/g,
  ''
);

fs.writeFileSync('src/App.jsx', c);
console.log("App.jsx patched");
