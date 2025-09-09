"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types"; // ton interface existante

// 🔧 On étend localement le type pour les champs utilisés ici
type ProfileUI = Profile & {
    role?: string | null;
    pointure?: string | number | null;
    newsletter?: boolean | null;
    dob?: string | Date | null;
    adresse?: string | null;
    ville?: string | null;
    code_postal?: string | null;
    pays?: string | null;
    created_at?: string | Date | null;
    prenom?: string | null;
    nom?: string | null;
    email?: string | null;
    id: string;
};

export default function UsersTable() {
    const [users, setUsers] = useState<ProfileUI[]>([]);
    const [search, setSearch] = useState<string>("");
    const [filterNewsletter, setFilterNewsletter] = useState<"all" | "yes" | "no">("all");
    const [filterPointure, setFilterPointure] = useState<string>("");
    const [filterRole, setFilterRole] = useState<string>("");

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from("profiles")
                // ✅ on récupère *explicitement* les colonnes qu'on utilise
                .select(`
          id, email, prenom, nom, dob, newsletter, role, pointure,
          adresse, ville, code_postal, pays, created_at
        `);

            if (error) {
                console.error(error);
                return;
            }
            setUsers((data as ProfileUI[]) ?? []);
        };
        fetchUsers();
    }, []);

    const filtered = users.filter((u) => {
        const matchesSearch =
            !search ||
            (u.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (u.prenom ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (u.nom ?? "").toLowerCase().includes(search.toLowerCase());

        const matchesNewsletter =
            filterNewsletter === "all" ||
            (filterNewsletter === "yes" && !!u.newsletter) ||
            (filterNewsletter === "no" && !u.newsletter);

        const matchesPointure = !filterPointure || String(u.pointure ?? "") === filterPointure;
        const matchesRole = !filterRole || (u.role ?? "") === filterRole;

        return matchesSearch && matchesNewsletter && matchesPointure && matchesRole;
    });

    return (
        <div className="w-full bg-white rounded-xl shadow">
            {/* ✅ Toolbar recherche (tu pourras ajouter les filtres ici si tu veux les UI) */}
            <div className="p-3 border-b border-gray-200 flex flex-col md:flex-row gap-3 md:items-center justify-between">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par email, prénom ou nom…"
                    className="w-full md:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
            </div>

            {/* ✅ Table complète */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                    <tr className="bg-gray-50">
                        <Th>Email</Th>
                        <Th>Prénom</Th>
                        <Th>Nom</Th>
                        <Th>Naissance</Th>
                        <Th>Newsletter</Th>
                        <Th>Rôle</Th>
                        <Th>Pointure</Th>
                        <Th>Adresse</Th>
                        <Th>Ville</Th>
                        <Th>Code postal</Th>
                        <Th>Pays</Th>
                        <Th>Création</Th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                            <Td>{u.email ?? ""}</Td>
                            <Td>{u.prenom ?? ""}</Td>
                            <Td>{u.nom ?? ""}</Td>
                            <Td>{u.dob ? new Date(u.dob as any).toLocaleDateString("fr-FR") : ""}</Td>
                            <Td>{u.newsletter ? "Oui" : "Non"}</Td>
                            <Td>{u.role ?? ""}</Td>
                            <Td>{u.pointure ?? ""}</Td>
                            <Td className="max-w-[150px] truncate">{u.adresse ?? ""}</Td>
                            <Td>{u.ville ?? ""}</Td>
                            <Td>{u.code_postal ?? ""}</Td>
                            <Td>{u.pays ?? ""}</Td>
                            <Td>{u.created_at ? new Date(u.created_at as any).toLocaleDateString("fr-FR") : ""}</Td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={12} className="px-3 py-6 text-center text-gray-500">
                                Aucun utilisateur trouvé.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* Helpers pour en-têtes / cellules */
function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase whitespace-nowrap">
            {children}
        </th>
    );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-3 py-2 break-all truncate max-w-[120px] ${className}`}>{children}</td>;
}
