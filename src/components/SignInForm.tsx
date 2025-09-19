"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function SignInForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            toast.error("Erreur lors de la connexion : " + error.message);
        } else {
            toast.success("Connexion réussie ! Bienvenue sur Addlast.");
            router.replace("/account");
        }
        setLoading(false);
    };

    return (
        <Card className="max-w-md w-full mx-auto shadow-2xl rounded-3xl border-0 bg-white/95">
            <CardHeader className="pt-10 pb-2 flex flex-col items-center gap-2">
                <span className="text-3xl font-black tracking-tight uppercase text-accent select-none">addlast</span>
                <CardTitle className="text-center text-2xl font-extrabold tracking-tight">Connexion</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-4 mt-4" onSubmit={handleSignIn} autoComplete="on">
                    <Input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <div className="relative">
                        <Input
                            name="password-signin"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe"
                            autoComplete="current-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-accent-muted"
                        >
                            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                    <div className="flex justify-between text-xs mb-1">
                        <span />
                        <Link href="/forgot-password" className="text-accent hover:text-accent-muted hover:underline transition">
                            Mot de passe oublié ?
                        </Link>
                    </div>
                    <Button
                        type="submit"
                        className="w-full mt-2 rounded-full font-semibold transition hover:-translate-y-1 hover:shadow-xl bg-black text-white border border-accent hover:bg-accent hover:text-black"
                        disabled={loading}
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </Button>
                </form>
                <div className="text-sm mt-8 text-center">
                    Pas encore de compte ?{" "}
                    <Link href="/sign-up" className="text-accent underline font-semibold hover:no-underline hover:text-accent-muted transition">
                        Créer un compte
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
