const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. REEMPLAZAR executeSearch PARA CARGA REALISTA
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
          const revealedSortedPrices = product.sortedPrices.filter(p => {
             const idx = simulatedChains.indexOf(p.pharmacy.id);
             if (idx === -1) return i === 5;
             return idx < i;
          });
          return { ...product, sortedPrices: revealedSortedPrices };
        }).filter(product => product.sortedPrices.length > 0);
        
        setResults(currentResults);
        await new Promise(r => setTimeout(r, 1000));
      }

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
}

// 2. ELIMINAR EL useEffect OBSOLETO
const useEffectStart = code.indexOf('  useEffect(() => {\n    let pharmacyInterval;\n    let textInterval;');
const useEffectEnd = code.indexOf('  }, [isLoading]);');
if (useEffectStart !== -1 && useEffectEnd !== -1) {
    code = code.substring(0, useEffectStart) + code.substring(useEffectEnd + '  }, [isLoading]);'.length);
}

// 3. DESACOPLAR EL JSX DE isLoading vs Results
const uiStartStr = `{isLoading ? (
              <div className="loading-container"`;
const uiStartIdx = code.indexOf(uiStartStr);
const uiEndStr = `const exactMatches =`;
const uiEndIdx = code.indexOf(uiEndStr);

if (uiStartIdx !== -1 && uiEndIdx !== -1) {
  const targetStr = code.substring(uiStartIdx, uiEndIdx);
  
  const replacementStr = `{isLoading && (
              <div className="loading-container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--primary)' }}>
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '1rem' }}>
                  Consultando punto de venta {scannedPharmacies || 1}...
                </h3>
                
                <div style={{ position: 'relative', height: '60px', marginBottom: '1.5rem', width: '100%', overflow: 'hidden' }}>
                  <p className={\`animated-loading-text \${loadingMessageIdx === 0 ? 'visible' : 'hidden'}\`}>
                    Nos estamos tomando tiempo para buscar los mejores precios en las mejores farmacias.
                  </p>
                  <p className={\`animated-loading-text \${loadingMessageIdx === 1 ? 'visible' : 'hidden'}\`}>
                    Sos nuestro visitante número {visitCount} a nuestra página en la semana. ¡Gracias!
                  </p>
                </div>

                <div style={{ background: 'var(--background)', borderRadius: '999px', height: '10px', width: '250px', margin: '0 auto', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ height: '100%', background: 'var(--primary)', width: \`\${(scannedPharmacies / 5) * 100}%\`, transition: 'width 0.8s ease-in-out', borderRadius: '999px' }}></div>
                </div>
                <p style={{ marginTop: '0.75rem', fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                  Analizando... {scannedPharmacies} farmacias listas
                </p>
                <style>{\`@keyframes spin { 100% { transform: rotate(360deg); } }\`}</style>
              </div>
            )}
            
            {results.length > 0 && (
              <>
                {backendErrors.length > 0 && (
                  <div className="error-banner" style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #fca5a5' }}>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Aviso importante:</strong>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                      {backendErrors.map((err, idx) => (
                        <li key={idx}>El sistema de farmacia <strong>{err.pharmacy.name}</strong> está caído y no responde en este momento.</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="results-grid">
                  {(() => {
                    `;

  code = code.replace(targetStr, replacementStr);
}

// 4. CORREGIR EL TERNARIO DE RESULTADOS VACÍOS
const emptyTarget = `              </>
            ) : (
              <div className="no-results" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>`;
const emptyReplacement = `              </>
            )}
            
            {results.length === 0 && !isLoading && hasSearched && (
              <div className="no-results" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>`;
code = code.replace(emptyTarget, emptyReplacement);


// 5. BORRAR LA BARRA AZUL LIVE SEARCH DEL FINAL
const trailingSpinner = `                  {isLiveSearching && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      <p style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>{liveLoadingMessage}</p>
                    </div>
                  )}`;
code = code.replace(trailingSpinner, '');


// 6. CORREGIR punto-farma a punto_farma EN LOS ENLACES
code = code.split("'punto-farma': 'https://www.puntofarma.com.py/buscar?q='").join("'punto_farma': 'https://www.puntofarma.com.py/buscar?q='");

// 7. BORRAR VARIABLES DE ESTADO OBSOLETAS
code = code.replace(/const \[loadingMessage, setLoadingMessage\].*?\n/g, '');
code = code.replace(/const \[isLiveSearching, setIsLiveSearching\].*?\n/g, '');
code = code.replace(/const \[liveLoadingMessage, setLiveLoadingMessage\].*?\n/g, '');


fs.writeFileSync(filePath, code);
console.log('REFACTOR FINAL COMPLETADO CON EXITO.');
