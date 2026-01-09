import { motion } from "framer-motion";
import { usePlayer } from "@/contexts/PlayerContext";
import {
    Minimize2,
    SkipBack,
    Play,
    Pause,
    SkipForward,
    Shuffle,
    Repeat,
    Repeat1,
    Heart,
    ListMusic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const FullScreenPlayer = () => {
    const {
        currentTrack,
        toggleFullScreen,
        isPlaying,
        progress,
        pauseTrack,
        resumeTrack,
        nextTrack,
        prevTrack,
        shuffle,
        repeat,
        toggleShuffle,
        toggleRepeat,
        setProgress,
        toggleQueue,
        analyser,
        lyrics,
        toggleFavorite,
        isFavorite
    } = usePlayer();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bottomCanvasRef = useRef<HTMLCanvasElement>(null);

    // Visualizer Loop
    useEffect(() => {
        if (!analyser || !isPlaying) return;

        const drawVisualizer = (canvas: HTMLCanvasElement | null, isFull: boolean) => {
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            let animationId: number;

            const draw = () => {
                animationId = requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const width = canvas.width;
                const height = canvas.height;
                const barsToDraw = isFull ? 64 : 128;
                const step = Math.floor(bufferLength / barsToDraw);
                const barWidth = (width / barsToDraw) * (isFull ? 0.7 : 0.8);
                let x = (width - (barsToDraw * (barWidth + 4))) / 2;

                for (let i = 0; i < barsToDraw; i++) {
                    const dataIndex = i * step;
                    const value = dataArray[dataIndex];
                    const barHeight = (value / 255) * height * 0.9;

                    const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
                    gradient.addColorStop(0, "rgba(255, 0, 0, 0.8)");
                    gradient.addColorStop(0.5, "rgba(255, 100, 0, 0.6)");
                    gradient.addColorStop(1, "rgba(255, 200, 0, 0.4)");

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.roundRect(x, height - barHeight, barWidth, barHeight, 4);
                    ctx.fill();
                    x += barWidth + 4;
                }
            };
            draw();
            return () => cancelAnimationFrame(animationId);
        };

        const cleanup1 = drawVisualizer(canvasRef.current, true);
        const cleanup2 = drawVisualizer(bottomCanvasRef.current, false);

        return () => {
            if (cleanup1) cleanup1();
            if (cleanup2) cleanup2();
        };
    }, [analyser, isPlaying]);

    if (!currentTrack) return null;

    const lyricsLines = lyrics ? lyrics.split('\n').filter(line => line.trim()) : ["Lyrics not found."];

    return (
        <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-[#0a0a0a] z-[60] flex flex-col overflow-hidden safely-buffered"
        >
            {/* Background Blur Effect */}
            <div
                className="absolute inset-0 opacity-20 blur-[120px] scale-150 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at center, red 0%, transparent 70%)`,
                    transition: 'background 1s ease'
                }}
            />

            {/* Header */}
            <div className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
                <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="hover:bg-white/10 rounded-full">
                    <Minimize2 className="w-8 h-8 text-white/70" />
                </Button>
                <div className="text-center hidden md:block">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Harmony Hub Premium Player</p>
                    <h3 className="text-sm font-bold tracking-tight text-white/90">Advanced Playback Engine 2.0</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleQueue} className="hover:bg-white/10 rounded-full">
                    <ListMusic className="w-8 h-8 text-white/70" />
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex w-full max-w-7xl mx-auto px-6 gap-12 lg:gap-24 items-center flex-1 relative z-10 overflow-hidden">

                {/* Left Side: Art & Information */}
                <div className="flex-1 flex flex-col items-center lg:items-start w-full lg:max-w-md">
                    <motion.div
                        className="relative aspect-square w-full rounded-2xl shadow-2xl overflow-hidden mb-12 ring-1 ring-white/10"
                        animate={{
                            scale: isPlaying ? 1 : 0.95,
                            rotate: isPlaying ? [0, 1, -1, 0] : 0
                        }}
                        transition={{
                            rotate: { repeat: Infinity, duration: 8, ease: "linear" },
                            scale: { duration: 0.5 }
                        }}
                    >
                        <img
                            src={currentTrack.coverUrl}
                            alt={currentTrack.title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    <div className="w-full text-center lg:text-left">
                        <motion.h1
                            key={currentTrack.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tighter"
                        >
                            {currentTrack.title}
                        </motion.h1>
                        <motion.p
                            key={Array.isArray(currentTrack.artist) ? currentTrack.artist.join(", ") : currentTrack.artist}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl text-red-500 font-bold uppercase tracking-wider"
                        >
                            {currentTrack.artist}
                        </motion.p>
                    </div>
                </div>

                {/* Right Side: Lyrics Panel */}
                <div className="flex-1 h-full hidden lg:flex flex-col gap-6 relative max-w-2xl py-12">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-1 bg-red-600 rounded-full" />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">System Synchronized Lyrics</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-hide space-y-8 pr-8 mask-image-gradient py-8">
                        {lyricsLines.map((line, i) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 0.9, y: 0 }}
                                viewport={{ once: false }}
                                className="text-3xl md:text-4xl font-extrabold text-white/50 hover:text-white transition-colors cursor-pointer leading-tight tracking-tight"
                            >
                                {line}
                            </motion.p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Controls Area */}
            <div className="w-full bg-[#111]/80 backdrop-blur-3xl border-t border-white/5 pb-12 pt-8 relative z-20">
                <div className="max-w-5xl mx-auto px-8">
                    {/* Visualizer Loop Overlay (Small) */}
                    <div className="h-24 w-full mb-6 opacity-30">
                        <canvas ref={bottomCanvasRef} width={1200} height={100} className="w-full h-full" />
                    </div>

                    {/* Progress */}
                    <div className="w-full space-y-4 mb-10">
                        <Slider
                            value={[progress]}
                            max={currentTrack.duration}
                            step={1}
                            onValueChange={([value]) => setProgress(value)}
                            className="h-1.5 [&_[role=slider]]:bg-red-600 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4"
                        />
                        <div className="flex justify-between text-xs font-mono tracking-widest text-white/40">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(currentTrack.duration)}</span>
                        </div>
                    </div>

                    {/* Main Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Button variant="ghost" size="icon" onClick={toggleShuffle} className={cn("hover:bg-white/5", shuffle && "text-red-500")}>
                                <Shuffle className="w-6 h-6" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={toggleRepeat} className={cn("hover:bg-white/5", repeat !== "off" && "text-red-500")}>
                                {repeat === "one" ? <Repeat1 className="w-6 h-6" /> : <Repeat className="w-6 h-6" />}
                            </Button>
                        </div>

                        <div className="flex items-center gap-6 md:gap-12">
                            <Button variant="ghost" size="icon" onClick={prevTrack} className="hover:bg-white/5">
                                <SkipBack className="w-10 h-10 text-white" />
                            </Button>
                            <Button
                                onClick={isPlaying ? pauseTrack : resumeTrack}
                                className="h-20 w-20 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            >
                                {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={nextTrack} className="hover:bg-white/5">
                                <SkipForward className="w-10 h-10 text-white" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("hover:bg-white/5", isFavorite(currentTrack.id) ? "text-red-500" : "text-white/50")}
                                onClick={() => toggleFavorite(currentTrack)}
                            >
                                <Heart className={cn("w-6 h-6", isFavorite(currentTrack.id) && "fill-current")} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="hover:bg-white/5">
                                <Minimize2 className="w-6 h-6 text-white/40" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
