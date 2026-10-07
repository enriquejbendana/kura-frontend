import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function updateData() {
  // Cambiar el Kitadol genérico a Kitadol 600 (Ibuprofeno)
  const { error } = await supabase
    .from('products')
    .update({ 
      commercial_name: 'Kitadol 600',
      composition: 'Ibuprofeno 600mg',
      active_principle_id: 'ibuprofeno'
    })
    .eq('commercial_name', 'Kitadol');

  if (error) console.error("Error actualizando Kitadol:", error);
  else console.log("Kitadol actualizado correctamente a Ibuprofeno 600mg.");
}

updateData();
