import * as cheerio from 'cheerio';

async function fetchWithTimeout(url, options = {}, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            ...options.headers
        }
    });
    clearTimeout(id);
    return response;
}

function extractNumber(str) {
    if (!str) return null;
    const matches = str.replace(/\./g, '').match(/\d+/g);
    return matches ? parseInt(matches[matches.length - 1], 10) : null;
}

async function scrapeFarmaTotal(query) {
    try {
        const res = await fetchWithTimeout(`https://www.farmatotal.com.py/?s=${encodeURIComponent(query)}&post_type=product`);
        if (!res.ok) return [];
        const html = await res.text();
        const $ = cheerio.load(html);
        const results = [];
        
        $('.product-wrapper, .product, .card').each((i, el) => {
            const titleEl = $(el).find('.product-title, h2, h3').first();
            const priceEl = $(el).find('.price .woocommerce-Price-amount, .amount, .precio').last(); 
            const imgEl = $(el).find('img').first();
            
            if (titleEl.length && priceEl.length) {
                const title = titleEl.text().trim();
                const price = extractNumber(priceEl.text());
                
                if (price && title) {
                    results.push({
                        pharmacy_id: 'farmatotal',
                        commercialName: title,
                        price: price
                    });
                }
            }
        });
        return results;
    } catch (e) {
        console.error('FarmaTotal error:', e.message);
        return [];
    }
}

async function scrapeFarmaoliva(query) {
    try {
        const res = await fetchWithTimeout(`https://www.farmaoliva.com.py/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        const html = await res.text();
        const $ = cheerio.load(html);
        const results = [];
        
        $('.ecommercepro-LoopProduct-link, .product, .card').each((i, el) => {
            const title = $(el).attr('title') || $(el).find('h2, h3, .product-title').text().trim();
            const priceEl = $(el).find('.price ins .amount, .price .amount, .precio').last();
            
            if (title && priceEl.length) {
                const price = extractNumber(priceEl.text());
                if (price) {
                    results.push({
                        pharmacy_id: 'farmaoliva',
                        commercialName: title,
                        price: price
                    });
                }
            }
        });
        return results;
    } catch (e) {
        console.error('Farmaoliva error:', e.message);
        return [];
    }
}

async function run() {
    const q = 'micolis';
    console.log(`Buscando ${q} en Farmatotal...`);
    const ft = await scrapeFarmaTotal(q);
    console.log(`Farmatotal encontró ${ft.length} productos:`, ft.slice(0, 3));
    
    console.log(`Buscando ${q} en Farmaoliva...`);
    const fo = await scrapeFarmaoliva(q);
    console.log(`Farmaoliva encontró ${fo.length} productos:`, fo.slice(0, 3));
}

run();
