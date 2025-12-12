import { useEffect, useState } from "react";
import { delay, motion } from "framer-motion";

type FireParticle = {
    id: number;
    left: string;
    scale: number;
    duration: number;
    delay: number;
}

export default function FireBackground() {
    const [particles, setParticles] = useState<FireParticle[]>([]);

    useEffect(() => {
        const particleNumber = 25;
        const newParticles = Array.from({ length: particleNumber }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            scale: Math.random() * 0.3 + 0.8,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
        }))
        setParticles(newParticles);
    }, [])

    return (
        <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.duration}
                    className="absolute -bottom-12.5 text-4xl"
                    style={{
                        left: particle.left,
                        filter: "drop-shadow(0 0 10px rgba(255, 69, 0, 0.5))",
                    }}
                    initial={{ y: 0, opacity: 0, scale: 0 }}
                    animate={{
                        y:"-110vh",
                        opacity: [0, 1, 1, 0],
                        scale: [particle.scale, particle.scale * 1.5],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    🔥
                </motion.div>
            ))}

            <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-orange-500/20 to-transparent" />
        </div>
    )
}