import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env de la raíz
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan las variables de entorno de Supabase.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Datos quemados para migrar (se importarán dinámicamente)
async function runMigration() {
  console.log("Iniciando migración automática a Supabase...");
  
  try {
    // 1. Migrar Farmacias
    const { cadenasFarmacias } = await import('../src/data/cadenasFarmacias.js');
    console.log(`Migrando ${cadenasFarmacias.length} farmacias...`);
    
    for (const farma of cadenasFarmacias) {
      await supabase.from('pharmacies').upsert({
        id: farma.id,
        name: farma.name,
        logo: farma.logo
      });
    }
    
    // 2. Migrar Descuentos
    const { alianzasDescuentos } = await import('../src/data/ofertasBancarias.js');
    console.log(`Migrando ${alianzasDescuentos.length} descuentos...`);
    
    for (const desc of alianzasDescuentos) {
      // Necesitamos enlazar con la farmacia. Asumimos que los nombres coinciden en ID.
      let pharmacy_id = null;
      if (desc.pharmacy.toLowerCase().includes('punto')) pharmacy_id = 'punto-farma';
      else if (desc.pharmacy.toLowerCase().includes('catedral')) pharmacy_id = 'catedral';
      else if (desc.pharmacy.toLowerCase().includes('farmaoliva')) pharmacy_id = 'farmaoliva';
      else if (desc.pharmacy.toLowerCase().includes('farmacenter')) pharmacy_id = 'farmacenter';
      else if (desc.pharmacy.toLowerCase().includes('scavone')) pharmacy_id = 'vicente-scavone';
      else if (desc.pharmacy.toLowerCase().includes('total')) pharmacy_id = 'farmatotal';
      
      await supabase.from('discounts').upsert({
        id: desc.id,
        category: desc.category,
        bank: desc.bank,
        bank_color: desc.bankColor,
        bank_highlight: desc.bankHighlight,
        pharmacy_id: pharmacy_id,
        pharmacy_color: desc.pharmacyColor,
        discount: desc.discount,
        type: desc.type,
        day_ids: desc.dayIds
      });
    }

    // 3. Migrar Principios Activos
    const { drugDictionary } = await import('../src/drugDictionary.js');
    console.log(`Migrando categorías de principios activos...`);
    
    for (const categoryObj of drugDictionary) {
      for (const drug of categoryObj.drugs) {
        // Generar un ID simple a partir del nombre
        const activePrincipleId = drug.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await supabase.from('active_principles').upsert({
          id: activePrincipleId,
          name: drug.name,
          description: drug.action,
          uses: categoryObj.category, // Usamos la categoría como "usos"
          warnings: drug.warnings
        });
      }
    }

    // 4. Migrar Productos y Precios
    const { MOCK_PRODUCTS } = await import('../src/mockData.js');
    console.log(`Migrando ${MOCK_PRODUCTS.length} productos base...`);
    
    for (const product of MOCK_PRODUCTS) {
      // Intentar vincular a un principio activo basado en la composición
      let activePrincipleId = null;
      for (const categoryObj of drugDictionary) {
         for (const drug of categoryObj.drugs) {
            if (product.composition.toLowerCase().includes(drug.name.toLowerCase())) {
               activePrincipleId = drug.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
               break;
            }
         }
         if (activePrincipleId) break;
      }

      await supabase.from('products').upsert({
        id: product.id.toString(),
        commercial_name: product.commercialName,
        laboratory: product.laboratory,
        composition: product.composition,
        details: product.details,
        image_url: product.imageUrl || null,
        active_principle_id: activePrincipleId
      });

      if (product.prices && product.prices.length > 0) {
        for (const priceObj of product.prices) {
          await supabase.from('product_prices').upsert({
            product_id: product.id.toString(),
            pharmacy_id: priceObj.pharmacy.id,
            price: priceObj.price
          });
        }
      }
    }
    
    console.log("¡Migración completada con éxito!");
    
  } catch (error) {
    console.error("Error durante la migración:", error);
  }
}

runMigration();
