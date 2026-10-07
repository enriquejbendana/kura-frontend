import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixData() {
  // En Paraguay, Kitadol (Lasca) es Ibuprofeno, a diferencia de otros países.
  // Kitadol normal = Ibuprofeno 600mg
  await supabase
    .from('products')
    .update({ 
      commercial_name: 'Kitadol 600',
      composition: 'Ibuprofeno 600mg',
      active_principle_id: 'ibuprofeno'
    })
    .eq('id', '1');

  // Kitadol Forte = Ibuprofeno 400mg
  await supabase
    .from('products')
    .update({ 
      commercial_name: 'Kitadol Forte',
      composition: 'Ibuprofeno 400mg',
      active_principle_id: 'ibuprofeno'
    })
    .eq('id', '5');

  console.log("Datos médicos corregidos de acuerdo a Lasca Paraguay.");
}

fixData();
