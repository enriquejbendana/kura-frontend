import fs from 'fs';
let js = fs.readFileSync('src/App.jsx', 'utf8');
js = js.replace(/fontSize: '0\.9rem'/g, "fontSize: '1.1rem'");
js = js.replace(/gap: '0\.5rem'/g, "gap: '1.5rem'");
js = js.replace(/padding: '0\.4rem 0\.8rem'/g, "padding: '0.8rem 1rem'");
fs.writeFileSync('src/App.jsx', js);
