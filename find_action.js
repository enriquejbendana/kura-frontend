import * as cheerio from 'cheerio';
async function run() {
    const res = await fetch("https://www.farmaoliva.com.py/catalogo?q=micolis", {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const micolisIndex = html.toLowerCase().indexOf('micolis');
    if (micolisIndex > -1) {
        console.log("Encontrado! HTML alrededor:");
        console.log(html.substring(Math.max(0, micolisIndex - 300), micolisIndex + 700));
    } else {
        console.log("No se encontró 'micolis' en todo el HTML!");
    }
}
run();
