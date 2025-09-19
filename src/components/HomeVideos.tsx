export default function HomeVideos() {
    return (
        <section className="py-12 bg-white border-y border-gray-100">
            <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center gap-8">
                <h2 className="text-2xl md:text-3xl font-bold text-accent">Micro-trottoir & Réseaux</h2>
                <div className="w-full max-w-xl aspect-video rounded-xl overflow-hidden shadow">
                    {/* Remplace src par ta vraie vidéo Youtube ou autre */}
                    <iframe
                        src="https://www.youtube.com/embed/ID_DE_TA_VIDEO"
                        title="Micro-trottoir Addlast"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
                <div className="flex gap-6 justify-center">
                    <a href="https://www.instagram.com/ton_insta/" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-accent hover:text-accent-muted hover:underline">Voir sur Instagram</a>
                    <a href="https://www.tiktok.com/@ton_tiktok/" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-accent hover:text-accent-muted hover:underline">Voir sur TikTok</a>
                </div>
            </div>
        </section>
    );
}
