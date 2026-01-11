import { motion } from "framer-motion";
import { Radio } from "lucide-react";

export const LiveVisualizer = () => {
    return (
        <div className="glass-panel-pro p-6 rounded-2xl relative overflow-hidden h-64 flex flex-col items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />

            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/20 animate-pulse">
                    <Radio className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Live Signal</span>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    Cyberpunk FM
                </h3>

                <div className="flex items-end gap-1 h-16">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 bg-gradient-to-t from-primary via-secondary to-cyan-400 rounded-full shadow-[0_0_15px_var(--neon-pink)]"
                            animate={{
                                height: [
                                    `${Math.random() * 20 + 10}%`,
                                    `${Math.random() * 80 + 20}%`,
                                    `${Math.random() * 20 + 10}%`
                                ],
                            }}
                            transition={{
                                duration: 0.4,
                                repeat: Infinity,
                                delay: i * 0.05,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>

                <p className="text-zinc-400 text-sm">Tune in for non-stop synthwave hits</p>
            </div>

            {/* Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
        </div>
    );
};
