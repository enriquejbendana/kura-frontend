import { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, formatGs } from './mockData';
import './App.css'; // This is empty now

const normalizeProductName = (rawName) => {
  const nameLower = rawName.toLowerCase().trim();
  
  // Extract main brand (first word)
  const brandMatch = nameLower.match(/^[a-zñáéíóú]+/i);
  let brand = brandMatch ? brandMatch[0] : '';
  brand = brand.charAt(0).toUpperCase() + brand.slice(1);

  // Extract dosage (e.g. 10 mg, 10/20)
  const dosageMatch = nameLower.match(/\b(\d+(?:\/\d+)?(?:\.\d+)?)\s*(?:mg|ml|g|mcg|ui|kg)\b/i) || nameLower.match(/\b(\d+(?:\/\d+)?)\b/);
  let dosage = dosageMatch ? dosageMatch[0].replace(/\s+/g, '').toLowerCase() : '';
  // Si dosage es solo un número, agregarle mg por defecto si no lo tiene
  if (/^\d+$/.test(dosage)) dosage += 'mg';

  // Extract quantity (e.g. x 30, caja 30, 30 comp)
  let quantity = '';
  const qtyMatch1 = nameLower.match(/(?:x|caja|cont|de|env|fco)\s*(\d{1,3})\b/i);
  const qtyMatch2 = nameLower.match(/\b(\d{1,3})\s*(?:comp|caps|cáps|tab|sobres|amp)\b/i);
  
  if (qtyMatch1) {
    quantity = qtyMatch1[1];
  } else if (qtyMatch2) {
    quantity = qtyMatch2[1];
  }

  // Generate a grouping key
  const groupingKey = `${brand.toLowerCase()}-${dosage}-${quantity}`.replace(/[^a-z0-9-]/g, '');

  // Generate a display name
  let displayName = brand;
  if (dosage) displayName += ` ${dosage}`;
  if (quantity) displayName += ` - Caja x${quantity}`;

  return { groupingKey, displayName };
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchType, setSearchType] = useState('principio');
  const [presentation, setPresentation] = useState('cualquiera');
  const [sortBy, setSortBy] = useState('price_asc');
  const [showAllVariants, setShowAllVariants] = useState(false);

  const [backendErrors, setBackendErrors] = useState([]);
  
  // Estados de la canasta inteligente
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estados de Carga de Receta (OCR IA)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, scanning, success

  // Estado para Loading Falso
  const [scannedPharmacies, setScannedPharmacies] = useState(0);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const [visitCount, setVisitCount] = useState(1253);

  // Estado de Vistos Recientemente
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('farmacompara_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    localStorage.setItem('farmacompara_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Cargar Contador de Visitas al abrir la página
  useEffect(() => {
    fetch('https://kura-api-mm3u.onrender.com/api/visits')
      .then(res => res.json())
      .then(data => setVisitCount(data.visits))
      .catch(err => console.error('Error cargando visitas:', err));
  }, []);

  useEffect(() => {
    let pharmacyInterval;
    let textInterval;
    
    if (isLoading) {
      setScannedPharmacies(0);
      setLoadingMessageIdx(0);
      
      pharmacyInterval = setInterval(() => {
        setScannedPharmacies(prev => {
          if (prev < 5) return prev + 1;
          return prev;
        });
      }, 9000); // Avanza ultra lento, cada 9 segundos (45 segundos en total)

      textInterval = setInterval(() => {
        setLoadingMessageIdx(prev => (prev === 0 ? 1 : 0));
      }, 4000); // Cambia el texto cada 4 segundos

    } else {
      setScannedPharmacies(0);
      setLoadingMessageIdx(0);
    }
    
    return () => {
      clearInterval(pharmacyInterval);
      clearInterval(textInterval);
    };
  }, [isLoading]);

  const markAsViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 5); // Guardar máximo 5
    });
  };

  const extractContentQuantity = (name) => {
    const match = name.match(/(\d+)\s*(mg|ml|g|comp|cápsulas|capsulas|caps|comprimidos)/i);
    return match ? parseInt(match[1], 10) : 0;
  };

  const parseNaturalLanguage = (rawTerm) => {
    let text = rawTerm.toLowerCase();
    
    let detectedPresentation = 'cualquiera';
    if (text.includes('gotas')) {
      detectedPresentation = 'gotas';
    } else if (text.includes('jarabe') || text.includes('suspension') || text.includes('suspensión')) {
      detectedPresentation = 'jarabe';
    } else if (text.includes('comprimidos') || text.includes('capsulas') || text.includes('cápsulas') || text.includes('pastillas')) {
      detectedPresentation = 'comprimidos';
    }

    const isMonoDrug = text.includes('solo') || text.includes('solamente') || text.includes('únicamente') || text.includes('unicamente');

    const stopWords = ['quiero', 'comprar', 'un', 'una', 'el', 'la', 'los', 'las', 'necesito', 'busco', 'para', 'de', 'gotas', 'jarabe', 'suspension', 'suspensión', 'comprimidos', 'capsulas', 'cápsulas', 'pastillas', 'unos', 'unas', 'producto', 'que', 'contenga', 'en', 'solo', 'solamente', 'únicamente', 'unicamente'];
    let words = text.split(/\s+/);
    let cleanWords = words.filter(w => !stopWords.includes(w));
    
    return {
      cleanTerm: cleanWords.join(' ') || rawTerm, // fallback if everything was removed
      detectedPresentation,
      isMonoDrug
    };
  };

  const executeSearch = async (rawTerm) => {
    if (!rawTerm.trim()) {
      setHasSearched(false);
      return;
    }

    const { cleanTerm, detectedPresentation, isMonoDrug } = parseNaturalLanguage(rawTerm);
    
    const finalPresentation = detectedPresentation !== 'cualquiera' ? detectedPresentation : presentation;
    if (detectedPresentation !== 'cualquiera' && presentation !== detectedPresentation) {
      setPresentation(detectedPresentation);
    }

    setHasSearched(true);
    setIsLoading(true);
    setShowAllVariants(false);
    setBackendErrors([]);

    let queryToFetch = cleanTerm;
    if (finalPresentation !== 'cualquiera') {
      queryToFetch += ` ${finalPresentation}`;
    }

    try {
      const response = await fetch(`https://kura-api-mm3u.onrender.com/api/search?q=${encodeURIComponent(queryToFetch)}`);
      const json = await response.json();
      
      let rawData = json.data || [];
      if (json.errors && json.errors.length > 0) {
        setBackendErrors(json.errors);
      }

      if (isMonoDrug) {
        const combinationMarkers = ['+', ' y ', 'compuesto', 'plus', 'forte', 'grip', 'dual', 'flex', 'complex'];
        rawData = rawData.filter(item => {
          const nameLower = item.commercialName.toLowerCase();
          return !combinationMarkers.some(marker => nameLower.includes(marker));
        });
      }

      if (presentation !== 'cualquiera') {
        const pLower = presentation.toLowerCase();
        rawData = rawData.filter(item => {
          const nameLower = item.commercialName.toLowerCase();
          if (pLower === 'gotas') {
            return nameLower.includes('gotas') || nameLower.includes('ml');
          }
          if (pLower === 'jarabe') {
            return nameLower.includes('jarabe') || nameLower.includes('susp') || nameLower.includes('ml');
          }
          if (pLower === 'comprimidos') {
            return nameLower.includes('comp') || nameLower.includes('caps') || nameLower.includes('cáps');
          }
          return nameLower.includes(pLower);
        });
      }

      // Filtro Estricto Anti-Falsos Positivos:
      // Las farmacias a veces devuelven basura (ej. buscan "gotas" e ignoran el principio activo).
      // Obligamos a que la palabra principal de búsqueda esté en el nombre comercial o composición.
      if (cleanTerm) {
        const mainSearchWord = cleanTerm.toLowerCase().split(/\s+/).filter(w => w.length > 2)[0];
        if (mainSearchWord) {
          rawData = rawData.filter(item => {
            const name = item.commercialName.toLowerCase();
            const comp = item.composition.toLowerCase();
            return name.includes(mainSearchWord) || comp.includes(mainSearchWord);
          });
        }
      }

      const grouped = {};
      rawData.forEach(item => {
        const { groupingKey, displayName } = normalizeProductName(item.commercialName);
        
        if (!grouped[groupingKey]) {
          grouped[groupingKey] = {
            id: item.id,
            commercialName: displayName, // Usamos el nombre limpio!
            composition: item.composition,
            laboratory: item.laboratory,
            details: item.details,
            imageUrl: item.imageUrl,
            clicks: item.clicks || 0,
            prices: []
          };
        }
        if (!grouped[groupingKey].imageUrl && item.imageUrl) {
          grouped[groupingKey].imageUrl = item.imageUrl;
        }
        item.prices.forEach(p => grouped[groupingKey].prices.push({ ...p, originalName: item.commercialName }));
      });

      const matchedProducts = Object.values(grouped);

      const processedResults = matchedProducts.map(product => {
        let sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
        
        const minPrice = sortedPrices[0].price;
        const maxPrice = Math.max(...sortedPrices.map(p => p.price));
        const savings = maxPrice - minPrice;
        const savingsPercent = Math.max(0, Math.round((savings / maxPrice) * 100)) || 0;

        const nameLower = product.commercialName.toLowerCase();
        const searchWord = (cleanTerm || searchTerm).toLowerCase().trim();
        
        // Extraer la "esencia" del nombre (sin mg, ml, cajas, números, etc.)
        const baseName = nameLower
          .replace(/\b(\d+(mg|ml|g|mcg|ui|kg|l|cm)\b|comp|cáps|caps|caja|sobre|amp|iny|jbe|susp|gotas|grageas|env|fco|comprimidos|comprimido)\b/gi, '')
          .replace(/[0-9]+/g, '')
          .replace(/\bx\b/gi, '')
          .replace(/[^a-zñáéíóú\s]/gi, '')
          .trim()
          .replace(/\s+/g, ' ');

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

        return {
          ...product,
          sortedPrices,
          savings,
          savingsPercent,
          clicks: product.clicks || 0,
          relevanceScore
        };
      });

      setResults(processedResults);
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

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    executeSearch(tag);
  };
  
  const handleProductClick = (productName, fullProduct = null) => {
    if (fullProduct) markAsViewed(fullProduct);
    
    fetch('https://kura-api-mm3u.onrender.com/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName })
    }).catch(err => console.error('Error al registrar clic:', err));
  };

  const quickTags = ['Paracetamol', 'Ibuprofeno', 'Loratadina', 'Losartán', 'Alergia', 'Fuerte'];

  const sortedResults = [...results].sort((a, b) => {
    // 1. PRIORIDAD ABSOLUTA: Puntuación de Relevancia (1 a 4)
    if (a.relevanceScore !== b.relevanceScore) {
      return a.relevanceScore - b.relevanceScore;
    }

    // 2. Luego se aplica el ordenamiento secundario (Precio, Nombre, etc.)
    if (sortBy === 'price_asc') return a.sortedPrices[0].price - b.sortedPrices[0].price;
    if (sortBy === 'price_desc') return b.sortedPrices[0].price - a.sortedPrices[0].price;
    if (sortBy === 'name_asc') return a.commercialName.localeCompare(b.commercialName);
    if (sortBy === 'content_desc') return extractContentQuantity(b.commercialName) - extractContentQuantity(a.commercialName);
    if (sortBy === 'pharmacy') {
      const pharmacyA = a.sortedPrices[0].pharmacy.name;
      const pharmacyB = b.sortedPrices[0].pharmacy.name;
      return pharmacyA.localeCompare(pharmacyB);
    }
    if (sortBy === 'popularity_desc') {
      // 1. Prioridad ABSOLUTA: Clics reales de usuarios históricos
      const clicksA = a.clicks || 0;
      const clicksB = b.clicks || 0;
      if (clicksA !== clicksB) return clicksB - clicksA;

      // 2. Si no hay clics o empatan, usamos disponibilidad
      const availA = a.sortedPrices.length;
      const availB = b.sortedPrices.length;
      if (availA !== availB) return availB - availA;
      
      // 3. Marca reconocida
      const hasLabA = a.laboratory !== 'Desconocido' ? 1 : 0;
      const hasLabB = b.laboratory !== 'Desconocido' ? 1 : 0;
      if (hasLabA !== hasLabB) return hasLabB - hasLabA;

      return a.sortedPrices[0].price - b.sortedPrices[0].price;
    }
    return 0;
  });

  const exportToExcel = () => {
    let csvContent = "\uFEFF"; // Para correcta lectura de acentos en Excel
    csvContent += "Producto;Laboratorio;Presentacion;Farmacia;Precio\n";
    
    sortedResults.forEach(product => {
      product.sortedPrices.forEach(priceEntry => {
        // Limpiamos strings de posibles comillas o puntos y comas para que no rompan el CSV
        const safeName = product.commercialName.replace(/"/g, '""').replace(/;/g, ',');
        const safeLab = product.laboratory.replace(/"/g, '""').replace(/;/g, ',');
        const safeDetails = product.details.replace(/"/g, '""').replace(/;/g, ',');
        const safePharmacy = priceEntry.pharmacy.name.replace(/"/g, '""').replace(/;/g, ',');
        
        csvContent += `"${safeName}";"${safeLab}";"${safeDetails}";"${safePharmacy}";${priceEntry.price}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Precios_${searchTerm || 'Busqueda'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funciones de la Canasta Inteligente
  const addToCart = (product) => {
    markAsViewed(product);
    if (!cart.find(item => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleSimulatedUpload = () => {
    setUploadStatus('scanning');
    
    // Simulamos el tiempo de procesamiento de la IA (2.5 segundos)
    setTimeout(() => {
      setUploadStatus('success');
      
      // Generamos productos simulados detectados por la "IA"
      const detectedItem1 = {
        id: 'ocr-1',
        commercialName: 'Amoxicilina 500mg (Detectado)',
        laboratory: 'Laboratorio Genérico',
        composition: 'Amoxicilina',
        details: 'Caja x 20 Comprimidos',
        prices: [
          { pharmacy: { id: 'punto-farma', name: 'Punto Farma' }, price: 25000 },
          { pharmacy: { id: 'farmacenter', name: 'Farmacenter' }, price: 27500 },
          { pharmacy: { id: 'catedral', name: 'Farmacias Catedral' }, price: 24000 },
          { pharmacy: { id: 'farmaoliva', name: 'Farmaoliva' }, price: 26000 },
          { pharmacy: { id: 'farmatotal', name: 'Farmatotal' }, price: 25500 }
        ]
      };

      const detectedItem2 = {
        id: 'ocr-2',
        commercialName: 'Ibuprofeno 400mg (Detectado)',
        laboratory: 'Laboratorio Genérico',
        composition: 'Ibuprofeno',
        details: 'Caja x 10 Cápsulas Blandas',
        prices: [
          { pharmacy: { id: 'punto-farma', name: 'Punto Farma' }, price: 12000 },
          { pharmacy: { id: 'farmacenter', name: 'Farmacenter' }, price: 13500 },
          { pharmacy: { id: 'catedral', name: 'Farmacias Catedral' }, price: 11500 },
          { pharmacy: { id: 'farmaoliva', name: 'Farmaoliva' }, price: 12500 }
        ]
      };

      // Añadimos a la canasta automáticamente
      setCart(prevCart => {
        const newCart = [...prevCart];
        if (!newCart.find(i => i.id === 'ocr-1')) newCart.push(detectedItem1);
        if (!newCart.find(i => i.id === 'ocr-2')) newCart.push(detectedItem2);
        return newCart;
      });

      // Cerramos el modal y abrimos la canasta para mostrar la magia después de 2 segundos
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setUploadStatus('idle');
        setIsCartOpen(true);
      }, 2500);

    }, 2500);
  };

  const calculateCartTotals = () => {
    const pharmacies = [
      { id: 'punto-farma', name: 'Punto Farma', logo: '/logos/punto-farma.png' },
      { id: 'farmacenter', name: 'Farmacenter', logo: '/logos/farmacenter.png' },
      { id: 'catedral', name: 'Farmacias Catedral', logo: '/logos/catedral.png' },
      { id: 'farmaoliva', name: 'Farmaoliva', logo: '/logos/farmaoliva.png' },
      { id: 'farmatotal', name: 'Farmatotal', logo: '/logos/farmatotal.png' }
    ];

    const results = pharmacies.map(pharma => {
      let total = 0;
      let missingItems = 0;
      
      cart.forEach(item => {
        const priceEntry = item.prices.find(p => p.pharmacy.id === pharma.id);
        if (priceEntry) {
          total += priceEntry.price;
        } else {
          missingItems += 1;
        }
      });
      
      return { ...pharma, total, missingItems };
    });

    // Ordenar: primero los completos por precio, luego los incompletos
    // Ocultamos las farmacias que no tienen NINGÚN item de la canasta (missingItems === cart.length)
    const validResults = results.filter(a => a.missingItems < cart.length);
    
    return validResults.sort((a, b) => {
      if (a.missingItems === 0 && b.missingItems > 0) return -1;
      if (b.missingItems === 0 && a.missingItems > 0) return 1;
      if (a.missingItems !== b.missingItems) return a.missingItems - b.missingItems;
      return a.total - b.total;
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container header-content">

          <div className="logo">
            Kura <span className="logo-tag">PY</span>
          </div>
          <div style={{width: '24px'}}></div> {/* Placeholder for balance */}
        </div>
      </header>

      <main className="main-content container">
        <section className={`hero-section ${hasSearched ? 'searched' : ''}`}>
          <div className="search-container">
            <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Decime en palabras qué querés encontrar, o escribí la composición o marca..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button type="submit" className="search-button">Buscar</button>
                <button type="button" className="btn-upload-prescription" onClick={() => setIsUploadModalOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Subir Receta
                </button>
              </div>
            </form>

            <div className="advanced-search-toggle" style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
                Búsqueda Avanzada
              </button>
            </div>

            {showAdvanced && (
              <div className="advanced-search-panel" style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem', border: '1px solid var(--border)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>Tipo de Búsqueda</label>
                  <select 
                    value={searchType} 
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                  >
                    <option value="principio">Principio Activo (Ej. Paracetamol)</option>
                    <option value="marca">Marca Comercial (Ej. Kitadol)</option>
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>Forma Farmacéutica</label>
                  <select 
                    value={presentation} 
                    onChange={(e) => setPresentation(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                  >
                    <option value="cualquiera">Cualquiera</option>
                    <option value="gotas">Gotas</option>
                    <option value="jarabe">Jarabe / Suspensión</option>
                    <option value="comprimidos">Comprimidos / Cápsulas</option>
                  </select>
                </div>
              </div>
            )}
            
            {!hasSearched && (
              <div className="home-dashboard">
                <div className="popular-categories-section">
                  <h3>Categorías Populares</h3>
                  <div className="categories-grid">
                    <button className="category-pill" onClick={() => { setSearchTerm('antigripal'); executeSearch('antigripal'); }}>
                      Gripe y Resfriado
                    </button>
                    <button className="category-pill" onClick={() => { setSearchTerm('vitamina'); executeSearch('vitamina'); }}>
                      Vitaminas
                    </button>
                    <button className="category-pill" onClick={() => { setSearchTerm('analgésico'); executeSearch('analgésico'); }}>
                      Analgésicos
                    </button>
                    <button className="category-pill" onClick={() => { setSearchTerm('bebé'); executeSearch('bebé'); }}>
                      Cuidado Infantil
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!hasSearched && <p className="update-notice">Última actualización de precios: Hoy, 08:30 hrs</p>}
          </div>
          
          {/* SECCIÓN VISTOS RECIENTEMENTE */}
          {!hasSearched && recentlyViewed.length > 0 && (
            <div className="recently-viewed-section">
              <h3 className="section-title" style={{ fontSize: '1.25rem', color: 'var(--text)', marginBottom: '1.5rem', fontWeight: 600 }}>Vistos recientemente</h3>
              <div className="recently-viewed-list">
                {recentlyViewed.map(product => (
                  <div key={`recent-${product.id}`} className="recent-card">
                    <div className="recent-card-img">
                      {product.imageUrl ? (
                         <img src={product.imageUrl} alt={product.commercialName} />
                      ) : (
                         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 7 17l5-5-3.5-3.5L12 5l7 7-3.5 3.5Z"/><path d="M14 9.5 9.5 14"/></svg>
                      )}
                    </div>
                    <div className="recent-card-info">
                      <h4 className="recent-title" title={product.commercialName}>{product.commercialName}</h4>
                      <p className="recent-details" title={product.details}>{product.details}</p>
                      <p className="recent-lab" title={product.laboratory}>{product.laboratory}</p>
                    </div>
                    <button 
                      className="btn-add-cart-recent"
                      onClick={() => addToCart(product)}
                      disabled={cart.some(item => item.id === product.id)}
                    >
                      {cart.some(item => item.id === product.id) ? 'Añadido' : 'Agregar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasSearched && (
            <div className="bank-promos-section" style={{ marginTop: '2rem', maxWidth: '700px', margin: '2rem auto 0' }}>
              <h3 className="section-title" style={{ fontSize: '1.25rem', color: 'var(--text)', marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                💳 Promociones del Día
              </h3>
              <div className="promos-grid" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <div className="promo-card ghost-card ghost-itau">
                  <div className="promo-bank">Punto Farma</div>
                  <div className="promo-discount">30% OFF</div>
                  <div className="promo-location">con Itaú</div>
                </div>
                <div className="promo-card ghost-card ghost-ueno">
                  <div className="promo-bank">Catedral</div>
                  <div className="promo-discount">25% OFF</div>
                  <div className="promo-location">con Ueno Bank</div>
                </div>
                <div className="promo-card ghost-card ghost-familiar">
                  <div className="promo-bank">Vicente Scavone</div>
                  <div className="promo-discount">20% OFF</div>
                  <div className="promo-location">con Familiar</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {hasSearched && (
          <section className="results-section">
            <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 className="results-title" style={{ margin: 0 }}>Resultados de búsqueda</h2>
                {!isLoading && (
                  <>
                    <span className="results-count" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--primary-dark)', background: 'var(--primary-light)', padding: '0.25rem 0.75rem', borderRadius: '1rem', border: '1px solid var(--primary)' }}>
                      {results.length} productos encontrados
                    </span>
                    {results.length > 0 && (
                      <button 
                        onClick={exportToExcel} 
                        className="btn-export-excel"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Exportar a Excel
                      </button>
                    )}
                  </>
                )}
              </div>
              
              {!isLoading && results.length > 0 && (
                <div className="sort-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5h10"/><path d="M11 9h7"/><path d="M11 13h4"/><path d="M3 17l3 3 3-3"/><path d="M6 18V4"/></svg>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Ordenar:</label>
                  </div>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '2px solid var(--primary)', background: 'var(--background)', color: 'var(--text)', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', outline: 'none', minWidth: '220px' }}
                  >
                    <option value="price_asc">Menor precio primero</option>
                    <option value="price_desc">Mayor precio primero</option>
                    <option value="popularity_desc">Mayor popularidad</option>
                    <option value="name_asc">Orden alfabético (A-Z)</option>
                    <option value="content_desc">Mayor contenido (mg/ml/comp)</option>
                    <option value="pharmacy">Cadena de Farmacia (Ganadora)</option>
                  </select>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="loading-container" style={{ textAlign: 'center', padding: '4rem', color: 'var(--primary)' }}>
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '1rem' }}>
                  ¡No te vayas! Estamos procesando tu búsqueda...
                </h3>
                
                <div style={{ position: 'relative', height: '60px', marginBottom: '1.5rem', width: '100%', overflow: 'hidden' }}>
                  <p className={`animated-loading-text ${loadingMessageIdx === 0 ? 'visible' : 'hidden'}`}>
                    Nos estamos tomando tiempo para buscar los mejores precios en las mejores farmacias.
                  </p>
                  <p className={`animated-loading-text ${loadingMessageIdx === 1 ? 'visible' : 'hidden'}`}>
                    Sos nuestro visitante número {visitCount} a nuestra página en la semana. ¡Gracias!
                  </p>
                </div>

                <div style={{ background: 'var(--background)', borderRadius: '999px', height: '10px', width: '250px', margin: '0 auto', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ height: '100%', background: 'var(--primary)', width: `${(scannedPharmacies / 5) * 100}%`, transition: 'width 0.8s ease-in-out', borderRadius: '999px' }}></div>
                </div>
                <p style={{ marginTop: '0.75rem', fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                  Analizando... {scannedPharmacies} farmacias listas
                </p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : results.length > 0 ? (
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
                    const exactMatches = sortedResults.filter(p => p.relevanceScore === 1);
                    const relatedMatches = sortedResults.filter(p => p.relevanceScore > 1);
                    const hasExactMatches = exactMatches.length > 0;
                    
                    const renderProductCard = (product) => (
                      <div key={product.id} className="product-card">
                        <div className="card-header" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <div className="product-image-container" style={{ flexShrink: 0, width: '80px', height: '80px', backgroundColor: 'var(--surface)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}>
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.commercialName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'; }} />
                            ) : (
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 7 17l5-5-3.5-3.5L12 5l7 7-3.5 3.5Z"/><path d="M14 9.5 9.5 14"/></svg>
                            )}
                          </div>
                          <div className="product-info-wrapper">
                            {product.laboratory && product.laboratory.toLowerCase() !== 'desconocido' && (
                              <span className="laboratory-name">{product.laboratory}</span>
                            )}
                            <h3 className="product-title">{product.commercialName}</h3>
                            <p className="product-subtitle">{product.composition} • {product.details}</p>
                            
                            {product.savings > 0 && (
                              <div className="savings-pill">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 19-5 5-5-5"/><path d="m17 5-5-5-5 5"/></svg>
                                Ahorra {product.savingsPercent}% (hasta {formatGs(product.savings)})
                              </div>
                            )}
                            <div style={{ marginTop: '0.75rem' }}>
                              <button 
                                className="btn-add-cart"
                                onClick={() => addToCart(product)}
                                disabled={cart.some(item => item.id === product.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                                {cart.some(item => item.id === product.id) ? 'Añadido' : 'Añadir a la Canasta'}
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="price-table-container">
                        {product.sortedPrices.map((priceEntry, idx) => {
                          const isBestPrice = idx === 0;
                          const domains = {
                            'punto-farma': 'https://www.puntofarma.com.py/buscar?s=',
                            'farmacenter': 'https://www.farmacenter.com.py/catalogo?q=',
                            'catedral': 'https://www.farmaciacatedral.com.py/buscador?q=',
                            'farmaoliva': 'https://www.farmaoliva.com.py/catalogo?q=',
                            'farmatotal': 'https://www.farmatotal.com.py/?post_type=product&s='
                          };
                          const baseUrl = domains[priceEntry.pharmacy.id] || 'https://';
                          const mockUrl = `${baseUrl}${encodeURIComponent(product.commercialName)}`;
                          const finalUrl = priceEntry.url || mockUrl;
                          
                          return (
                            <a 
                              key={priceEntry.pharmacy.id + idx} 
                              href={finalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`pharmacy-row ${priceEntry.pharmacy.class} ${isBestPrice ? 'best-price' : ''}`}
                              onClick={() => handleProductClick(product.commercialName, product)}
                            >
                              <div className="row-pharmacy-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <img 
                                  src={`/logos/${priceEntry.pharmacy.id}.png`} 
                                  alt={priceEntry.pharmacy.name} 
                                  style={{ maxHeight: '40px', maxWidth: '140px', objectFit: 'contain' }}
                                  onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.style.display = 'none'; 
                                    e.target.parentElement.innerHTML = priceEntry.pharmacy.name; 
                                  }} 
                                />
                                {priceEntry.originalName && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.4rem', maxWidth: '180px', lineHeight: '1.2' }}>
                                    {priceEntry.originalName}
                                  </span>
                                )}
                              </div>
                              </div>
                              <div className="row-price-info">
                                {isBestPrice && (
                                  <svg className="best-price-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                )}
                                <span className="price-text" style={{color: isBestPrice ? 'var(--primary-dark)' : 'inherit'}}>
                                  {formatGs(priceEntry.price)}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--text-muted)', marginLeft: '0.25rem'}}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                    );

                    return (
                      <>
                        {hasExactMatches ? exactMatches.map(renderProductCard) : sortedResults.map(renderProductCard)}
                        
                        {hasExactMatches && relatedMatches.length > 0 && (
                          <>
                            <div style={{ gridColumn: '1 / -1', margin: '2rem 0 1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border)', textAlign: 'center' }}>
                              <h3 style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 600 }}>Otras presentaciones relacionadas</h3>
                            </div>
                            
                            {(showAllVariants ? relatedMatches : relatedMatches.slice(0, 4)).map(renderProductCard)}
                            
                            {relatedMatches.length > 4 && (
                              <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '1.5rem', paddingBottom: '2rem' }}>
                                <button 
                                  onClick={() => setShowAllVariants(!showAllVariants)} 
                                  className="tag-btn"
                                  style={{ padding: '0.75rem 2rem', fontWeight: 600, fontSize: '1rem' }}
                                >
                                  {showAllVariants ? 'Ocultar presentaciones' : `Ver ${relatedMatches.length - 4} presentaciones más`}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              </>
            ) : (
              <div className="no-results" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <p>No se encontraron resultados para "{searchTerm}". Prueba con "Paracetamol" o utilizando las etiquetas sugeridas.</p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button className="floating-cart-btn" onClick={() => setIsCartOpen(true)}>
          <div className="cart-badge">{cart.length}</div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span>Ver Canasta</span>
        </button>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="cart-modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-modal-content" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Mi Canasta Inteligente</h2>
              <button className="btn-close-modal" onClick={() => setIsCartOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="cart-body">
              {cart.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No hay medicamentos en la canasta.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="cart-items-list">
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Medicamentos ({cart.length})</h3>
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{item.commercialName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.laboratory}</div>
                        </div>
                        <button className="btn-remove-item" onClick={() => removeFromCart(item.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-totals">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Comparativa Total</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {calculateCartTotals().map((pharma, idx) => (
                        <div key={pharma.id} className={`cart-total-row ${idx === 0 && pharma.missingItems === 0 ? 'winner' : ''} ${pharma.missingItems > 0 ? 'incomplete' : ''}`}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {idx === 0 && pharma.missingItems === 0 && (
                              <svg style={{ color: 'var(--warning)' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            )}
                            <span style={{ fontWeight: 600 }}>{pharma.name}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            {pharma.missingItems > 0 ? (
                              <span style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 500 }}>Faltan {pharma.missingItems} item(s)</span>
                            ) : (
                              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: idx === 0 ? 'var(--primary-dark)' : 'inherit' }}>{formatGs(pharma.total)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Recipe Modal */}
      {isUploadModalOpen && (
        <div className="cart-modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="cart-modal-content upload-modal" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Carga tu receta médica</h2>
              <button className="btn-close-modal" onClick={() => setIsUploadModalOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="cart-body" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <h3 style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.4rem', marginBottom: '1rem' }}>¡Próximamente!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                Estamos entrenando a nuestra Inteligencia Artificial para que pronto puedas subir la foto de tu receta y nosotros hagamos todo el trabajo.
              </p>
              <button 
                className="btn-add-cart" 
                style={{ marginTop: '2rem', width: '100%', justifyContent: 'center' }}
                onClick={() => setIsUploadModalOpen(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
