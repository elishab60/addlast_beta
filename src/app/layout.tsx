import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Addlast",
  description: "Addlast",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="font-sans antialiased">
        <CartProvider>

            {children}
            <Toaster position="bottom-right" theme="light" />
        </CartProvider>
        </body>
        </html>
    );
}
