import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://npbtcthkgnalwdtxiifr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wYnRjdGhrZ25hbHdkdHhpaWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2OTg0NjEsImV4cCI6MjA0NzI3NDQ2MX0.va9y_nTzFIeFavpllNnHf_vnhq8PzDkFqDmuLyKFb58';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});