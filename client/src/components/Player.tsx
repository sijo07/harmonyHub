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
import { SongOptionsMenu } from "@/components/SongOptionsMenu";

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
  const [isHovered, setIsHovered] = useState(false);

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
    return null; // Don't show anything if no track (Cleaner look)
  }

  return (
    <>
      <AnimatePresence>
        {isFullScreen && <FullScreenPlayer key="fullscreen-player" />}
      </AnimatePresence>

      <QueueSidebar />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 w-full bg-[#050508]/95 backdrop-blur-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Interactive Seek Bar - Hovering at the top edge */}
        <div className="absolute -top-3 left-0 right-0 h-6 group/seek z-50 flex items-center px-0">
          <Slider
            value={[progress]}
            max={currentTrack.duration || 100}
            step={1}
            onValueChange={(val) => setProgress(val[0])}
            className="w-full cursor-pointer touch-none [&>span:first-child]:h-1 [&>span:first-child]:bg-white/10 group-hover/seek:[&>span:first-child]:h-1.5 transition-all [&_span[data-orientation=horizontal]]:bg-primary [&_span]:transition-all"
          />
        </div>

        <div className="container mx-auto max-w-[1800px] px-4 md:px-6 py-3 md:py-4 h-20 md:h-24">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full gap-4">

            {/* Left: Track Info & Visuals */}
            <div className="flex items-center gap-4 min-w-0 justify-start group/info">
              <div
                className="relative cursor-pointer flex-shrink-0"
                onClick={toggleFullScreen}
              >
                <div className={cn("absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse", !isPlaying && "hidden")} />
                <motion.img
                  key={currentTrack.id}
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white/10 relative z-10 group-hover/info:border-primary/50 transition-colors"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover/info:opacity-100 transition-opacity">
                  <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                </div>
              </div>

              <div className="min-w-0 flex-1 hidden md:block">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-bold text-base text-white truncate text-glow-hover cursor-pointer hover:text-primary transition-colors">
                    {currentTrack.title}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => { e.stopPropagation(); currentTrack && toggleFavorite(currentTrack) }}
                    className={cn("w-6 h-6 hover:bg-transparent hover:scale-110", isFavorite(currentTrack.id) ? "text-primary" : "text-zinc-500 hover:text-white")}
                  >
                    <Heart className={cn("w-4 h-4", isFavorite(currentTrack.id) && "fill-current")} />
                  </Button>
                </div>
                <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Center: Playback Controls */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-4 md:gap-6">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleShuffle}
                  className={cn("hidden md:flex rounded-full hover:bg-white/10 w-8 h-8 transition-all", shuffle && "text-primary")}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="icon-sm" onClick={prevTrack} className="rounded-full hover:bg-white/10 w-10 h-10 hover:text-white text-zinc-300">
                  <SkipBack className="w-5 h-5 fill-current" />
                </Button>

                <Button
                  size="icon"
                  onClick={isPlaying ? pauseTrack : resumeTrack}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white text-black hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-0.5" />
                  )}
                </Button>

                <Button variant="ghost" size="icon-sm" onClick={nextTrack} className="rounded-full hover:bg-white/10 w-10 h-10 hover:text-white text-zinc-300">
                  <SkipForward className="w-5 h-5 fill-current" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleRepeat}
                  className={cn("hidden md:flex rounded-full hover:bg-white/10 w-8 h-8 transition-all", repeat !== "off" && "text-primary")}
                >
                  {repeat === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </Button>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span>{formatTime(progress)}</span>
                <span className="text-zinc-700">|</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            {/* Right: Volume & Queue */}
            <div className="flex items-center gap-3 md:gap-6 justify-end">
              <div className="hidden md:flex items-center gap-2 group/vol">
                <Button variant="ghost" size="icon-sm" onClick={handleMuteToggle} className="w-8 h-8 hover:bg-white/5 text-zinc-400 hover:text-white">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <div className="w-24 opacity-0 group-hover/vol:opacity-100 transition-opacity">
                  <Slider
                    value={[volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={([value]) => setVolume(value / 100)}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleQueue}
                className={cn("rounded-full hover:bg-white/10 w-10 h-10 transition-colors", isQueueOpen && "text-primary bg-white/5")}
              >
                <ListMusic className="w-5 h-5" />
              </Button>
            </div>

          </div>
        </div>
      </motion.div>
    </>
  );
};
