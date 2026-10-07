const fs = require('fs');

const code = fs.readFileSync('src/App.jsx', 'utf8');
const lines = code.split('\n');

const start = lines.findIndex(l => l.includes('const executeSearch ='));
const end = lines.findIndex(l => l.includes('const handleSearchChange ='));

const executeSearchNew = \
  const executeSearch = async (rawTerm) => {
    if (!rawTerm || rawTerm.trim().length < 3) return;
    
    const cleanTerm = rawTerm.trim();
    const compoundMarkers = ['ibu ', 'ergo ', 'plus', 'forte', 'compuesto', ' y ', 'sinus', 'flex', 'relax'];

    setHasSearched(true);
    setIsLoading(true);
    setLoadingMessage("Consultando punto de venta 1...");
    setShowAllVariants(false);
    setBackendErrors([]);

    // 1. Iniciar fetch de Render en paralelo
    const liveSearchPromise = fetch(\\\https://kura-api-mm3u.onrender.com/api/live-search?q=\\\\\\)
      .then(r => r.json())
      .catch((error) => {
        console.error("Error en live search:", error);
        setBackendErrors(prev => [...prev, { error: true, pharmacy: { name: 'Vercel API (' + error.message + ')' } }]);
        return { results: [] };
      });

    // Simulador 1
    await new Promise(r => setTimeout(r, 1000));

    let queryToFetch = cleanTerm;
    if (presentation !== 'cualquiera') {
      queryToFetch += \\\ \\\\\\;
    }

    try {
      // 2. Fetch Supabase
      const { data: dbProducts, error: dbError } = await supabase
        .from('products')
        .select('*, prices(price, pharmacy_id)')
        .or(\\\commercial_name.ilike.%\\\%,composition.ilike.%\\\%\\\);

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
             const pharmacyInfo = pharmacies[priceItem.pharmacy_id];
             return {
               pharmacy: {
                 id: priceItem.pharmacy_id,
                 name: pharmacyInfo ? pharmacyInfo.name : priceItem.pharmacy_id,
                 class: priceItem.pharmacy_id
               },
               price: priceItem.price,
               originalName: p.commercial_name,
               url: null
             };
          })
        }));

        if (exactMatch) {
          const mainSearchWord = cleanTerm.normalize("NFD").replace(/[\\\\u0300-\\\\u036f]/g, "").toLowerCase().split(/\\\\s+/)[0];
          rawData = rawData.filter(item => {
            const nameLower = item.commercialName.toLowerCase();
            const baseName = nameLower
              .replace(/\\\\b(\\\\d+(mg|ml|g|mcg|ui|kg|l|cm)\\\\b|comp|cáps|caps|caja|sobre|amp|iny|jbe|susp|gotas|grageas|env|fco|comprimidos|comprimido)\\\\b/gi, '')
              .replace(/[0-9]+/g, '')
              .replace(/\\\\bx\\\\b/gi, '')
              .replace(/[^a-zñáéíóú\\\\s]/gi, '')
              .trim()
              .replace(/\\\\s+/g, ' ');

            const searchHasMarker = compoundMarkers.some(m => cleanTerm.toLowerCase().includes(m.trim()));
            const nameHasMarker = compoundMarkers.some(m => nameLower.includes(m.trim()));
            
            if (!searchHasMarker && nameHasMarker) {
              return false; 
            }
            
            const firstWordOfName = baseName.split(/\\\\s+/)[0];
            const comp = (item.composition || '').toLowerCase();
            return (firstWordOfName && firstWordOfName.includes(mainSearchWord)) || comp.includes(mainSearchWord);
          });
        }
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
        if (!existingGrouped[groupingKey].imageUrl && item.imageUrl) {
          existingGrouped[groupingKey].imageUrl = item.imageUrl;
        }
        item.prices.forEach(p => {
          const existingIdx = existingGrouped[groupingKey].prices.findIndex(ep => ep.pharmacy.id === p.pharmacy.id);
          if (existingIdx >= 0) {
            if (p.price < existingGrouped[groupingKey].prices[existingIdx].price) {
              existingGrouped[groupingKey].prices[existingIdx] = { ...p, originalName: item.commercialName };
            }
          } else {
            existingGrouped[groupingKey].prices.push({ ...p, originalName: item.commercialName });
          }
        });
        existingGrouped[groupingKey].sortedPrices = [...existingGrouped[groupingKey].prices];
      });

      // Simuladores restantes
      setLoadingMessage("Consultando punto de venta 2...");
      await new Promise(r => setTimeout(r, 1000));
      setLoadingMessage("Consultando punto de venta 3...");
      await new Promise(r => setTimeout(r, 1000));
      setLoadingMessage("Consultando punto de venta 4...");
      await new Promise(r => setTimeout(r, 1000));
      setLoadingMessage("Consultando punto de venta 5...");
      await new Promise(r => setTimeout(r, 1000));

      // 3. Esperar Render si no terminó
      const liveData = await liveSearchPromise;

      if (liveData && liveData.results && liveData.results.length > 0) {
        liveData.results.forEach(item => {
          const priceObj = item.prices[0];
          if (!priceObj) return;
          
          const pharmacyId = priceObj.pharmacy.id;
          const price = priceObj.price;
          
          const baseName = item.commercialName
            .normalize("NFD").replace(/[\\\\u0300-\\\\u036f]/g, "")
            .toLowerCase()
            .replace(/\\\\b(comp|cps|caps|caja|sobre|amp|iny|jbe|susp|gotas|grageas|env|fco|comprimidos|comprimido)\\\\b/gi, '')
            .replace(/\\\\bx\\\\b/gi, '')
            .replace(/[^a-z0-9\\\\s]/gi, '')
            .trim()
            .replace(/\\\\s+/g, ' ');

          const searchWords = cleanTerm.normalize("NFD").replace(/[\\\\u0300-\\\\u036f]/g, "").toLowerCase().split(/\\\\s+/).filter(w => w.length > 2);
          
          const searchHasMarker = compoundMarkers.some(m => cleanTerm.toLowerCase().includes(m.trim()));
          const nameHasMarker = compoundMarkers.some(m => item.commercialName.toLowerCase().includes(m.trim()));
          
          if (!searchHasMarker && nameHasMarker) return;

          if (searchWords.length > 0) {
            const mainWord = searchWords[0];
            const firstWordOfName = baseName.split(/\\\\s+/)[0];
            if (!firstWordOfName || !firstWordOfName.includes(mainWord)) return;
          }

          const key = (baseName || item.commercialName).toLowerCase();
          const searchWord = cleanTerm.toLowerCase().trim();
          
          let relevanceScore = 4;
          if (baseName === searchWord) {
            relevanceScore = 1;
          } else if (baseName.startsWith(searchWord)) {
            relevanceScore = 2;
          } else if (baseName.endsWith(searchWord)) {
            relevanceScore = 3;
          } else {
            relevanceScore = 4;
          }
          
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

          // Mezclar con Supabase
          let foundExisting = null;
          Object.values(existingGrouped).forEach(ep => {
              const epBaseName = ep.commercialName
                .replace(/\\\\b(\\\\d+(mg|ml|g|mcg|ui|kg|l|cm)\\\\b|comp|cáps|caps|caja|sobre|amp|iny|jbe|susp|gotas|grageas|env|fco|comprimidos|comprimido)\\\\b/gi, '')
                .replace(/[0-9]+/g, '')
                .replace(/\\\\bx\\\\b/gi, '')
                .replace(/[^a-zñáéíóú\\\\s]/gi, '')
                .trim()
                .replace(/\\\\s+/g, ' ');
              const epKey = (epBaseName || ep.commercialName).toLowerCase();
              if (epKey === key) foundExisting = ep;
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
              relevanceScore: relevanceScore
            };
          }
        });
      }

      // Procesar Finales
      const finalResults = Object.values(existingGrouped).map(product => {
        const sortedPrices = [...(product.sortedPrices || product.prices)].sort((a, b) => a.price - b.price);
        let savings = 0;
        let savingsPercent = 0;
        if (sortedPrices.length > 1) {
          const minPrice = sortedPrices[0].price;
          const maxPrice = sortedPrices[sortedPrices.length - 1].price;
          savings = maxPrice - minPrice;
          savingsPercent = Math.round((savings / maxPrice) * 100);
        }

        const nameLower = product.commercialName.toLowerCase();
        const searchWord = cleanTerm.toLowerCase().trim();
        const baseName = nameLower
          .replace(/\\\\b(\\\\d+(mg|ml|g|mcg|ui|kg|l|cm)\\\\b|comp|cáps|caps|caja|sobre|amp|iny|jbe|susp|gotas|grageas|env|fco|comprimidos|comprimido)\\\\b/gi, '')
          .replace(/[0-9]+/g, '')
          .replace(/\\\\bx\\\\b/gi, '')
          .replace(/[^a-zñáéíóú\\\\s]/gi, '')
          .trim()
          .replace(/\\\\s+/g, ' ');

        let relevanceScore = product.relevanceScore || 4;
        if (!product.relevanceScore) {
          if (baseName === searchWord) {
            relevanceScore = 1;
          } else if (baseName.startsWith(searchWord)) {
            relevanceScore = 2;
          } else if (baseName.endsWith(searchWord)) {
            relevanceScore = 3;
          } else {
            relevanceScore = 4;
          }
        }

        return { ...product, sortedPrices, savings, savingsPercent, relevanceScore };
      });

      setResults(finalResults);
      
    } catch (error) {
      console.error("Error al buscar:", error);
      setResults([]);
      setBackendErrors([{ error: true, message: 'Fallo al conectar con el servidor', pharmacy: { name: 'Servidor Local' } }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setHasSearched(false);
    setResults([]);
  };
\;

const newCode = [...lines.slice(0, start), executeSearchNew.trim(), ...lines.slice(end)].join('\n');
fs.writeFileSync('src/App.jsx.temp', newCode);
