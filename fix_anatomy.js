const fs = require('fs');
let c = fs.readFileSync('src/components/AnatomyMap.jsx', 'utf8');

c = c.replace(/selectedPart === 'resp'/g, "selectedPart === 'neumo'")
     .replace(/onPartClick\('resp'\)/g, "onPartClick('neumo')")
     .replace(/selectedPart === 'reuma'/g, "selectedPart === 'neuro'")
     .replace(/onPartClick\('reuma'\)/g, "onPartClick('neuro')");

fs.writeFileSync('src/components/AnatomyMap.jsx', c);
