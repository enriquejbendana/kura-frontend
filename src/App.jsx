import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { MOCK_PRODUCTS, formatGs } from './mockData';
import { drugDictionary as localDrugDictionary } from './drugDictionary';
import { diccionarioAnatomico } from './data/diccionarioAnatomico';
import { cadenasFarmacias as localCadenasFarmacias } from './data/cadenasFarmacias';
import { diasSemana, alianzasDescuentos as localAlianzasDescuentos } from './data/ofertasBancarias';
import AnatomyMap from './components/AnatomyMap';
import './App.css'; // This is empty now

// normalizeProductName removido para evitar agrupación agresiva de marcas

function App() {
  // Estados de Base de Datos
  const [cadenasFarmacias, setCadenasFarmacias] = useState(localCadenasFarmacias);
  const [alianzasDescuentos, setAlianzasDescuentos] = useState(localAlianzasDescuentos);
  const [drugDictionary, setDrugDictionary] = useState(localDrugDictionary);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [exactMatch, setExactMatch] = useState(false);
  const [results, setResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchType, setSearchType] = useState('principio');
  const [presentation, setPresentation] = useState('cualquiera');
  const [sortBy, setSortBy] = useState('price_asc');
  const [showAllVariants, setShowAllVariants] = useState(false);

  const [backendErrors, setBackendErrors] = useState([]);
  
  // Estados de la canasta inteligente
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estados del Vademécum Anatómico
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDrugDetails, setSelectedDrugDetails] = useState(null);
  
  // Estados del Directorio de Farmacias
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  // Estados del Radar de Ofertas
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [offerCategory, setOfferCategory] = useState('bancos'); // 'bancos', 'seguros', 'cooperativas', 'eventos'

  // Estados de Carga de Receta (OCR IA)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, scanning, success
  
  // Estado de Navegación por Pestañas
  const [activeTab, setActiveTab] = useState('inicio');

  // Estado para Ofertas Dinámicas
  const [topOffers, setTopOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);

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

  // Carga inicial de datos desde Supabase
  useEffect(() => {
    async function loadDbData() {
      try {
        const [pharmaciesRes, discountsRes, principlesRes] = await Promise.all([
          supabase.from('pharmacies').select('*'),
          supabase.from('discounts').select('*'),
          supabase.from('active_principles').select('*')
        ]);
        
        if (pharmaciesRes.data && pharmaciesRes.data.length > 0) {
          const mappedPharmacies = pharmaciesRes.data.map(p => {
            const local = localCadenasFarmacias.find(l => l.id === p.id) || { data: {} };
            return {
              id: p.id,
              name: p.name || local.name,
              themeColor: p.theme_color || local.themeColor,
              textColor: p.text_color || local.textColor,
              status: p.status || local.status || 'Conectado',
              data: {
                delivery: p.delivery || local.data.delivery || '',
                horarios: p.horarios || local.data.horarios || '',
                seguros: p.seguros || local.data.seguros || '',
                fidelidad: p.fidelidad || local.data.fidelidad || '',
                whatsapp: p.whatsapp || local.data.whatsapp || '',
                pagos: p.pagos || local.data.pagos || '',
                cobertura: p.cobertura || local.data.cobertura || '',
                mapsQuery: p.maps_query || local.data.mapsQuery || ''
              }
            };
          });
          setCadenasFarmacias(mappedPharmacies);
        }
        
        if (discountsRes.data && discountsRes.data.length > 0) {
          // Normalizar snake_case a camelCase para la app
          const mappedDiscounts = discountsRes.data.map(d => ({
            id: d.id,
            category: d.category,
            bank: d.bank,
            bankColor: d.bank_color,
            bankHighlight: d.bank_highlight,
            pharmacy: d.pharmacy_id,
            pharmacyColor: d.pharmacy_color,
            discount: d.discount,
            type: d.type,
            dayIds: d.day_ids
          }));
          setAlianzasDescuentos(mappedDiscounts);
        }

        if (principlesRes.data && principlesRes.data.length > 0) {
          const dict = {};
          principlesRes.data.forEach(p => {
             if (!dict[p.uses]) dict[p.uses] = { category: p.uses, description: "", drugs: [] };
             dict[p.uses].drugs.push({ name: p.name, action: p.description, warnings: p.warnings });
          });
          setDrugDictionary(Object.values(dict));
        }

        setIsDataLoaded(true);
      } catch (err) {
        console.error("Error al cargar datos de Supabase:", err);
      }
    }
    loadDbData();
  }, []);

  // Cargar Contador de Visitas al abrir la página
  useEffect(() => {
    fetch('https://kura-api-mm3u.onrender.com/api/visits')
      .then(res => res.json())
      .then(data => setVisitCount(data.visits))
      .catch(err => console.error('Error cargando visitas:', err));
  }, []);

  // Cargar Top Ofertas cuando se abre la pestaña
  useEffect(() => {
    if (activeTab === 'ofertas' && topOffers.length === 0) {
      const fetchOffers = async () => {
        setLoadingOffers(true);
        try {
          const { data, error } = await supabase
            .from('medicamentos_cache')
            .select('*')
            .gt('discount_percentage', 0)
            .order('discount_percentage', { ascending: false })
            .limit(12);

          if (!error && data) {
            // Eliminar duplicados por nombre comercial para no mostrar 5 variantes del mismo producto
            const uniqueOffers = [];
            const seen = new Set();
            for (const item of data) {
              const simpleName = (item.commercial_name || '').toLowerCase().substring(0, 15);
              if (!seen.has(simpleName)) {
                seen.add(simpleName);
                uniqueOffers.push(item);
              }
            }
            setTopOffers(uniqueOffers);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingOffers(false);
        }
      };
      fetchOffers();
    }
  }, [activeTab]);

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
      // Búsqueda en Supabase usando ilike en commercial_name o composition
      const { data: dbProducts, error } = await supabase
        .from('products')
        .select(`
          *,
          product_prices (
            price,
            pharmacies (
              id,
              name,
              logo
            )
          )
        `)
        .or(`commercial_name.ilike.%${cleanTerm}%,composition.ilike.%${cleanTerm}%`);

      if (error) throw error;
      
      let rawData = [];
      
      if (dbProducts) {
        // Mapear la estructura de Supabase a la que esperaba el frontend
        rawData = dbProducts.map(p => ({
          id: p.id,
          commercialName: p.commercial_name,
          composition: p.composition,
          laboratory: p.laboratory,
          details: p.details,
          imageUrl: p.image_url,
          clicks: 0, // o agregar clicks a la tabla luego
          prices: p.product_prices.map(pp => ({
            price: pp.price,
            pharmacy: {
              id: pp.pharmacies.id,
              name: pp.pharmacies.name,
              logo: pp.pharmacies.logo
            }
          }))
        }));
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

      // Filtro Estricto Anti-Falsos Positivos
      if (cleanTerm) {
        const mainSearchWord = cleanTerm.toLowerCase().split(/\s+/).filter(w => w.length > 2)[0];
        if (mainSearchWord) {
          rawData = rawData.filter(item => {
            const name = item.commercialName.toLowerCase();
            const comp = (item.composition || '').toLowerCase();
            return name.includes(mainSearchWord) || comp.includes(mainSearchWord);
          });
        }
      }

      const grouped = {};
      rawData.forEach(item => {
        const groupingKey = item.id;
        
        if (!grouped[groupingKey]) {
          grouped[groupingKey] = {
            id: item.id,
            commercialName: item.commercialName, // Mantenemos el nombre real completo
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
        item.prices.forEach(p => {
          const existingIdx = grouped[groupingKey].prices.findIndex(ep => ep.pharmacy.id === p.pharmacy.id);
          if (existingIdx >= 0) {
            if (p.price < grouped[groupingKey].prices[existingIdx].price) {
              grouped[groupingKey].prices[existingIdx] = { ...p, originalName: item.commercialName };
            }
          } else {
            grouped[groupingKey].prices.push({ ...p, originalName: item.commercialName });
          }
        });
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
      // SIEMPRE disparar la búsqueda en vivo, incluso si Supabase falla (por ejemplo, si la tabla no existe todava)
      if (cleanTerm.length >= 3) {
        handleLiveSearch(cleanTerm);
      }
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

  const handleLiveSearch = async (termToSearch) => {
    setIsLiveSearching(true);
    try {
      const res = await fetch(`/api/live-search?q=${encodeURIComponent(termToSearch)}&exact=${exactMatch}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // Transformar los resultados planos en la estructura agrupada de productos
        const grouped = {};
        data.results.forEach(item => {
          // Normalizar el nombre base
          const baseName = item.commercialName
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\b(comp|cps|caps|caja|sobre|amp|iny|jbe|susp|gotas|grageas|env|fco|comprimidos|comprimido)\b/gi, '')
            .replace(/\bx\b/gi, '')
            .replace(/[^a-z0-9\s]/gi, '')
            .trim()
            .replace(/\s+/g, ' ');

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

        // Combinar con los resultados existentes (los de Supabase)
        setResults(prevResults => {
          const existingGrouped = {};
          prevResults.forEach(p => {
             const baseName = p.commercialName
              .replace(/\b(\d+(mg|ml|g|mcg|ui|kg|l|cm)\b|comp|cáps|caps|caja|sobre|amp|iny|jbe|susp|gotas|grageas|env|fco|comprimidos|comprimido)\b/gi, '')
              .replace(/[0-9]+/g, '')
              .replace(/\bx\b/gi, '')
              .replace(/[^a-zñáéíóú\s]/gi, '')
              .trim()
              .replace(/\s+/g, ' ');
             const key = (baseName || p.commercialName).toLowerCase();
             existingGrouped[key] = p;
          });

          // Mezclar los nuevos
          Object.keys(grouped).forEach(k => {
             if (existingGrouped[k]) {
               const newPrices = grouped[k].prices;
               newPrices.forEach(np => {
                 if (!existingGrouped[k].prices) existingGrouped[k].prices = [...existingGrouped[k].sortedPrices]; // Fallback
                 if (!existingGrouped[k].sortedPrices.some(ep => ep.pharmacy.id === np.pharmacy.id)) {
                   existingGrouped[k].sortedPrices.push(np);
                 }
               });
             } else {
               existingGrouped[k] = grouped[k];
               existingGrouped[k].sortedPrices = grouped[k].prices;
             }
          });

          // Recalcular ahorros para todo
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

        // Guardar silenciosamente en Supabase
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
            supabase.from('medicamentos_cache').insert(cacheItems).then(({error}) => {
              if (error) console.error('Error insertando en cache:', error);
            });
          }
        } catch (e) {
          console.error('No se pudo guardar en cache', e);
        }
      }
    } catch (error) {
      console.error("Error en live search:", error);
      // MOSTRAR ERROR EN PANTALLA PARA DEPURAR
      setBackendErrors(prev => [...prev, { error: true, pharmacy: { name: 'Vercel API (' + error.message + ')' } }]);
    } finally {
      setIsLiveSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === '') {
      handleClearSearch();
    }
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
          { pharmacy: { id: 'punto_farma', name: 'Punto Farma' }, price: 25000 },
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
          { pharmacy: { id: 'punto_farma', name: 'Punto Farma' }, price: 12000 },
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
      { id: 'punto_farma', name: 'Punto Farma', logo: '/logos/punto-farma.png' },
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

          <div className="logo" onClick={() => setActiveTab('inicio')} style={{ cursor: 'pointer' }}>
            Kura <span className="logo-tag">PY</span>
          </div>
          
          <nav className="header-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={() => setActiveTab('inicio')} 
              style={{ background: 'none', border: 'none', padding: '0.8rem 1.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem', color: activeTab === 'inicio' ? 'var(--primary)' : 'var(--text)', borderBottom: activeTab === 'inicio' ? '4px solid var(--primary)' : '4px solid transparent', transition: 'all 0.2s' }}>
              Inicio
            </button>
            <button 
              onClick={() => setActiveTab('farmacias')} 
              style={{ background: 'none', border: 'none', padding: '0.8rem 1.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem', color: activeTab === 'farmacias' ? 'var(--primary)' : 'var(--text)', borderBottom: activeTab === 'farmacias' ? '4px solid var(--primary)' : '4px solid transparent', transition: 'all 0.2s' }}>
              Farmacias
            </button>
            <button 
              onClick={() => setActiveTab('principios')} 
              style={{ background: 'none', border: 'none', padding: '0.8rem 1.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem', color: activeTab === 'principios' ? 'var(--primary)' : 'var(--text)', borderBottom: activeTab === 'principios' ? '4px solid var(--primary)' : '4px solid transparent', transition: 'all 0.2s' }}>
              Principios Activos
            </button>
            <button 
              onClick={() => setActiveTab('ofertas')} 
              style={{ background: 'none', border: 'none', padding: '0.8rem 1.5rem', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem', color: activeTab === 'ofertas' ? 'var(--primary)' : 'var(--text)', borderBottom: activeTab === 'ofertas' ? '4px solid var(--primary)' : '4px solid transparent', transition: 'all 0.2s' }}>
              Ofertas
            </button>
          </nav>

          <div style={{width: '24px'}}></div> {/* Placeholder for balance */}
        </div>
      </header>

      <main className="main-content container">

        {/* ===================== TAB: INICIO ===================== */}
        {activeTab === 'inicio' && (
          <>
            {!hasSearched && (
          <div className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">Encontrá tu bienestar<br/>al mejor precio</h1>
              <p className="hero-subtitle">Buscá y compará medicamentos en las mejores farmacias del país, sin salir de tu casa.</p>
              
              <div className="search-container" style={{ margin: 0, width: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
                  <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <textarea 
                    className="search-input multiline-search" 
                    placeholder="Decime en palabras qué querés encontrar, escribí la composición o marca, o bien, hace click en..." 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSearchSubmit(e);
                      }
                    }}
                    rows={3}
                  />
                  {searchTerm && (
                    <button type="button" onClick={handleClearSearch} className="clear-search-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--text-muted)', position: 'absolute', right: '110px', top: '50%', transform: 'translateY(-50%)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', flexShrink: 0 }}>
                    <button type="submit" className="search-button">Buscar</button>
                  </div>
                </form>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "10px", fontSize: "0.9rem", color: "var(--text-main)", cursor: "pointer", userSelect: "none", width: "fit-content" }}>
                <input type="checkbox" checked={exactMatch} onChange={(e) => setExactMatch(e.target.checked)} style={{ cursor: "pointer" }} />
                Buscar coincidencia exacta
              </label>
              </div>
            </div>
            <div className="hero-image-container">
              <img src="/hero-image.png" alt="Farmacéutica Kura" className="hero-image" />
            </div>
          </div>
        )}

        {hasSearched && (
          <div className="search-container" style={{ marginBottom: '2rem' }}>
            <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <textarea 
                    className="search-input multiline-search" 
                    placeholder="Decime en palabras qué querés encontrar, escribí la composición o marca, o bien, hace click en..." 
                    value={searchTerm}
                    rows={3}
                    onChange={handleSearchChange}
                  />
                  {searchTerm && (
                    <button type="button" onClick={handleClearSearch} className="clear-search-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--text-muted)', position: 'absolute', right: '110px', top: '50%', transform: 'translateY(-50%)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  )}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', flexShrink: 0 }}>
                <button type="submit" className="search-button">Buscar</button>
                </div>
              </form>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "10px", fontSize: "0.9rem", color: "var(--text-main)", cursor: "pointer", userSelect: "none", width: "fit-content" }}>
                <input type="checkbox" checked={exactMatch} onChange={(e) => setExactMatch(e.target.checked)} style={{ cursor: "pointer" }} />
                Buscar coincidencia exacta
              </label>

              <div className="advanced-search-toggle" style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
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
          </div>
        )}

        {!hasSearched && (
              <div className="home-dashboard">
                <div className="popular-categories-section">
                  <h3>Categorías Populares</h3>
                  <div className="categories-icons-grid">
                    <button className="category-item" onClick={() => { setSearchTerm('antigripal'); executeSearch('antigripal'); }}>
                      <div className="category-icon-wrapper squircle-blue">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 7 17l5-5-3.5-3.5L12 5l7 7-3.5 3.5Z"/><path d="M14 9.5 9.5 14"/></svg>
                      </div>
                      <span className="category-label text-blue">Gripe y Resfriado</span>
                    </button>
                    <button className="category-item" onClick={() => { setSearchTerm('vitamina'); executeSearch('vitamina'); }}>
                      <div className="category-icon-wrapper squircle-green">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="7" width="10" height="14" rx="2" ry="2"/><path d="M6 7h12"/><path d="M10 3v4"/><path d="M14 3v4"/><path d="M12 11v4"/><path d="M10 13h4"/></svg>
                      </div>
                      <span className="category-label text-green">Vitaminas</span>
                    </button>
                    <button className="category-item" onClick={() => { setSearchTerm('analgésico'); executeSearch('analgésico'); }}>
                      <div className="category-icon-wrapper squircle-purple">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M8 11h8"/><path d="M12 7v8"/></svg>
                      </div>
                      <span className="category-label text-purple">Analgésicos</span>
                    </button>
                    <button className="category-item" onClick={() => { setSearchTerm('bebé'); executeSearch('bebé'); }}>
                      <div className="category-icon-wrapper squircle-orange">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </div>
                      <span className="category-label text-orange">Cuidado Infantil</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!hasSearched && <p className="update-notice">Última actualización de precios: Hoy, 08:30 hrs</p>}
          
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
                {(() => {
                  const today = new Date().getDay();
                  const promosHoy = alianzasDescuentos.filter(o => o.category === 'bancos' && o.dayIds.includes(today)).slice(0, 3);
                  if (promosHoy.length === 0) {
                     return <p style={{ color: 'var(--text-muted)' }}>No hay promociones bancarias cargadas para hoy.</p>;
                  }
                  return promosHoy.map((promo, idx) => (
                    <div key={`promo-${idx}`} className="promo-card ghost-card" style={{
                      backgroundColor: 'var(--surface)', 
                      border: `1px solid ${promo.bankColor}40`,
                      borderLeft: `4px solid ${promo.bankColor}`
                    }}>
                      <div className="promo-bank" style={{ color: promo.pharmacyColor }}>{promo.pharmacy}</div>
                      <div className="promo-discount" style={{ color: promo.bankHighlight || promo.bankColor, fontWeight: 800 }}>{promo.discount}</div>
                      <div className="promo-location" style={{ color: 'var(--text-muted)' }}>con {promo.bank}</div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

        {hasSearched && (
          <section className="results-section">
            <div className="breadcrumbs" style={{ marginBottom: '1.5rem', fontSize: '1.15rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={handleClearSearch}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 600, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Inicio
              </button>
              <span style={{ fontSize: '1.15rem' }}>/</span>
              <span style={{ fontWeight: 500, color: 'var(--text)', fontSize: '1.15rem' }}>Resultados para "{searchTerm}"</span>
            </div>

            <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h2 className="results-title" style={{ margin: 0 }}>Resultados de búsqueda</h2>
                {!isLoading && (
                  <>
                    <span className="results-count" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--primary-dark)', background: 'var(--primary-light)', padding: '0.25rem 0.75rem', borderRadius: '1rem', border: '1px solid var(--primary)' }}>
                      {results.length} productos encontrados
                    </span>
                    
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

                {isLiveSearching && (
                  <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #bae6fd' }}>
                    <div style={{ width: '20px', height: '20px', border: '2px solid #0369a1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span style={{ fontWeight: '500' }}>Buscando precios actualizados en Catedral, FarmaTotal y Farmacenter...</span>
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
                            {product.laboratory && !product.laboratory.toLowerCase().includes('esconocido') && !product.laboratory.toLowerCase().includes('genérico') && (
                              <span className="laboratory-name">{product.laboratory}</span>
                            )}
                            <h3 className="product-title">{product.commercialName}</h3>
                            <p className="product-subtitle">{product.composition}</p>
                            
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
                            'punto_farma': 'https://www.puntofarma.com.py/buscar?s=',
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
                                <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-main)', textAlign: 'center', letterSpacing: '-0.01em' }}>
                                  {priceEntry.pharmacy.name}
                                </span>
                                {priceEntry.originalName && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.4rem', maxWidth: '180px', lineHeight: '1.2' }}>
                                    {priceEntry.originalName}
                                  </span>
                                )}
                              </div>
                              <div className="row-price-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  {isBestPrice && (
                                    <svg className="best-price-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                  )}
                                  <span className="price-text" style={{color: isBestPrice ? 'var(--primary-dark)' : 'inherit'}}>
                                    {formatGs(priceEntry.price)}
                                  </span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--text-muted)', marginLeft: '0.25rem'}}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                </div>
                                {priceEntry.specialPrice && (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '-0.2rem' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0288d1', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                      {formatGs(priceEntry.specialPrice)}
                                    </span>
                                    <span style={{ fontSize: '0.65rem', color: '#0288d1', fontWeight: '600', textTransform: 'uppercase' }}>
                                      {priceEntry.specialMethod}
                                    </span>
                                  </div>
                                )}
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
                {backendErrors.length > 0 && (
                  <div className="error-banner" style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid #fca5a5', textAlign: 'left' }}>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Aviso importante:</strong>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                      {backendErrors.map((err, idx) => (
                        <li key={idx}>El sistema de farmacia <strong>{err.pharmacy.name}</strong> est caido y no responde en este momento. ({err.message})</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div style={{ marginBottom: '2rem' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--border)', marginBottom: '1rem' }}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: '600' }}>No encontramos "{searchTerm}" en nuestra base rápida.</p>
                </div>
                
                {isLiveSearching && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>Buscando en vivo en todas las farmacias...</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
          </>
        )}

        {/* ===================== TAB: FARMACIAS ===================== */}
        {activeTab === 'farmacias' && (
          <div className="tab-content" style={{ animation: 'fadeIn 0.3s' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--text)', fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                Directorio de Farmacias
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Conocé las zonas de cobertura, costos de delivery, seguros médicos y encuentra las sucursales más cercanas a tu ubicación ingresando en la cadena de tu preferencia o{' '}
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=farmacias+cerca+de+mi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: 'white', 
                    background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)', 
                    padding: '0.4rem 1.2rem', 
                    borderRadius: '2rem', /* Píldora */
                    textDecoration: 'none', 
                    fontWeight: '800',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    margin: '0.2rem 0.5rem',
                    boxShadow: '0 4px 15px rgba(66, 133, 244, 0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    verticalAlign: 'middle'
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(66, 133, 244, 0.6)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(66, 133, 244, 0.4)'; }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  haciendo click aquí
                </a>
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
              {cadenasFarmacias.map((pharma) => (
                <div 
                  key={pharma.id} 
                  onClick={() => setSelectedPharmacy(pharma)}
                  style={{ backgroundColor: pharma.themeColor, padding: '3rem 2rem', borderRadius: '1.5rem', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '220px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', overflow: 'hidden' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)'; }}
                >
                  <div style={{ position: 'absolute', top: '10px', right: '15px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.8rem', borderRadius: '2rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 10px #4ade80' }}></div>
                    <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>{pharma.status}</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '2.5rem', color: pharma.textColor, fontWeight: 900, textAlign: 'center', letterSpacing: '-0.5px' }}>{pharma.name}</h3>
                  <p style={{ margin: '1rem 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '1rem', fontWeight: 500 }}>Toca para ver información ➔</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== MODAL DE FARMACIA ===================== */}
        {selectedPharmacy && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s' }} onClick={() => setSelectedPharmacy(null)}>
            <div style={{ width: '90%', maxWidth: '800px', backgroundColor: 'white', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '85vh', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s' }} onClick={e => e.stopPropagation()}>
              
              <div style={{ padding: '2rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: selectedPharmacy.themeColor, borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem' }}>
                <h2 style={{ fontSize: '2.5rem', color: selectedPharmacy.textColor, margin: 0, fontWeight: 900 }}>{selectedPharmacy.name}</h2>
                <button onClick={() => setSelectedPharmacy(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              
              <div style={{ padding: '3rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                  
                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem', borderLeft: `4px solid ${selectedPharmacy.themeColor}` }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedPharmacy.themeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                      Delivery
                    </h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>{selectedPharmacy.data.delivery}</p>
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem', borderLeft: `4px solid ${selectedPharmacy.themeColor}` }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedPharmacy.themeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Horarios de Atención
                    </h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>{selectedPharmacy.data.horarios}</p>
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem', borderLeft: `4px solid ${selectedPharmacy.themeColor}` }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedPharmacy.themeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      Métodos de Pago
                    </h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>{selectedPharmacy.data.pagos}</p>
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem', borderLeft: `4px solid ${selectedPharmacy.themeColor}` }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedPharmacy.themeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      Seguros Médicos Asociados
                    </h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>{selectedPharmacy.data.seguros}</p>
                  </div>

                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem', borderLeft: `4px solid ${selectedPharmacy.themeColor}` }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedPharmacy.themeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Contacto WhatsApp
                    </h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>{selectedPharmacy.data.whatsapp}</p>
                  </div>
                </div>

                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPharmacy.data.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: '100%', padding: '1.5rem', backgroundColor: '#4285F4', color: 'white', borderRadius: '1rem', border: 'none', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', boxShadow: '0 4px 15px rgba(66, 133, 244, 0.3)', textDecoration: 'none', transition: 'background-color 0.2s', marginTop: 'auto' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Ver sucursal más cercana en Google Maps
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: PRINCIPIOS ACTIVOS (ANATÓMICO) ===================== */}
        {activeTab === 'principios' && (
          <div className="tab-content" style={{ animation: 'fadeIn 0.3s' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--text)', fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                Directorio Médico
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Buscá por nombre, interactuá con el cuerpo humano o explorá por categorías.</p>
            </div>

            {/* Búsqueda Rápida de Principios Activos */}
            <div style={{ maxWidth: '600px', margin: '0 auto 4rem auto', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Buscar principio activo por nombre (ej: Ibuprofeno, Omeprazol)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = e.target.value.toLowerCase().trim();
                    if (val.length > 2) {
                      let foundCat = null;
                      let foundDrug = null;
                      
                      for (const cat of diccionarioAnatomico) {
                        const found = cat.drugs.find(d => d.name.toLowerCase().includes(val));
                        if (found) {
                          foundCat = cat;
                          foundDrug = found;
                          break;
                        }
                      }
                      
                      if (foundCat && foundDrug) {
                        setSelectedCategory(foundCat);
                        setSelectedDrugDetails(foundDrug);
                      } else {
                        // Redirigir a búsqueda general
                        setSearchTerm(val);
                        setActiveTab('inicio');
                        executeSearch(val);
                      }
                    }
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  if (val.length > 2) {
                    for (const cat of diccionarioAnatomico) {
                      const found = cat.drugs.find(d => d.name.toLowerCase().includes(val));
                      if (found) {
                        setSelectedCategory(cat);
                        setSelectedDrugDetails(found);
                        return;
                      }
                    }
                  }
                }}
                style={{ width: '100%', padding: '1.2rem 1.5rem', paddingLeft: '3.5rem', borderRadius: '1.5rem', border: '1px solid var(--border)', fontSize: '1.1rem', backgroundColor: 'var(--surface)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', color: 'var(--text)' }}
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>

            {/* Sección: Cuerpo Humano + Detalles */}
            <div id="anatomy-section" style={{ display: 'flex', gap: '3rem', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' }}>
              
              {/* Columna Izquierda: Cuerpo Interactivo */}
              <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <AnatomyMap 
                  selectedPart={selectedCategory ? selectedCategory.id : null}
                  onPartClick={(partId) => {
                    // Mapear los IDs visuales del mapa anatómico a las categorías de la base de datos
                    let mappedId = partId;
                    if (partId === 'resp') mappedId = 'neumo';
                    if (partId === 'derma') mappedId = 'infeccioso';
                    
                    const category = diccionarioAnatomico.find(c => c.id === mappedId);
                    if (category) {
                      setSelectedCategory(category);
                      setSelectedDrugDetails(null);
                    }
                  }}
                />
              </div>

              {/* Columna Derecha: Detalles / Lista de Medicamentos */}
              <div style={{ flex: '2', minWidth: '350px', display: 'flex', flexDirection: 'column' }}>
                {!selectedCategory ? (
                  <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: '1.5rem', border: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--primary)' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Seleccioná una zona</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Interactuá con el mapa anatómico de la izquierda para ver los principios activos relacionados.</p>
                  </div>
                ) : !selectedDrugDetails ? (
                  // VISTA 1: Lista de medicamentos de la zona anatómica
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.3s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
                      <div style={{ backgroundColor: `${selectedCategory.colorHex}`, padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={selectedCategory.iconPath} alt={selectedCategory.name} style={{ width: '32px', height: '32px' }} onError={(e) => e.target.style.display = 'none'} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text)' }}>{selectedCategory.name}</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>{selectedCategory.description}</p>
                      </div>
                    </div>
                    
                    <h4 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>Principios Activos Frecuentes:</h4>
                    {selectedCategory.drugs.map((drug, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setSelectedDrugDetails(drug)}
                        style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem', cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: 'var(--text)', fontSize: '1.1rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = selectedCategory.iconColor; e.currentTarget.style.color = selectedCategory.iconColor; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
                      >
                        {drug.name}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    ))}
                  </div>
                ) : (
                  // VISTA 2: Ficha Técnica Médica del Medicamento Seleccionado
                  <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <button 
                      onClick={() => setSelectedDrugDetails(null)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600, padding: 0, marginBottom: '2rem', transition: 'color 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.color = selectedCategory.iconColor}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      Volver a la lista de {selectedCategory.name}
                    </button>

                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 2rem 0' }}>{selectedDrugDetails.name}</h1>
                    
                    <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}>
                      <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem', borderLeft: `4px solid ${selectedCategory.iconColor}` }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedCategory.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                          Acción Terapéutica
                        </h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>{selectedDrugDetails.accion}</p>
                      </div>

                      <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem', borderLeft: `4px solid ${selectedCategory.iconColor}` }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedCategory.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                          Indicaciones
                        </h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>{selectedDrugDetails.indicaciones}</p>
                      </div>

                      {selectedDrugDetails.efectos && (
                        <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem', borderLeft: '4px solid #f59e0b' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                            Efectos Secundarios Comunes
                          </h4>
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>{selectedDrugDetails.efectos}</p>
                        </div>
                      )}

                      {selectedDrugDetails.contraindicaciones && (
                        <div style={{ padding: '1.5rem', backgroundColor: '#fff1f2', borderRadius: '1rem', borderLeft: '4px solid #e11d48' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                            Contraindicaciones
                          </h4>
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>{selectedDrugDetails.contraindicaciones}</p>
                        </div>
                      )}

                      {selectedDrugDetails.embarazo && (
                        <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '1rem', borderLeft: '4px solid #10b981' }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                            Embarazo y Lactancia
                          </h4>
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>{selectedDrugDetails.embarazo}</p>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => {
                        setSearchTerm(selectedDrugDetails.name);
                        setActiveTab('inicio');
                        setSelectedDrugDetails(null);
                        setSelectedCategory(null);
                        setTimeout(() => handleSearchSubmit({ preventDefault: () => {} }), 100);
                      }}
                      style={{ width: '100%', padding: '1.5rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '1rem', border: 'none', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', transition: 'background-color 0.2s', marginTop: 'auto' }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--primary-dark)'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      Buscar precios de {selectedDrugDetails.name}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Separador */}
            <div style={{ maxWidth: '1200px', margin: '4rem auto', borderBottom: '1px solid var(--border)' }}></div>

            {/* Antigua Grilla de Categorías */}
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--text)', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Explorar por Especialidad</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
              {diccionarioAnatomico.map((category) => {
                const topDrugs = category.drugs.slice(0, 2);
                const remainingCount = category.drugs.length - topDrugs.length;
                
                return (
                  <div 
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedDrugDetails(null);
                      document.getElementById('anatomy-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ backgroundColor: 'var(--surface)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid var(--border)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s', position: 'relative', overflow: 'hidden' }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05)'; }}
                  >
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', backgroundColor: category.iconColor, opacity: 0.05, borderBottomLeftRadius: '100%', pointerEvents: 'none' }}></div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ backgroundColor: `${category.colorHex}`, padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={category.iconPath} alt={category.name} style={{ width: '32px', height: '32px' }} onError={(e) => { e.target.style.display = 'none' }} />
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text)', fontWeight: 800 }}>{category.name}</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {topDrugs.map((drug, idx) => (
                        <div key={idx} style={{ backgroundColor: 'var(--background)', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.9rem', color: 'var(--text)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
                          {drug.name}
                        </div>
                      ))}
                      {remainingCount > 0 && (
                        <div style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                          + {remainingCount} principios más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB: OFERTAS (CALENDARIO DE DESCUENTOS) ===================== */}
        {activeTab === 'ofertas' && (
          <div className="tab-content" style={{ animation: 'fadeIn 0.3s' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <h2 style={{ color: 'var(--text)', fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Radar de <span style={{ color: 'var(--error)' }}>Beneficios</span> 💳</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Maximizá tus ahorros aprovechando alianzas con tarjetas, seguros, cooperativas y días especiales de cada cadena.</p>
            </div>

            {/* Filtros de Categoría (Perfil de Ahorro) - Glassmorphism */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setOfferCategory('bancos')}
                style={{
                  padding: '0.8rem 1.8rem',
                  borderRadius: '1rem',
                  border: offerCategory === 'bancos' ? '1px solid rgba(255,255,255,0.9)' : '1px solid rgba(200,200,200,0.3)',
                  backgroundColor: offerCategory === 'bancos' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(245, 245, 245, 0.5)',
                  backdropFilter: 'blur(10px)',
                  color: offerCategory === 'bancos' ? 'var(--primary-dark)' : 'var(--text-muted)',
                  fontWeight: offerCategory === 'bancos' ? 800 : 600,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  boxShadow: offerCategory === 'bancos' ? '0 8px 32px 0 rgba(16, 185, 129, 0.15)' : '0 4px 15px 0 rgba(31, 38, 135, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  transform: offerCategory === 'bancos' ? 'translateY(-2px)' : 'none'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                Bancos y Tarjetas
              </button>
              <button
                onClick={() => setOfferCategory('seguros')}
                style={{
                  padding: '0.8rem 1.8rem',
                  borderRadius: '1rem',
                  border: offerCategory === 'seguros' ? '1px solid rgba(255,255,255,0.9)' : '1px solid rgba(200,200,200,0.3)',
                  backgroundColor: offerCategory === 'seguros' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(245, 245, 245, 0.5)',
                  backdropFilter: 'blur(10px)',
                  color: offerCategory === 'seguros' ? '#00358e' : 'var(--text-muted)',
                  fontWeight: offerCategory === 'seguros' ? 800 : 600,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  boxShadow: offerCategory === 'seguros' ? '0 8px 32px 0 rgba(0, 85, 196, 0.15)' : '0 4px 15px 0 rgba(31, 38, 135, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  transform: offerCategory === 'seguros' ? 'translateY(-2px)' : 'none'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                Seguros Médicos
              </button>
              <button
                onClick={() => setOfferCategory('cooperativas')}
                style={{
                  padding: '0.8rem 1.8rem',
                  borderRadius: '1rem',
                  border: offerCategory === 'cooperativas' ? '1px solid rgba(255,255,255,0.9)' : '1px solid rgba(200,200,200,0.3)',
                  backgroundColor: offerCategory === 'cooperativas' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(245, 245, 245, 0.5)',
                  backdropFilter: 'blur(10px)',
                  color: offerCategory === 'cooperativas' ? '#004b2b' : 'var(--text-muted)',
                  fontWeight: offerCategory === 'cooperativas' ? 800 : 600,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  boxShadow: offerCategory === 'cooperativas' ? '0 8px 32px 0 rgba(0, 118, 68, 0.15)' : '0 4px 15px 0 rgba(31, 38, 135, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  transform: offerCategory === 'cooperativas' ? 'translateY(-2px)' : 'none'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Cooperativas
              </button>
              <button
                onClick={() => setOfferCategory('eventos')}
                style={{
                  padding: '0.8rem 1.8rem',
                  borderRadius: '1rem',
                  border: offerCategory === 'eventos' ? '1px solid rgba(255,255,255,0.9)' : '1px solid rgba(200,200,200,0.3)',
                  backgroundColor: offerCategory === 'eventos' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(245, 245, 245, 0.5)',
                  backdropFilter: 'blur(10px)',
                  color: offerCategory === 'eventos' ? '#e3000f' : 'var(--text-muted)',
                  fontWeight: offerCategory === 'eventos' ? 800 : 600,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  boxShadow: offerCategory === 'eventos' ? '0 8px 32px 0 rgba(227, 0, 15, 0.15)' : '0 4px 15px 0 rgba(31, 38, 135, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  transform: offerCategory === 'eventos' ? 'translateY(-2px)' : 'none'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Eventos de Cadenas
              </button>
            </div>

            {/* Selector de Días (Se muestra para Bancos y Eventos) */}
            {(offerCategory === 'bancos' || offerCategory === 'eventos') && (
              <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {diasSemana.map((dia) => {
                  const isSelected = selectedDay === dia.id;
                  const isToday = new Date().getDay() === dia.id;
                  
                  return (
                    <button
                      key={dia.id}
                      onClick={() => setSelectedDay(dia.id)}
                      style={{
                        padding: '0.8rem 1.5rem',
                        borderRadius: '2rem',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface)',
                        color: isSelected ? 'white' : 'var(--text)',
                        boxShadow: isSelected ? '0 4px 15px rgba(16, 185, 129, 0.3)' : '0 2px 5px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <span>{dia.name}</span>
                      {isToday && <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--primary)', fontWeight: 800, letterSpacing: '1px' }}>Hoy</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tarjetas de Ofertas para la Categoría y Día Seleccionado */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
              {alianzasDescuentos.filter(oferta => oferta.category === offerCategory && ((offerCategory !== 'bancos' && offerCategory !== 'eventos') || oferta.dayIds.includes(selectedDay))).length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', backgroundColor: 'var(--surface)', borderRadius: '1.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '1rem' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No hay alianzas registradas para este día</h3>
                  <p>Seleccioná otro día de la semana para ver más descuentos.</p>
                </div>
              ) : (
                alianzasDescuentos
                  .filter(oferta => oferta.category === offerCategory && ((offerCategory !== 'bancos' && offerCategory !== 'eventos') || oferta.dayIds.includes(selectedDay)))
                  .map((oferta) => {
                    const isLongDiscount = oferta.discount.includes(' al ');
                    return (
                    <div 
                      key={oferta.id} 
                      style={{ 
                        backgroundColor: oferta.bankColor,
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', backgroundColor: oferta.bankHighlight || '#ffffff', opacity: 0.2, borderBottomLeftRadius: '100%', pointerEvents: 'none' }}></div>
                      
                      <div style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ backgroundColor: 'white', color: oferta.bankColor, padding: '0.4rem 1rem', borderRadius: '2rem', fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {oferta.bank}
                          </span>
                        </div>
                        
                        <div>
                          <h3 style={{ color: 'white', fontSize: isLongDiscount ? '2.8rem' : '3.5rem', fontWeight: 900, margin: '1rem 0 0 0', lineHeight: 1 }}>{oferta.discount}</h3>
                          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', fontWeight: 600 }}>de ahorro</span>
                        </div>

                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', margin: 0 }}>Válido pagando con:<br/><strong style={{ color: 'white' }}>{oferta.type}</strong></p>
                      </div>

                      <div style={{ backgroundColor: oferta.pharmacyColor, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'white', fontSize: '1rem', opacity: 0.8 }}>Exclusivo en:</span>
                        <h4 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{oferta.pharmacy}</h4>
                      </div>
                    </div>
                  )})
              )}
            </div>
          </div>
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

      {/* Footer / Disclaimer */}
      <footer className="app-footer" style={{ marginTop: '5rem', padding: '3rem 0', backgroundColor: '#0f172a', color: '#94a3b8' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>El objetivo de Kura es contribuir al ahorro en tus gastos de salud. </span> 
            Somos una plataforma de búsqueda y comparación de precios, no una farmacia ni un proveedor médico. Los precios y la disponibilidad mostrados son estimaciones basadas en información pública y pueden no reflejar actualizaciones en tiempo real. El precio final y el stock real están sujetos a variaciones en el mostrador dependiendo de la sucursal, políticas internas o la presentación exacta del medicamento. Te recomendamos verificar el precio directamente con la farmacia antes de tu compra.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
