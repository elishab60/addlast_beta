"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Mail, MapPin, Settings, Shield, User, Zap } from "lucide-react"
import { toast } from "sonner"

interface UserProfileBentoProps {
    profile: any
}

// Util: assure un format YYYY-MM-DD (ou "" si invalide)
function toISODateOnly(input: any): string {
    if (!input) return ""
    try {
        // input peut être déjà "YYYY-MM-DD" ou un timestamp
        const d = new Date(input)
        if (isNaN(d.getTime())) return ""
        return d.toISOString().slice(0, 10)
    } catch {
        return ""
    }
}

export default function UserProfileBento({ profile }: UserProfileBentoProps) {
    // Normalise la DOB à l’affichage pour l’input type="date"
    const initialDob = toISODateOnly(profile.dob)

    const [userData, setUserData] = useState({
        firstName: profile.prenom || "",
        lastName: profile.nom || "",
        email: profile.email || "",
        birthDate: initialDob,          // toujours "YYYY-MM-DD" ou ""
        shoeSize: profile.pointure || "",
        newsletter: !!profile.newsletter,
        address: profile.adresse || "",
        city: profile.ville || "",
        postalCode: profile.code_postal || "",
        country: profile.pays || "",
        createdAt: profile.created_at,
        id: profile.id,
    })

    const [dirty, setDirty] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (field: string, value: any) => {
        setUserData((prev) => ({ ...prev, [field]: value }))
        setDirty(true)
    }

    const handleSave = async () => {
        setLoading(true)

        // IMPORTANT: n’envoyer JAMAIS "" pour un champ DATE -> utiliser null
        const dobForDb = userData.birthDate && userData.birthDate.trim() !== "" ? userData.birthDate : null

        const { error } = await supabase
            .from("profiles")
            .update({
                prenom: userData.firstName,
                nom: userData.lastName,
                email: userData.email,
                dob: dobForDb,                 // <- null si vide, "YYYY-MM-DD" sinon
                newsletter: userData.newsletter,
                pointure: userData.shoeSize,
                adresse: userData.address,
                ville: userData.city,
                code_postal: userData.postalCode,
                pays: userData.country,
            })
            .eq("id", userData.id)

        setLoading(false)

        if (error) {
            toast.error(error.message || "Erreur lors de la sauvegarde")
            console.error(error)
            return
        }

        toast.success("Profil mis à jour avec succès")
        setDirty(false)
    }

    const shoeSizes = Array.from({ length: 40 }, (_, i) => (35 + i * 0.5).toString())

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Mon Profil</h1>
                <p className="text-muted-foreground">Gérez vos informations personnelles et préférences</p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
                {/* Infos perso */}
                <Card className="md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <User className="h-5 w-5" />
                        <CardTitle>Informations Personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input
                                    id="firstName"
                                    value={userData.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input
                                    id="lastName"
                                    value={userData.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={userData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Date de naissance</Label>
                            <Input
                                id="birthDate"
                                type="date"
                                value={userData.birthDate}
                                onChange={(e) => handleChange("birthDate", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pointure */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            <CardTitle>Ma Pointure</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary mb-2">{userData.shoeSize || "--"}</div>
                            <p className="text-sm text-muted-foreground">Pointure EU</p>
                        </div>
                        <Select
                            value={userData.shoeSize}
                            onValueChange={(value) => handleChange("shoeSize", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir une pointure" />
                            </SelectTrigger>
                            <SelectContent>
                                {shoeSizes.map((size) => (
                                    <SelectItem key={size} value={size}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Newsletter */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            <CardTitle>Newsletter</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Recevoir les nouveautés</p>
                                <p className="text-sm text-muted-foreground">Soyez informé des dernières sorties</p>
                            </div>
                            <Switch
                                checked={userData.newsletter}
                                onCheckedChange={(checked) => handleChange("newsletter", checked)}
                            />
                        </div>
                        {userData.newsletter && (
                            <Badge variant="secondary" className="w-fit">
                                <Mail className="h-3 w-3 mr-1" />
                                Abonné
                            </Badge>
                        )}
                    </CardContent>
                </Card>

                {/* Adresse */}
                <Card className="md:col-span-2 lg:col-span-3 xl:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            <CardTitle>Adresse de livraison</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse</Label>
                            <Textarea
                                id="address"
                                value={userData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                className="resize-none"
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Ville</Label>
                                <Input
                                    id="city"
                                    value={userData.city}
                                    onChange={(e) => handleChange("city", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Code postal</Label>
                                <Input
                                    id="postalCode"
                                    value={userData.postalCode}
                                    onChange={(e) => handleChange("postalCode", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Pays</Label>
                                <Input
                                    id="country"
                                    value={userData.country}
                                    onChange={(e) => handleChange("country", e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Compte */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            <CardTitle>Compte</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Membre depuis</p>
                            <p className="font-medium">
                                {userData.createdAt
                                    ? new Date(userData.createdAt).toLocaleDateString("fr-FR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "--"}
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">Statut</p>
                            <Badge variant="secondary" className="mt-1">
                                Actif
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Sécurité */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <CardTitle>Sécurité</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full bg-transparent">
                            <Settings className="h-4 w-4 mr-2" />
                            Modifier le mot de passe
                        </Button>
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">Dernière modification il y a 3 mois</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bouton sauvegarde SOUS la grid */}
            {dirty && (
                <div className="flex justify-end mt-6">
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Sauvegarde..." : "Sauvegarder les modifications"}
                    </Button>
                </div>
            )}
        </div>
    )
}
