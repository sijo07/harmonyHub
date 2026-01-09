import { motion } from "framer-motion";
import { Play, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Playlist } from "@/types/music";
import { usePlayer } from "@/contexts/PlayerContext";

interface PlaylistCardProps {
  playlist: Playlist;
  index?: number;
  showPlayCount?: boolean;
  isNew?: boolean;
}

export const PlaylistCard = ({ playlist, index, showPlayCount, isNew }: PlaylistCardProps) => {
  const { playPlaylist, isPlaying, currentTrack } = usePlayer();

  const isPlaylistPlaying = playlist.tracks.some(t => t.id === currentTrack?.id) && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playPlaylist(playlist.tracks);
  };

  // Mock play count
  const playCount = Math.floor(Math.random() * 900000 + 100000);
  const formatPlayCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${Math.floor(count / 1000)}K`;
    return count.toString();
  };

  return (
    <Link to={`/playlist/${playlist._id || playlist.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index ? index * 0.1 : 0 }}
        whileHover={{ y: -4 }}
        className="group glass-card p-4 cursor-pointer transition-all duration-300 hover:bg-white/10"
      >
        <div className="relative mb-4">
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full aspect-square object-cover rounded-xl shadow-card"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button
              variant="player"
              size="icon-lg"
              onClick={handlePlay}
              className="shadow-glow"
            >
              <Play className="w-6 h-6 ml-1" />
            </Button>
          </motion.div>

          {/* New Badge */}
          {isNew && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-primary rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-white" />
              <span className="text-xs font-medium text-white">New</span>
            </div>
          )}

          {/* Playing indicator */}
          {isPlaylistPlaying && (
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse-glow">
              <div className="flex items-end gap-0.5 h-3">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-white rounded-full"
                    animate={{
                      height: ["40%", "100%", "60%", "80%", "40%"],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <h3 className="font-semibold truncate mb-1">{playlist.name}</h3>

        {showPlayCount ? (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>{formatPlayCount(playCount)} plays</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {playlist.description}
          </p>
        )}
      </motion.div>
    </Link>
  );
};