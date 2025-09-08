"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import UserProfileBento from "@/components/user-profile-bento"
import { User } from "@/types/product"

export default function AccountPage() {
    const [profile, setProfile] = useState<User>(null)

    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("prenom, nom, email, dob, newsletter, created_at, pointure, adresse, ville, code_postal, pays")
                    .eq("id", user.id)
                    .single()
                if (!error) setProfile({ ...data, id: user.id })
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
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-4">
                <UserProfileBento profile={profile} />
            </main>
            <Footer />
        </div>
    )
}
