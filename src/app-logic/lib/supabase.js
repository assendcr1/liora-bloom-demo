import { createClient } from "@supabase/supabase-js";

const _u = "https://owznaqqxubgjoakhhptg.supabase.co";
const _k = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93em5hcXF4dWJnam9ha2hocHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjU3NTIsImV4cCI6MjA4NjMwMTc1Mn0.jRDy5qgsFudqlOU_HwPE8iYUbPIQhRrM7Kr9qy7QU_Y";

// Adding configuration to stabilize the connection during uploads
export const supabase = createClient(_u, _k, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: true,
  }
});

console.log("✅ Database Engine: Connected");