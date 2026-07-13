import * as cheerio from 'cheerio';

// Helper function to extract numbers
const extractNumber = (str) => {
    if (!str) return null;
    const num = parseInt(str.replace(/[^\d]/g, ''), 10);
    return isNaN(num) ? null : num;
};

// Farmacenter Scraper (HTML)
async function scrapeFarmacenter(query) {
    try {
        const res = await fetch(`https://www.farmacenter.com.py/catalogo?q=${encodeURIComponent(query)}`);
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
                const priceMatches = cardText.match(/\d[\d\.,]*/g);
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
        const res = await fetch(`https://www.farmatotal.com.py/catalogo?q=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const html = await res.text();
        const $ = cheerio.load(html);
        const results = [];
        
        $('.product-wrapper, .product, .card').each((i, el) => {
            const titleEl = $(el).find('.product-title, h2, h3').first();
            const priceEl = $(el).find('.price, .amount, .precio').first();
            const imgEl = $(el).find('img').first();
            
            if (titleEl.length && priceEl.length) {
                const title = titleEl.text().trim();
                const priceText = priceEl.text().trim();
                const price = extractNumber(priceText);
                const imageUrl = imgEl.attr('src');
                
                if (price && title) {
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
        const res = await fetch(`https://www.farmaoliva.com.py/catalogo?q=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const html = await res.text();
        const $ = cheerio.load(html);
        const results = [];
        
        $('.ecommercepro-LoopProduct-link, .product, .card').each((i, el) => {
            const title = $(el).attr('title') || $(el).find('h2, h3, .product-title').text().trim();
            const priceEl = $(el).find('.price, .amount, .precio').first();
            const imgEl = $(el).find('img').first();
            
            if (title && priceEl.length) {
                const priceText = priceEl.text().trim();
                const price = extractNumber(priceText);
                const imageUrl = imgEl.attr('src');
                
                if (price) {
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
        const res = await fetch(`https://www.farmaciacatedral.com.py/get-productos?page=1&query_string=${encodeURIComponent(query)}`);
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

    // Fetch all pharmacies in parallel
    const [fc, ft, fo, cat] = await Promise.all([
        scrapeFarmacenter(q),
        scrapeFarmaTotal(q),
        scrapeFarmaoliva(q),
        scrapeCatedral(q)
    ]);

    const allResults = [...fc, ...ft, ...fo, ...cat];
    
    // We send the raw results back to the client immediately.
    // The client can display them, and we could also insert them into Supabase in the background.
    
    return res.status(200).json({
        success: true,
        query: q,
        total: allResults.length,
        results: allResults
    });
}
