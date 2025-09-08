export default function SocialIcons() {
    return (
        <div className="flex gap-6 mt-2 md:mt-0">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener" className="text-white/60 hover:text-white transition">
                {/* Instagram SVG */}
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><path d="M17 7h.01"/></svg>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener" className="text-white/60 hover:text-white transition">
                {/* Twitter SVG */}
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.43.36a9.18 9.18 0 01-2.89 1.1A4.48 4.48 0 0016.11 0c-2.63 0-4.78 2.13-4.78 4.77 0 .37.05.73.13 1.08C7.69 5.66 4.07 3.98 1.64 1.18a4.65 4.65 0 00-.65 2.4c0 1.66.85 3.13 2.13 3.99A4.41 4.41 0 012 7.48v.05c0 2.34 1.66 4.29 3.88 4.74-.4.11-.82.17-1.25.17-.31 0-.6-.03-.88-.08.61 1.88 2.38 3.25 4.47 3.29A9.01 9.01 0 012 20.55a12.77 12.77 0 006.92 2.03c8.31 0 12.87-6.89 12.87-12.86 0-.2 0-.39-.01-.59A9.18 9.18 0 0024 4.59a9.15 9.15 0 01-2.64.72z"/></svg>
            </a>
            <a href="mailto:contact@addlast.com" className="text-white/60 hover:text-white transition">
                {/* Mail SVG */}
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
            </a>
        </div>
    );
}
