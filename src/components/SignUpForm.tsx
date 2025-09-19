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

export default function SignUpForm() {
    const router = useRouter();
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newsletter, setNewsletter] = useState(false);
    const [acceptCgu, setAcceptCgu] = useState(false);
    const [loading, setLoading] = useState(false);

    // 👀 nouveaux états pour afficher/masquer
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptCgu) {
            toast.error("Vous devez accepter les CGU pour créer un compte.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            toast.error("Erreur lors de la création du compte : " + error.message);
            setLoading(false);
            return;
        }

        const user = data.user ?? data.session?.user;
        if (user) {
            const { error: profileError } = await supabase.from("profiles").upsert([
                {
                    id: user.id,
                    email,
                    prenom,
                    nom,
                    dob,
                    newsletter,
                    created_at: new Date().toISOString(),
                    role: "client",
                },
            ]);
            if (profileError) {
                toast.error("Erreur lors de l'enregistrement du profil : " + profileError.message);
                setLoading(false);
                return;
            }
        }

        toast.success("Compte créé, vérifiez votre mail pour valider votre inscription.");
        setLoading(false);
        router.replace("/sign-in");
    };

    return (
        <Card className="max-w-md w-full mx-auto shadow-2xl rounded-3xl border-0 bg-white/95">
            <CardHeader className="pt-10 pb-2 flex flex-col items-center gap-2">
                <span className="text-3xl font-black tracking-tight uppercase text-accent select-none">
                    addlast
                </span>
                <CardTitle className="text-center text-2xl font-extrabold tracking-tight">
                    Inscription
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    className="flex flex-col gap-4 mt-4"
                    onSubmit={handleSignUp}
                    autoComplete="on"
                >
                    <div className="flex gap-3">
                        <Input
                            type="text"
                            placeholder="Prénom"
                            autoComplete="given-name"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            required
                        />
                        <Input
                            type="text"
                            placeholder="Nom"
                            autoComplete="family-name"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                        />
                    </div>
                    <Input
                        type="date"
                        placeholder="Date de naissance (JJ/MM/AAAA)"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Adresse email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* Mot de passe avec toggle 👇 */}
                    <div className="relative">
                        <Input
                            name="password-signup"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    {/* Confirmation avec toggle 👇 */}
                    <div className="relative">
                        <Input
                            name="password-signup"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmer le mot de passe"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-accent-muted"
                        >
                            {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="newsletter"
                            type="checkbox"
                            checked={newsletter}
                            onChange={(e) => setNewsletter(e.target.checked)}
                            className="w-4 h-4 rounded transition focus:ring-2 focus:ring-accent"
                        />
                        <label htmlFor="newsletter" className="text-sm">
                            Je souhaite recevoir la newsletter.
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            id="cgu"
                            type="checkbox"
                            checked={acceptCgu}
                            onChange={(e) => setAcceptCgu(e.target.checked)}
                            className="w-4 h-4 rounded transition focus:ring-2 focus:ring-accent"
                            required
                        />
                        <label htmlFor="cgu" className="text-sm">
                            J’accepte les{" "}
                            <a href="/cgu" target="_blank" className="underline">
                                CGU
                            </a>
                            .
                        </label>
                    </div>
                    <Button
                        type="submit"
                        className="w-full mt-2 rounded-full font-semibold transition hover:-translate-y-1 hover:shadow-xl bg-black text-white border border-accent hover:bg-accent hover:text-black"
                        disabled={loading}
                    >
                        {loading ? "Création du compte..." : "S'inscrire"}
                    </Button>
                </form>
                <div className="text-sm mt-8 text-center">
                    Déjà un compte ?{" "}
                    <Link
                        href="/sign-in"
                        className="text-accent underline font-semibold hover:no-underline hover:text-accent-muted transition"
                    >
                        Se connecter
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
