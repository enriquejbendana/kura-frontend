import * as cheerio from 'cheerio';

const extractNumber = (str) => {
    if (!str) return null;
    const num = parseInt(str.replace(/[^\d]/g, ''), 10);
    return isNaN(num) ? null : num;
};

// Helper for fetch with timeout
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
            ...options.headers
        }
    });
    clearTimeout(id);
    return response;
}

// Farmacenter Scraper (HTML)
async function scrapeFarmacenter(query) {
    try {
        const res = await fetchWithTimeout(`https://www.farmacenter.com.py/catalogo?q=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const html = await res.text();
        const $ = cheerio.load(html);
        const results = [];
        
        $('.info, [class*="product"]').each((i, el) => {
            const titleEl = $(el).find('a.tit h2, .product-title, h3').first();
            const priceEl = $(el).find('.precio.venta .monto, .price').first();
            const imgEl = $(el).parent().find('img').first() || $(el).find('img').first();
            
            if (titleEl.length && priceEl.length) {
                const title = titleEl.text().trim();
                const cardText = $(el).text();
                const priceMatches = cardText.match(/\d[\d.,]*/g);
                const imageUrl = imgEl.attr('data-src') || imgEl.attr('data-original') || imgEl.attr('src');
                
                if (priceMatches && title) {
                    const allPrices = priceMatches.map(str => extractNumber(str)).filter(p => p > 1000);
                    const uniquePrices = [...new Set(allPrices)].sort((a, b) => a - b);
                    if (uniquePrices.length > 0) {
                        results.push({
                            pharmacy_id: 'farmacenter',
                            commercialName: title,
                            price: uniquePrices[0],
                            image_url: imageUrl || null,
                            query
                        });
                    }
                }
            }
        });
        return results;
    } catch (e) {
        console.error('Farmacenter live search error:', e.message);
        return [];
    }
}

// FarmaTotal Scraper (HTML)
async function scrapeFarmaTotal(query) {
    try {
        const res = await fetchWithTimeout(`https://www.farmatotal.com.py/?s=${encodeURIComponent(query)}&post_type=product`);
        if (!res.ok) return [];
        const html = await res.text();
        const $ = cheerio.load(html);
        const results = [];
        
        $('.product-wrapper, .product, .card').each((i, el) => {
            const titleEl = $(el).find('.product-title, h2, h3').first();
            // Evitar tomar precios tachados o múltiples precios concatenados
            const priceEl = $(el).find('.price .woocommerce-Price-amount, .amount, .precio').last(); 
            const imgEl = $(el).find('img').first();
            
            if (titleEl.length && priceEl.length) {
                const title = titleEl.text().trim();
                let priceText = priceEl.text().replace(/\./g, '').trim();
                const priceMatches = priceText.match(/\d+/g);
                const price = priceMatches ? parseInt(priceMatches[priceMatches.length - 1], 10) : null;
                const imageUrl = imgEl.attr('src');
                
                if (price && title && price < 10000000) { // Safety check contra números largos
                    results.push({
                        pharmacy_id: 'farmatotal',
                        commercialName: title,
                        price: price,
                        image_url: imageUrl || null,
                        query
                    });
                }
            }
        });
        return results;
    } catch (e) {
        console.error('FarmaTotal live search error:', e.message);
        return [];
    }
}

// Farmaoliva Scraper (HTML)
async function scrapeFarmaoliva(query) {
    try {
        const res = await fetchWithTimeout(`https://www.farmaoliva.com.py/catalogo?q=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const html = await res.text();
        const $ = cheerio.load(html);
        const results = [];
        
        $('.ecommercepro-LoopProduct-link, .product, .card').each((i, el) => {
            const title = $(el).attr('title') || $(el).find('h2, h3, .product-title').text().trim();
            const priceEl = $(el).find('.price ins .amount, .price .amount, .precio').last();
            const imgEl = $(el).find('img').first();
            
            if (title && priceEl.length) {
                const priceText = priceEl.text().trim();
                const price = extractNumber(priceText);
                const imageUrl = imgEl.attr('src');
                
                if (price && price < 10000000) {
                    results.push({
                        pharmacy_id: 'farmaoliva',
                        commercialName: title,
                        price: price,
                        image_url: imageUrl || null,
                        query
                    });
                }
            }
        });
        return results;
    } catch (e) {
        console.error('Farmaoliva live search error:', e.message);
        return [];
    }
}

// Catedral Scraper (JSON API)
async function scrapeCatedral(query) {
    try {
        const res = await fetchWithTimeout(`https://www.farmaciacatedral.com.py/get-productos?page=1&query_string=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const json = await res.json();
        const results = [];
        
        if (json.paginacion && json.paginacion.data) {
            json.paginacion.data.forEach(item => {
                if (item.nombre && item.getPrecio) {
                    results.push({
                        pharmacy_id: 'catedral',
                        commercialName: item.nombre,
                        price: item.getPrecio,
                        image_url: item.primera_imagen || null,
                        query
                    });
                }
            });
        }
        return results;
    } catch (e) {
        console.error('Catedral live search error:', e.message);
        return [];
    }
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { q } = req.query;
    if (!q || q.length < 3) {
        return res.status(400).json({ error: 'Query too short' });
    }

    console.log(`Live Search triggered for: ${q}`);

    // Fetch all pharmacies in parallel using allSettled to prevent one failure crashing others
    const outcomes = await Promise.allSettled([
        scrapeFarmacenter(q),
        scrapeFarmaTotal(q),
        scrapeFarmaoliva(q),
        scrapeCatedral(q)
    ]);

    let allResults = [];
    outcomes.forEach(outcome => {
        if (outcome.status === 'fulfilled' && outcome.value) {
            allResults = allResults.concat(outcome.value);
        }
    });

    // Filtro anti-basura: Asegurarse de que al menos una palabra clave este en el nombre del producto
    const searchKeywords = q.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    if (searchKeywords.length > 0) {
        allResults = allResults.filter(item => {
            const itemName = item.commercialName.toLowerCase();
            return searchKeywords.some(kw => itemName.includes(kw));
        });
    }

    // Deduplicar resultados exactos (misma farmacia, mismo nombre)
    const uniqueResults = [];
    const seen = new Set();
    allResults.forEach(item => {
        const uniqueKey = `${item.pharmacy_id}-${item.commercialName.toLowerCase().trim()}`;
        if (!seen.has(uniqueKey)) {
            seen.add(uniqueKey);
            uniqueResults.push(item);
        }
    });

    return res.status(200).json({
        success: true,
        query: q,
        total: uniqueResults.length,
        results: uniqueResults
    });
}
