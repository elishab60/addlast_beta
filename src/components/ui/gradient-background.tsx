"use client"

export default function GradientBackground() {
    return (
        <div className="absolute inset-0">
            <div className="w-full h-full bg-black organic-gradient" />

            <style jsx>{`
                @keyframes slowPulse {
                    0% {
                        opacity: 0.8;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0.8;
                    }
                }

                .organic-gradient {
                    background: radial-gradient(
                            circle at 20% 30%,
                            rgba(0, 255, 102, 0.25) 0%,
                            transparent 60%
                    ),
                    radial-gradient(
                            circle at 80% 40%,
                            rgba(0, 255, 153, 0.2) 0%,
                            transparent 55%
                    ),
                    radial-gradient(
                            circle at 40% 75%,
                            rgba(0, 255, 80, 0.15) 0%,
                            transparent 65%
                    ),
                    #000000; /* noir de base */
                    background-blend-mode: screen;
                    animation: slowPulse 10s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
