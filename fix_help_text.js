const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  /className="search-input"\s*style=\{\{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var\(--border\)', fontSize: '1\.1rem' \}\}\s*\/>\s*<\/div>/,
  `className="search-input" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid var(--border)', fontSize: '1.1rem' }} />
  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Si el principio activo no está en el mapa interactivo, presiona <b>Enter</b> para buscarlo en la base de datos completa.</p>
  </div>`
);
fs.writeFileSync('src/App.jsx', c);
