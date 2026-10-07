import fs from 'fs';
let js = fs.readFileSync('src/App.jsx', 'utf8');
js = js.replace(/fontSize: '1\.2rem'/g, "fontSize: '1rem'");
js = js.replace(/padding: '0\.8rem 1\.5rem'/g, "padding: '0.6rem 1rem'");
js = js.replace(/gap: '1rem'/g, "gap: '0.5rem'");
fs.writeFileSync('src/App.jsx', js);
