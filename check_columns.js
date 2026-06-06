import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gxultblluzqrlppnhhuz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4dWx0YmxsdXpxcmxwcG5oaHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTQ5NjgsImV4cCI6MjA4NjI5MDk2OH0.HvlhmBaCT8gwTeoXUulYTyhimCrvzW4sySUCQOXL_X8';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCols() {
  const { data: d1, error: e1 } = await supabase.from('install_requests').select('user_id').limit(1);
  console.log('install_requests.user_id:', d1, e1?.message);

  const { data: d2, error: e2 } = await supabase.from('install_requests').select('user_email').limit(1);
  console.log('install_requests.user_email:', d2, e2?.message);

  const { data: d3, error: e3 } = await supabase.from('eval_bookings').select('user_id').limit(1);
  console.log('eval_bookings.user_id:', d3, e3?.message);

  const { data: d4, error: e4 } = await supabase.from('eval_bookings').select('user_email').limit(1);
  console.log('eval_bookings.user_email:', d4, e4?.message);
}

checkCols();
