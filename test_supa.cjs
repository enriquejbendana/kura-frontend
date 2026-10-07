const fs = require('fs');
const content = fs.readFileSync('src/lib/supabase.js', 'utf8');
const urlMatch = content.match(/createClient\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/);
if (urlMatch) {
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(urlMatch[1], urlMatch[2]);
  supabase.from('medicamentos_cache').select('commercial_name').ilike('commercial_name', '%biogramon%').limit(5).then(({data, error}) => {
     console.log('Result:', data, error);
  });
}
