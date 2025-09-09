"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

// ✅ type local étendu aux colonnes utilisées ici
type ProfileUI = Profile & {
    id: string;
    email?: string | null;
    prenom?: string | null;
    nom?: string | null;
    dob?: string | null;          // ← string ISO
    newsletter?: boolean | null;
    role?: string | null;
    pointure?: string | number | null;
    adresse?: string | null;
    ville?: string | null;
    code_postal?: string | null;
    pays?: string | null;
    created_at?: string | null;   // ← string ISO
};

// ✅ helper sans any
function formatDate(value?: string | Date | null): string {
    if (!value) return "";
    const d = typeof value === "string" ? new Date(value) : value;
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("fr-FR");
}

export default function UsersTable() {
    const [users, setUsers] = useState<ProfileUI[]>([]);
    const [search, setSearch] = useState("");
    // ✅ on n’utilise pas les setters → on ne les déstructure pas
    const [filterNewsletter] = useState<"all" | "yes" | "no">("all");
    const [filterPointure] = useState<string>("");
    const [filterRole] = useState<string>("");

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from("profiles")
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
        const q = search.toLowerCase();
        const matchesSearch =
            !q ||
            (u.email ?? "").toLowerCase().includes(q) ||
            (u.prenom ?? "").toLowerCase().includes(q) ||
            (u.nom ?? "").toLowerCase().includes(q);

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
            {/* Toolbar recherche (UI des filtres à ajouter si tu veux les exploiter) */}
            <div className="p-3 border-b border-gray-200 flex flex-col md:flex-row gap-3 md:items-center justify-between">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par email, prénom ou nom…"
                    className="w-full md:w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
            </div>

            {/* Table */}
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
                            <Td>{formatDate(u.dob)}</Td>
                            <Td>{u.newsletter ? "Oui" : "Non"}</Td>
                            <Td>{u.role ?? ""}</Td>
                            <Td>{u.pointure ?? ""}</Td>
                            <Td className="max-w-[150px] truncate">{u.adresse ?? ""}</Td>
                            <Td>{u.ville ?? ""}</Td>
                            <Td>{u.code_postal ?? ""}</Td>
                            <Td>{u.pays ?? ""}</Td>
                            <Td>{formatDate(u.created_at)}</Td>
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

/* Helpers */
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
