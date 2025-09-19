"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Profile({ user }: { user: User | null }) {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    if (!user) {
        return (
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-accent text-center flex flex-col gap-5">
                <h2 className="text-2xl font-bold mb-3 text-accent">Bienvenue,</h2>
                <div className="text-lg">Aucun utilisateur connecté.</div>
                <Button className="w-full mt-8 bg-black text-white border border-accent hover:bg-accent hover:text-black" asChild>
                    <a href="/sign-in">Se connecter</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-accent text-center flex flex-col gap-5">
            <h2 className="text-2xl font-bold mb-3 text-accent">Bienvenue,</h2>
            <div className="text-lg font-semibold">{user.email}</div>
            <Button className="w-full mt-8" variant="destructive" onClick={handleLogout}>
                Se déconnecter
            </Button>
        </div>
    );
}
