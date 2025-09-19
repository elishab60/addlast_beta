// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./supabaseEnv";

const { url, anonKey } = getSupabaseEnv();

export const supabase = createClient(url, anonKey);
