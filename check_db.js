import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function checkSupabase() {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    
    try {
        const response = await fetch(`${url}/rest/v1/?apikey=${key}`);
        const data = await response.json();
        
        console.log("=== Tablas en Supabase ===");
        if (data && data.definitions) {
            const tables = Object.keys(data.definitions);
            console.log(tables.join('\n'));
        } else {
            console.log("No se encontraron tablas o el acceso fue denegado.");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}
checkSupabase();
