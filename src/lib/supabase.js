import { createClient } from "@supabase/supabase-js";

// Detection logic for both Create React App and Vite
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Database credentials not found. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);