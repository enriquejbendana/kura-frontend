import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixData() {
  // 1. Revertir el Kitadol original (ID 1)
  await supabase
    .from('products')
    .update({ 
      commercial_name: 'Kitadol',
      composition: 'Paracetamol 500mg',
      active_principle_id: 'paracetamol'
    })
    .eq('id', '1');

  // 2. Corregir el Kitadol Forte (ID 5) que era el verdadero problema
  await supabase
    .from('products')
    .update({ 
      composition: 'Ibuprofeno 800mg',
      active_principle_id: 'ibuprofeno'
    })
    .eq('id', '5');

  console.log("Datos corregidos!");
}

fixData();
