import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
  
async function test() {
    const {data: kData} = await supabase.from('medicamentos_cache').select('*').ilike('commercial_name', '%kitadol%').limit(5);
    console.log('Kitadol:', JSON.stringify(kData, null, 2));
}
  
test();
