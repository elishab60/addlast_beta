"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // ⚠️ si tu es en App Router, je peux aussi te montrer avec usePathname

export default function PageTransition() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleStop = () => setLoading(false);

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleStop);
        router.events.on("routeChangeError", handleStop);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleStop);
            router.events.off("routeChangeError", handleStop);
        };
    }, [router]);

    return (
        loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/70 backdrop-blur-md transition-opacity duration-500">
        <span className="text-lg font-bold text-gray-700 animate-pulse">
          Chargement...
        </span>
            </div>
        )
    );
}
