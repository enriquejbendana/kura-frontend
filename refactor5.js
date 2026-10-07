const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Remove states
code = code.replace(/const \[loadingMessage, setLoadingMessage\].*?\n/, '');
code = code.replace(/const \[isLiveSearching, setIsLiveSearching\].*?\n/, '');
code = code.replace(/const \[liveLoadingMessage, setLiveLoadingMessage\].*?\n/, '');

// 2. Remove useEffect for isLiveSearching
const isLiveSearchingRegex = /useEffect\(\(\) => \{\s*let interval;\s*if \(isLiveSearching\)[\s\S]*?\}, \[isLiveSearching\]\);\n/;
code = code.replace(isLiveSearchingRegex, '');

// 3. Remove useEffect for isLoading (the 9000ms loop)
const isLoadingRegex = /useEffect\(\(\) => \{\s*let pharmacyInterval;[\s\S]*?\}, \[isLoading\]\);\n/;
code = code.replace(isLoadingRegex, '');

// 4. Replace executeSearch and handleLiveSearch entirely
const executeSearchStart = code.indexOf('const executeSearch = async (rawTerm) => {');
const handleSearchChangeStart = code.indexOf('const handleSearchChange = (e) => {');

const executeSearchNew = `  const executeSearch = async (rawTerm) => {
    if (!rawTerm || rawTerm.trim().length < 3) return;
    
    const cleanTerm = rawTerm.trim();
    const compoundMarkers = ['ibu ', 'ergo ', 'plus', 'forte', 'compuesto', ' y ', 'sinus', 'flex', 'relax'];

    setHasSearched(true);
    setIsLoading(true);
    setShowAllVariants(false);
    setBackendErrors([]);
    setResults([]);
    setScannedPharmacies(0);

    // Intentamos despertar la API de Render en paralelo
    const liveSearchPromise = fetch(\`https://kura-api-mm3u.onrender.com/api/live-search?q=\${encodeURIComponent(cleanTerm)}\`)
      .then(r => r.json())
      .catch((error) => {
        console.error("Error en live search:", error);
        return { results: [] };
      });

    let queryToFetch = cleanTerm;
    if (presentation !== 'cualquiera') {
      queryToFetch += \` \${presentation}\`;
    }

    try {
      const { data: dbProducts, error: dbError } = await supabase
        .from('products')
        .select('*, prices(price, pharmacy_id)')
        .or(\`commercial_name.ilike.%\${queryToFetch}%,composition.ilike.%\${queryToFetch}%\`);

      let rawData = [];
      if (!dbError && dbProducts && dbProducts.length > 0) {
        rawData = dbProducts.map(p => ({
          id: p.id,
          commercialName: p.commercial_name,
          composition: p.composition,
          laboratory: p.laboratory,
          details: p.details,
          imageUrl: p.image_url,
          clicks: p.clicks,
          prices: p.prices.map(priceItem => {
             return {
               pharmacy: {
                 id: priceItem.pharmacy_id,
                 name: priceItem.pharmacy_id,
                 class: priceItem.pharmacy_id
               },
               price: priceItem.price,
               originalName: p.commercial_name,
               url: null
             };
          })
        }));
      }

      const existingGrouped = {};
      rawData.forEach(item => {
        const groupingKey = item.id;
        if (!existingGrouped[groupingKey]) {
           existingGrouped[groupingKey] = {
             id: item.id,
             commercialName: item.commercialName,
             composition: item.composition,
             laboratory: item.laboratory,
             details: item.details,
             imageUrl: item.imageUrl,
             clicks: item.clicks || 0,
             prices: [],
             sortedPrices: []
           };
        }
        item.prices.forEach(p => {
          existingGrouped[groupingKey].prices.push({ ...p, originalName: item.commercialName });
          existingGrouped[groupingKey].sortedPrices.push({ ...p, originalName: item.commercialName });
        });
      });

      const finalResults = Object.values(existingGrouped).map(product => {
        const sortedPrices = [...product.sortedPrices].sort((a, b) => a.price - b.price);
        return { ...product, sortedPrices };
      });

      // --- CARGA GRADUAL DE RESULTADOS DE SUPABASE ---
      const chunks = 5;
      const chunkSize = Math.ceil(finalResults.length / chunks);
      let currentResults = [];

      for (let i = 1; i <= 5; i++) {
        setScannedPharmacies(i);
        setLoadingMessageIdx(prev => prev === 0 ? 1 : 0);
        
        if (finalResults.length > 0) {
          const startIdx = (i - 1) * chunkSize;
          const endIdx = i * chunkSize;
          const chunk = finalResults.slice(startIdx, endIdx);
          currentResults = [...currentResults, ...chunk];
          setResults([...currentResults]);
        }
        
        // Esperamos 1 segundo por cada paso de la iteración
        await new Promise(r => setTimeout(r, 1000));
      }

      // --- ESPERAR RENDER AL FINAL (Si aún no terminó) ---
      const liveData = await liveSearchPromise;
      if (liveData && liveData.results && liveData.results.length > 0) {
        liveData.results.forEach(item => {
          const priceObj = item.prices[0];
          if (!priceObj) return;
          
          const pharmacyId = priceObj.pharmacy.id;
          const price = priceObj.price;
          
          let phName = pharmacyId;
          if (phName === 'farmacenter') phName = 'Farmacenter';
          if (phName === 'farmatotal') phName = 'Farmatotal';
          if (phName === 'farmaoliva') phName = 'Farmaoliva';
          if (phName === 'catedral') phName = 'Farmacias Catedral';
          if (phName === 'punto_farma') phName = 'Punto Farma';

          const newPriceObj = {
            pharmacy: { id: pharmacyId, name: phName, class: pharmacyId },
            price: price,
            originalName: item.commercialName,
            url: priceObj.url || null
          };

          const key = (item.commercialName).toLowerCase();
          
          let foundExisting = null;
          Object.values(existingGrouped).forEach(ep => {
              if (ep.commercialName.toLowerCase() === key) foundExisting = ep;
          });

          if (foundExisting) {
            if (!foundExisting.sortedPrices.some(ep => ep.pharmacy.id === pharmacyId)) {
               foundExisting.sortedPrices.push(newPriceObj);
            }
          } else {
            existingGrouped[key] = {
              id: 'live-' + Math.random().toString(36).substr(2, 9),
              commercialName: item.commercialName,
              laboratory: item.laboratory || 'Desconocido',
              composition: item.composition || '---',
              details: item.details || '',
              imageUrl: item.imageUrl || null,
              prices: [],
              sortedPrices: [newPriceObj],
              clicks: 0,
              relevanceScore: 4
            };
          }
        });
        
        // Re-calcular los resultados finales si Render devolvió algo extra
        const finalResultsIncludingLive = Object.values(existingGrouped).map(product => {
          const sortedPrices = [...product.sortedPrices].sort((a, b) => a.price - b.price);
          return { ...product, sortedPrices };
        });
        setResults(finalResultsIncludingLive);
      }
      
    } catch (error) {
      console.error("Error al buscar:", error);
      setResults([]);
      setBackendErrors([{ error: true, message: 'Fallo al conectar con el servidor' }]);
    } finally {
      setIsLoading(false);
      setScannedPharmacies(0);
    }
  };`;

