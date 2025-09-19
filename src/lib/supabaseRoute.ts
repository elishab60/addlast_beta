import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseEnv } from "./supabaseEnv";

export function supabaseRoute() {
    getSupabaseEnv();
    return createRouteHandlerClient({ cookies });
}
