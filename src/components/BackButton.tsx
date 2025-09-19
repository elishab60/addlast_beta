"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BackButton() {
    return (
        <motion.div
            className="fixed top-7 left-7 z-30"
            whileHover={{ x: -6, scale: 1.08 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350 }}
        >
            <Link href="/" className="group flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 border border-accent shadow hover:shadow-xl hover:bg-accent-muted transition-all backdrop-blur-lg">
                <svg
                    width={26}
                    height={26}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent group-hover:text-accent-muted transition"
                >
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                <span className="text-accent group-hover:text-accent-muted font-medium transition text-base hidden sm:block">
          Retour
        </span>
            </Link>
        </motion.div>
    );
}
