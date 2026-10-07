import * as fs from 'fs';
let code = fs.readFileSync('src/App.jsx', 'utf8');

const newFunction = `  const handleLiveSearch = async (termToSearch) => {
    setIsLiveSearching(true);
    try {
      const res = await fetch(\`/api/live-search?q=\${encodeURIComponent(termToSearch)}\`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const grouped = {};
        data.results.forEach(item => {
          const baseName = item.commercialName
            .replace(/\\b(\\d+(mg|ml|g|mcg|ui|kg|l|cm)\\b|comp|cáps|caps|caja|sobre|amp|iny|jbe|susp|gotas|grageas|env|fco|comprimidos|comprimido)\\b/gi, '')
            .replace(/[0-9]+/g, '')
            .replace(/\\bx\\b/gi, '')
            .replace(/[^a-zñáéíóú\\s]/gi, '')
            .trim()
            .replace(/\\s+/g, ' ');

          const key = (baseName || item.commercialName).toLowerCase();
          
          if (!grouped[key]) {
            grouped[key] = {
              id: 'live-' + Math.random().toString(36).substr(2, 9),
              commercialName: item.commercialName,
              laboratory: 'Desconocido',
              composition: termToSearch,
              details: '',
              imageUrl: item.image_url,
              prices: [],
              clicks: 0,
              relevanceScore: 1
            };
          }
          
          let phName = item.pharmacy_id;
          if (phName === 'farmacenter') phName = 'Farmacenter';
          if (phName === 'farmatotal') phName = 'Farmatotal';
          if (phName === 'farmaoliva') phName = 'Farmaoliva';
          if (phName === 'catedral') phName = 'Farmacias Catedral';

          grouped[key].prices.push({
            pharmacy: { id: item.pharmacy_id, name: phName, class: item.pharmacy_id },
            price: item.price,
            originalName: item.commercialName
          });
        });

        setResults(prevResults => {
          const existingGrouped = {};
          prevResults.forEach(p => {
             const baseName = p.commercialName
              .replace(/\\b(\\d+(mg|ml|g|mcg|ui|kg|l|cm)\\b|comp|cáps|caps|caja|sobre|amp|iny|jbe|susp|gotas|grageas|env|fco|comprimidos|comprimido)\\b/gi, '')
              .replace(/[0-9]+/g, '')
              .replace(/\\bx\\b/gi, '')
              .replace(/[^a-zñáéíóú\\s]/gi, '')
              .trim()
              .replace(/\\s+/g, ' ');
             const key = (baseName || p.commercialName).toLowerCase();
             existingGrouped[key] = p;
          });

          Object.keys(grouped).forEach(k => {
             if (existingGrouped[k]) {
               const newPrices = grouped[k].prices;
               newPrices.forEach(np => {
                 if (!existingGrouped[k].prices) existingGrouped[k].prices = [...existingGrouped[k].sortedPrices];
                 if (!existingGrouped[k].sortedPrices.some(ep => ep.pharmacy.id === np.pharmacy.id)) {
                   existingGrouped[k].sortedPrices.push(np);
                 }
               });
             } else {
               existingGrouped[k] = grouped[k];
               existingGrouped[k].sortedPrices = grouped[k].prices;
             }
          });

          return Object.values(existingGrouped).map(product => {
            const sortedPrices = [...(product.sortedPrices || product.prices)].sort((a, b) => a.price - b.price);
            let savings = 0;
            let savingsPercent = 0;
            if (sortedPrices.length > 1) {
              const minPrice = sortedPrices[0].price;
              const maxPrice = sortedPrices[sortedPrices.length - 1].price;
              savings = maxPrice - minPrice;
              savingsPercent = Math.round((savings / maxPrice) * 100);
            }
            return { ...product, sortedPrices, savings, savingsPercent };
          });
        });

        try {
          const cacheItems = data.results.map(item => ({
            query: termToSearch.toLowerCase(),
            commercial_name: item.commercialName,
            price: item.price,
            pharmacy_id: item.pharmacy_id,
            image_url: item.image_url,
            scraped_at: new Date().toISOString()
          }));
          
          if (cacheItems.length > 0) {
            supabase.from('medicamentos_cache').insert(cacheItems).then(({error}) => {});
          }
        } catch (e) {}
      }
    } catch (error) {
      console.error("Error en live search:", error);
    } finally {
      setIsLiveSearching(false);
    }
  };`;

// Replace handleLiveSearch
const startStr = "const handleLiveSearch = async () => {";
const endStr = "  const handleSearchChange = (e) => {";
const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);
code = code.substring(0, startIndex) + newFunction + "\n\n" + code.substring(endIndex);

// Add the call to handleLiveSearch inside executeSearch
const searchCallLoc = "setResults(processedResults);\n    } catch (error) {";
code = code.replace(searchCallLoc, "setResults(processedResults);\n      handleLiveSearch(searchWord);\n    } catch (error) {");

// Add UI Spinner for isLiveSearching
const gridLoc = `<div className="results-grid">`;
const spinnerHtml = `
                {isLiveSearching && (
                  <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #bae6fd' }}>
                    <div style={{ width: '20px', height: '20px', border: '2px solid #0369a1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span style={{ fontWeight: '500' }}>Buscando precios actualizados en Catedral, FarmaTotal y Farmacenter...</span>
                  </div>
                )}
                <div className="results-grid">`;
code = code.replace(gridLoc, spinnerHtml);

// Remove the button from the empty state
const emptyStateLoc = `Búsqueda Profunda (En vivo)
                  </button>
                )}`;
code = code.replace(emptyStateLoc, `Buscando en vivo en todas las farmacias...</p>
                  </div>
                )}`);

const emptyStateStartLoc = `{isLiveSearching ? (`;
code = code.replace(emptyStateStartLoc, `{isLiveSearching && (`);

const emptyStateParams = `Prueba con "Paracetamol" o activa la búsqueda profunda.</p>`;
code = code.replace(emptyStateParams, `Prueba con "Paracetamol".</p>`);


fs.writeFileSync('src/App.jsx', code);
console.log('App.jsx modified successfully');
