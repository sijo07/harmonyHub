import { motion } from "framer-motion";

export const MusicLoader = () => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="relative flex items-end gap-1 h-16 mb-4">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-3 bg-primary rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                        animate={{
                            height: ["20%", "80%", "40%", "100%", "20%"],
                            backgroundColor: ["#ff0000", "#ff4444", "#ff0000"]
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="text-primary font-mono tracking-widest uppercase text-sm"
            >
                Loading System...
            </motion.p>
        </div>
    );
};
