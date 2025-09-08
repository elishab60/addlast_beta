"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
            toast.error("Erreur lors de la demande : " + error.message);
        } else {
            toast.success(
                "Un email a été envoyé pour réinitialiser votre mot de passe."
            );
        }
        setLoading(false);
    };

    return (
        <Card className="max-w-md w-full mx-auto shadow-2xl rounded-3xl border-0 bg-white/95">
            <CardHeader className="pt-10 pb-2 flex flex-col items-center gap-2">
        <span className="text-3xl font-black tracking-tight uppercase text-black select-none">
          addlast
        </span>
                <CardTitle className="text-center text-2xl font-extrabold tracking-tight">
                    Mot de passe oublié
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    className="flex flex-col gap-4 mt-4"
                    onSubmit={handleReset}
                    autoComplete="on"
                >
                    <Input
                        type="email"
                        placeholder="Votre email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        className="w-full mt-2 rounded-full font-semibold transition hover:-translate-y-1 hover:shadow-xl"
                        disabled={loading}
                    >
                        {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                    </Button>
                </form>
                <div className="text-sm mt-8 text-center">
                    <Link
                        href="/sign-in"
                        className="text-black underline font-semibold hover:no-underline hover:text-neutral-700 transition"
                    >
                        Retour à la connexion
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
