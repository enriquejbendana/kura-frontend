import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

async function checkSupabase() {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
        console.log("Credenciales no encontradas.");
        return;
    }

    const supabase = createClient(url, key);
    const tables = ['pharmacies', 'active_principles', 'products', 'product_prices', 'discounts'];
    
    console.log(`Conectado al proyecto: ${url}\n`);
    console.log("=== Resumen de Datos ===");
    
    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        
        if (error) {
            console.log(`- ${table}: Error (${error.message})`);
        } else {
            console.log(`- ${table}: ${count} fila(s)`);
        }
    }
}
checkSupabase();
