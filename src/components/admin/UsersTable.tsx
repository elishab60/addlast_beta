"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types"; // ✅ ton interface

export default function UsersTable() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase.from("profiles").select("*");
            if (error) {
                console.error(error);
                return;
            }
            setUsers(data ?? []);
        };
        fetchUsers();
    }, []);

    const filtered = users.filter(
        (u) =>
            !search ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.prenom?.toLowerCase().includes(search.toLowerCase()) ||
            u.nom?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full bg-white rounded-xl shadow">
            {/* ✅ barre de recherche (setSearch est utilisé) */}
            <div className="p-3 border-b border-gray-200">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par email, prénom ou nom…"
                    className="w-full md:w-80 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Prénom</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Nom</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Naissance</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Newsletter</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Création</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                            <td className="px-3 py-2 font-semibold break-all truncate max-w-[160px]">
                                {u.email}
                            </td>
                            <td className="px-3 py-2 break-all truncate max-w-[90px]">{u.prenom}</td>
                            <td className="px-3 py-2 break-all truncate max-w-[90px]">{u.nom}</td>
                            <td className="px-3 py-2 break-all truncate max-w-[70px]">
                                {u.dob ? new Date(u.dob).toLocaleDateString("fr-FR") : ""}
                            </td>
                            <td className="px-3 py-2">{u.newsletter ? "Oui" : "Non"}</td>
                            <td className="px-3 py-2">
                                {u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : ""}
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td
                                className="px-3 py-6 text-center text-sm text-gray-500"
                                colSpan={6}
                            >
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
