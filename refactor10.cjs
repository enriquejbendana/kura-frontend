const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(filePath, 'utf8');

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

      // --- CARGA GRADUAL "REALISTA" POR FARMACIA ---
      const simulatedChains = ['punto_farma', 'farmacenter', 'catedral', 'farmaoliva', 'farmatotal'];

      for (let i = 1; i <= 5; i++) {
        setScannedPharmacies(i);
        setLoadingMessageIdx(prev => prev === 0 ? 1 : 0);
        
        const currentResults = finalResults.map(product => {
          // Filtramos los precios para mostrar solo los de las farmacias "ya escaneadas" hasta el paso i
          const revealedSortedPrices = product.sortedPrices.filter(p => {
             const idx = simulatedChains.indexOf(p.pharmacy.id);
             // Si es una cadena desconocida, la mostramos en el Aoltimo paso (i === 5)
             if (idx === -1) return i === 5;
             return idx < i; // idx va de 0 a 4. i va de 1 a 5.
          });
          return { ...product, sortedPrices: revealedSortedPrices };
        }).filter(product => product.sortedPrices.length > 0); // Solo mostramos el producto si tiene algAon precio revelado
        
        setResults(currentResults);
        
        // Esperamos 1 segundo por cada paso de la iteraciA3n para simular el escaneo
        await new Promise(r => setTimeout(r, 1000));
      }

      // --- ESPERAR RENDER AL FINAL (Si aAon no terminA3) ---
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
        
        // Re-calcular los resultados finales si Render devolviA3 algo extra
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
  code = code.substring(0, executeSearchStart) + executeSearchNew + '\n\n  ' + code.substring(handleSearchChangeStart);
  fs.writeFileSync(filePath, code);
  console.log('executeSearch replaced for realistic progressive load.');
} else {
  console.error('Could not find start/end marks');
}
