import SocialIcons from "./SocialIcons";

export default function Footer() {
    return (
        <footer className="w-full mt-12 bg-black py-10 border-t border-neutral-900">
            <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 px-4">
                <span className="text-white font-bold text-lg tracking-wider">addlast</span>
                <SocialIcons />
                <div className="text-white/40 text-xs mt-4 md:mt-0">© {new Date().getFullYear()} addlast. Tous droits réservés.</div>
            </div>
        </footer>
    );
}
