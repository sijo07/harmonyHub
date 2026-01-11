import { motion } from "framer-motion";
import { Play, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Playlist } from "@/types/music";
import { usePlayer } from "@/contexts/PlayerContext";
import { CollectionOptionsMenu } from "@/components/CollectionOptionsMenu";

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
        whileHover={{ y: -6, scale: 1.02 }}
        className="group glass-panel p-4 cursor-pointer transition-all duration-300 hover:bg-white/5 hover:border-white/20 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden rounded-2xl"
      >
        {/* Neon Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative mb-4 overflow-hidden rounded-xl shadow-lg">
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full aspect-square object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Button
              variant="player"
              size="icon-lg"
              onClick={handlePlay}
              className="shadow-[0_0_30px_var(--neon-pink)] hover:scale-110 transition-transform bg-primary text-white border-none"
            >
              <Play className="w-7 h-7 ml-1 fill-current" />
            </Button>
          </motion.div>

          {/* New Badge */}
          {isNew && (
            <div className="absolute top-2 left-2 px-2.5 py-1 bg-primary/90 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-[0_0_10px_var(--neon-pink)] border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">New</span>
            </div>
          )}

          {/* Options Menu */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <div className="bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10 hover:bg-black/70 transition-colors">
              <CollectionOptionsMenu collection={playlist} type={(playlist as any).type === 'album' ? 'album' : 'playlist'} />
            </div>
          </div>

          {/* Playing indicator */}
          {isPlaylistPlaying && (
            <div className="absolute bottom-3 right-3 w-10 h-10 bg-primary/90 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_var(--neon-pink)] border border-white/20">
              <div className="flex items-end gap-0.5 h-4 mb-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white rounded-full shadow-[0_0_5px_white]"
                    animate={{
                      height: ["30%", "100%", "50%", "80%", "30%"],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10">
          <h3 className="font-bold truncate mb-1 text-lg group-hover:text-primary transition-colors text-glow-hover">{playlist.name}</h3>

          {showPlayCount ? (
            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              <span className="font-mono text-xs">{formatPlayCount(playCount)} plays</span>
            </div>
          ) : (
            <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-zinc-300 transition-colors">
              {playlist.description}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
};