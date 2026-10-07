const fs = require('fs');
let jsx = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Remove MOCK_PRODUCTS from import
jsx = jsx.replace(/import \{ MOCK_PRODUCTS, formatGs \} from '\.\/mockData';/, "import { formatGs } from './mockData';");

// 2. Remove injection block
const injectStart = jsx.indexOf('// -- INYECTAR DATOS LOCALES DE PRUEBA (MOCK_PRODUCTS) --');
const injectEnd = jsx.indexOf('rawData.forEach(item => {');
if (injectStart !== -1 && injectEnd !== -1) {
    jsx = jsx.substring(0, injectStart) + jsx.substring(injectEnd);
}

// 3. Remove autocomplete mock block
const mockStart = jsx.indexOf('// Buscar marcas en MOCK_PRODUCTS local (rápido)');
const mockEnd = jsx.indexOf('// Buscar drogas genéricas');
if (mockStart !== -1 && mockEnd !== -1) {
    jsx = jsx.substring(0, mockStart) + jsx.substring(mockEnd);
}

fs.writeFileSync('src/App.jsx', jsx);
console.log('App.jsx modified successfully');

// 4. Remove MOCK_PRODUCTS from mockData.js completely
let mockData = fs.readFileSync('src/mockData.js', 'utf8');
const exportMockStart = mockData.indexOf('export const MOCK_PRODUCTS = [');
if (exportMockStart !== -1) {
    mockData = mockData.substring(0, exportMockStart);
    fs.writeFileSync('src/mockData.js', mockData);
    console.log('mockData.js modified successfully');
}
