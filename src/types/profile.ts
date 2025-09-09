export interface Profile {
    id: string
    prenom: string | null
    nom: string | null
    email: string | null
    dob: string | null
    newsletter: boolean | null
    created_at: string
    pointure: string | null
    adresse: string | null
    ville: string | null
    code_postal: string | null
    pays: string | null
}