if (executeSearchStart > -1 && handleSearchChangeStart > -1) {
  code = code.substring(0, executeSearchStart) + executeSearchNew + '\\n\\n  ' + code.substring(handleSearchChangeStart);
}

// 5. Remove isLiveSearching JSX block 1 (Banner azul)
const isLiveSearchBlock1Regex = /\\{\\s*isLiveSearching && \\(\\s*<div style=\\{\\{ background: '#e0f2fe'[^}]+\\}\\}>[\\s\\S]*?<\\/div>\\s*\\)\\s*\\}/;
code = code.replace(isLiveSearchBlock1Regex, '');

// 6. Remove isLiveSearching JSX block 2 (Spinner grande)
const isLiveSearchBlock2Regex = /\\{\\s*isLiveSearching && \\(\\s*<div style=\\{\\{ display: 'flex', flexDirection: 'column'[^}]+\\}\\}>[\\s\\S]*?<\\/div>\\s*\\)\\s*\\}/;
code = code.replace(isLiveSearchBlock2Regex, '');

// 7. Fix punto-farma to punto_farma inside domains map
code = code.replace(/'punto-farma': 'https:\\/\\/www.puntofarma.com.py\\/buscar\\?q=',/g, "'punto_farma': 'https://www.puntofarma.com.py/buscar?q=',");

fs.writeFileSync(filePath, code);
console.log('Refactor completed.');
