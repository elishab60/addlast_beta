"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function ProposePairForm() {
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [cooldown, setCooldown] = useState<Date | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    }, []);

    // Vérifier la date de dernière soumission
    useEffect(() => {
        if (!user) return;
        const checkLastSubmission = async () => {
            const { data, error } = await supabase
                .from("submissions")
                .select("created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error(error);
                return;
            }

            if (data?.created_at) {
                const last = new Date(data.created_at);
                const now = new Date();
                const next = new Date(last.getTime() + 90 * 24 * 3600 * 1000);
                if (next > now) setCooldown(next);
            }
        };
        checkLastSubmission();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!user) {
            toast.error("Connecte-toi pour proposer une paire.");
            return;
        }
        if (cooldown) {
            toast.error("Tu peux proposer une seule paire tous les 3 mois.");
            return;
        }
        if (message.trim().length < 20) {
            setError("Merci d'écrire un message détaillé (20 caractères minimum).");
            return;
        }

        setLoading(true);

        const { error } = await supabase.from("submissions").insert({
            user_id: user.id,
            message,
        });

        setLoading(false);

        if (!error) {
            toast.success("Merci ! Ta proposition a bien été envoyée.");
            setMessage("");
            setCooldown(new Date(Date.now() + 90 * 24 * 3600 * 1000));
        } else {
            toast.error("Erreur : " + error.message);
        }
    };

    if (!user) {
        return (
            <div className="text-center py-12">
                <div className="mb-6 font-semibold text-xl">
                    Connecte-toi pour proposer une paire !
                </div>
                <Button asChild>
                    <a href="/sign-in">Se connecter</a>
                </Button>
            </div>
        );
    }

    if (cooldown) {
        return (
            <div className="text-center py-12">
                <div className="mb-3 font-bold text-xl">Merci pour ta participation !</div>
                <div className="text-gray-600">
                    Tu pourras proposer une nouvelle paire à partir du{" "}
                    <b>{cooldown.toLocaleDateString("fr-FR")}</b>.
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg mx-auto my-10"
        >
            <h2 className="font-bold text-2xl mb-6 text-center">Proposer une paire</h2>

            <div className="mb-6">
                <label className="block font-semibold mb-2">Message et références</label>
                <Textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Explique ton inspiration, liens, description, pourquoi cette paire mérite de revenir…"
                    required
                />
                <div className="text-sm text-gray-500 mt-1">
                    Liens, références, texte libre. 20 caractères min.
                </div>
            </div>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Envoi..." : "Envoyer la proposition"}
            </Button>
        </form>
    );
}
