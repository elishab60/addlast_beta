// src/lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export function supabaseServer() {
    try {
        // Lit les cookies Next et tes env NEXT_PUBLIC_* automatiquement
        return createServerComponentClient({ cookies });
    } catch (error) {
        console.warn('⚠️ Supabase server client initialization failed. Using fallback.', error);
        // Fallback client for build time
        return null;
    }
}
