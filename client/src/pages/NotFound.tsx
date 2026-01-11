import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Disc, Home } from "lucide-react";
import { motion } from "framer-motion";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-background to-background z-0" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mb-8 relative"
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center shadow-2xl">
            <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(#333_0px,#111_2px,#111_4px)] opacity-50" />
            <Disc className="w-24 h-24 text-zinc-700/50" />

            {/* Crack effect overlay */}
            <motion.div
              className="absolute inset-0 border-t-2 border-transparent border-l-2 border-l-red-500/50 w-full h-full rounded-full"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600 mb-2 glitch-text"
          data-text="404"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide mb-8"
        >
          B-Side Unavailable
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-zinc-500 max-w-md mb-8"
        >
          The track you're looking for has been skipped or doesn't exist in our crate.
          Let's get you back to the main stage.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
