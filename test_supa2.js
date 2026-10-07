import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const content = fs.readFileSync('src/lib/supabase.js', 'utf8');
const urlMatch = content.match(/createClient\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/);

if (urlMatch) {
  const supabase = createClient(urlMatch[1], urlMatch[2]);
  
  async function test() {
    const {data: bData} = await supabase.from('medicamentos_cache').select('commercial_name').ilike('commercial_name', '%biogramon%').limit(5);
    console.log('Biogramon:', bData);
    
    const {data: kData} = await supabase.from('medicamentos_cache').select('commercial_name').ilike('commercial_name', '%kitadol%').limit(5);
    console.log('Kitadol:', kData);
  }
  
  test();
}
