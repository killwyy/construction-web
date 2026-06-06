import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gxultblluzqrlppnhhuz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4dWx0YmxsdXpxcmxwcG5oaHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTQ5NjgsImV4cCI6MjA4NjI5MDk2OH0.HvlhmBaCT8gwTeoXUulYTyhimCrvzW4sySUCQOXL_X8';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listColumns() {
  const { data: installCols, error: err1 } = await supabase.rpc('get_table_columns', { table_name: 'install_requests' });
  console.log('install_requests columns:', installCols, err1);

  // If RPC is not available, we can try querying information_schema via a standard select if supabase allows it, or just use another method.
  // Let's run a select with a non-existent column to see if it lists columns in the error, or query postgrest.
  const { data, error } = await supabase.from('install_requests').select('non_existent_column_name');
  console.log('Error hint:', error);
}

listColumns();
