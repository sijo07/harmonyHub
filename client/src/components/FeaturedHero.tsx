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
      className="relative h-80 md:h-96 rounded-3xl overflow-hidden mb-8"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full mb-4">
            Featured Playlist
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">{playlist.name}</h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-xl">
            {playlist.description}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => playPlaylist(playlist.tracks)}
              className="gap-2"
            >
              <Play className="w-5 h-5" />
              Play Now
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={() => playPlaylist([...playlist.tracks].sort(() => Math.random() - 0.5))}
              className="gap-2"
            >
              <Shuffle className="w-5 h-5" />
              Shuffle
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary/30 rounded-full blur-3xl" />
    </motion.div>
  );
};
