import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf8');

// Logo
css = css.replace(/font-size: 1\.4rem;/g, "font-size: 1.25rem;");
// Grid minimum width
css = css.replace(/minmax\(350px, 1fr\)/g, "minmax(300px, 1fr)");
// Product Title
css = css.replace(/font-size: 1\.05rem;/g, "font-size: 0.95rem;");
// Row pharmacy info
css = css.replace(/font-size: 0\.95rem;/g, "font-size: 0.85rem;");
// Price text
css = css.replace(/font-size: 1\.1rem;/g, "font-size: 1rem;");
// Padding of cards
css = css.replace(/padding: 1\.25rem 1\.25rem 0\.75rem;/g, "padding: 1rem 1rem 0.5rem;");
css = css.replace(/padding: 0\.75rem 1rem;/g, "padding: 0.5rem 0.75rem;");

fs.writeFileSync('src/index.css', css);

let js = fs.readFileSync('src/App.jsx', 'utf8');
// Navbar
js = js.replace(/fontSize: '1rem'/g, "fontSize: '0.9rem'");
js = js.replace(/padding: '0\.6rem 1rem'/g, "padding: '0.4rem 0.8rem'");
fs.writeFileSync('src/App.jsx', js);
