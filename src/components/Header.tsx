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
];

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { count } = useCart();

    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null | undefined>(undefined);
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

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
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
            }
        );

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

    if (user === undefined) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-black">
        <span className="text-gray-400 animate-pulse text-lg font-semibold">
          Chargement…
        </span>
            </div>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#7CFF6B] bg-black font-mono">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 text-white">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
          <span className="font-extrabold text-2xl tracking-tight text-white transition-colors group-hover:text-[#7CFF6B]">
            add<span className="text-[#7CFF6B]">last</span>
          </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`text-sm font-semibold transition-colors relative group min-w-[110px] text-center ${
                                pathname === item.href
                                    ? "text-[#7CFF6B]"
                                    : "text-gray-400 hover:text-[#7CFF6B]"
                            }`}
                        >
                            {item.name}
                            <span
                                className={`absolute -bottom-1 left-0 h-0.5 transition-all group-hover:w-full bg-[#7CFF6B] ${
                                    pathname === item.href ? "w-full" : "w-0"
                                }`}
                            />
                        </Link>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center space-x-4">
                    {/* User */}
                    <div className="min-w-[130px] flex justify-end">
                        {!user ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm font-semibold text-gray-400 flex items-center bg-black hover:bg-black hover:!text-gray-400 focus-visible:ring-0"
                                onClick={() => router.push("/sign-in")}
                            >
                                <UserIcon className="w-4 h-4 mr-2 text-[#7CFF6B]" />
                                Se connecter
                            </Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="
                      bg-black hover:bg-black focus-visible:ring-0
                      !text-[#7CFF6B] hover:!text-[#7CFF6B] active:!text-[#7CFF6B] data-[state=open]:!text-[#7CFF6B]
                      [&>svg]:!text-[#7CFF6B] hover:[&>svg]:!text-[#7CFF6B]
                    "
                                        aria-label="Compte"
                                    >
                                        <UserIcon className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56 shadow-xl rounded-2xl mt-2 border border-[#7CFF6B] bg-black font-mono text-gray-400"
                                >
                                    <DropdownMenuItem
                                        asChild
                                        className="bg-black hover:bg-black focus:bg-black hover:!text-[#7CFF6B] focus:!text-[#7CFF6B]"
                                    >
                                        <Link href="/account">Mon profil</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        asChild
                                        className="bg-black hover:bg-black focus:bg-black hover:!text-[#7CFF6B] focus:!text-[#7CFF6B]"
                                    >
                                        <Link href="/orders">Mes commandes</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-[#7CFF6B]/30" />
                                    {isAdmin && (
                                        <>
                                            <DropdownMenuItem
                                                asChild
                                                className="bg-black hover:bg-black focus:bg-black hover:!text-[#7CFF6B] focus:!text-[#7CFF6B]"
                                            >
                                                <Link href="/admin">Admin</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-[#7CFF6B]/30" />
                                        </>
                                    )}
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="bg-black hover:bg-black focus:bg-black hover:!text-[#7CFF6B] focus:!text-[#7CFF6B]"
                                    >
                                        Déconnexion
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Wishlist */}
                    <Link href="/wishlist" aria-label="Wishlist">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                bg-black hover:bg-black focus-visible:ring-0
                !text-[#7CFF6B] hover:!text-[#7CFF6B] active:!text-[#7CFF6B]
                [&>svg]:!text-[#7CFF6B] hover:[&>svg]:!text-[#7CFF6B]
              "
                        >
                            <Heart className="w-5 h-5" />
                        </Button>
                    </Link>

                    {/* Cart */}
                    <Link href="/cart" aria-label="Panier">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                relative bg-black hover:bg-black focus-visible:ring-0
                !text-[#7CFF6B] hover:!text-[#7CFF6B] active:!text-[#7CFF6B]
                [&>svg]:!text-[#7CFF6B] hover:[&>svg]:!text-[#7CFF6B]
              "
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7CFF6B] text-black text-xs rounded-full flex items-center justify-center font-medium">
                  {count}
                </span>
                            )}
                        </Button>
                    </Link>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden flex items-center space-x-2">
                    <Link href="/wishlist" aria-label="Wishlist">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                bg-black hover:bg-black focus-visible:ring-0
                !text-[#7CFF6B] hover:!text-[#7CFF6B]
                [&>svg]:!text-[#7CFF6B]
              "
                        >
                            <Heart className="w-5 h-5" />
                        </Button>
                    </Link>

                    <Link href="/cart" aria-label="Panier">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                relative bg-black hover:bg-black focus-visible:ring-0
                !text-[#7CFF6B] hover:!text-[#7CFF6B]
                [&>svg]:!text-[#7CFF6B]
              "
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7CFF6B] text-black text-xs rounded-full flex items-center justify-center font-medium">
                  {count}
                </span>
                            )}
                        </Button>
                    </Link>

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="
                  bg-black hover:bg-black focus-visible:ring-0
                  !text-[#7CFF6B] hover:!text-[#7CFF6B]
                  [&>svg]:!text-[#7CFF6B]
                "
                                aria-label="Ouvrir le menu"
                            >
                                <Menu className="w-5 h-5" />
                                <span className="sr-only">Ouvrir le menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-80 bg-black text-gray-400 border-l border-[#7CFF6B]"
                        >
                            <div className="flex flex-col space-y-6 mt-6">
                                <nav className="flex flex-col space-y-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg font-semibold text-gray-400 hover:text-[#7CFF6B] transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="flex flex-col space-y-3 pt-6 border-t border-[#7CFF6B]/30">
                                    {!user ? (
                                        <Button
                                            variant="ghost"
                                            className="justify-start text-gray-400 bg-black hover:bg-black hover:!text-gray-400 focus-visible:ring-0"
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
                                                className="text-gray-400 hover:text-[#7CFF6B]"
                                            >
                                                Mon profil
                                            </Link>
                                            <Link
                                                href="/orders"
                                                onClick={() => setIsOpen(false)}
                                                className="text-gray-400 hover:text-[#7CFF6B]"
                                            >
                                                Mes commandes
                                            </Link>
                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-gray-400 hover:text-[#7CFF6B]"
                                                >
                                                    Admin
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsOpen(false);
                                                }}
                                                className="text-left text-gray-400 hover:text-[#7CFF6B]"
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
