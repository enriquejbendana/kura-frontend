const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const regex = /const baseName = item\.commercialName([\s\S]*?)\.trim\(\)/m;
c = c.replace(regex, `const baseName = item.commercialName
            .normalize("NFD").replace(/[\\u0300-\\u036f]/g, "")
            .replace(/\\b(comp|cps|caps|caja|sobre|amp|iny|jbe|susp|gotas|grageas|env|fco|comprimidos|comprimido)\\b/gi, '')
            .replace(/\\bx\\b/gi, '')
            .replace(/[^a-z0-9\\s]/gi, '')
            .trim()`);

fs.writeFileSync('src/App.jsx', c);
