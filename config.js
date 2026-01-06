// config.js
const SUPABASE_URL = "https://ndkwlfyqbbkohhccsijm.supabase.co";
const SUPABASE_KEY = "sb_publishable_4nqx9VwhGrgLA0RzQCDHFg_8eaLvIDn";

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);