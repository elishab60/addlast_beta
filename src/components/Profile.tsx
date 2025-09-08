"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Profile({ user }: { user: any }) {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border text-center flex flex-col gap-5">
            <h2 className="text-2xl font-bold mb-3">Bienvenue,</h2>
            <div className="text-lg font-semibold">{user.email}</div>
            <Button className="w-full mt-8" variant="destructive" onClick={handleLogout}>
                Se déconnecter
            </Button>
        </div>
    );
}
