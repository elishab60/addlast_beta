import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseEnv } from "./supabaseEnv";

export async function supabaseRoute() {
    getSupabaseEnv();
    const cookieStore = await cookies();
    return createRouteHandlerClient({
        cookies: () => cookieStore,
    });
}
