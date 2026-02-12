import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// This will help us debug once the page loads
console.log("--- Supabase Connection Diagnostic ---");
console.log("URL:", supabaseUrl ? "✅ Loaded" : "❌ MISSING");
console.log("Key:", supabaseAnonKey ? "✅ Loaded" : "❌ MISSING");

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;