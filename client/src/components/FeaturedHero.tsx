import { motion } from "framer-motion";
import { Play, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Playlist } from "@/types/music";
import { usePlayer } from "@/contexts/PlayerContext";

interface FeaturedHeroProps {
  playlist: Playlist;
}

export const FeaturedHero = ({ playlist }: FeaturedHeroProps) => {
  const { playPlaylist } = usePlayer();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative h-80 md:h-96 rounded-[2rem] overflow-hidden mb-8 group"
    >
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0">
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[20000ms] ease-linear"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

        {/* Animated sheen effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/20 text-primary text-sm font-bold rounded-full mb-6 shadow-[0_0_15px_rgba(255,51,153,0.3)]">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
            Featured Playlist
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-xl tracking-tight">{playlist.name}</h1>
          <p className="text-lg text-zinc-300/90 mb-8 max-w-xl leading-relaxed">
            {playlist.description}
          </p>
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={() => playPlaylist(playlist.tracks)}
              className="gap-2 bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-full h-14 px-8 text-lg font-bold"
            >
              <Play className="w-6 h-6 fill-current" />
              Play Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => playPlaylist([...playlist.tracks].sort(() => Math.random() - 0.5))}
              className="gap-2 border-white/20 hover:bg-white/10 hover:border-white/40 text-white backdrop-blur-md rounded-full h-14 px-8 text-lg hover:scale-105 transition-all"
            >
              <Shuffle className="w-6 h-6" />
              Shuffle
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Neon Glows */}
      <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-40 -left-20 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
    </motion.div>
  );
};
