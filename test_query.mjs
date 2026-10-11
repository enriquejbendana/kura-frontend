import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const queryToFetch = 'plidan';
  const { data, error } = await supabase
    .from('medicamentos_cache')
    .select('*')
    .or(`commercial_name.ilike.%${queryToFetch}%`);
    
  console.log('Error:', error);
  console.log('Count:', data ? data.length : 0);
  if (data) {
    data.forEach(d => console.log(d.id, d.pharmacy_id, d.commercial_name, d.price));
  }
}
run();
