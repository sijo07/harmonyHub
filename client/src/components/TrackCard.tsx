import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, MoreHorizontal, Heart, PlusCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Track } from "@/types/music";
import { usePlayer } from "@/contexts/PlayerContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddToPlaylistModal } from "@/components/AddToPlaylistModal";
import { SongOptionsMenu } from "@/components/SongOptionsMenu";

interface TrackCardProps {
  track: Track;
  index?: number;
  showAlbum?: boolean;
  onRemove?: () => void;
  canRemove?: boolean;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const TrackCard = ({ track, index, showAlbum = true, onRemove, canRemove = false }: TrackCardProps) => {
  const { currentTrack, isPlaying, playTrack, pauseTrack, resumeTrack } = usePlayer();
  const { user, checkUser } = useAuth();
  const isCurrentTrack = currentTrack?.id === track.id;

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (user?.likedSongs) {
      // loose comparison to handle string/number id differences often seen in APIs
      setIsLiked(user.likedSongs.some((s: any) => s.id == track.id));
    }
  }, [user, track.id]);

  const handlePlay = () => {
    if (isCurrentTrack) {
      isPlaying ? pauseTrack() : resumeTrack();
    } else {
      playTrack(track);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isLiked) {
        await api.removeFromFavorites(track.id);
        setIsLiked(false);
      } else {
        await api.addToFavorites(track as any);
        setIsLiked(true);
      }
      await checkUser(); // Refresh user data to update liked songs list globally
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  };

  return (
    <>
      return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index ? index * 0.05 : 0 }}
          className={cn(
            "group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 cursor-pointer group/card border border-transparent",
            isCurrentTrack ? "bg-white/10 border-white/5 shadow-[inset_0_0_20px_rgba(255,51,153,0.1)]" : "hover:bg-white/5 hover:border-white/5"
          )}
          onClick={handlePlay}
        >
          {/* Track Number / Play Button */}
          <div className="w-8 flex items-center justify-center relative">
            {index !== undefined && !isCurrentTrack && (
              <span className="text-sm text-zinc-500 font-mono group-hover/card:hidden">
                {index + 1}
              </span>
            )}
            {isCurrentTrack && isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center group-hover/card:hidden">
                <div className="flex gap-0.5 h-3 items-end">
                  <motion.div animate={{ height: ["30%", "100%", "30%"] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-0.5 bg-primary rounded-full" />
                  <motion.div animate={{ height: ["100%", "30%", "100%"] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }} className="w-0.5 bg-primary rounded-full" />
                  <motion.div animate={{ height: ["30%", "100%", "30%"] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-0.5 bg-primary rounded-full" />
                </div>
              </div>
            )}

            <motion.div
              className={cn(
                "items-center justify-center",
                index !== undefined && !isCurrentTrack ? "hidden group-hover/card:flex" : "flex",
                isCurrentTrack && isPlaying ? "hidden group-hover/card:flex" : "flex"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="icon-sm" onClick={handlePlay} className={cn("hover:bg-transparent", isCurrentTrack ? "text-primary" : "text-white")}>
                {isCurrentTrack && isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </Button>
            </motion.div>
          </div>

          {/* Album Art */}
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-shadow">
            <img
              src={track.coverUrl}
              alt={track.album}
              className="w-full h-full object-cover"
            />
            {isCurrentTrack && isPlaying && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex items-end gap-0.5 h-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary rounded-full shadow-[0_0_5px_var(--neon-pink)]"
                      animate={{
                        height: ["40%", "100%", "60%", "80%", "40%"],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <p className={cn("font-medium truncate transition-colors", isCurrentTrack ? "text-primary text-glow-pink" : "text-white group-hover:text-primary")}>
              {track.title}
            </p>
            <p className="text-sm text-zinc-400 truncate group-hover:text-zinc-300">{track.artist}</p>
          </div>

          {/* Album */}
          {showAlbum && (
            <span className="hidden md:block text-sm text-zinc-500 truncate w-40 group-hover:text-zinc-400">
              {track.album}
            </span>
          )}

          {/* Like Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className={`opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-transparent ${isLiked ? "opacity-100" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 transition-colors transition-transform active:scale-95 ${isLiked ? "fill-primary text-primary drop-shadow-[0_0_5px_var(--neon-pink)]" : "text-zinc-400 hover:text-white"}`} />
          </Button>

          {/* Duration */}
          <span className="text-sm text-zinc-500 w-12 text-right font-mono group-hover:text-zinc-300">
            {formatDuration(track.duration)}
          </span>

          {/* Options Menu */}
          <SongOptionsMenu
            song={track}
            className="opacity-0 group-hover/card:opacity-100 transition-opacity"
            onRemove={canRemove && onRemove ? onRemove : undefined}
            showAlbumOption={!showAlbum}
          />
        </motion.div>
      </>
      );
    </>
  );
};