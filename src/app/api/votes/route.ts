import { NextResponse } from "next/server";

import { supabaseRoute, type SupabaseRouteResult } from "@/lib/supabaseRoute";

type SessionUser = NonNullable<SupabaseRouteResult["session"]>["user"];

function assertUserSession(session: SupabaseRouteResult["session"]): SessionUser | null {
    if (!session || !session.user || !session.access_token) {
        return null;
    }

    if (session.expires_at && session.expires_at <= Math.floor(Date.now() / 1000)) {
        return null;
    }

    return session.user;
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
    const user = assertUserSession(session);

    if (!user) {
        return NextResponse.json({ message: "Authentification requise" }, { status: 401 });
    }

    const { data: existingVote, error: existingError } = await supabase
        .from("votes")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

    if (existingError) {
        return NextResponse.json({ message: "Impossible de vérifier tes likes" }, { status: 500 });
    }

    if (existingVote) {
        return NextResponse.json({ message: "Tu as déjà liké cette paire." }, { status: 409 });
    }

    const { error: insertError } = await supabase
        .from("votes")
        .insert({ user_id: user.id, product_id: productId });

    if (insertError) {
        return NextResponse.json({ message: "Erreur lors du vote, réessaie." }, { status: 500 });
    }

    const { count } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("product_id", productId);

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

    if (countError) {
        return NextResponse.json({ message: "Impossible de récupérer les votes" }, { status: 500 });
    }

    let userVoted = false;
    const user = assertUserSession(session);

    if (user) {
        const { data: userVotes, error: userVoteError } = await supabase
            .from("votes")
            .select("id")
            .eq("user_id", user.id)
            .eq("product_id", productId)
            .limit(1);

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
    const user = assertUserSession(session);

    if (!user) {
        return NextResponse.json({ message: "Authentification requise" }, { status: 401 });
    }

    const { data: existingVote, error: fetchError } = await supabase
        .from("votes")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

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

    if (deleteError) {
        return NextResponse.json({ message: "Erreur lors du retrait du like" }, { status: 500 });
    }

    const { count } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("product_id", productId);

    return NextResponse.json({ message: "Ton like a bien été retiré.", votes: count ?? 0 });
}
