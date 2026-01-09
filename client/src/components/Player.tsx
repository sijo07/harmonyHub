import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  Heart,
  ListMusic,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "@/contexts/PlayerContext";
import { cn } from "@/lib/utils";
import { FullScreenPlayer } from "./FullScreenPlayer";
import { QueueSidebar } from "./QueueSidebar";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const Player = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    shuffle,
    repeat,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack,
    setVolume,
    setProgress,
    toggleShuffle,
    toggleRepeat,
    toggleFullScreen,
    isFullScreen,
    toggleQueue,
    isQueueOpen,
    toggleFavorite,
    isFavorite,
  } = usePlayer();

  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const interval = setInterval(() => {
      if (progress >= currentTrack.duration) {
        nextTrack();
        setProgress(0);
      } else {
        setProgress(progress + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, progress, setProgress, nextTrack]);

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  if (!currentTrack) {
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 h-24 bg-card/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center"
      >
        <p className="text-muted-foreground">Select a track to start playing</p>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isFullScreen && <FullScreenPlayer key="fullscreen-player" />}
      </AnimatePresence>

      <QueueSidebar />

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-[80px] md:bottom-0 left-0 right-0 h-20 md:h-24 bg-card/90 backdrop-blur-xl border-t border-white/10 px-4 z-40 transition-all duration-300"
      >
        <div className="h-full max-w-screen-2xl mx-auto flex items-center justify-between md:justify-start gap-4">
          {/* Track Info - Responsive */}
          <div className="flex items-center gap-3 w-full md:w-[30%] md:min-w-[200px]" onClick={toggleFullScreen}>
            <motion.img
              key={currentTrack.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover shadow-lg cursor-pointer"
            />
            <div className="min-w-0 flex-1 md:flex-initial">
              <p className="font-medium truncate text-sm md:text-base cursor-pointer">
                {currentTrack.title}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {currentTrack.artist}
              </p>
            </div>

            {/* Mobile Play/Pause Button (Inside Track Info area for mobile) */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="player"
                size="icon-sm"
                onClick={(e) => { e.stopPropagation(); isPlaying ? pauseTrack() : resumeTrack(); }}
                className="w-10 h-10 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-1" />
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); currentTrack && toggleFavorite(currentTrack) }}
              className={cn(currentTrack && isFavorite(currentTrack.id) && "text-red-500", "hidden md:inline-flex")}
              title="Add to Favorites"
            >
              <Heart className={cn("w-4 h-4", currentTrack && isFavorite(currentTrack.id) && "fill-current")} />
            </Button>
          </div>

          {/* Controls - Hidden on Mobile */}
          <div className="hidden md:flex flex-1 flex-col items-center gap-2 max-w-[40%]">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={toggleShuffle}
                className={cn(shuffle && "text-red-500", "transition-all")}
                title={shuffle ? "Shuffle On" : "Shuffle Off"}
              >
                <Shuffle className={cn("w-4 h-4", shuffle && "drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]")} />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={prevTrack} title="Previous (Ctrl+Left)">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                variant="player"
                size="icon-lg"
                onClick={isPlaying ? pauseTrack : resumeTrack}
                className="mx-2 shadow-glow active:scale-95 transition-all"
                title="Play/Pause (Space)"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={nextTrack} title="Next (Ctrl+Right)">
                <SkipForward className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={toggleRepeat}
                className={cn(repeat !== "off" && "text-red-500", "transition-all")}
                title={`Repeat: ${repeat.charAt(0).toUpperCase() + repeat.slice(1)}`}
              >
                {repeat === "one" ? (
                  <Repeat1 className={cn("w-4 h-4", "drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]")} />
                ) : (
                  <Repeat className={cn("w-4 h-4", repeat === "all" && "drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]")} />
                )}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center gap-2 group/progress">
              <span className="text-[10px] font-mono text-muted-foreground w-10 text-right opacity-0 group-hover/progress:opacity-100 transition-opacity">
                {formatTime(progress)}
              </span>
              <Slider
                value={[progress]}
                max={currentTrack.duration}
                step={1}
                onValueChange={([value]) => setProgress(value)}
                className="flex-1 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-muted-foreground w-10 opacity-0 group-hover/progress:opacity-100 transition-opacity">
                {formatTime(currentTrack.duration)}
              </span>
            </div>
          </div>

          {/* Volume & Extra - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-2 w-[30%] justify-end">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleQueue}
              className={cn(isQueueOpen ? "text-red-500 bg-white/5" : "hover:bg-white/5")}
              title="Queue"
            >
              <ListMusic className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 w-32 group/volume">
              <Button variant="ghost" size="icon-sm" onClick={handleMuteToggle} title="Mute (M)">
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => setVolume(value / 100)}
                className="flex-1"
              />
            </div>
            <Button variant="ghost" size="icon-sm" onClick={toggleFullScreen} title="Full Screen" className="hover:bg-white/5">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
