import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://aujegmilkwsmwpzrfdaf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1amVnbWlsa3dzbXdwenJmZGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTcwNTcsImV4cCI6MjA0ODQ5MzA1N30.hW7OU9a47GjMURDOK_DSjWUx6s9gOoJOosidOFYP6-M";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);