import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('Testing Cloud Insert...');
  const { data, error } = await supabase
    .from('records')
    .insert([{
      customer_name: 'Terminal Test User',
      customer_id: 'TERM001',
      aadhar_number: '000000000000',
      sl_no: 'T1'
    }])
    .select();

  if (error) {
    console.error('Insert failed:', error.message);
  } else {
    console.log('Insert success!', data);
  }
}

testInsert();
