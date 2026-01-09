import { motion } from "framer-motion";
import { Hammer, Music, Clock, Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const UnderConstruction = () => {
    return (
        <div className="relative min-h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden p-6">
            {/* Dynamic Sound Wave Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <div className="flex items-end gap-2 h-96">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-4 bg-emerald-500 rounded-full"
                            animate={{
                                height: [40, 200, 100, 300, 60],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Floating Sparkles/Particles */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-0"
                        animate={{
                            opacity: [0, 0.5, 0],
                            y: [0, -100],
                            x: [0, (i % 2 === 0 ? 50 : -50)]
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-xl w-full"
            >
                <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-16 text-center shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-10 ring-1 ring-emerald-500/20 rotate-45 group hover:rotate-0 transition-transform duration-700">
                        <Hammer className="w-10 h-10 text-emerald-400" />
                    </div>

                    <p className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">Under Construction</p>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">We're fine-tuning <br /><span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">the frequency.</span></h1>

                    <p className="text-zinc-500 text-lg mb-12 max-w-md mx-auto leading-relaxed">
                        This module is currently in the mixing stage. Our engineers are working hard to bring you the best fidelity possible.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild variant="ghost" className="h-14 px-8 text-zinc-400 hover:text-white hover:bg-white/5 rounded-2xl font-bold">
                            <Link to="/">
                                <ArrowLeft className="w-5 h-5 mr-3" />
                                Go Back
                            </Link>
                        </Button>

                        <Button className="h-14 px-10 bg-emerald-500 text-black hover:bg-emerald-400 rounded-2xl font-bold text-base shadow-[0_20px_40px_rgba(16,185,129,0.2)] group">
                            <Bell className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                            Notify Me
                        </Button>
                    </div>

                    <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                        <div className="flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Hi-Res</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Early Access</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UnderConstruction;
