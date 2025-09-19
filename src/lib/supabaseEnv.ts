const URL_VAR = "NEXT_PUBLIC_SUPABASE_URL" as const;
const KEY_VAR = "NEXT_PUBLIC_SUPABASE_ANON_KEY" as const;

type EnvVars = {
    url: string;
    anonKey: string;
};

export function getSupabaseEnv(): EnvVars {
    const url = process.env[URL_VAR];
    const anonKey = process.env[KEY_VAR];

    const missing = [!url && URL_VAR, !anonKey && KEY_VAR].filter(Boolean) as string[];

    if (missing.length > 0) {
        throw new Error(`Missing Supabase environment variables: ${missing.join(", ")}`);
    }

    return { url: url!, anonKey: anonKey! };
}
