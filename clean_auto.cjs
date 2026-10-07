const fs = require('fs');
let lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');

// 1. Remove JSX
const renderStart = lines.findIndex(l => l.includes('{showSuggestions && liveSuggestions.length > 0 && ('));
if (renderStart !== -1) {
    let renderEnd = -1;
    let braces = 1;
    for (let i = renderStart + 1; i < lines.length; i++) {
        if (lines[i].includes(')}')) {
            renderEnd = i;
            break;
        }
    }
    if (renderEnd !== -1) {
        lines.splice(renderStart, renderEnd - renderStart + 1);
        console.log('Removed JSX block');
    }
}

// 2. Remove useEffect
const effectStart = lines.findIndex(l => l.includes('// Buscar en nuestro catálogo semilla curado'));
if (effectStart !== -1) {
    // Find the nearest useEffect above it
    let actualStart = -1;
    for (let i = effectStart; i >= 0; i--) {
        if (lines[i].includes('useEffect(() => {')) {
            actualStart = i;
            break;
        }
    }
    
    let effectEnd = -1;
    if (actualStart !== -1) {
        for (let i = actualStart; i < lines.length; i++) {
            if (lines[i].includes('}, [searchTerm, drugDictionary]);')) {
                effectEnd = i;
                break;
            }
        }
    }
    
    if (actualStart !== -1 && effectEnd !== -1) {
        lines.splice(actualStart, effectEnd - actualStart + 1);
        console.log('Removed useEffect');
    }
}

// Write back
fs.writeFileSync('src/App.jsx', lines.join('\n'));
