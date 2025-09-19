import { NextResponse } from "next/server";
import { supabaseRoute, type SupabaseRouteResult } from "@/lib/supabaseRoute";

type SessionUser = NonNullable<NonNullable<SupabaseRouteResult["session"]>["user"]>;

async function getAuthenticatedUser(
    supabase: SupabaseRouteResult["supabase"],
    session: SupabaseRouteResult["session"]
): Promise<SessionUser | null> {
    console.debug("[votes] resolving authenticated user", {
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        expiresAt: session?.expires_at ?? null,
        hasUserOnSession: !!session?.user,
    });

    if (!session || !session.access_token) {
        console.debug("[votes] missing session or access token");
        return null;
    }

    if (session.expires_at && session.expires_at <= Math.floor(Date.now() / 1000)) {
        console.debug("[votes] session expired", { expiresAt: session.expires_at });
        return null;
    }

    if (session.user) {
        console.debug("[votes] session already contains user", {
            userId: session.user.id,
        });
        return session.user as SessionUser;
    }

    const { data, error } = await supabase.auth.getUser(session.access_token);

    if (error || !data?.user) {
        console.debug("[votes] supabase.auth.getUser failed", {
            hasError: !!error,
            errorMessage: error?.message,
            hasUser: !!data?.user,
        });
        return null;
    }

    console.debug("[votes] fetched user from Supabase", {
        userId: data.user.id,
    });

    return data.user as SessionUser;
}

export async function POST(request: Request) {
    let productId: string | undefined;

    try {
        const body = await request.json();
        productId = body?.productId;
    } catch {
        return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
    }

    if (!productId) {
        return NextResponse.json({ message: "productId manquant" }, { status: 400 });
    }

    const { supabase, session } = await supabaseRoute();
    const user = await getAuthenticatedUser(supabase, session);

    console.debug("[votes][POST] request context", {
        productId,
        isAuthenticated: !!user,
        userId: user?.id ?? null,
    });

    if (!user) {
        console.debug("[votes][POST] rejecting unauthenticated request");
        return NextResponse.json({ message: "Authentification requise" }, { status: 401 });
    }

    const { data: existingVote, error: existingError } = await supabase
        .from("votes")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

    console.debug("[votes][POST] existing vote lookup", {
        userId: user.id,
        productId,
        hasExistingVote: !!existingVote,
        hasError: !!existingError,
        errorMessage: existingError?.message,
    });

    if (existingError) {
        return NextResponse.json({ message: "Impossible de vérifier tes likes" }, { status: 500 });
    }

    if (existingVote) {
        return NextResponse.json({ message: "Tu as déjà liké cette paire." }, { status: 409 });
    }

    const { error: insertError } = await supabase
        .from("votes")
        .insert({ user_id: user.id, product_id: productId });

    console.debug("[votes][POST] inserting vote", {
        userId: user.id,
        productId,
        hasInsertError: !!insertError,
        insertErrorMessage: insertError?.message,
    });

    if (insertError) {
        return NextResponse.json({ message: "Erreur lors du vote, réessaie." }, { status: 500 });
    }

    const { count } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("product_id", productId);

    console.debug("[votes][POST] final vote count", { productId, count: count ?? 0 });

    return NextResponse.json({ message: "Ton vote a bien été pris en compte !", votes: count ?? 0 });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
        return NextResponse.json({ message: "productId manquant" }, { status: 400 });
    }

    const { supabase, session } = await supabaseRoute();

    const { count, error: countError } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("product_id", productId);

    console.debug("[votes][GET] product vote count", {
        productId,
        count: count ?? 0,
        hasError: !!countError,
        errorMessage: countError?.message,
    });

    if (countError) {
        return NextResponse.json({ message: "Impossible de récupérer les votes" }, { status: 500 });
    }

    let userVoted = false;
    const user = await getAuthenticatedUser(supabase, session);

    console.debug("[votes][GET] request context", {
        productId,
        isAuthenticated: !!user,
        userId: user?.id ?? null,
    });

    if (user) {
        const { data: userVotes, error: userVoteError } = await supabase
            .from("votes")
            .select("id")
            .eq("user_id", user.id)
            .eq("product_id", productId)
            .limit(1);

        console.debug("[votes][GET] user votes lookup", {
            userId: user.id,
            productId,
            hasVotes: !!(userVotes && userVotes.length > 0),
            hasError: !!userVoteError,
            errorMessage: userVoteError?.message,
        });

        if (userVoteError) {
            return NextResponse.json(
                { message: "Impossible de vérifier tes votes" },
                { status: 500 }
            );
        }

        userVoted = !!(userVotes && userVotes.length > 0);
    }

    return NextResponse.json({ votes: count ?? 0, userVoted });
}

export async function DELETE(request: Request) {
    let productId: string | undefined;

    try {
        const body = await request.json();
        productId = body?.productId;
    } catch {
        return NextResponse.json({ message: "Requête invalide" }, { status: 400 });
    }

    if (!productId) {
        return NextResponse.json({ message: "productId manquant" }, { status: 400 });
    }

    const { supabase, session } = await supabaseRoute();
    const user = await getAuthenticatedUser(supabase, session);

    console.debug("[votes][DELETE] request context", {
        productId,
        isAuthenticated: !!user,
        userId: user?.id ?? null,
    });

    if (!user) {
        return NextResponse.json({ message: "Authentification requise" }, { status: 401 });
    }

    const { data: existingVote, error: fetchError } = await supabase
        .from("votes")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

    console.debug("[votes][DELETE] existing vote lookup", {
        userId: user.id,
        productId,
        hasExistingVote: !!existingVote,
        hasError: !!fetchError,
        errorMessage: fetchError?.message,
    });

    if (fetchError) {
        return NextResponse.json({ message: "Impossible de vérifier tes votes" }, { status: 500 });
    }

    if (!existingVote) {
        return NextResponse.json({ message: "Aucun like récent à retirer" }, { status: 404 });
    }

    const voteId = existingVote.id;
    const { error: deleteError } = await supabase
        .from("votes")
        .delete()
        .eq("id", voteId);

    console.debug("[votes][DELETE] deleting vote", {
        userId: user.id,
        productId,
        voteId,
        hasDeleteError: !!deleteError,
        deleteErrorMessage: deleteError?.message,
    });

    if (deleteError) {
        return NextResponse.json({ message: "Erreur lors du retrait du like" }, { status: 500 });
    }

    const { count } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("product_id", productId);

    console.debug("[votes][DELETE] final vote count", { productId, count: count ?? 0 });

    return NextResponse.json({ message: "Ton like a bien été retiré.", votes: count ?? 0 });
}
