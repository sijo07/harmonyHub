import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, MoreHorizontal, Heart, PlusCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Track } from "@/types/music";
import { usePlayer } from "@/contexts/PlayerContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddToPlaylistModal } from "@/components/AddToPlaylistModal";

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
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index ? index * 0.05 : 0 }}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        className="group flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer group/card"
        onClick={handlePlay}
      >
        {/* Track Number / Play Button */}
        <div className="w-8 flex items-center justify-center">
          {index !== undefined ? (
            <span className="text-sm text-muted-foreground group-hover/card:hidden">
              {index + 1}
            </span>
          ) : null}
          <motion.div
            className={index !== undefined ? "hidden group-hover/card:flex" : "flex"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="icon-sm" onClick={handlePlay}>
              {isCurrentTrack && isPlaying ? (
                <Pause className="w-4 h-4 text-primary" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Album Art */}
        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={track.coverUrl}
            alt={track.album}
            className="w-full h-full object-cover"
          />
          {isCurrentTrack && isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <div className="flex items-end gap-0.5 h-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
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
            </motion.div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${isCurrentTrack ? "text-primary" : ""}`}>
            {track.title}
          </p>
          <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
        </div>

        {/* Album */}
        {showAlbum && (
          <span className="hidden md:block text-sm text-muted-foreground truncate w-40">
            {track.album}
          </span>
        )}

        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className={`opacity-0 group-hover/card:opacity-100 transition-opacity ${isLiked ? "opacity-100" : ""}`}
          onClick={handleLike}
        >
          <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-zinc-400 hover:text-white"}`} />
        </Button>

        {/* Duration */}
        <span className="text-sm text-muted-foreground w-12 text-right">
          {formatDuration(track.duration)}
        </span>

        {/* More Button Key */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="opacity-0 group-hover/card:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-white/10 text-zinc-200">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setShowPlaylistModal(true);
              }}
              className="hover:bg-white/10 cursor-pointer"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Add to Playlist</span>
            </DropdownMenuItem>

            {canRemove && onRemove && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="hover:bg-red-900/30 text-red-500 hover:text-red-400 cursor-pointer focus:text-red-400 focus:bg-red-900/30"
              >
                <PlusCircle className="mr-2 h-4 w-4 rotate-45" />
                <span>Remove from Playlist</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <AnimatePresence>
        {showPlaylistModal && (
          <AddToPlaylistModal
            song={track as any}
            onClose={() => setShowPlaylistModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};