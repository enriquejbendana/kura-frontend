import fs from 'fs';
let app = fs.readFileSync('src/App.jsx', 'utf8');

// Cambiar el valor por defecto de sortBy
app = app.replace("const [sortBy, setSortBy] = useState('price_asc');", "const [sortBy, setSortBy] = useState('popularity_desc');");

// Cambiar la etiqueta de "Mayor popularidad" a "Relevancia (Recomendado)"
app = app.replace('<option value="popularity_desc">Mayor popularidad</option>', '<option value="popularity_desc">Relevancia (Recomendado)</option>');

fs.writeFileSync('src/App.jsx', app);
