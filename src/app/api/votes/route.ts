import { NextResponse } from "next/server";
import { supabaseRoute } from "@/lib/supabaseRoute";
import { evaluateVoteEligibility, VoteRecord } from "@/lib/voteRules";

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

    const supabase = supabaseRoute();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ message: "Authentification requise" }, { status: 401 });
    }

    const { data: history, error: historyError } = await supabase
        .from("votes")
        .select("product_id, created_at")
        .eq("user_id", user.id);

    if (historyError) {
        return NextResponse.json({ message: "Impossible de vérifier tes votes" }, { status: 500 });
    }

    const evaluation = evaluateVoteEligibility((history as VoteRecord[]) ?? [], productId);

    if (!evaluation.canVote) {
        const message =
            evaluation.reason === "duplicate"
                ? "Tu as déjà voté pour cette paire ce mois-ci !"
                : "Tu as atteint la limite de 2 votes ce mois-ci.";
        return NextResponse.json({ message }, { status: 409 });
    }

    const { error: insertError } = await supabase.from("votes").insert({ user_id: user.id, product_id: productId });

    if (insertError) {
        return NextResponse.json({ message: "Erreur lors du vote, réessaie." }, { status: 500 });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const { count } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("product_id", productId)
        .gte("created_at", thirtyDaysAgo);

    return NextResponse.json({ message: "Ton vote a bien été pris en compte !", votes: count ?? 0 });
}
