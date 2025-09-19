import { cookies } from "next/headers";
import { createClient, type Session } from "@supabase/supabase-js";
import { parseSupabaseCookie } from "@supabase/auth-helpers-shared";

import { getSupabaseEnv } from "./supabaseEnv";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export type SupabaseRouteResult = {
    supabase: ReturnType<typeof createClient>;
    session: Partial<Session> | null;
};

function extractSupabaseSession(cookieStore: CookieStore): Partial<Session> | null {
    const authCookies = cookieStore
        .getAll()
        .filter((cookie) => cookie.name.includes("-auth-token"));

    if (authCookies.length === 0) {
        return null;
    }

    const grouped = new Map<
        string,
        {
            base?: string;
            chunks: { index: number; value: string }[];
        }
    >();

    for (const { name, value } of authCookies) {
        const [prefix, chunkSuffix] = name.split(".");
        const bucket = grouped.get(prefix) ?? { chunks: [] };

        if (chunkSuffix === undefined) {
            bucket.base = value;
        } else {
            const index = Number.parseInt(chunkSuffix, 10);
            if (!Number.isNaN(index)) {
                bucket.chunks.push({ index, value });
            }
        }

        grouped.set(prefix, bucket);
    }

    for (const { base, chunks } of grouped.values()) {
        let serialized = base ?? null;

        if (!serialized && chunks.length > 0) {
            chunks.sort((a, b) => a.index - b.index);
            serialized = chunks.map((chunk) => chunk.value).join("");
        }

        if (!serialized) {
            continue;
        }

        const session = parseSupabaseCookie(serialized);

        if (session?.access_token) {
            return session;
        }
    }

    return null;
}

export async function supabaseRoute(): Promise<SupabaseRouteResult> {
    const { url, anonKey } = getSupabaseEnv();
    const cookieStore = await cookies();
    const session = extractSupabaseSession(cookieStore);

    const supabase = createClient(url, anonKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
        global: {
            headers: session?.access_token
                ? { Authorization: `Bearer ${session.access_token}` }
                : undefined,
        },
    });

    return { supabase, session };
}
