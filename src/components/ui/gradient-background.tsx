"use client"

export default function GradientBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-full bg-black organic-waves" />

            <style jsx>{`
                @keyframes drift1 {
                    0% {
                        transform: translate(-10%, -10%) scale(1);
                    }
                    50% {
                        transform: translate(5%, 5%) scale(1.2);
                    }
                    100% {
                        transform: translate(-10%, -10%) scale(1);
                    }
                }

                @keyframes drift2 {
                    0% {
                        transform: translate(15%, -5%) scale(1.1);
                    }
                    50% {
                        transform: translate(-5%, 10%) scale(1.3);
                    }
                    100% {
                        transform: translate(15%, -5%) scale(1.1);
                    }
                }

                @keyframes drift3 {
                    0% {
                        transform: translate(-5%, 15%) scale(0.9);
                    }
                    50% {
                        transform: translate(10%, -10%) scale(1.1);
                    }
                    100% {
                        transform: translate(-5%, 15%) scale(0.9);
                    }
                }

                .organic-waves {
                    position: relative;
                    background: #000;
                    overflow: hidden;
                }

                .organic-waves::before,
                .organic-waves::after {
                    content: "";
                    position: absolute;
                    width: 200%;
                    height: 200%;
                    top: -50%;
                    left: -50%;
                    filter: blur(120px);
                    opacity: 0.5;
                    mix-blend-mode: screen;
                }

                /* Première vague */
                .organic-waves::before {
                    background: radial-gradient(circle at 30% 40%, rgba(10, 172, 74, 0.39), transparent 70%),
                    radial-gradient(circle at 70% 60%, rgba(0, 200, 80, 0.57), transparent 80%);
                    animation: drift1 35s ease-in-out infinite;
                }

                /* Deuxième vague */
                .organic-waves::after {
                    background: radial-gradient(circle at 60% 70%, rgba(0, 255, 150, 0.1), transparent 80%),
                    radial-gradient(circle at 40% 30%, rgba(0, 180, 60, 0.08), transparent 75%);
                    animation: drift2 50s ease-in-out infinite;
                }

                /* Troisième couche mouvante */
                .organic-waves > div {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 50%, rgb(67, 188, 98), transparent 85%);
                    filter: blur(140px);
                    mix-blend-mode: screen;
                    animation: drift3 60s ease-in-out infinite;
                }
            `}</style>

            <div />
        </div>
    )
}
