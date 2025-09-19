import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "./supabaseEnv";

export type SupabaseRouteResult = {
    supabase: SupabaseClient;
    session: Session | null;
};

export async function supabaseRoute(): Promise<SupabaseRouteResult> {
    const { url, anonKey } = getSupabaseEnv();
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const supabaseAuthCookies = allCookies
        .map((cookie) => cookie.name)
        .filter((name) => name.includes("sb-"));

    console.debug("[supabaseRoute] cookies available", {
        total: allCookies.length,
        supabaseAuthCookies,
    });

    const supabase = createRouteHandlerClient(
        { cookies: () => cookieStore },
        {
            supabaseUrl: url,
            supabaseKey: anonKey,
        }
    );

    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    console.debug("[supabaseRoute] session resolved", {
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        expiresAt: session?.expires_at ?? null,
        hasUser: !!session?.user,
        hasError: !!error,
        errorMessage: error?.message,
    });

    return { supabase, session: session ?? null };
}
