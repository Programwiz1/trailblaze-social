// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://alabhuxqqxqtbnhwykls.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYWJodXhxcXhxdGJuaHd5a2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTA0NDAsImV4cCI6MjA1NTI2NjQ0MH0.Epol7d6ffoY3NaNiP0nlKU5EF4BsMV1SVBW1KaiAZLc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);