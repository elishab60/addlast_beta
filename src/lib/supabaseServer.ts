// src/lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseEnv } from "./supabaseEnv";

export function supabaseServer() {
    getSupabaseEnv();
    // Lit les cookies Next et tes env NEXT_PUBLIC_* automatiquement
    return createServerComponentClient({ cookies });
}
