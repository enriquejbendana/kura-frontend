import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkMerge() {
  const queryToFetch = 'plidan';
  const cleanTerm = 'plidan';
  const searchTokens = cleanTerm.toLowerCase().split(/\s+/);
  const requiredTokens = searchTokens.filter(t => /^\d+$/.test(t));

  const { data: dbProducts } = await supabase
    .from('medicamentos_cache')
    .select('*')
    .or(`commercial_name.ilike.%${queryToFetch}%`);

  let rawData = [];
  const grouped = {};
  dbProducts.forEach(p => {
     if (!grouped[p.commercial_name]) {
        grouped[p.commercial_name] = {
           id: p.id,
           commercialName: p.commercial_name,
           composition: '---',
           laboratory: 'Desconocido',
           details: '',
           imageUrl: p.image_url,
           clicks: 0,
           prices: []
        };
     }
     grouped[p.commercial_name].prices.push({
         pharmacy: { id: p.pharmacy_id, name: p.pharmacy_id, class: p.pharmacy_id },
         price: p.price,
         originalName: p.commercial_name,
         url: null
     });
  });
  rawData = Object.values(grouped);

  const existingGrouped = {};
  rawData.forEach(item => {
    const groupingKey = item.id;
    existingGrouped[groupingKey] = {
       id: item.id,
       commercialName: item.commercialName,
       composition: item.composition,
       laboratory: item.laboratory,
       details: item.details,
       imageUrl: item.imageUrl,
       clicks: 0,
       prices: [],
       sortedPrices: [],
       relevanceScore: 1
    };
    item.prices.forEach(p => {
      existingGrouped[groupingKey].sortedPrices.push({ ...p, originalName: item.commercialName });
    });
  });

  const liveRes = await fetch('https://kura-api-mm3u.onrender.com/api/live-search?q=plidan');
  const liveData = await liveRes.json();
  const liveDataResults = liveData.results;

  liveDataResults.forEach(item => {
    const priceObj = item.prices[0];
    if (!priceObj) return;
    const pharmacyId = priceObj.pharmacy.id;
    const price = priceObj.price;
    let phName = pharmacyId;
    if (phName === 'catedral') phName = 'Farmacias Catedral';
    if (phName === 'farmaoliva') phName = 'Farmaoliva';

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

  const merged = Object.values(existingGrouped).map(product => {
    const uniquePrices = {};
    product.sortedPrices.forEach(p => {
       const pid = p.pharmacy.id.toLowerCase().replace('-', '_');
       if (!uniquePrices[pid] || uniquePrices[pid].price > p.price) {
           uniquePrices[pid] = { ...p, pharmacy: { ...p.pharmacy, id: pid, class: pid } };
       }
    });
    const sortedPrices = Object.values(uniquePrices).sort((a, b) => a.price - b.price);
    return { ...product, sortedPrices };
  });

  const finalFiltered = merged.filter(product => {
      const name = product.commercialName.toLowerCase();
      return requiredTokens.every(req => name.includes(req));
  });

  console.log('Final results count:', finalFiltered.length);
  finalFiltered.forEach(f => {
    console.log('Name:', f.commercialName, 'Relevance:', f.relevanceScore, 'Prices:', f.sortedPrices.map(p => p.pharmacy.name + ': ' + p.price));
  });
}
checkMerge();
