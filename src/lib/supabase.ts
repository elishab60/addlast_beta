"use client";

// src/lib/supabase.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseEnv } from "./supabaseEnv";

const { url, anonKey } = getSupabaseEnv();

export const supabase = createClientComponentClient({
    supabaseUrl: url,
    supabaseKey: anonKey,
});
