"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import UserProfileBento from "@/components/user-profile-bento"
import type { Profile } from "@/types"

export default function AccountPage() {
    // ✅ autoriser null au démarrage
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        ;(async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from("profiles")
                .select("prenom, nom, email, dob, newsletter, created_at, pointure, adresse, ville, code_postal, pays")
                .eq("id", user.id)
                .single()

            if (!error && data) {
                // ✅ on reconstruit un Profile complet (id depuis l'user)
                const p: Profile = {
                    id: user.id,
                    prenom: data.prenom ?? null,
                    nom: data.nom ?? null,
                    email: data.email ?? null,
                    dob: data.dob ?? null,
                    newsletter: data.newsletter ?? null,
                    created_at: data.created_at,
                    pointure: data.pointure ?? null,
                    adresse: data.adresse ?? null,
                    ville: data.ville ?? null,
                    code_postal: data.code_postal ?? null,
                    pays: data.pays ?? null,
                }
                setProfile(p)
            }
        })()
    }, [])

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex justify-center items-center">
                    <p>Chargement du profil...</p>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col font-mono">
            <Header />
            <main className="flex-1 p-4">
                <UserProfileBento profile={profile} />
            </main>
            <Footer />
        </div>
    )
}
