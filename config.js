// config.js
const SUPABASE_URL = "https://ndkwlfyqbbkohhccsijm.supabase.co";
const SUPABASE_KEY = "seyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ka3dsZnlxYmJrb2hoY2NzaWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDc1OTcsImV4cCI6MjA4MzI4MzU5N30.r5vOKPTc65gyoesWuiiT_slt2ldlEX6K0D2bbdS1nZI";

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);