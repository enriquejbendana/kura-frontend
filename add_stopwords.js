import fs from 'fs';
let app = fs.readFileSync('src/App.jsx', 'utf8');

const oldCode = `    const cleanTerm = rawTerm.trim();
    const compoundMarkers = ['ibu ', 'ergo ', 'plus', 'forte', 'compuesto', ' y ', 'sinus', 'flex', 'relax'];`;

const newCode = `    let cleanTerm = rawTerm.trim();
    
    // Filtro de palabras comunes para búsquedas con lenguaje natural
    const stopWords = ['quiero', 'un', 'una', 'unos', 'unas', 'para', 'el', 'la', 'los', 'las', 'de', 'del', 'que', 'sirva', 'algo', 'busco', 'necesito', 'comprar', 'remedio', 'producto', 'medicamento', 'pastilla', 'pastillas', 'jarabe', 'crema', 'pomada', 'me', 'duele', 'tengo'];
    const words = cleanTerm.toLowerCase().split(/\\s+/);
    if (words.length > 1) {
        const filteredWords = words.filter(w => !stopWords.includes(w) && w.length > 2);
        if (filteredWords.length > 0) {
            cleanTerm = filteredWords.join(' ');
        }
    }
    
    const compoundMarkers = ['ibu ', 'ergo ', 'plus', 'forte', 'compuesto', ' y ', 'sinus', 'flex', 'relax'];`;

app = app.replace(oldCode, newCode);
fs.writeFileSync('src/App.jsx', app);
