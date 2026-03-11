import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gxultblluzqrlppnhhuz.supabase.co'
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4dWx0YmxsdXpxcmxwcG5oaHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTQ5NjgsImV4cCI6MjA4NjI5MDk2OH0.HvlhmBaCT8gwTeoXUulYTyhimCrvzW4sySUCQOXL_X8"

    export const supabase = createClient(supabaseUrl, supabaseAnonKey)