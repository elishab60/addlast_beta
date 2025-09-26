"use client"

export default function GradientBackground() {
    return (
        <div className="absolute inset-0">
            <div className="w-full h-full bg-black neon-wave" />

            <style jsx>{`
                @keyframes waveFlow {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                .neon-wave {
                    background: linear-gradient(
                            -45deg,
                            rgba(0, 255, 102, 0.2) 0%,
                            transparent 40%,
                            rgba(0, 255, 153, 0.15) 70%,
                            transparent 100%
                    ),
                    linear-gradient(
                            45deg,
                            rgba(0, 255, 102, 0.2) 0%,
                            transparent 50%,
                            rgba(0, 255, 153, 0.15) 80%,
                            transparent 100%
                    ),
                    #000000; /* fond noir profond */
                    background-size: 300% 300%;
                    animation: waveFlow 12s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
