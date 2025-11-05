// js/supabaseClient.js
const SUPABASE_URL = "https://quxapvhqutuvejxyclzk.supabase.co";
const SUPABASE_ANON_KEY = "<eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eGFwdmhxdXR1dmVqeHljbHprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDM1MjksImV4cCI6MjA3Nzg3OTUyOX0.mL-Qgsy1e7RrellB-n-kgvV5NWZCQRux1dAFig2ljPc>";

// La librería @supabase/supabase-js debe estar cargada antes (CDN).
window.supabase = window.supabase || supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);