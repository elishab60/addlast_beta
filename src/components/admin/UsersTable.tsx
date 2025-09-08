"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

export default function UsersTable() {
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await supabase.from("profiles").select("*");
            setUsers(data || []);
        };
        fetchUsers();
    }, []);

    const filtered = users.filter(
        u =>
            !search ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.prenom?.toLowerCase().includes(search.toLowerCase()) ||
            u.nom?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Prénom</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Nom</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Naissance</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Newsletter</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Rôle</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Création</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="px-3 py-2 font-semibold break-all truncate max-w-[160px]">{u.email}</td>
                        <td className="px-3 py-2 break-all truncate max-w-[90px]">{u.prenom}</td>
                        <td className="px-3 py-2 break-all truncate max-w-[90px]">{u.nom}</td>
                        <td className="px-3 py-2 break-all truncate max-w-[70px]">{u.dob ? new Date(u.dob).toLocaleDateString() : ""}</td>
                        <td className="px-3 py-2">{u.newsletter ? "Oui" : "Non"}</td>
                        <td className="px-3 py-2">{u.role || "user"}</td>
                        <td className="px-3 py-2 break-all truncate max-w-[90px]">{u.created_at && new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    );
}
