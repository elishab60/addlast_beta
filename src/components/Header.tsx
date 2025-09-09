"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, User as UserIcon, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const navigation = [
    { name: "Catalogue", href: "/products" },
    { name: "Votes", href: "/votes" },
    { name: "Précommandes", href: "/precommandes" },
    { name: "Communauté", href: "/communaute" },
    { name: "À propos", href: "/a-propos" },
];

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { count } = useCart();

    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = pas encore chargé
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let ignore = false;

        supabase.auth.getUser().then(async ({ data }) => {
            if (ignore) return;
            setUser(data?.user ?? null);
            if (data?.user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", data.user.id)
                    .single();
                setIsAdmin(profile?.role === "admin");
            }
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", session.user.id)
                    .single()
                    .then(({ data: profile }) => setIsAdmin(profile?.role === "admin"));
            } else {
                setIsAdmin(false);
            }
        });

        return () => {
            ignore = true;
            listener?.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success("Déconnexion réussie !");
        router.replace("/");
    };

    // 🚨 Tant que Supabase n’a pas répondu → on bloque toute la page
    if (user === undefined) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-white">
        <span className="text-gray-500 animate-pulse text-lg font-semibold">
          Chargement…
        </span>
            </div>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
          <span className="font-extrabold text-2xl tracking-tight text-black group-hover:text-primary transition-colors">
            add<span className="text-primary">last</span>
          </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`text-sm font-semibold transition-colors relative group min-w-[110px] text-center ${
                                pathname === item.href ? "text-black" : "text-gray-700 hover:text-black"
                            }`}
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center space-x-4">
                    {/* Zone utilisateur largeur fixe */}
                    <div className="min-w-[130px] flex justify-end">
                        {!user ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm font-semibold text-gray-600 hover:text-black flex items-center"
                                onClick={() => router.push("/sign-in")}
                            >
                                <UserIcon className="w-4 h-4 mr-2" />
                                Se connecter
                            </Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-600 hover:text-black"
                                    >
                                        <UserIcon className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 shadow-xl rounded-2xl mt-2">
                                    <DropdownMenuItem asChild>
                                        <Link href="/account">Mon profil</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders">Mes commandes</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {isAdmin && (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin">Admin</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem onClick={handleLogout}>
                                        Déconnexion
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Likes */}
                    <Link href="/wishlist">
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                            <Heart className="w-5 h-5" />
                        </Button>
                    </Link>

                    {/* Cart */}
                    <Link href="/cart">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-gray-600 hover:text-black"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {count}
                </span>
                            )}
                        </Button>
                    </Link>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden flex items-center space-x-2">
                    {/* Likes */}
                    <Link href="/wishlist">
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                            <Heart className="w-5 h-5" />
                        </Button>
                    </Link>

                    {/* Cart */}
                    <Link href="/cart">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-gray-600 hover:text-black"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {count}
                </span>
                            )}
                        </Button>
                    </Link>

                    {/* Burger menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                                <Menu className="w-5 h-5" />
                                <span className="sr-only">Ouvrir le menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 bg-white text-black">
                            <div className="flex flex-col space-y-6 mt-6">
                                <nav className="flex flex-col space-y-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg font-semibold hover:text-primary transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
                                    {!user ? (
                                        <Button
                                            variant="ghost"
                                            className="justify-start text-gray-600 hover:text-black"
                                            onClick={() => {
                                                setIsOpen(false);
                                                router.push("/sign-in");
                                            }}
                                        >
                                            <UserIcon className="w-4 h-4 mr-2" />
                                            Se connecter
                                        </Button>
                                    ) : (
                                        <>
                                            <Link
                                                href="/account"
                                                onClick={() => setIsOpen(false)}
                                                className="text-gray-700 hover:text-black"
                                            >
                                                Mon profil
                                            </Link>
                                            <Link
                                                href="/orders"
                                                onClick={() => setIsOpen(false)}
                                                className="text-gray-700 hover:text-black"
                                            >
                                                Mes commandes
                                            </Link>
                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-gray-700 hover:text-black"
                                                >
                                                    Admin
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsOpen(false);
                                                }}
                                                className="text-left text-gray-700 hover:text-black"
                                            >
                                                Déconnexion
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
