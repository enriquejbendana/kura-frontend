import * as cheerio from 'cheerio';

async function analyze(url) {
    try {
        const r = await fetch(url);
        const html = await r.text();
        const $ = cheerio.load(html);
        
        // Find all possible product containers
        const items = $('.card, .product, .item, .info, .caja-producto');
        console.log(`\n=== URL: ${url} ===`);
        console.log('Items found:', items.length);
        
        if(items.length > 0) {
            const el = items.first();
            console.log('HTML sample of first item:\n', el.html().substring(0, 300));
        } else {
            console.log('No items found with common selectors. Page HTML sample:\n', html.substring(0, 500));
        }
    } catch(e) {
        console.error(url, e.message);
    }
}

async function run() {
    await analyze('https://www.farmacenter.com.py/catalogo?q=micolis');
    await analyze('https://www.farmaciacatedral.com.py/catalogo?q=micolis');
    await analyze('https://www.farmatotal.com.py/catalogo?q=micolis');
    await analyze('https://www.farmaoliva.com.py/catalogo?q=micolis');
}

run();
