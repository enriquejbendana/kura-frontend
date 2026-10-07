import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function deleteTylenol() {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('commercial_name', 'Tylenol');

  if (error) console.error(error);
  else console.log("Tylenol eliminado de la BD");
}

deleteTylenol();
