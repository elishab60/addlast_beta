// app/admin/page.tsx
"use client";
import { useState } from "react";
import UsersTable from "@/components/admin/UsersTable";
import ProductsTable from "@/components/admin/ProductsTable";
import SubmissionsTable from "@/components/SubmissionsTable";
import AdminLikesTable from "@/components/admin/AdminLikesTable"; // 👈 NEW
import { Button } from "@/components/ui/button";
import Link from "next/link";

const sections = [
    { id: "orders", label: "Gérer les commandes" },
    { id: "users", label: "Gérer les utilisateurs" },
    { id: "products", label: "Gérer les produits" },
    { id: "likes", label: "Votes (likes)" },         // 👈 NEW
    { id: "submissions", label: "Soumissions communauté" },
];

export default function AdminPage() {
    const [selected, setSelected] = useState("orders");

    return (
        <div className="min-h-screen flex bg-gray-50 font-mono text-black">
            {/* Sidecar */}
            <nav className="w-64 min-h-screen flex flex-col bg-white border-r border-gray-200 shadow-md pt-12 pb-8 px-4">
                <h2 className="font-black text-xl uppercase mb-10 text-black">Panneau admin</h2>
                <ul className="flex-1 flex flex-col gap-2">
                    {sections.map((s) => (
                        <li key={s.id}>
                            <Button
                                variant={selected === s.id ? "default" : "ghost"}
                                className={`w-full justify-start rounded-lg font-semibold transition border border-transparent ${
                                    selected === s.id
                                        ? "bg-accent  text-black hover:bg-accent"
                                        : "text-black hover:text-black "
                                }`}
                                onClick={() => setSelected(s.id)}
                            >
                                {s.label}
                            </Button>
                        </li>
                    ))}
                </ul>
                <div className="mt-auto">
                    <Link href="/">
                        <Button variant="outline" className="w-full rounded-full border border-black text-black hover:text-black hover:bg-accent">
                            Retour au site
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-1 flex flex-col items-stretch py-12 px-6">
                <div className="w-full max-w-6xl flex-1 mx-auto bg-white rounded-2xl shadow p-10 min-h-[70vh] flex flex-col">
                    {selected === "orders" && (
                        <div>
                            <h3 className="font-bold text-2xl mb-8 text-black">Gestion des commandes</h3>
                            <p className="text-gray-400">Module à venir...</p>
                        </div>
                    )}

                    {selected === "users" && (
                        <div className="flex-1 flex flex-col">
                            <h3 className="font-bold text-2xl mb-8 text-black">Gestion des utilisateurs</h3>
                            <div className="flex-1 w-full">
                                <UsersTable />
                            </div>
                        </div>
                    )}

                    {selected === "products" && (
                        <div className="flex-1 flex flex-col">
                            <h3 className="font-bold text-2xl mb-8 text-black">Gestion des produits</h3>
                            <div className="flex-1 w-full">
                                <ProductsTable />
                            </div>
                        </div>
                    )}

                    {selected === "likes" && ( // 👈 NEW
                        <div className="flex-1 flex flex-col">
                            <h3 className="font-bold text-2xl mb-8 text-black">Votes (likes) par produit</h3>
                            <div className="flex-1 w-full">
                                <AdminLikesTable />
                            </div>
                        </div>
                    )}

                    {selected === "submissions" && (
                        <div className="flex-1 flex flex-col">
                            <h3 className="font-bold text-2xl mb-8 text-black">Soumissions Communauté</h3>
                            <div className="flex-1 w-full">
                                <SubmissionsTable />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
