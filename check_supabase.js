import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRecords() {
  console.log('Checking Supabase connection...');
  const { data, error } = await supabase
    .from('records')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error fetching records:', error.message);
  } else {
    console.log('Successfully fetched records count:', data.length);
    console.log('Records:', JSON.stringify(data, null, 2));
  }
}

checkRecords();
